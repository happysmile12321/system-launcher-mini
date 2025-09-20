import { initialize as initCLI } from './initialize.js';
import { destroy as destroyCLI } from './destroy.js';

/**
 * CLI核心类
 * 负责CLI服务器管理
 */
export class CLI {
    constructor(config = {}) {
        this.config = config;
        this.cli = null;
    }

    /**
     * 初始化CLI服务器
     */
    async initialize() {
        this.cli = await initCLI(this.config);
        return this.cli;
    }

    /**
     * 销毁CLI服务器
     */
    async destroy() {
        await destroyCLI(this.cli);
        this.cli = null;
    }
}
