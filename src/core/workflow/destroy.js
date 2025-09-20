/**
 * 工作流模块销毁函数
 */
export async function destroy(workflow) {
    console.log('[Workflow] 销毁工作流管理器...');

    if (workflow) {
        // 停止所有运行中的工作流
        await stopAllRunningWorkflows(workflow);

        // 清理资源
        workflow.workflows.clear();
        workflow.executions.clear();
        workflow.runningExecutions.clear();
        workflow.steps.clear();
        workflow.initialized = false;
    }

    console.log('[Workflow] 工作流管理器销毁完成');
}

/**
 * 停止所有运行中的工作流
 */
async function stopAllRunningWorkflows(workflow) {
    console.log('[Workflow] 停止所有运行中的工作流...');
    for (const executionId of workflow.runningExecutions) {
        try {
            await stopWorkflowExecution(executionId);
        } catch (error) {
            console.error(`[Workflow] 停止工作流执行 ${executionId} 失败:`, error);
        }
    }
}

/**
 * 停止工作流执行
 */
async function stopWorkflowExecution(executionId) {
    console.log(`[Workflow] 停止工作流执行: ${executionId}`);
    // 实现工作流执行停止逻辑
}
