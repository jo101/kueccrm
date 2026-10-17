#!/usr/bin/env bash
# Recreates the rehearsal stack from scratch: compose up, first user, workspace, admin key, stage options.
# Destroys the stack named in ./.env (docker compose down -v), so it refuses anything but twenty-rehearsal.
# Needs ./.env (copy of config/deploy/.env.example with local values) and ./ca-bundle.crt (see override.yml).
set -euo pipefail
cd "$(dirname "$0")"
grep -q '^COMPOSE_PROJECT_NAME=twenty-rehearsal$' .env || { echo "refusing: .env must set COMPOSE_PROJECT_NAME=twenty-rehearsal"; exit 1; }
DC=(docker compose --project-directory . -f ../../../config/deploy/docker-compose.yml -f override.yml --env-file .env)
"${DC[@]}" down -v >/dev/null 2>&1 || true
"${DC[@]}" up -d >/dev/null 2>&1 || true
for i in $(seq 1 60); do [ "$(docker inspect -f '{{.State.Health.Status}}' twenty-rehearsal-server-1 2>/dev/null)" = healthy ] && break; sleep 5; done
"${DC[@]}" up -d >/dev/null 2>&1
gq(){ curl -s localhost:3000/metadata -H 'content-type: application/json' ${2:+-H "authorization: Bearer $2"} -d "$(jq -n --arg q "$1" '{query:$q}')"; }
AG=$(gq 'mutation { signUp(email:"deploy.engineer@kuec.test", password:"Rehearsal-2026!pw") { tokens { accessOrWorkspaceAgnosticToken { token } } } }' | jq -r .data.signUp.tokens.accessOrWorkspaceAgnosticToken.token)
LT=$(gq 'mutation { signUpInNewWorkspace(input:{displayName:"KUEC BD Ops rehearsal"}) { loginToken { token } } }' "$AG" | jq -r .data.signUpInNewWorkspace.loginToken.token)
T=$(gq "mutation { getAuthTokensFromLoginToken(loginToken:\"$LT\", origin:\"http://localhost:3000\") { tokens { accessOrWorkspaceAgnosticToken { token } } } }" | jq -r .data.getAuthTokensFromLoginToken.tokens.accessOrWorkspaceAgnosticToken.token)
echo "$T" > admin.token
gq 'mutation { activateWorkspace(data:{displayName:"KUEC BD Ops rehearsal"}) { activationStatus } }' "$T" >/dev/null
ADMIN_ROLE=$(gq '{ getRoles { id label } }' "$T" | jq -r '.data.getRoles[] | select(.label=="Admin") | .id')
KID=$(gq "mutation { createApiKey(input:{name:\"rehearsal-admin\", expiresAt:\"2026-11-30T00:00:00Z\", roleId:\"$ADMIN_ROLE\"}) { id } }" "$T" | jq -r .data.createApiKey.id)
gq "mutation { generateApiKeyToken(apiKeyId:\"$KID\", expiresAt:\"2026-11-30T00:00:00Z\") { token } }" "$T" | jq -r .data.generateApiKeyToken.token > admin.apikey
K=$(cat admin.apikey)
F=$(curl -s localhost:3000/metadata -H 'content-type: application/json' -H "authorization: Bearer $K" -d '{"query":"{ objects(paging:{first:200}) { edges { node { nameSingular fieldsList { id name options } } } } }"}' | jq -c '.data.objects.edges[].node | select(.nameSingular=="opportunity") | .fieldsList[] | select(.name=="stage")')
OPTS=$(echo "$F" | jq -c '[.options[] | {value,label,position,color}] + [{value:"SIGNED",label:"Signed",color:"green",position:5},{value:"LOST",label:"Lost",color:"red",position:6},{value:"PARKED",label:"Parked",color:"gray",position:7}]')
curl -s localhost:3000/metadata -H 'content-type: application/json' -H "authorization: Bearer $K" -d "$(jq -n --arg id "$(echo "$F" | jq -r .id)" --argjson o "$OPTS" '{query:"mutation($id: UUID!, $o: JSON) { updateOneField(input:{id:$id, update:{options:$o}}) { options } }", variables:{id:$id, o:$o}}')" | jq -c '[.data.updateOneField.options[].value]'
jq --arg k "$K" '.remotes.local = {apiUrl:"http://localhost:3000", apiKey:$k} | .remotes.rehearsal = .remotes.local | .defaultRemote="local"' ~/.twenty/config.json > ~/.twenty/c.json && mv ~/.twenty/c.json ~/.twenty/config.json
echo "bootstrap done"
