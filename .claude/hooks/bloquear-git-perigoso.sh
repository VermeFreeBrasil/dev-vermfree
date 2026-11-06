#!/bin/bash
# Git guardrails (adaptado de mattpocock/skills git-guardrails-claude-code).
# Bloqueia comandos que reescrevem/apagam historico — proibido neste projeto Lovable (ver AGENTS.md).
# git push normal continua liberado.
COMMAND=$(jq -r '.tool_input.command // empty')
PATTERNS=(
  "git push.*(--force|-f( |$)|--force-with-lease|--mirror|--delete|:refs)"
  "git reset --hard"
  "git clean -[a-z]*f"
  "git branch -D"
  "git checkout \.( |$)"
  "git restore \.( |$)"
  "git rebase"
  "git commit.*--amend"
  "git filter-branch|git filter-repo"
)
for p in "${PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$p"; then
    echo "BLOQUEADO: '$COMMAND' bate com o padrao perigoso '$p'. Este projeto e sincronizado com o Lovable e nao pode ter historico reescrito/apagado. Peca autorizacao explicita ao usuario." >&2
    exit 2
  fi
done
exit 0
