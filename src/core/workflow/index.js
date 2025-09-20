import { initialize as initWorkflow } from './initialize.js';
import { destroy as destroyWorkflow } from './destroy.js';

/**
 * 工作流核心类
 * 负责工作流编排和执行管理
 */
export class Workflow {
    constructor(config = {}) {
        this.config = config;
        this.workflow = null;
    }

    /**
     * 初始化工作流管理器
     */
    async initialize() {
        this.workflow = await initWorkflow(this.config);
        return this.workflow;
    }

    /**
     * 销毁工作流管理器
     */
    async destroy() {
        await destroyWorkflow(this.workflow);
        this.workflow = null;
    }
}