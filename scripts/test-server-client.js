#!/usr/bin/env node

/**
 * 测试脚本：启动Server然后启动Client
 * 提供更好的错误处理和进程管理
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

class TestRunner {
    constructor() {
        this.serverProcess = null;
        this.clientProcess = null;
        this.serverReady = false;
    }

    async start() {
        console.log(chalk.blue('🚀 启动Server-Client测试...\n'));

        try {
            // 1. 启动Server
            await this.startServer();

            // 2. 等待Server就绪
            await this.waitForServer();

            // 3. 启动Client
            await this.startClient();

            // 4. 设置优雅关闭
            this.setupGracefulShutdown();

        } catch (error) {
            console.error(chalk.red('❌ 测试启动失败:'), error);
            await this.cleanup();
            process.exit(1);
        }
    }

    async startServer() {
        console.log(chalk.yellow('1. 启动Server...'));

        return new Promise((resolve, reject) => {
            this.serverProcess = spawn('node', ['src/server/start_server.js'], {
                stdio: ['inherit', 'pipe', 'pipe'],
                cwd: process.cwd()
            });

            let serverOutput = '';

            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                serverOutput += output;
                console.log(chalk.gray(`[Server] ${output.trim()}`));

                // 检查Server是否启动成功
                if (output.includes('RPC服务器启动成功') || output.includes('Server启动完成')) {
                    this.serverReady = true;
                    resolve();
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                console.error(chalk.red(`[Server Error] ${data.toString().trim()}`));
            });

            this.serverProcess.on('error', (error) => {
                console.error(chalk.red('Server启动失败:'), error);
                reject(error);
            });

            this.serverProcess.on('exit', (code) => {
                if (code !== 0 && !this.serverReady) {
                    reject(new Error(`Server进程退出，代码: ${code}`));
                }
            });

            // 超时处理
            setTimeout(() => {
                if (!this.serverReady) {
                    reject(new Error('Server启动超时'));
                }
            }, 10000);
        });
    }

    async waitForServer() {
        console.log(chalk.yellow('2. 等待Server完全就绪...'));

        // 等待额外时间确保Server完全启动
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(chalk.green('✅ Server就绪\n'));
    }

    async startClient() {
        console.log(chalk.yellow('3. 启动Client...'));

        return new Promise((resolve, reject) => {
            this.clientProcess = spawn('node', ['src/cli/index.js'], {
                stdio: 'inherit',
                cwd: process.cwd()
            });

            this.clientProcess.on('error', (error) => {
                console.error(chalk.red('Client启动失败:'), error);
                reject(error);
            });

            this.clientProcess.on('exit', (code) => {
                console.log(chalk.gray(`Client进程退出，代码: ${code}`));
                resolve();
            });

            // 给Client一些时间启动
            setTimeout(resolve, 1000);
        });
    }

    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            console.log(chalk.yellow(`\n🛑 收到${signal}信号，正在优雅关闭...`));
            await this.cleanup();
            process.exit(0);
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGQUIT', () => shutdown('SIGQUIT'));

        console.log(chalk.green('\n✅ 测试环境启动完成!'));
        console.log(chalk.cyan('📡 Server运行在: http://localhost:8081'));
        console.log(chalk.cyan('🖥️  Client已连接'));
        console.log(chalk.gray('按 Ctrl+C 停止测试环境\n'));
    }

    async cleanup() {
        console.log(chalk.yellow('🧹 清理进程...'));

        if (this.clientProcess) {
            this.clientProcess.kill('SIGTERM');
            console.log(chalk.gray('  - Client进程已停止'));
        }

        if (this.serverProcess) {
            this.serverProcess.kill('SIGTERM');
            console.log(chalk.gray('  - Server进程已停止'));
        }

        // 等待进程完全退出
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(chalk.green('✅ 清理完成'));
    }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    const runner = new TestRunner();
    runner.start().catch((error) => {
        console.error(chalk.red('❌ 测试失败:'), error);
        process.exit(1);
    });
}

export default TestRunner;
