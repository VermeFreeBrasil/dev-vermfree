// Recebe o formulário do pop-up (nome, e-mail, WhatsApp) e cria/atualiza o contato no ActiveCampaign
// com a tag do Grupo VIP 11/11. Variáveis no projeto da Vercel:
//   AC_API_URL (ex.: https://suaconta.api-us1.com), AC_API_KEY (secreta), AC_TAG_ID (60), AC_LIST_ID (opcional)
// Sem AC_API_URL/AC_API_KEY, o lead vai para o fluxo do n8n "VF · Lead LP VIP 11/11 → ActiveCampaign" (N8N_LEAD_URL opcional).
module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ ok: false }); return; }
  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  const nome = String(b.nome || '').trim().slice(0, 120);
  const email = String(b.email || '').trim().toLowerCase().slice(0, 160);
  let fone = String(b.whatsapp || '').replace(/\D/g, '');
  if (fone.length === 10 || fone.length === 11) fone = '55' + fone;
  if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || fone.length < 12) {
    res.status(400).json({ ok: false, erro: 'dados' }); return;
  }
  const URL = (process.env.AC_API_URL || '').replace(/\/$/, '');
  const KEY = process.env.AC_API_KEY;
  const registro = JSON.stringify({ nome, email, fone, utm: b.utm || {}, em: new Date().toISOString() });
  if (!URL || !KEY) {
    // Sem chave do AC na Vercel: manda para o fluxo do n8n, que grava no ActiveCampaign (lista 15 + tag 60).
    console.log('LEAD ' + registro);
    try {
      const r = await fetch(process.env.N8N_LEAD_URL || 'https://n8n.vermefree.com.br/webhook/vf-vip-1111-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: registro });
      if (!r.ok) throw new Error('n8n ' + r.status);
      res.status(200).json({ ok: true, via: 'n8n' });
    } catch (e) {
      console.error('LEAD_ERRO_N8N ' + registro + ' ' + e.message);
      res.status(200).json({ ok: false, erro: 'n8n' });
    }
    return;
  }
  const h = { 'Api-Token': KEY, 'Content-Type': 'application/json' };
  const [primeiro, ...resto] = nome.split(/\s+/);
  try {
    const r = await fetch(URL + '/api/3/contact/sync', { method: 'POST', headers: h,
      body: JSON.stringify({ contact: { email, firstName: primeiro, lastName: resto.join(' '), phone: '+' + fone } }) });
    const j = await r.json();
    const id = j && j.contact && j.contact.id;
    if (!id) throw new Error('sync ' + r.status + ' ' + JSON.stringify(j).slice(0, 300));
    const extras = [];
    if (process.env.AC_TAG_ID) extras.push(fetch(URL + '/api/3/contactTags', { method: 'POST', headers: h,
      body: JSON.stringify({ contactTag: { contact: id, tag: process.env.AC_TAG_ID } }) }));
    if (process.env.AC_LIST_ID) extras.push(fetch(URL + '/api/3/contactLists', { method: 'POST', headers: h,
      body: JSON.stringify({ contactList: { list: process.env.AC_LIST_ID, contact: id, status: 1 } }) }));
    await Promise.all(extras);
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('LEAD_ERRO_AC ' + JSON.stringify({ nome, email, fone, utm: b.utm || {}, erro: e.message }));
    res.status(200).json({ ok: false, erro: 'ac' });
  }
};
