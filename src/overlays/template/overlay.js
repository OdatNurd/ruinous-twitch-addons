import addon from '../%%SVELTE_SRC_FILE%%';

import { createOverlay } from '../lib/main.js';


// =============================================================================


const overlay = createOverlay(addon, '%%ADDON_ID%%');

export default overlay;