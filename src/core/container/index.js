import { initialize as initContainer } from './initialize.js';
import { destroy as destroyContainer } from './destroy.js';

/**
 * 容器核心类
 * 负责容器管理和实例化
 */
export class Container {
    constructor(config = {}) {
        this.config = config;
        this.container = null;
    }

    /**
     * 初始化容器
     */
    async initialize() {
        this.container = await initContainer(this.config);
        return this.container;
    }

    /**
     * 销毁容器
     */
    async destroy() {
        await destroyContainer(this.container);
        this.container = null;
    }
}