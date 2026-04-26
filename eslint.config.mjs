import web from './apps/web/eslint.config.js';
import mobile from './apps/mobile/eslint.config.js';
import ui from './packages/ui/eslint.config.js';
import hooks from './packages/hooks/eslint.config.js';
import utils from './packages/utils/eslint.config.js';

export default [...web, ...mobile, ...ui, ...hooks, ...utils];
