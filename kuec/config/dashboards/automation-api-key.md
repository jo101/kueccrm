# Automation API key

- **Why not the manifest:** API keys are secrets created at runtime. The Automation **role** comes from the app manifest (`automation.role.ts`); the key bound to it does not.
- **Written against:** Twenty 2.48.0.
- **Prerequisites:** the ED's account (the ED role: creating a key needs both the **API keys** and the **Roles** permission, which no other team role holds); a row for the key in the inventory, `runbooks/13-roles.md` section 4.1; `kuec-bd-ops` installed so the **Automation** role exists with `canBeAssignedToApiKeys: true`; write access to secrets-manager path `twenty/<env>/AUTOMATION_API_KEY`.

## Steps

1. Settings > **MCP & APIs** > API keys > **New key**.
2. Name: `automation-<env>-<yyyy-mm>`, for example `automation-prod-2026-10`.
3. Expiration: **1 year**.
4. Role: **Automation**.
5. Create, then copy the key ("Copy this key as it will not be visible again") straight into the secrets manager. Never paste it into a ticket, chat, runbook, test or log.
6. Calendar: rotation reminder per `CLAUDE.md` (quarterly) and a hard reminder 30 days before expiry.

## Expected result

The key is listed with role Automation and an expiry one year out.

## Verify

```bash
KEY="$(<read from secrets manager>)"
# allowed: read and update an opportunity
curl -fsS -H "Authorization: Bearer $KEY" "$SERVER_URL/rest/opportunities?limit=1"
# refused: delete
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE -H "Authorization: Bearer $KEY" "$SERVER_URL/rest/opportunities/<id-of-a-test-record>"   # expect a permission error
# refused: settings/metadata
curl -s -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"query":"mutation { createOneObject(input:{object:{nameSingular:\"x\",namePlural:\"xs\",labelSingular:\"X\",labelPlural:\"Xs\"}}) { id } }"}' \
  "$SERVER_URL/metadata"   # expect a permission error
```

## Undo

Settings > MCP & APIs > the key > **Delete API key** (revokes it immediately). Rotation: create the new key, switch the secret, confirm the automation runs, then delete the old key.
