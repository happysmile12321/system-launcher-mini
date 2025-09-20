import { initialize as initScript } from './initialize.js';
import { destroy as destroyScript } from './destroy.js';

/**
 * 脚本管理核心类
 * 负责脚本执行和管理
 */
export class Script {
    constructor(config = {}) {
        this.config = config;
        this.script = null;
    }

    /**
     * 初始化脚本管理器
     */
    async initialize() {
        this.script = await initScript(this.config);
        return this.script;
    }

    /**
     * 销毁脚本管理器
     */
    async destroy() {
        await destroyScript(this.script);
        this.script = null;
    }
}