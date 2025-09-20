import { initialize as initTrigger } from './initialize.js';
import { destroy as destroyTrigger } from './destroy.js';

/**
 * 触发器核心类
 * 负责事件触发和调度管理
 */
export class Trigger {
    constructor(config = {}) {
        this.config = config;
        this.trigger = null;
    }

    /**
     * 初始化触发器管理器
     */
    async initialize() {
        this.trigger = await initTrigger(this.config);
        return this.trigger;
    }

    /**
     * 销毁触发器管理器
     */
    async destroy() {
        await destroyTrigger(this.trigger);
        this.trigger = null;
    }
}