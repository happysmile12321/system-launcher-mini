#!/usr/bin/env node

/**
 * Trigger演示
 * 展示trigger管理功能
 */

import chalk from 'chalk';
import { ClientAPI } from '../src/client/client_api.js';

async function demonstrateTrigger() {
    console.log(chalk.blue('🚀 Trigger功能演示\n'));

    let client = null;

    try {
        // 1. 连接到服务器
        console.log(chalk.yellow('1. 连接到RPC服务器...'));
        client = new ClientAPI({
            host: 'localhost',
            port: 8081
        });

        await client.connect();
        console.log(chalk.green('✅ 连接成功\n'));

        // 2. 演示事件触发器
        console.log(chalk.yellow('2. 演示事件触发器...'));

        // 创建事件监听器
        console.log(chalk.gray('创建事件监听器: user.login'));
        const createEventResult = await client.rpcClient.call('trigger_api.event.createEvent', {
            eventName: 'user.login',
            workflowId: 'workflow-001',
            config: { priority: 'high' }
        });
        console.log(chalk.green(`✅ 事件监听器创建成功:`));
        console.log(chalk.gray(JSON.stringify(createEventResult, null, 2)));

        // 获取事件监听器
        console.log(chalk.gray('获取事件监听器信息'));
        const getEventResult = await client.rpcClient.call('trigger_api.event.getEvent', {
            eventId: createEventResult.id
        });
        console.log(chalk.green(`✅ 事件监听器信息:`));
        console.log(chalk.gray(JSON.stringify(getEventResult, null, 2)));

        // 触发事件
        console.log(chalk.gray('触发事件: user.login'));
        const triggerEventResult = await client.rpcClient.call('trigger_api.event.triggerEvent', {
            eventName: 'user.login',
            data: { userId: '123', timestamp: new Date().toISOString() }
        });
        console.log(chalk.green(`✅ 事件触发成功:`));
        console.log(chalk.gray(JSON.stringify(triggerEventResult, null, 2)));

        console.log(chalk.green('\n✅ 事件触发器演示完成\n'));

        // 3. 演示手动触发器
        console.log(chalk.yellow('3. 演示手动触发器...'));

        // 创建手动触发器
        console.log(chalk.gray('创建手动触发器'));
        const createManualResult = await client.rpcClient.call('trigger_api.manual.createManualTrigger', {
            workflowId: 'workflow-002',
            config: { description: 'Manual backup trigger' }
        });
        console.log(chalk.green(`✅ 手动触发器创建成功:`));
        console.log(chalk.gray(JSON.stringify(createManualResult, null, 2)));

        // 手动触发工作流
        console.log(chalk.gray('手动触发工作流'));
        const triggerWorkflowResult = await client.rpcClient.call('trigger_api.manual.triggerWorkflow', {
            workflowId: 'workflow-002',
            data: { triggerType: 'manual', source: 'demo' }
        });
        console.log(chalk.green(`✅ 工作流手动触发成功:`));
        console.log(chalk.gray(JSON.stringify(triggerWorkflowResult, null, 2)));

        console.log(chalk.green('\n✅ 手动触发器演示完成\n'));

        // 4. 演示定时任务
        console.log(chalk.yellow('4. 演示定时任务...'));

        // 验证Cron表达式
        console.log(chalk.gray('验证Cron表达式: "0 0 * * *"'));
        const validateCronResult = await client.rpcClient.call('trigger_api.schedule.validateCronExpression', {
            cronExpression: '0 0 * * *'
        });
        console.log(chalk.green(`✅ Cron表达式验证结果:`));
        console.log(chalk.gray(JSON.stringify(validateCronResult, null, 2)));

        // 创建定时任务
        console.log(chalk.gray('创建定时任务: 每天午夜执行'));
        const createScheduleResult = await client.rpcClient.call('trigger_api.schedule.createSchedule', {
            cronExpression: '0 0 * * *',
            workflowId: 'workflow-003',
            config: { description: 'Daily backup task' }
        });
        console.log(chalk.green(`✅ 定时任务创建成功:`));
        console.log(chalk.gray(JSON.stringify(createScheduleResult, null, 2)));

        console.log(chalk.green('\n✅ 定时任务演示完成\n'));

        // 5. 演示Webhook
        console.log(chalk.yellow('5. 演示Webhook...'));

        // 创建Webhook
        console.log(chalk.gray('创建Webhook'));
        const createWebhookResult = await client.rpcClient.call('trigger_api.webhook.createWebhook', {
            workflowId: 'workflow-004',
            config: {
                description: 'GitHub webhook',
                secret: 'webhook-secret-123'
            }
        });
        console.log(chalk.green(`✅ Webhook创建成功:`));
        console.log(chalk.gray(JSON.stringify(createWebhookResult, null, 2)));

        // 调用Webhook
        console.log(chalk.gray('调用Webhook'));
        const callWebhookResult = await client.rpcClient.call('trigger_api.webhook.handleWebhookCall', {
            workflowId: 'workflow-004',
            payload: {
                event: 'push',
                repository: 'my-repo',
                commits: [{ message: 'Update README' }]
            }
        });
        console.log(chalk.green(`✅ Webhook调用成功:`));
        console.log(chalk.gray(JSON.stringify(callWebhookResult, null, 2)));

        console.log(chalk.green('\n✅ Webhook演示完成\n'));

        // 6. 演示事件管理
        console.log(chalk.yellow('6. 演示事件管理...'));

        // 获取事件统计
        console.log(chalk.gray('获取事件统计信息'));
        const eventStatsResult = await client.rpcClient.call('trigger_api.events.getEventStats', {});
        console.log(chalk.green(`✅ 事件统计信息:`));
        console.log(chalk.gray(JSON.stringify(eventStatsResult, null, 2)));

        // 批量创建事件
        console.log(chalk.gray('批量创建事件'));
        const batchCreateResult = await client.rpcClient.call('trigger_api.events.batchCreateEvents', {
            events: [
                { eventName: 'user.logout', workflowId: 'workflow-005' },
                { eventName: 'user.register', workflowId: 'workflow-006' }
            ]
        });
        console.log(chalk.green(`✅ 批量创建事件成功:`));
        console.log(chalk.gray(JSON.stringify(batchCreateResult, null, 2)));

        console.log(chalk.green('\n✅ 事件管理演示完成\n'));

        // 7. 清理演示数据
        console.log(chalk.yellow('7. 清理演示数据...'));

        // 删除事件监听器
        console.log(chalk.gray('删除事件监听器'));
        const deleteEventResult = await client.rpcClient.call('trigger_api.event.deleteEvent', {
            eventId: createEventResult.id
        });
        console.log(chalk.green(`✅ 事件监听器删除成功:`));
        console.log(chalk.gray(JSON.stringify(deleteEventResult, null, 2)));

        // 删除手动触发器
        console.log(chalk.gray('删除手动触发器'));
        const deleteManualResult = await client.rpcClient.call('trigger_api.manual.deleteManualTrigger', {
            triggerId: createManualResult.id
        });
        console.log(chalk.green(`✅ 手动触发器删除成功:`));
        console.log(chalk.gray(JSON.stringify(deleteManualResult, null, 2)));

        // 删除定时任务
        console.log(chalk.gray('删除定时任务'));
        const deleteScheduleResult = await client.rpcClient.call('trigger_api.schedule.deleteSchedule', {
            scheduleId: createScheduleResult.id
        });
        console.log(chalk.green(`✅ 定时任务删除成功:`));
        console.log(chalk.gray(JSON.stringify(deleteScheduleResult, null, 2)));

        // 删除Webhook
        console.log(chalk.gray('删除Webhook'));
        const deleteWebhookResult = await client.rpcClient.call('trigger_api.webhook.deleteWebhook', {
            webhookId: createWebhookResult.id
        });
        console.log(chalk.green(`✅ Webhook删除成功:`));
        console.log(chalk.gray(JSON.stringify(deleteWebhookResult, null, 2)));

        console.log(chalk.green('\n✅ Trigger功能演示完成!'));

    } catch (error) {
        console.error(chalk.red('❌ 演示过程中出现错误:'), error);
    } finally {
        // 清理资源
        if (client) {
            client.disconnect();
            console.log(chalk.gray('\n🔌 客户端断开连接'));
        }
    }
}

// 运行演示
if (import.meta.url === `file://${process.argv[1]}`) {
    demonstrateTrigger().catch((error) => {
        console.error(chalk.red('❌ 演示失败:'), error);
        process.exit(1);
    });
}

export default demonstrateTrigger;
