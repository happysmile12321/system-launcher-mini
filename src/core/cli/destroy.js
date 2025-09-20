/**
 * CLI模块销毁函数
 */
export async function destroy(cli) {
    console.log('[CLI] 销毁CLI服务器...');

    if (cli) {
        // 停止HTTP服务器
        if (cli.server) {
            await new Promise((resolve) => {
                cli.server.close(resolve);
            });
            cli.server = null;
        }

        // 清理应用
        cli.app = null;
        cli.components = {};
        cli.initialized = false;
    }

    console.log('[CLI] CLI服务器销毁完成');
}
