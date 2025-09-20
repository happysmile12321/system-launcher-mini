#!/usr/bin/env node

/**
 * REPL演示
 * 展示REPL客户端的基本功能
 */

import chalk from 'chalk';
import { ClientAPI } from '../src/client/client_api.js';

async function demonstrateREPL() {
    console.log(chalk.blue('🚀 REPL功能演示\n'));

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

        // 2. 演示文件操作
        console.log(chalk.yellow('2. 演示文件操作...'));

        // 创建文件
        console.log(chalk.gray('创建文件: test.txt'));
        const createResult = await client.createFile('test.txt', 'Hello from REPL demo!', 'local');
        console.log(chalk.green(`✅ 文件创建${createResult ? '成功' : '失败'}`));

        // 读取文件
        console.log(chalk.gray('读取文件: test.txt'));
        const content = await client.readFile('test.txt', 'local');
        console.log(chalk.green(`✅ 文件内容: ${content}`));

        // 更新文件
        console.log(chalk.gray('更新文件: test.txt'));
        const updateResult = await client.updateFile('test.txt', 'Updated content from REPL demo!', 'local');
        console.log(chalk.green(`✅ 文件更新${updateResult ? '成功' : '失败'}`));

        // 再次读取
        const updatedContent = await client.readFile('test.txt', 'local');
        console.log(chalk.green(`✅ 更新后内容: ${updatedContent}`));

        // 检查文件存在
        console.log(chalk.gray('检查文件存在: test.txt'));
        const exists = await client.fileExists('test.txt', 'local');
        console.log(chalk.green(`✅ 文件${exists ? '存在' : '不存在'}`));

        // 获取文件信息
        console.log(chalk.gray('获取文件信息: test.txt'));
        const fileInfo = await client.getFileInfo('test.txt', 'local');
        if (fileInfo) {
            console.log(chalk.green(`✅ 文件信息:`));
            console.log(chalk.gray(`  大小: ${fileInfo.size} 字节`));
            console.log(chalk.gray(`  创建时间: ${fileInfo.created}`));
            console.log(chalk.gray(`  修改时间: ${fileInfo.modified}`));
        }

        // 列出文件
        console.log(chalk.gray('列出文件'));
        const files = await client.listFiles('local');
        console.log(chalk.green(`✅ 文件列表:`));
        files.forEach(file => {
            console.log(chalk.gray(`  - ${file}`));
        });

        // 获取文件系统统计
        console.log(chalk.gray('获取文件系统统计'));
        const stats = await client.getFSStats('local');
        console.log(chalk.green(`✅ 文件系统统计:`));
        console.log(chalk.gray(`  文件数量: ${stats.fileCount}`));
        console.log(chalk.gray(`  总大小: ${stats.totalSize} 字节`));
        console.log(chalk.gray(`  平均大小: ${stats.averageSize.toFixed(2)} 字节`));

        console.log(chalk.green('\n✅ 文件操作演示完成\n'));

        // 3. 演示内存文件系统
        console.log(chalk.yellow('3. 演示内存文件系统...'));

        const memoryCreate = await client.createFile('/memory-test.json', JSON.stringify({ message: 'Memory test from REPL' }), 'memory');
        console.log(chalk.green(`✅ 内存文件创建${memoryCreate ? '成功' : '失败'}`));

        const memoryRead = await client.readFile('/memory-test.json', 'memory');
        console.log(chalk.green(`✅ 内存文件内容: ${memoryRead}`));

        const memoryFiles = await client.listFiles('memory');
        console.log(chalk.green(`✅ 内存文件列表:`));
        memoryFiles.forEach(file => {
            console.log(chalk.gray(`  - ${file}`));
        });

        console.log(chalk.green('\n✅ 内存文件系统演示完成\n'));

        // 4. 演示系统状态
        console.log(chalk.yellow('4. 演示系统状态...'));

        const systemStatus = await client.getSystemStatus();
        console.log(chalk.green(`✅ 系统状态:`));
        console.log(chalk.gray(`  初始化状态: ${systemStatus.initialized ? '✅ 已初始化' : '❌ 未初始化'}`));
        console.log(chalk.gray(`  文件服务数量: ${systemStatus.fsServices.length}`));
        console.log(chalk.gray(`  核心组件数量: ${systemStatus.components.length}`));

        const fsList = await client.getFSList();
        console.log(chalk.green(`✅ 可用文件系统:`));
        fsList.forEach(fs => {
            console.log(chalk.gray(`  - ${fs.name} (${fs.type})`));
        });

        const components = await client.getComponents();
        console.log(chalk.green(`✅ 可用组件:`));
        components.forEach(component => {
            console.log(chalk.gray(`  - ${component}`));
        });

        console.log(chalk.green('\n✅ 系统状态演示完成\n'));

        // 5. 清理演示文件
        console.log(chalk.yellow('5. 清理演示文件...'));

        const deleteResult = await client.deleteFile('test.txt', 'local');
        console.log(chalk.green(`✅ 文件删除${deleteResult ? '成功' : '失败'}: test.txt`));

        const memoryDeleteResult = await client.deleteFile('/memory-test.json', 'memory');
        console.log(chalk.green(`✅ 内存文件删除${memoryDeleteResult ? '成功' : '失败'}: /memory-test.json`));

        console.log(chalk.green('\n✅ REPL功能演示完成!'));

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
    demonstrateREPL().catch((error) => {
        console.error(chalk.red('❌ 演示失败:'), error);
        process.exit(1);
    });
}

export default demonstrateREPL;
