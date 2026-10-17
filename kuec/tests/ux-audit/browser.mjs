// Shared constants for the UX audit's browser scripts. Rehearsal only: the host name and the
// throwaway password are the ones release-gate/rehearsal/lib.mjs uses.
export const BASE = 'http://server:3000';
export const PASSWORD = 'Rehearsal-2026!pw';
export const SHOTS = new URL('./evidence/shots/', import.meta.url).pathname;
