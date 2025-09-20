#!/usr/bin/env node

/**
 * 使用示例：展示新的约定式规则
 * 演示如何通过全局Core对象访问文件服务和核心组件
 */

import chalk from 'chalk';
import { Core } from '../src/core/index.js';

async function demonstrateUsage() {
    console.log(chalk.blue('🚀 演示新的约定式规则使用方式\n'));

    try {
        // 1. 初始化全局Core
        console.log(chalk.yellow('1. 初始化全局Core...'));
        await Core.initialize();
        console.log(chalk.green('✅ 全局Core初始化完成\n'));

        // 2. 访问文件服务
        console.log(chalk.yellow('2. 访问文件服务...'));

        // 获取本地文件系统
        const localFS = Core.getFS('local');
        if (localFS) {
            console.log(chalk.gray('  - 使用本地文件系统创建测试文件'));
            localFS.create('./test.txt', 'Hello, World!');
            const content = localFS.read('./test.txt');
            console.log(chalk.gray(`  - 读取内容: ${content}`));
        }

        // 获取Git文件系统
        const gitFS = Core.getFS('git');
        if (gitFS) {
            console.log(chalk.gray('  - Git文件系统已就绪'));
        }

        // 获取内存文件系统
        const memoryFS = Core.getFS('memory');
        if (memoryFS) {
            console.log(chalk.gray('  - 使用内存文件系统创建临时文件'));
            memoryFS.create('/temp/test.json', JSON.stringify({ message: '临时数据' }));
            const tempContent = memoryFS.read('/temp/test.json');
            console.log(chalk.gray(`  - 临时内容: ${tempContent}`));
        }

        console.log(chalk.green('✅ 文件服务访问完成\n'));

        // 3. 访问核心组件
        console.log(chalk.yellow('3. 访问核心组件...'));

        // 通过便捷属性访问
        const container = Core.container;
        const persistence = Core.persistence;
        const script = Core.script;
        const trigger = Core.trigger;
        const workflow = Core.workflow;
        const cli = Core.cli;

        console.log(chalk.gray('  - 容器组件:', container ? '✅ 可用' : '❌ 不可用'));
        console.log(chalk.gray('  - 持久化组件:', persistence ? '✅ 可用' : '❌ 不可用'));
        console.log(chalk.gray('  - 脚本组件:', script ? '✅ 可用' : '❌ 不可用'));
        console.log(chalk.gray('  - 触发器组件:', trigger ? '✅ 可用' : '❌ 不可用'));
        console.log(chalk.gray('  - 工作流组件:', workflow ? '✅ 可用' : '❌ 不可用'));
        console.log(chalk.gray('  - CLI组件:', cli ? '✅ 可用' : '❌ 不可用'));

        console.log(chalk.green('✅ 核心组件访问完成\n'));

        // 4. 获取系统状态
        console.log(chalk.yellow('4. 系统状态信息...'));
        const status = Core.getStatus();

        console.log(chalk.cyan('📊 系统状态:'));
        console.log(chalk.gray(`  - 初始化状态: ${status.initialized ? '✅ 已初始化' : '❌ 未初始化'}`));
        console.log(chalk.gray(`  - 文件服务数量: ${status.fsServices.length}`));
        console.log(chalk.gray(`  - 核心组件数量: ${status.components.length}`));

        console.log(chalk.cyan('\n🗂️ 可用文件服务:'));
        status.fsServices.forEach(fs => {
            console.log(chalk.gray(`  - ${fs.name} (${fs.type})`));
        });

        console.log(chalk.cyan('\n🔧 可用核心组件:'));
        status.components.forEach(component => {
            console.log(chalk.gray(`  - ${component}`));
        });

        // 5. 演示约定式规则的优势
        console.log(chalk.yellow('\n5. 约定式规则的优势...'));
        console.log(chalk.gray('  - ✅ 统一的访问入口：通过Core对象访问所有服务'));
        console.log(chalk.gray('  - ✅ 自动注册：infra下的文件系统自动注册到core'));
        console.log(chalk.gray('  - ✅ 解耦设计：core下的概念只依赖注册的接口，不关心实现细节'));
        console.log(chalk.gray('  - ✅ 便捷访问：提供getter方法快速访问常用服务'));
        console.log(chalk.gray('  - ✅ 全局管理：所有服务和组件由全局Core统一管理'));

        console.log(chalk.green('\n✅ 演示完成！'));

    } catch (error) {
        console.error(chalk.red('❌ 演示过程中出现错误:'), error);
    } finally {
        // 清理资源
        console.log(chalk.yellow('\n🧹 清理资源...'));
        await Core.destroy();
        console.log(chalk.green('✅ 资源清理完成'));
    }
}

// 运行演示
if (import.meta.url === `file://${process.argv[1]}`) {
    demonstrateUsage().catch((error) => {
        console.error(chalk.red('❌ 演示失败:'), error);
        process.exit(1);
    });
}

export default demonstrateUsage;
