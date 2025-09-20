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

        // Trigger API 方法
        this.registerTriggerAPIMethods();

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

    // ========== Trigger API 方法注册 ==========

    /**
     * 注册所有 Trigger API 方法
     */
    registerTriggerAPIMethods() {
        // Event API 方法
        this.registerMethod('trigger_api.event.createEvent', this.triggerEventCreate.bind(this));
        this.registerMethod('trigger_api.event.deleteEvent', this.triggerEventDelete.bind(this));
        this.registerMethod('trigger_api.event.updateEvent', this.triggerEventUpdate.bind(this));
        this.registerMethod('trigger_api.event.getEvent', this.triggerEventGet.bind(this));
        this.registerMethod('trigger_api.event.getAllEvents', this.triggerEventGetAll.bind(this));
        this.registerMethod('trigger_api.event.triggerEvent', this.triggerEventTrigger.bind(this));

        // Events API 方法
        this.registerMethod('trigger_api.events.batchCreateEvents', this.triggerEventsBatchCreate.bind(this));
        this.registerMethod('trigger_api.events.batchDeleteEvents', this.triggerEventsBatchDelete.bind(this));
        this.registerMethod('trigger_api.events.toggleEventStatus', this.triggerEventsToggle.bind(this));
        this.registerMethod('trigger_api.events.getEventStats', this.triggerEventsStats.bind(this));
        this.registerMethod('trigger_api.events.cleanupExpiredEvents', this.triggerEventsCleanup.bind(this));

        // Manual API 方法
        this.registerMethod('trigger_api.manual.createManualTrigger', this.triggerManualCreate.bind(this));
        this.registerMethod('trigger_api.manual.deleteManualTrigger', this.triggerManualDelete.bind(this));
        this.registerMethod('trigger_api.manual.updateManualTrigger', this.triggerManualUpdate.bind(this));
        this.registerMethod('trigger_api.manual.getManualTrigger', this.triggerManualGet.bind(this));
        this.registerMethod('trigger_api.manual.getAllManualTriggers', this.triggerManualGetAll.bind(this));
        this.registerMethod('trigger_api.manual.triggerWorkflow', this.triggerManualTrigger.bind(this));

        // Schedule API 方法
        this.registerMethod('trigger_api.schedule.createSchedule', this.triggerScheduleCreate.bind(this));
        this.registerMethod('trigger_api.schedule.deleteSchedule', this.triggerScheduleDelete.bind(this));
        this.registerMethod('trigger_api.schedule.updateSchedule', this.triggerScheduleUpdate.bind(this));
        this.registerMethod('trigger_api.schedule.getSchedule', this.triggerScheduleGet.bind(this));
        this.registerMethod('trigger_api.schedule.getAllSchedules', this.triggerScheduleGetAll.bind(this));
        this.registerMethod('trigger_api.schedule.validateCronExpression', this.triggerScheduleValidate.bind(this));

        // Webhook API 方法
        this.registerMethod('trigger_api.webhook.createWebhook', this.triggerWebhookCreate.bind(this));
        this.registerMethod('trigger_api.webhook.deleteWebhook', this.triggerWebhookDelete.bind(this));
        this.registerMethod('trigger_api.webhook.updateWebhook', this.triggerWebhookUpdate.bind(this));
        this.registerMethod('trigger_api.webhook.getWebhook', this.triggerWebhookGet.bind(this));
        this.registerMethod('trigger_api.webhook.getAllWebhooks', this.triggerWebhookGetAll.bind(this));
        this.registerMethod('trigger_api.webhook.handleWebhookCall', this.triggerWebhookCall.bind(this));
    }

    // ========== Event API 方法实现 ==========

    async triggerEventCreate(params) {
        const { eventName, workflowId, config } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.createEvent(eventName, workflowId, config);
    }

    async triggerEventDelete(params) {
        const { eventId } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.deleteEvent(eventId);
    }

    async triggerEventUpdate(params) {
        const { eventId, updates } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.updateEvent(eventId, updates);
    }

    async triggerEventGet(params) {
        const { eventId } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.getEvent(eventId);
    }

    async triggerEventGetAll() {
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.getAllEvents();
    }

    async triggerEventTrigger(params) {
        const { eventName, data } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.triggerEvent(eventName, data);
    }

    // ========== Events API 方法实现 ==========

    async triggerEventsBatchCreate(params) {
        const { events } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.batchCreateEvents(events);
    }

    async triggerEventsBatchDelete(params) {
        const { eventIds } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.batchDeleteEvents(eventIds);
    }

    async triggerEventsToggle(params) {
        const { eventId, enabled } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.toggleEventStatus(eventId, enabled);
    }

    async triggerEventsStats() {
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.getEventStats();
    }

    async triggerEventsCleanup() {
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.cleanupExpiredEvents();
    }

    // ========== Manual API 方法实现 ==========

    async triggerManualCreate(params) {
        const { workflowId, config } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.createManualTrigger(workflowId, config);
    }

    async triggerManualDelete(params) {
        const { triggerId } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.deleteManualTrigger(triggerId);
    }

    async triggerManualUpdate(params) {
        const { triggerId, updates } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.updateManualTrigger(triggerId, updates);
    }

    async triggerManualGet(params) {
        const { triggerId } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.getManualTrigger(triggerId);
    }

    async triggerManualGetAll() {
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.getAllManualTriggers();
    }

    async triggerManualTrigger(params) {
        const { workflowId, data } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.triggerWorkflow(workflowId, data);
    }

    // ========== Schedule API 方法实现 ==========

    async triggerScheduleCreate(params) {
        const { cronExpression, workflowId, config } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.createSchedule(cronExpression, workflowId, config);
    }

    async triggerScheduleDelete(params) {
        const { scheduleId } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.deleteSchedule(scheduleId);
    }

    async triggerScheduleUpdate(params) {
        const { scheduleId, updates } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.updateSchedule(scheduleId, updates);
    }

    async triggerScheduleGet(params) {
        const { scheduleId } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.getSchedule(scheduleId);
    }

    async triggerScheduleGetAll() {
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.getAllSchedules();
    }

    async triggerScheduleValidate(params) {
        const { cronExpression } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.validateCronExpression(cronExpression);
    }

    // ========== Webhook API 方法实现 ==========

    async triggerWebhookCreate(params) {
        const { workflowId, config } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.createWebhook(workflowId, config);
    }

    async triggerWebhookDelete(params) {
        const { webhookId } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.deleteWebhook(webhookId);
    }

    async triggerWebhookUpdate(params) {
        const { webhookId, updates } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.updateWebhook(webhookId, updates);
    }

    async triggerWebhookGet(params) {
        const { webhookId } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.getWebhook(webhookId);
    }

    async triggerWebhookGetAll() {
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.getAllWebhooks();
    }

    async triggerWebhookCall(params) {
        const { workflowId, payload } = params;
        const triggerComponent = this.core.getComponent('trigger');
        if (!triggerComponent) {
            throw new Error('Trigger component not available');
        }
        return await triggerComponent.handleWebhookCall(workflowId, payload);
    }
}

export { ServerAPI };
