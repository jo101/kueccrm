// Standard object identifiers that logic functions need at runtime.
//
// The SDK build replaces twenty-sdk/define with a stub inside every
// logic-function bundle. Flat constants keep their values, but nested ones such
// as STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS become a Proxy, so
// `STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier` is a
// function there: it passes isDefined and reaches the API as null (release-gate
// B5). Manifest files may keep reading the SDK constant; runtime code under
// src/automation and src/logic-functions reads these instead.
// standard-objects.test.ts checks each value against the SDK.
export const OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER =
  '20202020-9549-49dd-b2b2-883999db8938';
