#!/usr/bin/env node

/**
 * REPL CLI客户端
 * 连接后进入交互式REPL模式，等待用户输入命令
 */

import chalk from 'chalk';
import { ClientAPI } from '../client/client_api.js';
import readline from 'readline';
import TriggerManager from './trigger_manager.js';

/**
 * REPL CLI客户端类
 */
class REPLCLIClient {
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
        this.rl = null;
        this.commands = new Map();
        this.triggerManager = null;
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
            console.log(chalk.blue('🚀 启动REPL CLI客户端...'));

            // 智能连接到服务器
            await this.smartConnect();

            console.log(chalk.green(`✅ CLI客户端启动成功!`));
            await this.printSystemStatus();

            // 启动REPL
            this.startREPL();

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

        } catch (error) {
            console.error(chalk.red('❌ 获取系统状态失败:'), error.message);
        }
    }

    startREPL() {
        console.log(chalk.cyan('\n🎯 进入REPL模式'));
        console.log(chalk.gray('输入 "help" 查看可用命令，输入 "exit" 退出'));
        console.log(chalk.gray('💡 提示: 按 Tab 键可以自动补全命令和参数\n'));

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.blue('slm> '),
            completer: this.completer.bind(this)
        });

        this.rl.prompt();

        this.rl.on('line', async (line) => {
            const input = line.trim();
            
            if (input) {
                await this.processCommand(input);
            }
            
            this.rl.prompt();
        });

        this.rl.on('close', () => {
            console.log(chalk.yellow('\n👋 再见!'));
            this.cleanup();
        });
    }

    /**
     * 自动补全函数
     */
    completer(line) {
        const parts = line.trim().split(' ');
        const current = parts[parts.length - 1];
        const previous = parts[parts.length - 2];

        // 如果是第一个参数（命令名）
        if (parts.length === 1) {
            const commands = Array.from(this.commands.keys());
            const matches = commands.filter(cmd => cmd.startsWith(current.toLowerCase()));
            return [matches.length ? matches : commands, current];
        }

        // 根据命令提供参数补全
        const command = parts[0].toLowerCase();
        const completions = this.getCommandCompletions(command, previous, current);
        
        return [completions, current];
    }

    /**
     * 获取命令的补全选项
     */
    getCommandCompletions(command, previous, current) {
        const completions = [];

        switch (command) {
            case 'create':
            case 'read':
            case 'update':
            case 'delete':
            case 'exists':
            case 'info':
                if (previous === command) {
                    // 文件路径补全
                    completions.push('test.txt', 'data.json', 'config.yaml', 'README.md');
                } else if (previous && previous !== command) {
                    // 文件系统名称补全
                    completions.push('local', 'git', 'memory');
                }
                break;

            case 'list':
                if (previous === 'list') {
                    completions.push('local', 'git', 'memory');
                }
                break;

            case 'stats':
                if (previous === 'stats') {
                    completions.push('local', 'git', 'memory');
                }
                break;

            case 'container':
                if (previous === 'container') {
                    completions.push('list', 'start', 'stop', 'remove');
                } else if (previous === 'start' || previous === 'stop' || previous === 'remove') {
                    completions.push('container-1', 'container-2', 'container-3');
                }
                break;

            case 'script':
                if (previous === 'script') {
                    completions.push('list', 'execute');
                } else if (previous === 'execute') {
                    completions.push('hello.sh', 'backup.sh', 'deploy.sh');
                }
                break;

            case 'trigger':
                // trigger 命令会进入子模式，这里不需要补全
                break;

            default:
                // 通用命令补全
                const commands = Array.from(this.commands.keys());
                completions.push(...commands.filter(cmd => cmd.startsWith(current.toLowerCase())));
        }

        return completions.filter(comp => comp.startsWith(current));
    }

    async processCommand(input) {
        const parts = input.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        try {
            if (this.commands.has(command)) {
                await this.commands.get(command)(args);
            } else {
                console.log(chalk.red(`❌ 未知命令: ${command}`));
                console.log(chalk.gray('输入 "help" 查看可用命令'));
            }
        } catch (error) {
            console.error(chalk.red(`❌ 命令执行失败: ${error.message}`));
        }
    }

    // ========== 文件操作命令 ==========

    async createFile(args) {
        if (args.length < 2) {
            console.log(chalk.red('❌ 用法: create <path> <data> [fsName]'));
            return;
        }

        const [path, data, fsName = 'local'] = args;
        const result = await this.clientAPI.createFile(path, data, fsName);
        console.log(chalk.green(`✅ 文件创建${result ? '成功' : '失败'}: ${path}`));
    }

    async readFile(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: read <path> [fsName]'));
            return;
        }

        const [path, fsName = 'local'] = args;
        const content = await this.clientAPI.readFile(path, fsName);

        if (content !== null) {
            console.log(chalk.green(`✅ 文件内容 (${path}):`));
            console.log(chalk.gray(content));
        } else {
            console.log(chalk.red(`❌ 文件不存在: ${path}`));
        }
    }

    async updateFile(args) {
        if (args.length < 2) {
            console.log(chalk.red('❌ 用法: update <path> <data> [fsName]'));
            return;
        }

        const [path, data, fsName = 'local'] = args;
        const result = await this.clientAPI.updateFile(path, data, fsName);
        console.log(chalk.green(`✅ 文件更新${result ? '成功' : '失败'}: ${path}`));
    }

    async deleteFile(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: delete <path> [fsName]'));
            return;
        }

        const [path, fsName = 'local'] = args;
        const result = await this.clientAPI.deleteFile(path, fsName);
        console.log(chalk.green(`✅ 文件删除${result ? '成功' : '失败'}: ${path}`));
    }

    async fileExists(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: exists <path> [fsName]'));
            return;
        }

        const [path, fsName = 'local'] = args;
        const exists = await this.clientAPI.fileExists(path, fsName);
        console.log(chalk.green(`📁 文件 ${exists ? '存在' : '不存在'}: ${path}`));
    }

    async listFiles(args) {
        const [fsName = 'local'] = args;
        const files = await this.clientAPI.listFiles(fsName);

        console.log(chalk.green(`📁 文件列表 (${fsName}):`));
        if (files.length > 0) {
            files.forEach(file => {
                console.log(chalk.gray(`  - ${file}`));
            });
        } else {
            console.log(chalk.gray('  (空)'));
        }
    }

    async getFileInfo(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: info <path> [fsName]'));
            return;
        }

        const [path, fsName = 'local'] = args;
        const info = await this.clientAPI.getFileInfo(path, fsName);

        if (info) {
            console.log(chalk.green(`📄 文件信息 (${path}):`));
            console.log(chalk.gray(`  大小: ${info.size} 字节`));
            console.log(chalk.gray(`  创建时间: ${info.created}`));
            console.log(chalk.gray(`  修改时间: ${info.modified}`));
        } else {
            console.log(chalk.red(`❌ 文件不存在: ${path}`));
        }
    }

    async getFSStats(args) {
        const [fsName = 'local'] = args;
        const stats = await this.clientAPI.getFSStats(fsName);

        console.log(chalk.green(`📊 文件系统统计 (${fsName}):`));
        console.log(chalk.gray(`  文件数量: ${stats.fileCount}`));
        console.log(chalk.gray(`  总大小: ${stats.totalSize} 字节`));
        console.log(chalk.gray(`  平均大小: ${stats.averageSize.toFixed(2)} 字节`));
    }

    // ========== 容器操作命令 ==========

    async containerCommand(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: container <list|create|start|stop|remove> [options]'));
            return;
        }

        const [action, ...options] = args;

        switch (action) {
            case 'list':
                const containers = await this.clientAPI.listContainers();
                console.log(chalk.green('🐳 容器列表:'));
                if (containers.length > 0) {
                    containers.forEach(container => {
                        console.log(chalk.gray(`  - ${container.id}: ${container.status}`));
                    });
                } else {
                    console.log(chalk.gray('  (无容器)'));
                }
                break;

            case 'create':
                console.log(chalk.yellow('⚠️ 容器创建功能需要配置参数'));
                break;

            case 'start':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: container start <containerId>'));
                    return;
                }
                const startResult = await this.clientAPI.startContainer(options[0]);
                console.log(chalk.green(`✅ 容器启动${startResult ? '成功' : '失败'}: ${options[0]}`));
                break;

            case 'stop':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: container stop <containerId>'));
                    return;
                }
                const stopResult = await this.clientAPI.stopContainer(options[0]);
                console.log(chalk.green(`✅ 容器停止${stopResult ? '成功' : '失败'}: ${options[0]}`));
                break;

            default:
                console.log(chalk.red(`❌ 未知容器操作: ${action}`));
        }
    }

    // ========== 脚本操作命令 ==========

    async scriptCommand(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: script <list|execute> [options]'));
            return;
        }

        const [action, ...options] = args;

        switch (action) {
            case 'list':
                const scripts = await this.clientAPI.listScripts();
                console.log(chalk.green('📜 脚本列表:'));
                if (scripts.length > 0) {
                    scripts.forEach(script => {
                        console.log(chalk.gray(`  - ${script.name}: ${script.status}`));
                    });
                } else {
                    console.log(chalk.gray('  (无脚本)'));
                }
                break;

            case 'execute':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: script execute <scriptPath> [args]'));
                    return;
                }
                const [scriptPath, ...scriptArgs] = options;
                const result = await this.clientAPI.executeScript(scriptPath, scriptArgs);
                console.log(chalk.green(`✅ 脚本执行完成: ${scriptPath}`));
                console.log(chalk.gray(`结果: ${JSON.stringify(result)}`));
                break;

            default:
                console.log(chalk.red(`❌ 未知脚本操作: ${action}`));
        }
    }

    // ========== 系统状态命令 ==========

    async getSystemStatus() {
        const status = await this.clientAPI.getSystemStatus();
        console.log(chalk.green('📊 系统状态:'));
        console.log(chalk.gray(`  初始化状态: ${status.initialized ? '✅ 已初始化' : '❌ 未初始化'}`));
        console.log(chalk.gray(`  文件服务数量: ${status.fsServices.length}`));
        console.log(chalk.gray(`  核心组件数量: ${status.components.length}`));
    }

    async getServerInfo() {
        const info = await this.clientAPI.getServerInfo();
        console.log(chalk.green('🌐 服务器信息:'));
        console.log(chalk.gray(`  服务器状态: ${info.status.initialized ? '✅ 已初始化' : '❌ 未初始化'}`));
        console.log(chalk.gray(`  文件系统: ${info.fileSystems.map(fs => fs.name).join(', ')}`));
        console.log(chalk.gray(`  核心组件: ${info.components.join(', ')}`));
        console.log(chalk.gray(`  连接地址: ${info.client.config.host}:${info.client.config.port}`));
    }

    // ========== 触发器管理命令 ==========

    async triggerCommand(args) {
        if (!this.triggerManager) {
            this.triggerManager = new TriggerManager(this.clientAPI);
        }

        console.log(chalk.blue('🎯 进入Trigger管理交互模式'));
        console.log(chalk.gray('输入 "help" 查看可用命令，输入 "exit" 退出\n'));

        // 创建新的readline接口用于trigger管理
        const triggerRL = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.blue('trigger> ')
        });

        // 临时替换当前的readline接口
        const originalRL = this.rl;
        this.rl = triggerRL;

        triggerRL.prompt();

        triggerRL.on('line', async (line) => {
            const input = line.trim();

            if (input) {
                if (input === 'exit' || input === 'quit') {
                    console.log(chalk.yellow('👋 退出Trigger管理'));
                    triggerRL.close();
                    this.rl = originalRL;
                    this.rl.prompt();
                    return;
                }

                await this.triggerManager.processCommand(input);
            }

            triggerRL.prompt();
        });

        triggerRL.on('close', () => {
            this.rl = originalRL;
            this.rl.prompt();
        });
    }

    // ========== 帮助和工具命令 ==========

    showHelp() {
        console.log(chalk.cyan('\n📖 可用命令:'));
        console.log(chalk.yellow('\n📁 文件操作:'));
        console.log(chalk.gray('  create <path> <data> [fsName]  - 创建文件'));
        console.log(chalk.gray('  read <path> [fsName]          - 读取文件'));
        console.log(chalk.gray('  update <path> <data> [fsName] - 更新文件'));
        console.log(chalk.gray('  delete <path> [fsName]        - 删除文件'));
        console.log(chalk.gray('  exists <path> [fsName]        - 检查文件存在'));
        console.log(chalk.gray('  list [fsName]                 - 列出文件'));
        console.log(chalk.gray('  info <path> [fsName]          - 获取文件信息'));
        console.log(chalk.gray('  stats [fsName]                - 获取文件系统统计'));

        console.log(chalk.yellow('\n🐳 容器操作:'));
        console.log(chalk.gray('  container list                - 列出容器'));
        console.log(chalk.gray('  container start <id>          - 启动容器'));
        console.log(chalk.gray('  container stop <id>           - 停止容器'));

        console.log(chalk.yellow('\n📜 脚本操作:'));
        console.log(chalk.gray('  script list                   - 列出脚本'));
        console.log(chalk.gray('  script execute <path> [args]  - 执行脚本'));

        console.log(chalk.yellow('\n📊 系统状态:'));
        console.log(chalk.gray('  status                        - 获取系统状态'));
        console.log(chalk.gray('  info                          - 获取服务器信息'));

        console.log(chalk.yellow('\n🎯 触发器管理:'));
        console.log(chalk.gray('  trigger                       - 进入触发器管理交互模式'));

        console.log(chalk.yellow('\n🛠️ 工具命令:'));
        console.log(chalk.gray('  help                          - 显示帮助'));
        console.log(chalk.gray('  clear                         - 清屏'));
        console.log(chalk.gray('  exit/quit                     - 退出'));
        console.log(chalk.gray('\n💡 提示: 所有文件操作默认使用 "local" 文件系统'));
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
        if (this.rl) {
            this.rl.close();
        }
        if (this.connected) {
            this.clientAPI.disconnect();
        }
    }
}

async function main() {
    const client = new REPLCLIClient();

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

export default REPLCLIClient;
