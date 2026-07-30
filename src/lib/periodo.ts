export function periodoDeDias(dias: number) {
  const to = new Date();
  const from = new Date(to.getTime() - (dias - 1) * 86400000);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

export function diaCurto(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}