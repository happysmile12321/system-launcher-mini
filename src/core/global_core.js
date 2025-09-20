/**
 * 全局Core对象
 * 提供统一的系统访问入口，集成所有核心功能
 */
import CoreAPI from './api/index.js';
import FSRegistry from './fs_registry.js';
import { Container } from './container/index.js';
import { Persistence } from './persistance/index.js';
import { Script } from './script/index.js';
import { Trigger } from './trigger/index.js';
import { Workflow } from './workflow/index.js';
import { CLI } from './cli/index.js';

/**
 * 默认配置
 */
const defaultConfig = {
    container: {
        dockerEndpoint: 'unix:///var/run/docker.sock',
        defaultImage: 'alpine:latest'
    },
    persistence: {
        storagePath: './data',
        backupPath: './backups',
        maxBackups: 10
    },
    script: {
        scriptPath: './scripts',
        timeout: 30000,
        maxConcurrent: 5
    },
    trigger: {
        maxTriggers: 100,
        triggerTimeout: 5000,
        retryAttempts: 3
    },
    workflow: {
        maxWorkflows: 50,
        executionTimeout: 300000,
        retryAttempts: 3
    },
    cli: {
        port: 3000,
        host: 'localhost'
    }
};

/**
 * 全局Core类
 * 作为整个系统的统一入口点
 */
class GlobalCore {
    constructor(config = {}) {
        this.config = { ...defaultConfig, ...config };
        this.api = new CoreAPI();
        this.fsRegistry = new FSRegistry(this.api);
        this.components = new Map();
        this.initialized = false;
    }

    /**
     * 初始化全局Core
     * @param {Object} fsConfigs - 文件服务配置
     */
    async initialize(fsConfigs = {}) {
        if (this.initialized) {
            console.log('[GlobalCore] 已经初始化过了');
            return;
        }

        console.log('[GlobalCore] 开始初始化...');

        try {
            // 1. 注册文件服务
            await this.fsRegistry.registerDefaultServices(fsConfigs);

            // 2. 注册核心组件
            await this.registerComponents();

            // 3. 初始化所有服务
            await this.api.initialize();

            this.initialized = true;
            console.log('[GlobalCore] 初始化完成');
        } catch (error) {
            console.error('[GlobalCore] 初始化失败:', error);
            throw error;
        }
    }

    /**
     * 注册所有核心组件
     */
    async registerComponents() {
        console.log('[GlobalCore] 注册核心组件...');

        // 注册Container组件
        const container = new Container(this.config.container);
        this.api.registerComponent('container', container);
        this.components.set('container', container);

        // 注册Persistence组件
        const persistence = new Persistence(this.config.persistence);
        this.api.registerComponent('persistence', persistence);
        this.components.set('persistence', persistence);

        // 注册Script组件
        const script = new Script(this.config.script);
        this.api.registerComponent('script', script);
        this.components.set('script', script);

        // 注册Trigger组件
        const trigger = new Trigger(this.config.trigger);
        this.api.registerComponent('trigger', trigger);
        this.components.set('trigger', trigger);

        // 注册Workflow组件
        const workflow = new Workflow(this.config.workflow);
        this.api.registerComponent('workflow', workflow);
        this.components.set('workflow', workflow);

        // 注册CLI组件
        const cli = new CLI(this.config.cli);
        this.api.registerComponent('cli', cli);
        this.components.set('cli', cli);

        console.log('[GlobalCore] 核心组件注册完成');
    }

    /**
     * 获取文件服务
     * @param {string} name - 服务名称，不指定则返回默认服务
     * @returns {Object|null} 文件服务实例
     */
    getFS(name = null) {
        if (name) {
            return this.fsRegistry.getFS(name);
        }
        return this.fsRegistry.getDefaultFS();
    }

    /**
     * 获取核心组件
     * @param {string} name - 组件名称
     * @returns {Object|null} 组件实例
     */
    getComponent(name) {
        return this.api.getComponent(name);
    }

    /**
     * 注册自定义文件服务
     * @param {string} name - 服务名称
     * @param {Object} fsInstance - 文件服务实例
     * @param {Object} config - 配置
     */
    registerFS(name, fsInstance, config = {}) {
        this.fsRegistry.registerCustomFS(name, fsInstance, config);
    }

    /**
     * 获取所有可用的文件服务
     * @returns {Array} 文件服务列表
     */
    getAvailableFS() {
        return this.api.getAllFS();
    }

    /**
     * 获取所有可用的组件
     * @returns {Array} 组件列表
     */
    getAvailableComponents() {
        return this.api.getAllComponents();
    }

    /**
     * 获取系统状态
     * @returns {Object} 系统状态信息
     */
    getStatus() {
        return {
            initialized: this.initialized,
            config: this.config,
            api: this.api.getStatus(),
            fsServices: this.getAvailableFS(),
            components: this.getAvailableComponents()
        };
    }

    /**
     * 销毁全局Core
     */
    async destroy() {
        if (!this.initialized) {
            console.log('[GlobalCore] 未初始化，无需销毁');
            return;
        }

        console.log('[GlobalCore] 开始销毁...');

        try {
            await this.api.destroy();
            this.initialized = false;
            console.log('[GlobalCore] 销毁完成');
        } catch (error) {
            console.error('[GlobalCore] 销毁失败:', error);
            throw error;
        }
    }

    // 便捷访问方法
    get container() { return this.getComponent('container'); }
    get persistence() { return this.getComponent('persistence'); }
    get script() { return this.getComponent('script'); }
    get trigger() { return this.getComponent('trigger'); }
    get workflow() { return this.getComponent('workflow'); }
    get cli() { return this.getComponent('cli'); }

    // 文件服务便捷访问
    get localFS() { return this.getFS('local'); }
    get gitFS() { return this.getFS('git'); }
    get memoryFS() { return this.getFS('memory'); }
}

// 创建全局实例
const globalCore = new GlobalCore();

export default globalCore;
export { GlobalCore };
