/**
 * Trigger管理器
 * 提供trigger管理交互模式
 */

import chalk from 'chalk';
import readline from 'readline';

/**
 * Trigger管理器类
 */
class TriggerManager {
    constructor(clientAPI) {
        this.clientAPI = clientAPI;
        this.rl = null;
        this.commands = new Map();
        this.initializeCommands();
    }

    /**
     * 初始化命令
     */
    initializeCommands() {
        // 事件相关命令
        this.commands.set('event', this.eventCommand.bind(this));
        this.commands.set('events', this.eventsCommand.bind(this));

        // 手动触发器命令
        this.commands.set('manual', this.manualCommand.bind(this));

        // 定时任务命令
        this.commands.set('schedule', this.scheduleCommand.bind(this));

        // Webhook命令
        this.commands.set('webhook', this.webhookCommand.bind(this));

        // 通用命令
        this.commands.set('list', this.listAll.bind(this));
        this.commands.set('status', this.getStatus.bind(this));
        this.commands.set('help', this.showHelp.bind(this));
        this.commands.set('exit', this.exit.bind(this));
        this.commands.set('quit', this.exit.bind(this));
        this.commands.set('clear', this.clear.bind(this));
    }

    /**
     * 启动Trigger管理器
     */
    async start() {
        console.log(chalk.blue('🎯 进入Trigger管理交互模式'));
        console.log(chalk.gray('输入 "help" 查看可用命令，输入 "exit" 退出'));
        console.log(chalk.gray('💡 提示: 按 Tab 键可以自动补全命令和参数\n'));

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.blue('trigger> '),
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
            console.log(chalk.yellow('\n👋 退出Trigger管理'));
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
        const completions = this.getTriggerCommandCompletions(command, previous, current);
        
        return [completions, current];
    }

    /**
     * 获取Trigger命令的补全选项
     */
    getTriggerCommandCompletions(command, previous, current) {
        const completions = [];

        switch (command) {
            case 'event':
                if (previous === 'event') {
                    completions.push('create', 'delete', 'update', 'get', 'list', 'trigger');
                } else if (previous === 'create' || previous === 'trigger') {
                    completions.push('user.login', 'user.logout', 'user.register', 'system.start', 'system.stop');
                } else if (previous === 'delete' || previous === 'update' || previous === 'get') {
                    completions.push('1703123456789', '1703123456790', '1703123456791');
                }
                break;

            case 'events':
                if (previous === 'events') {
                    completions.push('batch-create', 'batch-delete', 'toggle', 'stats', 'cleanup');
                } else if (previous === 'toggle') {
                    completions.push('1703123456789', '1703123456790');
                } else if (previous && previous !== 'events' && previous !== 'toggle') {
                    completions.push('true', 'false');
                }
                break;

            case 'manual':
                if (previous === 'manual') {
                    completions.push('create', 'delete', 'update', 'get', 'list', 'trigger');
                } else if (previous === 'create' || previous === 'trigger') {
                    completions.push('workflow-001', 'workflow-002', 'workflow-003');
                } else if (previous === 'delete' || previous === 'update' || previous === 'get') {
                    completions.push('1703123456789', '1703123456790', '1703123456791');
                }
                break;

            case 'schedule':
                if (previous === 'schedule') {
                    completions.push('create', 'delete', 'update', 'get', 'list', 'validate');
                } else if (previous === 'create') {
                    completions.push('0 0 * * *', '0 */6 * * *', '*/15 * * * *', '0 2 * * 1');
                } else if (previous === 'validate') {
                    completions.push('0 0 * * *', '0 */6 * * *', '*/15 * * * *');
                } else if (previous === 'delete' || previous === 'update' || previous === 'get') {
                    completions.push('1703123456789', '1703123456790', '1703123456791');
                }
                break;

            case 'webhook':
                if (previous === 'webhook') {
                    completions.push('create', 'delete', 'update', 'get', 'list', 'call');
                } else if (previous === 'create' || previous === 'call') {
                    completions.push('workflow-001', 'workflow-002', 'workflow-003');
                } else if (previous === 'delete' || previous === 'update' || previous === 'get') {
                    completions.push('1703123456789', '1703123456790', '1703123456791');
                }
                break;

            default:
                // 通用命令补全
                const commands = Array.from(this.commands.keys());
                completions.push(...commands.filter(cmd => cmd.startsWith(current.toLowerCase())));
        }

        return completions.filter(comp => comp.startsWith(current));
    }

    /**
     * 处理命令
     */
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

    // ========== 事件相关命令 ==========

    async eventCommand(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: event <create|delete|update|get|list|trigger> [options]'));
            return;
        }

        const [action, ...options] = args;

        switch (action) {
            case 'create':
                if (options.length < 2) {
                    console.log(chalk.red('❌ 用法: event create <eventName> <workflowId> [config]'));
                    return;
                }
                const [eventName, workflowId, config] = options;
                const createResult = await this.clientAPI.rpcClient.call('trigger_api.event.createEvent', {
                    eventName,
                    workflowId,
                    config: config ? JSON.parse(config) : {}
                });
                console.log(chalk.green(`✅ 事件监听器创建成功:`));
                console.log(chalk.gray(JSON.stringify(createResult, null, 2)));
                break;

            case 'delete':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: event delete <eventId>'));
                    return;
                }
                const deleteResult = await this.clientAPI.rpcClient.call('trigger_api.event.deleteEvent', {
                    eventId: options[0]
                });
                console.log(chalk.green(`✅ 事件监听器删除成功:`));
                console.log(chalk.gray(JSON.stringify(deleteResult, null, 2)));
                break;

            case 'update':
                if (options.length < 2) {
                    console.log(chalk.red('❌ 用法: event update <eventId> <updates>'));
                    return;
                }
                const [eventId, updates] = options;
                const updateResult = await this.clientAPI.rpcClient.call('trigger_api.event.updateEvent', {
                    eventId,
                    updates: JSON.parse(updates)
                });
                console.log(chalk.green(`✅ 事件监听器更新成功:`));
                console.log(chalk.gray(JSON.stringify(updateResult, null, 2)));
                break;

            case 'get':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: event get <eventId>'));
                    return;
                }
                const getResult = await this.clientAPI.rpcClient.call('trigger_api.event.getEvent', {
                    eventId: options[0]
                });
                console.log(chalk.green(`✅ 事件监听器信息:`));
                console.log(chalk.gray(JSON.stringify(getResult, null, 2)));
                break;

            case 'list':
                const listResult = await this.clientAPI.rpcClient.call('trigger_api.event.getAllEvents', {});
                console.log(chalk.green(`✅ 所有事件监听器:`));
                console.log(chalk.gray(JSON.stringify(listResult, null, 2)));
                break;

            case 'trigger':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: event trigger <eventName> [data]'));
                    return;
                }
                const [triggerEventName, triggerData] = options;
                const triggerResult = await this.clientAPI.rpcClient.call('trigger_api.event.triggerEvent', {
                    eventName: triggerEventName,
                    data: triggerData ? JSON.parse(triggerData) : {}
                });
                console.log(chalk.green(`✅ 事件触发成功:`));
                console.log(chalk.gray(JSON.stringify(triggerResult, null, 2)));
                break;

            default:
                console.log(chalk.red(`❌ 未知事件操作: ${action}`));
        }
    }

    async eventsCommand(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: events <batch-create|batch-delete|toggle|stats|cleanup> [options]'));
            return;
        }

        const [action, ...options] = args;

        switch (action) {
            case 'batch-create':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: events batch-create <eventsJson>'));
                    return;
                }
                const batchCreateResult = await this.clientAPI.rpcClient.call('trigger_api.events.batchCreateEvents', {
                    events: JSON.parse(options[0])
                });
                console.log(chalk.green(`✅ 批量创建事件成功:`));
                console.log(chalk.gray(JSON.stringify(batchCreateResult, null, 2)));
                break;

            case 'batch-delete':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: events batch-delete <eventIdsJson>'));
                    return;
                }
                const batchDeleteResult = await this.clientAPI.rpcClient.call('trigger_api.events.batchDeleteEvents', {
                    eventIds: JSON.parse(options[0])
                });
                console.log(chalk.green(`✅ 批量删除事件成功:`));
                console.log(chalk.gray(JSON.stringify(batchDeleteResult, null, 2)));
                break;

            case 'toggle':
                if (options.length < 2) {
                    console.log(chalk.red('❌ 用法: events toggle <eventId> <enabled>'));
                    return;
                }
                const [toggleEventId, enabled] = options;
                const toggleResult = await this.clientAPI.rpcClient.call('trigger_api.events.toggleEventStatus', {
                    eventId: toggleEventId,
                    enabled: enabled === 'true'
                });
                console.log(chalk.green(`✅ 事件状态切换成功:`));
                console.log(chalk.gray(JSON.stringify(toggleResult, null, 2)));
                break;

            case 'stats':
                const statsResult = await this.clientAPI.rpcClient.call('trigger_api.events.getEventStats', {});
                console.log(chalk.green(`✅ 事件统计信息:`));
                console.log(chalk.gray(JSON.stringify(statsResult, null, 2)));
                break;

            case 'cleanup':
                const cleanupResult = await this.clientAPI.rpcClient.call('trigger_api.events.cleanupExpiredEvents', {});
                console.log(chalk.green(`✅ 过期事件清理完成:`));
                console.log(chalk.gray(JSON.stringify(cleanupResult, null, 2)));
                break;

            default:
                console.log(chalk.red(`❌ 未知事件管理操作: ${action}`));
        }
    }

    // ========== 手动触发器命令 ==========

    async manualCommand(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: manual <create|delete|update|get|list|trigger> [options]'));
            return;
        }

        const [action, ...options] = args;

        switch (action) {
            case 'create':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: manual create <workflowId> [config]'));
                    return;
                }
                const [workflowId, config] = options;
                const createResult = await this.clientAPI.rpcClient.call('trigger_api.manual.createManualTrigger', {
                    workflowId,
                    config: config ? JSON.parse(config) : {}
                });
                console.log(chalk.green(`✅ 手动触发器创建成功:`));
                console.log(chalk.gray(JSON.stringify(createResult, null, 2)));
                break;

            case 'delete':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: manual delete <triggerId>'));
                    return;
                }
                const deleteResult = await this.clientAPI.rpcClient.call('trigger_api.manual.deleteManualTrigger', {
                    triggerId: options[0]
                });
                console.log(chalk.green(`✅ 手动触发器删除成功:`));
                console.log(chalk.gray(JSON.stringify(deleteResult, null, 2)));
                break;

            case 'update':
                if (options.length < 2) {
                    console.log(chalk.red('❌ 用法: manual update <triggerId> <updates>'));
                    return;
                }
                const [triggerId, updates] = options;
                const updateResult = await this.clientAPI.rpcClient.call('trigger_api.manual.updateManualTrigger', {
                    triggerId,
                    updates: JSON.parse(updates)
                });
                console.log(chalk.green(`✅ 手动触发器更新成功:`));
                console.log(chalk.gray(JSON.stringify(updateResult, null, 2)));
                break;

            case 'get':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: manual get <triggerId>'));
                    return;
                }
                const getResult = await this.clientAPI.rpcClient.call('trigger_api.manual.getManualTrigger', {
                    triggerId: options[0]
                });
                console.log(chalk.green(`✅ 手动触发器信息:`));
                console.log(chalk.gray(JSON.stringify(getResult, null, 2)));
                break;

            case 'list':
                const listResult = await this.clientAPI.rpcClient.call('trigger_api.manual.getAllManualTriggers', {});
                console.log(chalk.green(`✅ 所有手动触发器:`));
                console.log(chalk.gray(JSON.stringify(listResult, null, 2)));
                break;

            case 'trigger':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: manual trigger <workflowId> [data]'));
                    return;
                }
                const [triggerWorkflowId, triggerData] = options;
                const triggerResult = await this.clientAPI.rpcClient.call('trigger_api.manual.triggerWorkflow', {
                    workflowId: triggerWorkflowId,
                    data: triggerData ? JSON.parse(triggerData) : {}
                });
                console.log(chalk.green(`✅ 工作流手动触发成功:`));
                console.log(chalk.gray(JSON.stringify(triggerResult, null, 2)));
                break;

            default:
                console.log(chalk.red(`❌ 未知手动触发器操作: ${action}`));
        }
    }

    // ========== 定时任务命令 ==========

    async scheduleCommand(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: schedule <create|delete|update|get|list|validate> [options]'));
            return;
        }

        const [action, ...options] = args;

        switch (action) {
            case 'create':
                if (options.length < 2) {
                    console.log(chalk.red('❌ 用法: schedule create <cronExpression> <workflowId> [config]'));
                    return;
                }
                const [cronExpression, scheduleWorkflowId, scheduleConfig] = options;
                const createResult = await this.clientAPI.rpcClient.call('trigger_api.schedule.createSchedule', {
                    cronExpression,
                    workflowId: scheduleWorkflowId,
                    config: scheduleConfig ? JSON.parse(scheduleConfig) : {}
                });
                console.log(chalk.green(`✅ 定时任务创建成功:`));
                console.log(chalk.gray(JSON.stringify(createResult, null, 2)));
                break;

            case 'delete':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: schedule delete <scheduleId>'));
                    return;
                }
                const deleteResult = await this.clientAPI.rpcClient.call('trigger_api.schedule.deleteSchedule', {
                    scheduleId: options[0]
                });
                console.log(chalk.green(`✅ 定时任务删除成功:`));
                console.log(chalk.gray(JSON.stringify(deleteResult, null, 2)));
                break;

            case 'update':
                if (options.length < 2) {
                    console.log(chalk.red('❌ 用法: schedule update <scheduleId> <updates>'));
                    return;
                }
                const [scheduleId, scheduleUpdates] = options;
                const updateResult = await this.clientAPI.rpcClient.call('trigger_api.schedule.updateSchedule', {
                    scheduleId,
                    updates: JSON.parse(scheduleUpdates)
                });
                console.log(chalk.green(`✅ 定时任务更新成功:`));
                console.log(chalk.gray(JSON.stringify(updateResult, null, 2)));
                break;

            case 'get':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: schedule get <scheduleId>'));
                    return;
                }
                const getResult = await this.clientAPI.rpcClient.call('trigger_api.schedule.getSchedule', {
                    scheduleId: options[0]
                });
                console.log(chalk.green(`✅ 定时任务信息:`));
                console.log(chalk.gray(JSON.stringify(getResult, null, 2)));
                break;

            case 'list':
                const listResult = await this.clientAPI.rpcClient.call('trigger_api.schedule.getAllSchedules', {});
                console.log(chalk.green(`✅ 所有定时任务:`));
                console.log(chalk.gray(JSON.stringify(listResult, null, 2)));
                break;

            case 'validate':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: schedule validate <cronExpression>'));
                    return;
                }
                const validateResult = await this.clientAPI.rpcClient.call('trigger_api.schedule.validateCronExpression', {
                    cronExpression: options[0]
                });
                console.log(chalk.green(`✅ Cron表达式验证结果:`));
                console.log(chalk.gray(JSON.stringify(validateResult, null, 2)));
                break;

            default:
                console.log(chalk.red(`❌ 未知定时任务操作: ${action}`));
        }
    }

    // ========== Webhook命令 ==========

    async webhookCommand(args) {
        if (args.length < 1) {
            console.log(chalk.red('❌ 用法: webhook <create|delete|update|get|list|call> [options]'));
            return;
        }

        const [action, ...options] = args;

        switch (action) {
            case 'create':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: webhook create <workflowId> [config]'));
                    return;
                }
                const [webhookWorkflowId, webhookConfig] = options;
                const createResult = await this.clientAPI.rpcClient.call('trigger_api.webhook.createWebhook', {
                    workflowId: webhookWorkflowId,
                    config: webhookConfig ? JSON.parse(webhookConfig) : {}
                });
                console.log(chalk.green(`✅ Webhook创建成功:`));
                console.log(chalk.gray(JSON.stringify(createResult, null, 2)));
                break;

            case 'delete':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: webhook delete <webhookId>'));
                    return;
                }
                const deleteResult = await this.clientAPI.rpcClient.call('trigger_api.webhook.deleteWebhook', {
                    webhookId: options[0]
                });
                console.log(chalk.green(`✅ Webhook删除成功:`));
                console.log(chalk.gray(JSON.stringify(deleteResult, null, 2)));
                break;

            case 'update':
                if (options.length < 2) {
                    console.log(chalk.red('❌ 用法: webhook update <webhookId> <updates>'));
                    return;
                }
                const [webhookId, webhookUpdates] = options;
                const updateResult = await this.clientAPI.rpcClient.call('trigger_api.webhook.updateWebhook', {
                    webhookId,
                    updates: JSON.parse(webhookUpdates)
                });
                console.log(chalk.green(`✅ Webhook更新成功:`));
                console.log(chalk.gray(JSON.stringify(updateResult, null, 2)));
                break;

            case 'get':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: webhook get <webhookId>'));
                    return;
                }
                const getResult = await this.clientAPI.rpcClient.call('trigger_api.webhook.getWebhook', {
                    webhookId: options[0]
                });
                console.log(chalk.green(`✅ Webhook信息:`));
                console.log(chalk.gray(JSON.stringify(getResult, null, 2)));
                break;

            case 'list':
                const listResult = await this.clientAPI.rpcClient.call('trigger_api.webhook.getAllWebhooks', {});
                console.log(chalk.green(`✅ 所有Webhook:`));
                console.log(chalk.gray(JSON.stringify(listResult, null, 2)));
                break;

            case 'call':
                if (options.length < 1) {
                    console.log(chalk.red('❌ 用法: webhook call <workflowId> [payload]'));
                    return;
                }
                const [callWorkflowId, payload] = options;
                const callResult = await this.clientAPI.rpcClient.call('trigger_api.webhook.handleWebhookCall', {
                    workflowId: callWorkflowId,
                    payload: payload ? JSON.parse(payload) : {}
                });
                console.log(chalk.green(`✅ Webhook调用成功:`));
                console.log(chalk.gray(JSON.stringify(callResult, null, 2)));
                break;

            default:
                console.log(chalk.red(`❌ 未知Webhook操作: ${action}`));
        }
    }

    // ========== 通用命令 ==========

    async listAll() {
        console.log(chalk.yellow('📋 所有触发器类型:'));
        console.log(chalk.gray('  - event: 事件触发器'));
        console.log(chalk.gray('  - manual: 手动触发器'));
        console.log(chalk.gray('  - schedule: 定时任务触发器'));
        console.log(chalk.gray('  - webhook: Webhook触发器'));
        console.log(chalk.gray('\n使用 "help" 查看详细命令'));
    }

    async getStatus() {
        try {
            const status = await this.clientAPI.getSystemStatus();
            console.log(chalk.green('📊 系统状态:'));
            console.log(chalk.gray(`  初始化状态: ${status.initialized ? '✅ 已初始化' : '❌ 未初始化'}`));
            console.log(chalk.gray(`  触发器组件: ${status.components.includes('trigger') ? '✅ 可用' : '❌ 不可用'}`));
        } catch (error) {
            console.error(chalk.red('❌ 获取状态失败:'), error.message);
        }
    }

    showHelp() {
        console.log(chalk.cyan('\n📖 Trigger管理命令:'));

        console.log(chalk.yellow('\n🎯 事件触发器:'));
        console.log(chalk.gray('  event create <eventName> <workflowId> [config]  - 创建事件监听器'));
        console.log(chalk.gray('  event delete <eventId>                        - 删除事件监听器'));
        console.log(chalk.gray('  event update <eventId> <updates>              - 更新事件监听器'));
        console.log(chalk.gray('  event get <eventId>                           - 获取事件监听器'));
        console.log(chalk.gray('  event list                                    - 列出所有事件监听器'));
        console.log(chalk.gray('  event trigger <eventName> [data]              - 触发事件'));

        console.log(chalk.yellow('\n📊 事件管理:'));
        console.log(chalk.gray('  events batch-create <eventsJson>              - 批量创建事件'));
        console.log(chalk.gray('  events batch-delete <eventIdsJson>            - 批量删除事件'));
        console.log(chalk.gray('  events toggle <eventId> <enabled>             - 切换事件状态'));
        console.log(chalk.gray('  events stats                                  - 获取事件统计'));
        console.log(chalk.gray('  events cleanup                                - 清理过期事件'));

        console.log(chalk.yellow('\n👆 手动触发器:'));
        console.log(chalk.gray('  manual create <workflowId> [config]           - 创建手动触发器'));
        console.log(chalk.gray('  manual delete <triggerId>                     - 删除手动触发器'));
        console.log(chalk.gray('  manual update <triggerId> <updates>           - 更新手动触发器'));
        console.log(chalk.gray('  manual get <triggerId>                        - 获取手动触发器'));
        console.log(chalk.gray('  manual list                                   - 列出所有手动触发器'));
        console.log(chalk.gray('  manual trigger <workflowId> [data]            - 手动触发工作流'));

        console.log(chalk.yellow('\n⏰ 定时任务:'));
        console.log(chalk.gray('  schedule create <cron> <workflowId> [config]  - 创建定时任务'));
        console.log(chalk.gray('  schedule delete <scheduleId>                  - 删除定时任务'));
        console.log(chalk.gray('  schedule update <scheduleId> <updates>        - 更新定时任务'));
        console.log(chalk.gray('  schedule get <scheduleId>                     - 获取定时任务'));
        console.log(chalk.gray('  schedule list                                 - 列出所有定时任务'));
        console.log(chalk.gray('  schedule validate <cronExpression>            - 验证Cron表达式'));

        console.log(chalk.yellow('\n🌐 Webhook:'));
        console.log(chalk.gray('  webhook create <workflowId> [config]          - 创建Webhook'));
        console.log(chalk.gray('  webhook delete <webhookId>                    - 删除Webhook'));
        console.log(chalk.gray('  webhook update <webhookId> <updates>          - 更新Webhook'));
        console.log(chalk.gray('  webhook get <webhookId>                       - 获取Webhook'));
        console.log(chalk.gray('  webhook list                                  - 列出所有Webhook'));
        console.log(chalk.gray('  webhook call <workflowId> [payload]           - 调用Webhook'));

        console.log(chalk.yellow('\n🛠️ 通用命令:'));
        console.log(chalk.gray('  list                                          - 列出所有触发器类型'));
        console.log(chalk.gray('  status                                        - 获取系统状态'));
        console.log(chalk.gray('  help                                          - 显示帮助'));
        console.log(chalk.gray('  clear                                         - 清屏'));
        console.log(chalk.gray('  exit/quit                                     - 退出'));

        console.log(chalk.cyan('\n💡 提示:'));
        console.log(chalk.gray('  - 所有JSON参数需要用引号包围'));
        console.log(chalk.gray('  - 例如: \'{"key": "value"}\''));
        console.log(chalk.gray('  - 布尔值使用 "true" 或 "false"'));
    }

    clear() {
        console.clear();
    }

    async exit() {
        console.log(chalk.yellow('👋 退出Trigger管理...'));
        if (this.rl) {
            this.rl.close();
        }
    }
}

export default TriggerManager;
