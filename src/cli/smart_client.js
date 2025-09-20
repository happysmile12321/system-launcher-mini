#!/usr/bin/env node

/**
 * 智能CLI客户端
 * 自动等待服务器启动，提供更好的用户体验
 */

import chalk from 'chalk';
import { ClientAPI } from '../client/client_api.js';

/**
 * 智能CLI客户端类
 */
class SmartCLIClient {
    constructor(config = {}) {
        this.config = {
            serverHost: config.serverHost || 'localhost',
            serverPort: config.serverPort || 8081,
            maxRetries: config.maxRetries || 10,
            retryDelay: config.retryDelay || 2000,
            ...config
        };
        this.clientAPI = new ClientAPI({
            host: this.config.serverHost,
            port: this.config.serverPort
        });
        this.connected = false;
    }

    async start() {
        try {
            console.log(chalk.blue('🚀 启动智能CLI客户端...'));

            // 智能连接到服务器
            await this.smartConnect();

            console.log(chalk.green(`✅ CLI客户端启动成功!`));
            await this.printSystemStatus();

        } catch (error) {
            console.error(chalk.red('❌ 启动失败:'), error.message);
            process.exit(1);
        }
    }

    async smartConnect() {
        console.log(chalk.yellow('🔄 智能连接到RPC服务器...'));

        for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
            try {
                console.log(chalk.gray(`  尝试连接 (${attempt}/${this.config.maxRetries})...`));

                await this.clientAPI.connect();
                this.connected = true;

                console.log(chalk.green('✅ 连接到RPC服务器成功'));
                return;

            } catch (error) {
                console.log(chalk.gray(`  ❌ 连接失败: ${error.message}`));

                if (attempt < this.config.maxRetries) {
                    console.log(chalk.gray(`  ⏳ 等待 ${this.config.retryDelay}ms 后重试...`));
                    await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
                } else {
                    throw new Error(`连接失败，已尝试 ${this.config.maxRetries} 次`);
                }
            }
        }
    }

    async printSystemStatus() {
        try {
            const serverInfo = await this.clientAPI.getServerInfo();

            console.log(chalk.cyan('\n📊 系统状态:'));
            console.log(chalk.gray(`- 连接状态: ${this.connected ? '✅ 已连接' : '❌ 未连接'}`));
            console.log(chalk.gray(`- 服务器状态: ${serverInfo.status.initialized ? '✅ 已初始化' : '❌ 未初始化'}`));
            console.log(chalk.gray(`- 文件服务数量: ${serverInfo.fileSystems.length}`));
            console.log(chalk.gray(`- 核心组件数量: ${serverInfo.components.length}`));

            console.log(chalk.cyan('\n🗂️ 可用文件服务:'));
            serverInfo.fileSystems.forEach(fs => {
                console.log(chalk.gray(`  - ${fs.name} (${fs.type})`));
            });

            console.log(chalk.cyan('\n🔧 可用核心组件:'));
            serverInfo.components.forEach(component => {
                console.log(chalk.gray(`  - ${component}`));
            });

            console.log(chalk.cyan('\n🌐 连接信息:'));
            console.log(chalk.gray(`  - 服务器地址: ${serverInfo.client.config.host}:${serverInfo.client.config.port}`));
            console.log(chalk.gray(`  - 连接状态: ${serverInfo.client.connected ? '✅ 已连接' : '❌ 未连接'}`));

            // 显示使用提示
            this.showUsageTips();

        } catch (error) {
            console.error(chalk.red('❌ 获取系统状态失败:'), error.message);
        }
    }

    showUsageTips() {
        console.log(chalk.cyan('\n💡 使用提示:'));
        console.log(chalk.gray('  - 按 Ctrl+C 退出客户端'));
        console.log(chalk.gray('  - 服务器会自动处理所有RPC请求'));
        console.log(chalk.gray('  - 支持文件操作、容器管理、脚本执行等功能'));
        console.log(chalk.gray('  - 查看 README.md 了解更多使用方法'));
    }

    async stop() {
        console.log(chalk.yellow('🛑 停止CLI客户端...'));

        if (this.connected) {
            this.clientAPI.disconnect();
            this.connected = false;
        }

        console.log(chalk.green('✅ CLI客户端停止完成'));
    }

    // ========== 文件服务便捷方法 ==========

    async createFile(path, data, fsName = 'local') {
        return await this.clientAPI.createFile(path, data, fsName);
    }

    async readFile(path, fsName = 'local') {
        return await this.clientAPI.readFile(path, fsName);
    }

    async updateFile(path, data, fsName = 'local') {
        return await this.clientAPI.updateFile(path, data, fsName);
    }

    async deleteFile(path, fsName = 'local') {
        return await this.clientAPI.deleteFile(path, fsName);
    }

    async fileExists(path, fsName = 'local') {
        return await this.clientAPI.fileExists(path, fsName);
    }

    async listFiles(fsName = 'local') {
        return await this.clientAPI.listFiles(fsName);
    }

    // ========== 系统状态便捷方法 ==========

    async getSystemStatus() {
        return await this.clientAPI.getSystemStatus();
    }

    async getServerInfo() {
        return await this.clientAPI.getServerInfo();
    }
}

async function main() {
    const client = new SmartCLIClient();

    // 设置优雅关闭
    process.on('SIGINT', async () => {
        await client.stop();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await client.stop();
        process.exit(0);
    });

    await client.start();
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error(chalk.red('❌ 启动失败:'), error);
        process.exit(1);
    });
}

export default SmartCLIClient;
