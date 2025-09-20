#!/usr/bin/env node

/**
 * 增强版REPL客户端
 * 使用inquirer提供更好的交互体验和自动补全
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { ClientAPI } from '../client/client_api.js';

/**
 * 增强版REPL客户端类
 */
class EnhancedREPLClient {
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
        this.commands = new Map();
        this.initializeCommands();
    }

    /**
     * 初始化命令
     */
    initializeCommands() {
        // 文件操作命令
        this.commands.set('create', this.createFile.bind(this));
        this.commands.set('read', this.readFile.bind(this));
        this.commands.set('update', this.updateFile.bind(this));
        this.commands.set('delete', this.deleteFile.bind(this));
        this.commands.set('exists', this.fileExists.bind(this));
        this.commands.set('list', this.listFiles.bind(this));
        this.commands.set('info', this.getFileInfo.bind(this));
        this.commands.set('stats', this.getFSStats.bind(this));

        // 容器操作命令
        this.commands.set('container', this.containerCommand.bind(this));

        // 脚本操作命令
        this.commands.set('script', this.scriptCommand.bind(this));

        // 系统状态命令
        this.commands.set('status', this.getSystemStatus.bind(this));
        this.commands.set('info', this.getServerInfo.bind(this));

        // 触发器管理命令
        this.commands.set('trigger', this.triggerCommand.bind(this));

        // 帮助命令
        this.commands.set('help', this.showHelp.bind(this));
        this.commands.set('exit', this.exit.bind(this));
        this.commands.set('quit', this.exit.bind(this));
        this.commands.set('clear', this.clear.bind(this));
    }

    async start() {
        try {
            console.log(chalk.blue('🚀 启动增强版REPL客户端...'));

            // 智能连接到服务器
            await this.smartConnect();

            console.log(chalk.green(`✅ CLI客户端启动成功!`));
            await this.printSystemStatus();

            // 启动增强版REPL
            await this.startEnhancedREPL();

        } catch (error) {
            console.error(chalk.red('❌ 启动失败:'), error.message);
            process.exit(1);
        }
    }

    async smartConnect() {
        const spinner = ora('智能连接到RPC服务器...').start();

        for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
            try {
                spinner.text = `尝试连接 (${attempt}/${this.config.maxRetries})...`;

                await this.clientAPI.connect();
                this.connected = true;

                spinner.succeed('连接到RPC服务器成功');
                return;

            } catch (error) {
                spinner.text = `连接失败: ${error.message}`;

                if (attempt < this.config.maxRetries) {
                    spinner.text = `等待 ${this.config.retryDelay}ms 后重试...`;
                    await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
                } else {
                    spinner.fail(`连接失败，已尝试 ${this.config.maxRetries} 次`);
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

        } catch (error) {
            console.error(chalk.red('❌ 获取系统状态失败:'), error.message);
        }
    }

    async startEnhancedREPL() {
        console.log(chalk.cyan('\n🎯 进入增强版REPL模式'));
        console.log(chalk.gray('使用交互式菜单进行操作，或输入命令直接执行\n'));

        while (true) {
            try {
                const { action } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: '请选择操作:',
                        choices: [
                            { name: '📁 文件操作', value: 'file_operations' },
                            { name: '🐳 容器操作', value: 'container_operations' },
                            { name: '📜 脚本操作', value: 'script_operations' },
                            { name: '🎯 触发器管理', value: 'trigger_management' },
                            { name: '📊 系统状态', value: 'system_status' },
                            { name: '❓ 帮助', value: 'help' },
                            { name: '🚪 退出', value: 'exit' }
                        ]
                    }
                ]);

                switch (action) {
                    case 'file_operations':
                        await this.showFileOperations();
                        break;
                    case 'container_operations':
                        await this.showContainerOperations();
                        break;
                    case 'script_operations':
                        await this.showScriptOperations();
                        break;
                    case 'trigger_management':
                        await this.showTriggerManagement();
                        break;
                    case 'system_status':
                        await this.showSystemStatus();
                        break;
                    case 'help':
                        await this.showHelp();
                        break;
                    case 'exit':
                        console.log(chalk.yellow('👋 再见!'));
                        this.cleanup();
                        return;
                }
            } catch (error) {
                if (error.isTtyError) {
                    console.log(chalk.red('❌ 交互式界面不支持，请使用标准REPL客户端'));
                    process.exit(1);
                } else {
                    console.error(chalk.red('❌ 操作失败:'), error.message);
                }
            }
        }
    }

    async showFileOperations() {
        const { operation } = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: '选择文件操作:',
                choices: [
                    { name: '📄 创建文件', value: 'create' },
                    { name: '📖 读取文件', value: 'read' },
                    { name: '✏️ 更新文件', value: 'update' },
                    { name: '🗑️ 删除文件', value: 'delete' },
                    { name: '❓ 检查文件存在', value: 'exists' },
                    { name: '📋 列出文件', value: 'list' },
                    { name: 'ℹ️ 获取文件信息', value: 'info' },
                    { name: '📊 文件系统统计', value: 'stats' },
                    { name: '🔙 返回主菜单', value: 'back' }
                ]
            }
        ]);

        if (operation === 'back') return;

        try {
            await this.commands.get(operation)();
        } catch (error) {
            console.error(chalk.red('❌ 文件操作失败:'), error.message);
        }
    }

    async showContainerOperations() {
        const { operation } = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: '选择容器操作:',
                choices: [
                    { name: '📋 列出容器', value: 'list' },
                    { name: '▶️ 启动容器', value: 'start' },
                    { name: '⏹️ 停止容器', value: 'stop' },
                    { name: '🔙 返回主菜单', value: 'back' }
                ]
            }
        ]);

        if (operation === 'back') return;

        try {
            await this.commands.get('container')([operation]);
        } catch (error) {
            console.error(chalk.red('❌ 容器操作失败:'), error.message);
        }
    }

    async showScriptOperations() {
        const { operation } = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: '选择脚本操作:',
                choices: [
                    { name: '📋 列出脚本', value: 'list' },
                    { name: '▶️ 执行脚本', value: 'execute' },
                    { name: '🔙 返回主菜单', value: 'back' }
                ]
            }
        ]);

        if (operation === 'back') return;

        try {
            await this.commands.get('script')([operation]);
        } catch (error) {
            console.error(chalk.red('❌ 脚本操作失败:'), error.message);
        }
    }

    async showTriggerManagement() {
        const { operation } = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: '选择触发器管理:',
                choices: [
                    { name: '🎯 事件触发器', value: 'event' },
                    { name: '👆 手动触发器', value: 'manual' },
                    { name: '⏰ 定时任务', value: 'schedule' },
                    { name: '🌐 Webhook', value: 'webhook' },
                    { name: '📊 事件管理', value: 'events' },
                    { name: '🔙 返回主菜单', value: 'back' }
                ]
            }
        ]);

        if (operation === 'back') return;

        try {
            await this.commands.get('trigger')([operation]);
        } catch (error) {
            console.error(chalk.red('❌ 触发器管理失败:'), error.message);
        }
    }

    async showSystemStatus() {
        try {
            await this.commands.get('status')();
        } catch (error) {
            console.error(chalk.red('❌ 获取系统状态失败:'), error.message);
        }
    }

    // ========== 文件操作命令 ==========

    async createFile() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'path',
                message: '文件路径:',
                validate: input => input.trim() ? true : '请输入文件路径'
            },
            {
                type: 'input',
                name: 'data',
                message: '文件内容:',
                validate: input => input.trim() ? true : '请输入文件内容'
            },
            {
                type: 'list',
                name: 'fsName',
                message: '文件系统:',
                choices: ['local', 'git', 'memory'],
                default: 'local'
            }
        ]);

        const spinner = ora('创建文件中...').start();
        try {
            const result = await this.clientAPI.createFile(answers.path, answers.data, answers.fsName);
            spinner.succeed(`文件创建${result ? '成功' : '失败'}: ${answers.path}`);
        } catch (error) {
            spinner.fail(`文件创建失败: ${error.message}`);
        }
    }

    async readFile() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'path',
                message: '文件路径:',
                validate: input => input.trim() ? true : '请输入文件路径'
            },
            {
                type: 'list',
                name: 'fsName',
                message: '文件系统:',
                choices: ['local', 'git', 'memory'],
                default: 'local'
            }
        ]);

        const spinner = ora('读取文件中...').start();
        try {
            const content = await this.clientAPI.readFile(answers.path, answers.fsName);
            spinner.succeed(`文件读取${content !== null ? '成功' : '失败'}: ${answers.path}`);
            if (content !== null) {
                console.log(chalk.green(`\n文件内容:`));
                console.log(chalk.gray(content));
            }
        } catch (error) {
            spinner.fail(`文件读取失败: ${error.message}`);
        }
    }

    async updateFile() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'path',
                message: '文件路径:',
                validate: input => input.trim() ? true : '请输入文件路径'
            },
            {
                type: 'input',
                name: 'data',
                message: '新内容:',
                validate: input => input.trim() ? true : '请输入新内容'
            },
            {
                type: 'list',
                name: 'fsName',
                message: '文件系统:',
                choices: ['local', 'git', 'memory'],
                default: 'local'
            }
        ]);

        const spinner = ora('更新文件中...').start();
        try {
            const result = await this.clientAPI.updateFile(answers.path, answers.data, answers.fsName);
            spinner.succeed(`文件更新${result ? '成功' : '失败'}: ${answers.path}`);
        } catch (error) {
            spinner.fail(`文件更新失败: ${error.message}`);
        }
    }

    async deleteFile() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'path',
                message: '文件路径:',
                validate: input => input.trim() ? true : '请输入文件路径'
            },
            {
                type: 'list',
                name: 'fsName',
                message: '文件系统:',
                choices: ['local', 'git', 'memory'],
                default: 'local'
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: '确认删除文件?',
                default: false
            }
        ]);

        if (!answers.confirm) {
            console.log(chalk.yellow('❌ 取消删除'));
            return;
        }

        const spinner = ora('删除文件中...').start();
        try {
            const result = await this.clientAPI.deleteFile(answers.path, answers.fsName);
            spinner.succeed(`文件删除${result ? '成功' : '失败'}: ${answers.path}`);
        } catch (error) {
            spinner.fail(`文件删除失败: ${error.message}`);
        }
    }

    async fileExists() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'path',
                message: '文件路径:',
                validate: input => input.trim() ? true : '请输入文件路径'
            },
            {
                type: 'list',
                name: 'fsName',
                message: '文件系统:',
                choices: ['local', 'git', 'memory'],
                default: 'local'
            }
        ]);

        const spinner = ora('检查文件存在...').start();
        try {
            const exists = await this.clientAPI.fileExists(answers.path, answers.fsName);
            spinner.succeed(`文件 ${exists ? '存在' : '不存在'}: ${answers.path}`);
        } catch (error) {
            spinner.fail(`检查文件存在失败: ${error.message}`);
        }
    }

    async listFiles() {
        const { fsName } = await inquirer.prompt([
            {
                type: 'list',
                name: 'fsName',
                message: '文件系统:',
                choices: ['local', 'git', 'memory'],
                default: 'local'
            }
        ]);

        const spinner = ora('获取文件列表...').start();
        try {
            const files = await this.clientAPI.listFiles(fsName);
            spinner.succeed(`文件列表获取成功 (${fsName})`);

            console.log(chalk.green(`\n📁 文件列表 (${fsName}):`));
            if (files.length > 0) {
                files.forEach(file => {
                    console.log(chalk.gray(`  - ${file}`));
                });
            } else {
                console.log(chalk.gray('  (空)'));
            }
        } catch (error) {
            spinner.fail(`获取文件列表失败: ${error.message}`);
        }
    }

    async getFileInfo() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'path',
                message: '文件路径:',
                validate: input => input.trim() ? true : '请输入文件路径'
            },
            {
                type: 'list',
                name: 'fsName',
                message: '文件系统:',
                choices: ['local', 'git', 'memory'],
                default: 'local'
            }
        ]);

        const spinner = ora('获取文件信息...').start();
        try {
            const info = await this.clientAPI.getFileInfo(answers.path, answers.fsName);
            spinner.succeed(`文件信息获取${info ? '成功' : '失败'}: ${answers.path}`);

            if (info) {
                console.log(chalk.green(`\n📄 文件信息 (${answers.path}):`));
                console.log(chalk.gray(`  大小: ${info.size} 字节`));
                console.log(chalk.gray(`  创建时间: ${info.created}`));
                console.log(chalk.gray(`  修改时间: ${info.modified}`));
            }
        } catch (error) {
            spinner.fail(`获取文件信息失败: ${error.message}`);
        }
    }

    async getFSStats() {
        const { fsName } = await inquirer.prompt([
            {
                type: 'list',
                name: 'fsName',
                message: '文件系统:',
                choices: ['local', 'git', 'memory'],
                default: 'local'
            }
        ]);

        const spinner = ora('获取文件系统统计...').start();
        try {
            const stats = await this.clientAPI.getFSStats(fsName);
            spinner.succeed(`文件系统统计获取成功 (${fsName})`);

            console.log(chalk.green(`\n📊 文件系统统计 (${fsName}):`));
            console.log(chalk.gray(`  文件数量: ${stats.fileCount}`));
            console.log(chalk.gray(`  总大小: ${stats.totalSize} 字节`));
            console.log(chalk.gray(`  平均大小: ${stats.averageSize.toFixed(2)} 字节`));
        } catch (error) {
            spinner.fail(`获取文件系统统计失败: ${error.message}`);
        }
    }

    // ========== 容器操作命令 ==========

    async containerCommand(args) {
        const operation = args[0] || 'list';

        const spinner = ora(`执行容器操作: ${operation}`).start();
        try {
            switch (operation) {
                case 'list':
                    const containers = await this.clientAPI.listContainers();
                    spinner.succeed('容器列表获取成功');
                    console.log(chalk.green('\n🐳 容器列表:'));
                    if (containers.length > 0) {
                        containers.forEach(container => {
                            console.log(chalk.gray(`  - ${container.id}: ${container.status}`));
                        });
                    } else {
                        console.log(chalk.gray('  (无容器)'));
                    }
                    break;

                case 'start':
                case 'stop':
                    const { containerId } = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'containerId',
                            message: '容器ID:',
                            validate: input => input.trim() ? true : '请输入容器ID'
                        }
                    ]);

                    const result = operation === 'start'
                        ? await this.clientAPI.startContainer(containerId)
                        : await this.clientAPI.stopContainer(containerId);

                    spinner.succeed(`容器${operation === 'start' ? '启动' : '停止'}${result ? '成功' : '失败'}: ${containerId}`);
                    break;

                default:
                    spinner.fail(`未知容器操作: ${operation}`);
            }
        } catch (error) {
            spinner.fail(`容器操作失败: ${error.message}`);
        }
    }

    // ========== 脚本操作命令 ==========

    async scriptCommand(args) {
        const operation = args[0] || 'list';

        const spinner = ora(`执行脚本操作: ${operation}`).start();
        try {
            switch (operation) {
                case 'list':
                    const scripts = await this.clientAPI.listScripts();
                    spinner.succeed('脚本列表获取成功');
                    console.log(chalk.green('\n📜 脚本列表:'));
                    if (scripts.length > 0) {
                        scripts.forEach(script => {
                            console.log(chalk.gray(`  - ${script.name}: ${script.status}`));
                        });
                    } else {
                        console.log(chalk.gray('  (无脚本)'));
                    }
                    break;

                case 'execute':
                    const { scriptPath } = await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'scriptPath',
                            message: '脚本路径:',
                            validate: input => input.trim() ? true : '请输入脚本路径'
                        }
                    ]);

                    const result = await this.clientAPI.executeScript(scriptPath, []);
                    spinner.succeed(`脚本执行完成: ${scriptPath}`);
                    console.log(chalk.green('\n📜 执行结果:'));
                    console.log(chalk.gray(JSON.stringify(result, null, 2)));
                    break;

                default:
                    spinner.fail(`未知脚本操作: ${operation}`);
            }
        } catch (error) {
            spinner.fail(`脚本操作失败: ${error.message}`);
        }
    }

    // ========== 触发器管理命令 ==========

    async triggerCommand(args) {
        console.log(chalk.blue('🎯 进入触发器管理'));
        console.log(chalk.yellow('提示: 触发器管理功能正在开发中，请使用标准REPL客户端'));
    }

    // ========== 系统状态命令 ==========

    async getSystemStatus() {
        const spinner = ora('获取系统状态...').start();
        try {
            const status = await this.clientAPI.getSystemStatus();
            spinner.succeed('系统状态获取成功');

            console.log(chalk.green('\n📊 系统状态:'));
            console.log(chalk.gray(`  初始化状态: ${status.initialized ? '✅ 已初始化' : '❌ 未初始化'}`));
            console.log(chalk.gray(`  文件服务数量: ${status.fsServices.length}`));
            console.log(chalk.gray(`  核心组件数量: ${status.components.length}`));
        } catch (error) {
            spinner.fail(`获取系统状态失败: ${error.message}`);
        }
    }

    async getServerInfo() {
        const spinner = ora('获取服务器信息...').start();
        try {
            const info = await this.clientAPI.getServerInfo();
            spinner.succeed('服务器信息获取成功');

            console.log(chalk.green('\n🌐 服务器信息:'));
            console.log(chalk.gray(`  服务器状态: ${info.status.initialized ? '✅ 已初始化' : '❌ 未初始化'}`));
            console.log(chalk.gray(`  文件系统: ${info.fileSystems.map(fs => fs.name).join(', ')}`));
            console.log(chalk.gray(`  核心组件: ${info.components.join(', ')}`));
            console.log(chalk.gray(`  连接地址: ${info.client.config.host}:${info.client.config.port}`));
        } catch (error) {
            spinner.fail(`获取服务器信息失败: ${error.message}`);
        }
    }

    // ========== 帮助和工具命令 ==========

    async showHelp() {
        console.log(chalk.cyan('\n📖 增强版REPL客户端帮助:'));
        console.log(chalk.yellow('\n🎯 主要功能:'));
        console.log(chalk.gray('  - 📁 文件操作: 创建、读取、更新、删除文件'));
        console.log(chalk.gray('  - 🐳 容器操作: 管理容器生命周期'));
        console.log(chalk.gray('  - 📜 脚本操作: 执行和管理脚本'));
        console.log(chalk.gray('  - 🎯 触发器管理: 管理各种触发器'));
        console.log(chalk.gray('  - 📊 系统状态: 查看系统运行状态'));

        console.log(chalk.yellow('\n💡 使用提示:'));
        console.log(chalk.gray('  - 使用交互式菜单进行操作'));
        console.log(chalk.gray('  - 所有操作都有进度指示器'));
        console.log(chalk.gray('  - 支持文件系统选择 (local/git/memory)'));
        console.log(chalk.gray('  - 提供确认对话框防止误操作'));
    }

    clear() {
        console.clear();
    }

    async exit() {
        console.log(chalk.yellow('👋 正在退出...'));
        this.cleanup();
        process.exit(0);
    }

    cleanup() {
        if (this.connected) {
            this.clientAPI.disconnect();
        }
    }
}

async function main() {
    const client = new EnhancedREPLClient();

    // 设置优雅关闭
    process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n🛑 收到中断信号，正在退出...'));
        client.cleanup();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log(chalk.yellow('\n🛑 收到终止信号，正在退出...'));
        client.cleanup();
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

export default EnhancedREPLClient;
