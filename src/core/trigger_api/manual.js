/**
 * 手动触发器方法模块
 * 提供手动触发的增删改查功能
 */

/**
 * 创建手动触发器
 */
export async function createManualTrigger(workflowId, config = {}) {
    console.log(`[ManualAPI] 创建手动触发器: ${workflowId}`);

    return {
        id: Date.now(),
        type: 'manual',
        workflowId,
        config,
        status: 'created',
        createdAt: new Date().toISOString()
    };
}

/**
 * 删除手动触发器
 */
export async function deleteManualTrigger(triggerId) {
    console.log(`[ManualAPI] 删除手动触发器: ${triggerId}`);

    return {
        success: true,
        message: `手动触发器 ${triggerId} 已删除`
    };
}

/**
 * 更新手动触发器
 */
export async function updateManualTrigger(triggerId, updates) {
    console.log(`[ManualAPI] 更新手动触发器: ${triggerId}`);

    return {
        id: triggerId,
        ...updates,
        updatedAt: new Date().toISOString()
    };
}

/**
 * 查询手动触发器
 */
export async function getManualTrigger(triggerId) {
    console.log(`[ManualAPI] 查询手动触发器: ${triggerId}`);

    return {
        id: triggerId,
        type: 'manual',
        status: 'active',
        createdAt: new Date().toISOString()
    };
}

/**
 * 获取所有手动触发器
 */
export async function getAllManualTriggers() {
    console.log(`[ManualAPI] 获取所有手动触发器`);

    return {
        triggers: [],
        count: 0
    };
}

/**
 * 手动触发工作流
 */
export async function triggerWorkflow(workflowId, data = {}) {
    console.log(`[ManualAPI] 手动触发工作流: ${workflowId}`);

    return {
        workflowId,
        triggerType: 'manual',
        data,
        executionId: Date.now(),
        timestamp: new Date().toISOString()
    };
}
