#!/usr/bin/env python3
"""Gera o GDRIVE_REFRESH_TOKEN usado por subir-drive.sh. Rode UMA vez no seu computador.

Uso: python3 autorizar-drive.py <CLIENT_ID> <CLIENT_SECRET>

Abre o navegador para você entrar com a conta Google dona da pasta, recebe a
resposta em http://localhost e imprime o refresh token. Só usa a biblioteca padrão.
"""
import http.server
import json
import secrets
import sys
import urllib.parse
import urllib.request
import webbrowser

ESCOPO = 'https://www.googleapis.com/auth/drive'


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    client_id, client_secret = sys.argv[1], sys.argv[2]
    estado = secrets.token_urlsafe(16)
    recebido = {}

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            if 'code' in q or 'error' in q:
                recebido.update({k: v[0] for k, v in q.items()})
                msg = 'Pronto! Pode fechar esta aba e voltar ao terminal.'
            else:
                msg = 'Aguardando autorização...'
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(msg.encode())

        def log_message(self, *a):
            pass

    srv = http.server.HTTPServer(('127.0.0.1', 0), Handler)
    redirect = f'http://127.0.0.1:{srv.server_port}'
    url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urllib.parse.urlencode(dict(
        client_id=client_id, redirect_uri=redirect, response_type='code', scope=ESCOPO,
        access_type='offline', prompt='consent', state=estado))
    print('Abrindo o navegador. Se não abrir, copie este link:\n\n' + url + '\n')
    webbrowser.open(url)
    while 'code' not in recebido and 'error' not in recebido:
        srv.handle_request()
    if 'error' in recebido:
        sys.exit('Autorização negada: ' + recebido['error'])
    if recebido.get('state') != estado:
        sys.exit('Resposta com state diferente; tente de novo.')
    dados = urllib.parse.urlencode(dict(code=recebido['code'], client_id=client_id, client_secret=client_secret,
                                        redirect_uri=redirect, grant_type='authorization_code')).encode()
    with urllib.request.urlopen('https://oauth2.googleapis.com/token', dados) as r:
        tok = json.load(r)
    if 'refresh_token' not in tok:
        sys.exit('O Google não devolveu refresh token: ' + json.dumps(tok))
    print('Configure estes três segredos no ambiente do Claude Code:\n')
    print('GDRIVE_CLIENT_ID=' + client_id)
    print('GDRIVE_CLIENT_SECRET=' + client_secret)
    print('GDRIVE_REFRESH_TOKEN=' + tok['refresh_token'])


if __name__ == '__main__':
    main()
