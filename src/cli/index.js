#!/usr/bin/env node

import chalk from 'chalk';
import { Core, defaultConfig } from '../core/index.js';

/**
 * 简化的CLI服务器
 * 使用新的约定式规则，通过全局Core对象访问所有服务
 */
class CLIServer {
    constructor() {
        this.core = Core;
        this.initialized = false;
    }

    async start() {
        try {
            console.log(chalk.blue('🚀 启动服务器...'));

            // 使用全局Core初始化所有服务
            await this.initializeCore();

            console.log(chalk.green(`✅ 服务器启动成功!`));
            this.printSystemStatus();

        } catch (error) {
            console.error(chalk.red('❌ 启动失败:'), error);
            process.exit(1);
        }
    }

    async initializeCore() {
        console.log(chalk.yellow('🔄 初始化全局Core...'));

        // 自定义文件服务配置
        const fsConfigs = {
            local: {
                basePath: './data',
                encoding: 'utf8',
                autoCreateDir: true
            },
            git: {
                basePath: './data',
                gitRepo: './data',
                autoCommit: true,
                commitMessage: 'Auto commit by CLI server'
            },
            memory: {
                basePath: './temp'
            }
        };

        // 初始化全局Core
        await this.core.initialize(fsConfigs);
        this.initialized = true;

        console.log(chalk.green('✅ 全局Core初始化完成'));
    }

    printSystemStatus() {
        const status = this.core.getStatus();

        console.log(chalk.cyan('\n📊 系统状态:'));
        console.log(chalk.gray(`- 初始化状态: ${status.initialized ? '✅ 已初始化' : '❌ 未初始化'}`));
        console.log(chalk.gray(`- 文件服务数量: ${status.fsServices.length}`));
        console.log(chalk.gray(`- 核心组件数量: ${status.components.length}`));

        console.log(chalk.cyan('\n🗂️ 可用文件服务:'));
        status.fsServices.forEach(fs => {
            console.log(chalk.gray(`  - ${fs.name} (${fs.type})`));
        });

        console.log(chalk.cyan('\n🔧 可用核心组件:'));
        status.components.forEach(component => {
            console.log(chalk.gray(`  - ${component}`));
        });
    }

    async stop() {
        console.log(chalk.yellow('🛑 停止服务器...'));

        if (this.initialized) {
            await this.core.destroy();
            this.initialized = false;
        }

        console.log(chalk.green('✅ 服务器停止完成'));
    }

    // 便捷访问方法
    getFS(name) {
        return this.core.getFS(name);
    }

    getComponent(name) {
        return this.core.getComponent(name);
    }

    // 组件便捷访问
    get container() { return this.core.container; }
    get persistence() { return this.core.persistence; }
    get script() { return this.core.script; }
    get trigger() { return this.core.trigger; }
    get workflow() { return this.core.workflow; }
    get cli() { return this.core.cli; }

    // 文件服务便捷访问
    get localFS() { return this.core.localFS; }
    get gitFS() { return this.core.gitFS; }
    get memoryFS() { return this.core.memoryFS; }
}

async function main() {
    const server = new CLIServer();

    process.on('SIGINT', async () => {
        await server.stop();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await server.stop();
        process.exit(0);
    });

    await server.start();
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error(chalk.red('❌ 启动失败:'), error);
        process.exit(1);
    });
}

export default CLIServer;
