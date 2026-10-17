# Iframe embedding: let uVENTURE show CRM views

- **Why not the manifest:** the allowed embedding origins are a workspace security setting (`allowedIframeOrigins` on the workspace), not app metadata. An app cannot set it.
- **Written against:** Twenty 2.48.0, `kuec-bd-ops` 0.11.0.
- **Prerequisites:** the ED's account (the **Security** permission; the mutation is guarded by it). The uVENTURE origin of this environment: `https://uventure.kuec.example` in production, `https://uventure-staging.kuec.example` on staging (replace with the real names, `runbooks/21-uventure-readiness.md` section 1.1). Twenty already runs at `crm.<that uVENTURE host>`.

## Steps

1. Settings > **Security**.
2. Section **Iframe embedding**. The text reads "Allow trusted websites to display this workspace in an iframe."
3. **Allowed origin**: type the uVENTURE origin exactly, scheme and host, no path and no trailing slash: `https://uventure.kuec.example`.
4. **Add origin**. The origin appears in the list above the field.
5. Add nothing else. Twenty allows at most 20 origins; this instance needs one per environment.

## Expected result

Every Twenty page is served with `Content-Security-Policy: frame-ancestors 'self' https://uventure.kuec.example` and without `X-Frame-Options` (`frontend.service.ts`). A uVENTURE page can embed a Twenty view, the BD dashboard or a record in an iframe; any other site still cannot.

## Verify

```bash
curl -sI https://crm.uventure.kuec.example/objects/opportunities | grep -i -e content-security-policy -e x-frame-options
# expect: content-security-policy: frame-ancestors 'self' https://uventure.kuec.example; ...
# expect: no x-frame-options line
```

Then in a browser, signed in to Twenty in one tab, open the uVENTURE page that embeds a CRM view: the view loads signed in. Microsoft sign-in itself never loads inside a frame, so a person who is signed out sees the Twenty sign-in page in the frame and signs in once in a Twenty tab (`runbooks/21-uventure-readiness.md` section 1.4).

The reverse proxy must not add its own frame header (`config/deploy/Caddyfile.example`).

## Undo

Settings > Security > Iframe embedding > **Remove** next to the origin. Twenty goes back to `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` at the next page load; uVENTURE's embedded CRM views show an empty frame.
