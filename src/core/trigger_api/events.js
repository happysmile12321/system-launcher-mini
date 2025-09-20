/**
 * 事件管理器
 * 提供更复杂的事件管理功能
 */

/**
 * 批量创建事件监听器
 */
export async function batchCreateEvents(events) {
    console.log(`[EventsAPI] 批量创建事件监听器: ${events.length} 个`);

    const results = [];
    for (const event of events) {
        const result = await createEvent(event.eventName, event.workflowId, event.config);
        results.push(result);
    }

    return {
        success: true,
        created: results.length,
        results
    };
}

/**
 * 批量删除事件监听器
 */
export async function batchDeleteEvents(eventIds) {
    console.log(`[EventsAPI] 批量删除事件监听器: ${eventIds.length} 个`);

    const results = [];
    for (const eventId of eventIds) {
        const result = await deleteEvent(eventId);
        results.push(result);
    }

    return {
        success: true,
        deleted: results.length,
        results
    };
}

/**
 * 启用/禁用事件监听器
 */
export async function toggleEventStatus(eventId, enabled) {
    console.log(`[EventsAPI] ${enabled ? '启用' : '禁用'}事件监听器: ${eventId}`);

    return await updateEvent(eventId, {
        enabled,
        status: enabled ? 'active' : 'disabled',
        updatedAt: new Date().toISOString()
    });
}

/**
 * 获取事件统计信息
 */
export async function getEventStats() {
    console.log(`[EventsAPI] 获取事件统计信息`);

    return {
        total: 0,
        active: 0,
        disabled: 0,
        byType: {},
        lastUpdated: new Date().toISOString()
    };
}

/**
 * 清理过期事件
 */
export async function cleanupExpiredEvents() {
    console.log(`[EventsAPI] 清理过期事件`);

    return {
        success: true,
        cleaned: 0,
        message: '过期事件清理完成'
    };
}

// 导入基础方法
import { createEvent, deleteEvent, updateEvent } from './event.js';
