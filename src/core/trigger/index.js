import { initialize as initTrigger } from './initialize.js';
import { destroy as destroyTrigger } from './destroy.js';

// 导入所有trigger_api方法
import * as eventAPI from '../trigger_api/event.js';
import * as eventsAPI from '../trigger_api/events.js';
import * as manualAPI from '../trigger_api/manual.js';
import * as scheduleAPI from '../trigger_api/schedule.js';
import * as webhookAPI from '../trigger_api/webhook.js';

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

    // ========== Event API 代理方法 ==========

    async createEvent(eventName, workflowId, config = {}) {
        return await eventAPI.createEvent(eventName, workflowId, config);
    }

    async deleteEvent(eventId) {
        return await eventAPI.deleteEvent(eventId);
    }

    async updateEvent(eventId, updates) {
        return await eventAPI.updateEvent(eventId, updates);
    }

    async getEvent(eventId) {
        return await eventAPI.getEvent(eventId);
    }

    async getAllEvents() {
        return await eventAPI.getAllEvents();
    }

    async triggerEvent(eventName, data = {}) {
        return await eventAPI.triggerEvent(eventName, data);
    }

    // ========== Events API 代理方法 ==========

    async batchCreateEvents(events) {
        return await eventsAPI.batchCreateEvents(events);
    }

    async batchDeleteEvents(eventIds) {
        return await eventsAPI.batchDeleteEvents(eventIds);
    }

    async toggleEventStatus(eventId, enabled) {
        return await eventsAPI.toggleEventStatus(eventId, enabled);
    }

    async getEventStats() {
        return await eventsAPI.getEventStats();
    }

    async cleanupExpiredEvents() {
        return await eventsAPI.cleanupExpiredEvents();
    }

    // ========== Manual API 代理方法 ==========

    async createManualTrigger(workflowId, config = {}) {
        return await manualAPI.createManualTrigger(workflowId, config);
    }

    async deleteManualTrigger(triggerId) {
        return await manualAPI.deleteManualTrigger(triggerId);
    }

    async updateManualTrigger(triggerId, updates) {
        return await manualAPI.updateManualTrigger(triggerId, updates);
    }

    async getManualTrigger(triggerId) {
        return await manualAPI.getManualTrigger(triggerId);
    }

    async getAllManualTriggers() {
        return await manualAPI.getAllManualTriggers();
    }

    async triggerWorkflow(workflowId, data = {}) {
        return await manualAPI.triggerWorkflow(workflowId, data);
    }

    // ========== Schedule API 代理方法 ==========

    async createSchedule(cronExpression, workflowId, config = {}) {
        return await scheduleAPI.createSchedule(cronExpression, workflowId, config);
    }

    async deleteSchedule(scheduleId) {
        return await scheduleAPI.deleteSchedule(scheduleId);
    }

    async updateSchedule(scheduleId, updates) {
        return await scheduleAPI.updateSchedule(scheduleId, updates);
    }

    async getSchedule(scheduleId) {
        return await scheduleAPI.getSchedule(scheduleId);
    }

    async getAllSchedules() {
        return await scheduleAPI.getAllSchedules();
    }

    async validateCronExpression(cronExpression) {
        return await scheduleAPI.validateCronExpression(cronExpression);
    }

    // ========== Webhook API 代理方法 ==========

    async createWebhook(workflowId, config = {}) {
        return await webhookAPI.createWebhook(workflowId, config);
    }

    async deleteWebhook(webhookId) {
        return await webhookAPI.deleteWebhook(webhookId);
    }

    async updateWebhook(webhookId, updates) {
        return await webhookAPI.updateWebhook(webhookId, updates);
    }

    async getWebhook(webhookId) {
        return await webhookAPI.getWebhook(webhookId);
    }

    async getAllWebhooks() {
        return await webhookAPI.getAllWebhooks();
    }

    async handleWebhookCall(workflowId, payload) {
        return await webhookAPI.handleWebhookCall(workflowId, payload);
    }
}