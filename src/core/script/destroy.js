/**
 * 脚本模块销毁函数
 */
export async function destroy(script) {
    console.log('[Script] 销毁脚本管理器...');

    if (script) {
        // 停止所有运行中的脚本
        await stopAllRunningScripts(script);

        // 清理资源
        script.scripts.clear();
        script.executions.clear();
        script.runningTasks.clear();
        script.initialized = false;
    }

    console.log('[Script] 脚本管理器销毁完成');
}

/**
 * 停止所有运行中的脚本
 */
async function stopAllRunningScripts(script) {
    console.log('[Script] 停止所有运行中的脚本...');
    for (const taskId of script.runningTasks) {
        try {
            await stopScript(taskId);
        } catch (error) {
            console.error(`[Script] 停止脚本 ${taskId} 失败:`, error);
        }
    }
}

/**
 * 停止脚本
 */
async function stopScript(executionId) {
    console.log(`[Script] 停止脚本执行: ${executionId}`);
    // 实现脚本停止逻辑
}
