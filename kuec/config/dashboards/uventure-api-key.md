# uVENTURE reader API key

- **Why not the manifest:** API keys are secrets created at runtime. The **uVENTURE reader** role comes from the app manifest (`uventure-reader.role.ts`); the key bound to it does not.
- **Written against:** Twenty 2.48.0, `kuec-bd-ops` 0.11.0.
- **Prerequisites:** the ED's account (creating a key needs both the **API keys** and the **Roles** permission); a row for the key in the inventory, `runbooks/13-roles.md` section 4.1; `kuec-bd-ops` 0.11.0 or later installed so the role exists; write access to secrets-manager path `twenty/<env>/UVENTURE_READER_API_KEY`; the uVENTURE administrator ready to store it on their side.

## Steps

1. Settings > **MCP & APIs** > API keys > **New key**.
2. Name: `uventure-reader-<env>-<yyyy-mm>`, for example `uventure-reader-prod-2026-11`.
3. Expiration: **1 year**.
4. Role: **uVENTURE reader**.
5. Create, then copy the key straight into the secrets manager. Hand it to the uVENTURE administrator through the secrets manager share, never by email or chat.
6. Calendar: rotation with the Automation key every quarter, and a hard reminder 30 days before expiry.

## Expected result

The key is listed with role uVENTURE reader and an expiry one year out.

## Verify

```bash
KEY="$(<read from secrets manager>)"
# allowed: the nightly read of signed licence opportunities
curl -fsS -H "Authorization: Bearer $KEY" \
  "$SERVER_URL/rest/opportunities?limit=1&filter=and(stage[eq]:SIGNED,playbookType[eq]:TECHNOLOGY_LICENSING)"
# refused: any write
curl -s -o /dev/null -w '%{http_code}\n' -X PATCH -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
  -d '{"name":"x"}' "$SERVER_URL/rest/opportunities/<id-of-a-test-record>"   # expect a permission error
# refused: work packages, tasks and notes are not readable
curl -s -H "Authorization: Bearer $KEY" "$SERVER_URL/rest/workPackages?limit=1"   # expect a permission error
```

## Undo

Settings > MCP & APIs > the key > **Delete API key**: uVENTURE's nightly read stops at once, and the signed webhooks keep running. Rotation: create the new key, the uVENTURE administrator switches to it and confirms one nightly read, then delete the old key.
