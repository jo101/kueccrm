import fieldsJson from './fields.json';

export type FieldGuidanceKey = keyof typeof fieldsJson.fields;
export type ObjectGuidanceKey = keyof typeof fieldsJson.objects;

// Twenty reads the English from the manifest; scripts/sync-locales.mjs puts
// the Arabic of the same entry into locales/ar-SA.json.
export const fieldDescription = (key: FieldGuidanceKey): string =>
  fieldsJson.fields[key].description.en;

export const objectDescription = (key: ObjectGuidanceKey): string =>
  fieldsJson.objects[key].description.en;
