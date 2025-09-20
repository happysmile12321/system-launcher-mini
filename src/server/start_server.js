#!/usr/bin/env node

/**
 * Server启动脚本
 * 启动RPC服务器
 */

import chalk from 'chalk';
import Server from './index.js';

async function startServer() {
    console.log(chalk.blue('🚀 启动System Launcher Server...'));

    const server = new Server({
        port: 8080,
        host: 'localhost',
        rpcPort: 8081
    });

    // 处理优雅关闭
    process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n🛑 收到关闭信号，正在优雅关闭...'));
        await server.stop();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log(chalk.yellow('\n🛑 收到终止信号，正在优雅关闭...'));
        await server.stop();
        process.exit(0);
    });

    try {
        await server.start();

        console.log(chalk.green('\n✅ Server启动完成!'));
        console.log(chalk.cyan('📡 RPC服务地址: http://localhost:8081'));
        console.log(chalk.gray('按 Ctrl+C 停止服务器'));

        // 保持进程运行
        process.stdin.resume();

    } catch (error) {
        console.error(chalk.red('❌ Server启动失败:'), error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    startServer().catch((error) => {
        console.error(chalk.red('❌ 启动失败:'), error);
        process.exit(1);
    });
}

export default startServer;
