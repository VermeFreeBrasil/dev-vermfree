#!/usr/bin/env python3
"""Sobe arquivos para uma pasta do Drive pelo Web App do Apps Script (edicao-de-video/apps-script/upload-drive.gs).

Uso: python3 -I subir-drive.py <id-ou-link-da-pasta> <arquivo> [...]

Precisa de GAS_UPLOAD_URL (URL /exec do Web App) e GAS_UPLOAD_TOKEN (o TOKEN do script),
como variáveis de ambiente, e da rede liberando script.google.com e script.googleusercontent.com.
Arquivos com o mesmo nome já presentes na pasta são pulados (SOBRESCREVER=1 para enviar de novo).
Só usa a biblioteca padrão.
"""
import base64
import json
import mimetypes
import os
import re
import sys
import time
import urllib.request

PEDACO = 8 * 1024 * 1024  # múltiplo de 256 KB, exigido pela API do Drive


def chamar(url, token, **campos):
    corpo = json.dumps(dict(token=token, **campos)).encode()
    for tentativa in range(4):
        try:
            req = urllib.request.Request(url, corpo, {'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=300) as r:
                resp = json.loads(r.read().decode())
            if not resp.get('ok'):
                raise RuntimeError(resp.get('erro', resp))
            return resp
        except RuntimeError:
            raise
        except Exception as e:  # rede: tenta de novo
            if tentativa == 3:
                raise RuntimeError(f'falha de rede: {e}')
            time.sleep(2 ** (tentativa + 1))


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    url, token = os.environ.get('GAS_UPLOAD_URL'), os.environ.get('GAS_UPLOAD_TOKEN')
    if not url or not token:
        sys.exit('Faltam GAS_UPLOAD_URL e/ou GAS_UPLOAD_TOKEN (COMO-USAR.md, seção "Subir para o Drive").')
    m = re.search(r'/folders/([^/?#]+)|[?&]id=([^&#]+)', sys.argv[1])
    pasta = (m.group(1) or m.group(2)) if m else sys.argv[1]
    try:
        print('conta do Web App:', chamar(url, token, action='ping')['conta'])
    except Exception as e:
        sys.exit(f'O Web App não respondeu direito: {e}. Confira URL /exec, senha e rede (COMO-USAR.md).')
    falhas = 0
    for caminho in sys.argv[2:]:
        nome = os.path.basename(caminho)
        try:
            tam = os.path.getsize(caminho)
            if os.environ.get('SOBRESCREVER') != '1':
                ex = chamar(url, token, action='exists', folderId=pasta, name=nome)
                if ex['existe']:
                    print(f'já existe na pasta, pulando: {nome} → {ex["url"]}')
                    continue
            tipo = mimetypes.guess_type(nome)[0] or 'application/octet-stream'
            sessao = chamar(url, token, action='start', folderId=pasta, name=nome, mimeType=tipo, size=tam)['session']
            with open(caminho, 'rb') as f:
                ini = 0
                while True:
                    dados = f.read(PEDACO)
                    if not dados:
                        raise RuntimeError('arquivo terminou antes de o Drive confirmar')
                    r = chamar(url, token, action='chunk', session=sessao, start=ini, total=tam,
                               mimeType=tipo, data=base64.b64encode(dados).decode())
                    ini += len(dados)
                    print(f'  {nome}: {ini * 100 // tam}%', flush=True)
                    if r['done']:
                        print(f'ok: {nome} ({tam / 1e6:.1f} MB) → {r["url"]}')
                        break
        except Exception as e:
            print(f'FALHOU: {nome}: {e}', file=sys.stderr)
            falhas += 1
    if falhas:
        sys.exit(f'{falhas} arquivo(s) falharam.')


if __name__ == '__main__':
    main()
