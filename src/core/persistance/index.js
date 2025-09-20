import { initialize as initPersistence } from './initialize.js';
import { destroy as destroyPersistence } from './destroy.js';

/**
 * 持久化核心类
 * 负责数据存储和持久化管理
 */
export class Persistence {
    constructor(config = {}) {
        this.config = config;
        this.persistence = null;
    }

    /**
     * 初始化持久化管理器
     */
    async initialize() {
        this.persistence = await initPersistence(this.config);
        return this.persistence;
    }

    /**
     * 销毁持久化管理器
     */
    async destroy() {
        await destroyPersistence(this.persistence);
        this.persistence = null;
    }
}