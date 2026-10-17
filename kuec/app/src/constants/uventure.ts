// The uVENTURE origin is read when the manifest is built, so a staging build
// embeds and links staging uVENTURE: publish with KUEC_UVENTURE_ORIGIN set
// (runbooks/21-uventure-readiness.md section 1.3). Production is the default.
// Logic functions never read it; their links come in the uVENTURE payloads.
export const UVENTURE_ORIGIN = (
  process.env.KUEC_UVENTURE_ORIGIN ?? 'https://uventure.kuec.example'
).replace(/\/+$/, '');

// Pages uVENTURE serves for embedding; the paths are confirmed with the
// uVENTURE administrator before the first staging publish.
export const UVENTURE_PAGE_URL = {
  HOME: `${UVENTURE_ORIGIN}/`,
  TECHNOLOGIES: `${UVENTURE_ORIGIN}/embed/technologies`,
  EQUIPMENT_AND_LABS: `${UVENTURE_ORIGIN}/embed/equipment`,
  CHALLENGES: `${UVENTURE_ORIGIN}/embed/challenges`,
} as const;
