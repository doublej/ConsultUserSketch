import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.B0znqXPk.js","_app/immutable/chunks/Dt2Xl_rb.js","_app/immutable/chunks/20TeykM2.js","_app/immutable/chunks/CTjiQYu9.js"];
export const stylesheets = ["_app/immutable/assets/0.CMjo1MB9.css"];
export const fonts = [];
