/**
 * ServerAPI模块
 * 定义RPC接口规范，将Core的功能暴露为RPC方法
 */
import { EventEmitter } from 'events';

/**
 * ServerAPI类
 * 提供RPC接口，将Core的功能暴露给客户端
 */
class ServerAPI extends EventEmitter {
    constructor(core) {
        super();
        this.core = core;
        this.methods = new Map();
        this.initializeMethods();
    }

    /**
     * 初始化所有RPC方法
     */
    initializeMethods() {
        console.log('[ServerAPI] 初始化RPC方法...');

        // 文件服务相关方法
        this.registerMethod('fs.create', this.fsCreate.bind(this));
        this.registerMethod('fs.read', this.fsRead.bind(this));
        this.registerMethod('fs.update', this.fsUpdate.bind(this));
        this.registerMethod('fs.delete', this.fsDelete.bind(this));
        this.registerMethod('fs.exists', this.fsExists.bind(this));
        this.registerMethod('fs.list', this.fsList.bind(this));
        this.registerMethod('fs.getInfo', this.fsGetInfo.bind(this));
        this.registerMethod('fs.stats', this.fsStats.bind(this));

        // 核心组件相关方法
        this.registerMethod('container.create', this.containerCreate.bind(this));
        this.registerMethod('container.start', this.containerStart.bind(this));
        this.registerMethod('container.stop', this.containerStop.bind(this));
        this.registerMethod('container.remove', this.containerRemove.bind(this));
        this.registerMethod('container.list', this.containerList.bind(this));

        this.registerMethod('script.execute', this.scriptExecute.bind(this));
        this.registerMethod('script.list', this.scriptList.bind(this));
        this.registerMethod('script.getStatus', this.scriptGetStatus.bind(this));

        this.registerMethod('trigger.create', this.triggerCreate.bind(this));
        this.registerMethod('trigger.start', this.triggerStart.bind(this));
        this.registerMethod('trigger.stop', this.triggerStop.bind(this));
        this.registerMethod('trigger.list', this.triggerList.bind(this));

        this.registerMethod('workflow.create', this.workflowCreate.bind(this));
        this.registerMethod('workflow.start', this.workflowStart.bind(this));
        this.registerMethod('workflow.stop', this.workflowStop.bind(this));
        this.registerMethod('workflow.list', this.workflowList.bind(this));

        this.registerMethod('persistence.save', this.persistenceSave.bind(this));
        this.registerMethod('persistence.load', this.persistenceLoad.bind(this));
        this.registerMethod('persistence.delete', this.persistenceDelete.bind(this));

        // 系统状态方法
        this.registerMethod('system.getStatus', this.systemGetStatus.bind(this));
        this.registerMethod('system.getFSList', this.systemGetFSList.bind(this));
        this.registerMethod('system.getComponents', this.systemGetComponents.bind(this));

        console.log(`[ServerAPI] RPC方法初始化完成，共注册 ${this.methods.size} 个方法`);
    }

    /**
     * 注册RPC方法
     */
    registerMethod(name, handler) {
        this.methods.set(name, handler);
        console.log(`[ServerAPI] 注册方法: ${name}`);
    }

    /**
     * 调用RPC方法
     */
    async call(method, params) {
        const handler = this.methods.get(method);
        if (!handler) {
            throw new Error(`Method not found: ${method}`);
        }

        try {
            return await handler(params);
        } catch (error) {
            console.error(`[ServerAPI] 方法调用失败 ${method}:`, error);
            throw error;
        }
    }

    /**
     * 获取所有可用的方法
     */
    getMethods() {
        return Array.from(this.methods.keys());
    }

    // ========== 文件服务方法 ==========

    async fsCreate(params) {
        const { fsName = 'local', path, data } = params;
        const fs = this.core.getFS(fsName);
        if (!fs) {
            throw new Error(`File system not found: ${fsName}`);
        }
        return fs.create(path, data);
    }

    async fsRead(params) {
        const { fsName = 'local', path } = params;
        const fs = this.core.getFS(fsName);
        if (!fs) {
            throw new Error(`File system not found: ${fsName}`);
        }
        return fs.read(path);
    }

    async fsUpdate(params) {
        const { fsName = 'local', path, data } = params;
        const fs = this.core.getFS(fsName);
        if (!fs) {
            throw new Error(`File system not found: ${fsName}`);
        }
        return fs.update(path, data);
    }

    async fsDelete(params) {
        const { fsName = 'local', path } = params;
        const fs = this.core.getFS(fsName);
        if (!fs) {
            throw new Error(`File system not found: ${fsName}`);
        }
        return fs.delete(path);
    }

    async fsExists(params) {
        const { fsName = 'local', path } = params;
        const fs = this.core.getFS(fsName);
        if (!fs) {
            throw new Error(`File system not found: ${fsName}`);
        }
        return fs.exists(path);
    }

    async fsList(params) {
        const { fsName = 'local' } = params;
        const fs = this.core.getFS(fsName);
        if (!fs) {
            throw new Error(`File system not found: ${fsName}`);
        }
        return fs.list();
    }

    async fsGetInfo(params) {
        const { fsName = 'local', path } = params;
        const fs = this.core.getFS(fsName);
        if (!fs) {
            throw new Error(`File system not found: ${fsName}`);
        }
        return fs.getInfo(path);
    }

    async fsStats(params) {
        const { fsName = 'local' } = params;
        const fs = this.core.getFS(fsName);
        if (!fs) {
            throw new Error(`File system not found: ${fsName}`);
        }
        return fs.stats();
    }

    // ========== 容器组件方法 ==========

    async containerCreate(params) {
        const container = this.core.container;
        if (!container) {
            throw new Error('Container component not available');
        }
        return await container.createContainer(params);
    }

    async containerStart(params) {
        const container = this.core.container;
        if (!container) {
            throw new Error('Container component not available');
        }
        return await container.startContainer(params.containerId);
    }

    async containerStop(params) {
        const container = this.core.container;
        if (!container) {
            throw new Error('Container component not available');
        }
        return await container.stopContainer(params.containerId);
    }

    async containerRemove(params) {
        const container = this.core.container;
        if (!container) {
            throw new Error('Container component not available');
        }
        return await container.removeContainer(params.containerId);
    }

    async containerList(params) {
        const container = this.core.container;
        if (!container) {
            throw new Error('Container component not available');
        }
        return await container.listContainers();
    }

    // ========== 脚本组件方法 ==========

    async scriptExecute(params) {
        const script = this.core.script;
        if (!script) {
            throw new Error('Script component not available');
        }
        return await script.executeScript(params.scriptPath, params.args);
    }

    async scriptList(params) {
        const script = this.core.script;
        if (!script) {
            throw new Error('Script component not available');
        }
        return await script.listScripts();
    }

    async scriptGetStatus(params) {
        const script = this.core.script;
        if (!script) {
            throw new Error('Script component not available');
        }
        return await script.getScriptStatus(params.scriptId);
    }

    // ========== 触发器组件方法 ==========

    async triggerCreate(params) {
        const trigger = this.core.trigger;
        if (!trigger) {
            throw new Error('Trigger component not available');
        }
        return await trigger.createTrigger(params);
    }

    async triggerStart(params) {
        const trigger = this.core.trigger;
        if (!trigger) {
            throw new Error('Trigger component not available');
        }
        return await trigger.startTrigger(params.triggerId);
    }

    async triggerStop(params) {
        const trigger = this.core.trigger;
        if (!trigger) {
            throw new Error('Trigger component not available');
        }
        return await trigger.stopTrigger(params.triggerId);
    }

    async triggerList(params) {
        const trigger = this.core.trigger;
        if (!trigger) {
            throw new Error('Trigger component not available');
        }
        return await trigger.listTriggers();
    }

    // ========== 工作流组件方法 ==========

    async workflowCreate(params) {
        const workflow = this.core.workflow;
        if (!workflow) {
            throw new Error('Workflow component not available');
        }
        return await workflow.createWorkflow(params);
    }

    async workflowStart(params) {
        const workflow = this.core.workflow;
        if (!workflow) {
            throw new Error('Workflow component not available');
        }
        return await workflow.startWorkflow(params.workflowId);
    }

    async workflowStop(params) {
        const workflow = this.core.workflow;
        if (!workflow) {
            throw new Error('Workflow component not available');
        }
        return await workflow.stopWorkflow(params.workflowId);
    }

    async workflowList(params) {
        const workflow = this.core.workflow;
        if (!workflow) {
            throw new Error('Workflow component not available');
        }
        return await workflow.listWorkflows();
    }

    // ========== 持久化组件方法 ==========

    async persistenceSave(params) {
        const persistence = this.core.persistence;
        if (!persistence) {
            throw new Error('Persistence component not available');
        }
        return await persistence.saveData(params.key, params.data);
    }

    async persistenceLoad(params) {
        const persistence = this.core.persistence;
        if (!persistence) {
            throw new Error('Persistence component not available');
        }
        return await persistence.loadData(params.key);
    }

    async persistenceDelete(params) {
        const persistence = this.core.persistence;
        if (!persistence) {
            throw new Error('Persistence component not available');
        }
        return await persistence.deleteData(params.key);
    }

    // ========== 系统状态方法 ==========

    async systemGetStatus(params) {
        return this.core.getStatus();
    }

    async systemGetFSList(params) {
        return this.core.getAvailableFS();
    }

    async systemGetComponents(params) {
        return this.core.getAvailableComponents();
    }
}

export { ServerAPI };
