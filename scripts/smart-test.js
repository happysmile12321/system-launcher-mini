#!/usr/bin/env node

/**
 * 智能测试脚本
 * 启动Server，然后启动智能Client
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

async function smartTest() {
    console.log(chalk.blue('🚀 智能测试：Server + Smart Client\n'));

    let serverProcess = null;

    try {
        // 1. 启动Server
        console.log(chalk.yellow('1. 启动Server...'));
        serverProcess = spawn('node', ['src/server/start_server.js'], {
            stdio: ['inherit', 'pipe', 'pipe']
        });

        // 等待Server启动
        await new Promise((resolve, reject) => {
            let serverReady = false;

            serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(chalk.gray(`[Server] ${output.trim()}`));

                if (output.includes('RPC服务器启动成功') || output.includes('Server启动完成')) {
                    serverReady = true;
                    resolve();
                }
            });

            serverProcess.stderr.on('data', (data) => {
                console.error(chalk.red(`[Server Error] ${data.toString().trim()}`));
            });

            serverProcess.on('error', reject);

            // 超时处理
            setTimeout(() => {
                if (!serverReady) {
                    reject(new Error('Server启动超时'));
                }
            }, 15000);
        });

        console.log(chalk.green('✅ Server启动成功\n'));

        // 2. 等待Server完全就绪
        console.log(chalk.yellow('2. 等待Server完全就绪...'));
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. 启动智能客户端
        console.log(chalk.yellow('3. 启动智能客户端...\n'));

        const clientProcess = spawn('node', ['src/cli/smart_client.js'], {
            stdio: 'inherit'
        });

        await new Promise((resolve) => {
            clientProcess.on('exit', (code) => {
                console.log(chalk.gray(`\n智能客户端退出，代码: ${code}`));
                resolve();
            });
        });

    } catch (error) {
        console.error(chalk.red('❌ 智能测试失败:'), error);
    } finally {
        // 清理Server进程
        if (serverProcess) {
            console.log(chalk.yellow('\n🛑 停止Server...'));
            serverProcess.kill('SIGTERM');
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(chalk.green('✅ 清理完成'));
        }
    }
}

// 设置优雅关闭
process.on('SIGINT', async () => {
    console.log(chalk.yellow('\n🛑 收到中断信号，正在退出...'));
    process.exit(0);
});

// 运行智能测试
if (import.meta.url === `file://${process.argv[1]}`) {
    smartTest().catch((error) => {
        console.error(chalk.red('❌ 测试失败:'), error);
        process.exit(1);
    });
}

export default smartTest;
