/**
 * 容器模块销毁函数
 */
export async function destroy(container) {
    console.log('[Container] 销毁容器管理器...');

    if (container && container.instances) {
        // 清理所有实例
        container.instances.clear();
        container.initialized = false;
    }

    console.log('[Container] 容器管理器销毁完成');
}
