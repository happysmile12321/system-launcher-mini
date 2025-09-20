import { Container } from './container/index.js';
import { Persistence } from './persistance/index.js';
import { Script } from './script/index.js';
import { Trigger } from './trigger/index.js';
import { Workflow } from './workflow/index.js';
import { CLI } from './cli/index.js';
import globalCore, { GlobalCore } from './global_core.js';
import CoreAPI from './api/index.js';
import FSRegistry from './fs_registry.js';

/**
 * 核心模块导出
 * 提供所有核心组件的统一访问入口
 */
export {
    Container,
    Persistence,
    Script,
    Trigger,
    Workflow,
    CLI,
    GlobalCore,
    CoreAPI,
    FSRegistry
};

/**
 * 导出全局Core实例
 * 这是系统的主要访问入口
 */
export { globalCore as Core };


/**
 * 默认配置
 */
export const defaultConfig = {
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
