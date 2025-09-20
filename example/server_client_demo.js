#!/usr/bin/env node

/**
 * Server-Client演示
 * 展示server和client的RPC交互
 */

import chalk from 'chalk';
import Server from '../src/server/index.js';
import { ClientAPI } from '../src/client/client_api.js';

async function demonstrateServerClient() {
    console.log(chalk.blue('🚀 Server-Client RPC交互演示\n'));

    let server = null;
    let client = null;

    try {
        // 1. 启动Server
        console.log(chalk.yellow('1. 启动Server...'));
        server = new Server({
            port: 8080,
            host: 'localhost',
            rpcPort: 8081
        });

        await server.start();
        console.log(chalk.green('✅ Server启动成功\n'));

        // 等待服务器完全启动
        console.log(chalk.gray('等待服务器完全启动...'));
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 2. 创建Client并连接
        console.log(chalk.yellow('2. 创建Client并连接到Server...'));
        client = new ClientAPI({
            host: 'localhost',
            port: 8081
        });

        await client.connect();
        console.log(chalk.green('✅ Client连接成功\n'));

        // 3. 测试文件服务RPC调用
        console.log(chalk.yellow('3. 测试文件服务RPC调用...'));

        // 创建文件
        const createResult = await client.createFile('/test.txt', 'Hello from RPC!', 'local');
        console.log(chalk.gray(`  - 创建文件结果: ${createResult}`));

        // 读取文件
        const readResult = await client.readFile('/test.txt', 'local');
        console.log(chalk.gray(`  - 读取文件内容: ${readResult}`));

        // 更新文件
        const updateResult = await client.updateFile('/test.txt', 'Updated via RPC!', 'local');
        console.log(chalk.gray(`  - 更新文件结果: ${updateResult}`));

        // 再次读取
        const readResult2 = await client.readFile('/test.txt', 'local');
        console.log(chalk.gray(`  - 更新后内容: ${readResult2}`));

        // 检查文件是否存在
        const existsResult = await client.fileExists('/test.txt', 'local');
        console.log(chalk.gray(`  - 文件是否存在: ${existsResult}`));

        // 获取文件信息
        const fileInfo = await client.getFileInfo('/test.txt', 'local');
        console.log(chalk.gray(`  - 文件信息:`, JSON.stringify(fileInfo, null, 2)));

        console.log(chalk.green('✅ 文件服务RPC调用完成\n'));

        // 4. 测试内存文件系统
        console.log(chalk.yellow('4. 测试内存文件系统...'));

        const memoryCreate = await client.createFile('/memory-test.json', JSON.stringify({ message: 'Memory test' }), 'memory');
        console.log(chalk.gray(`  - 内存文件创建: ${memoryCreate}`));

        const memoryRead = await client.readFile('/memory-test.json', 'memory');
        console.log(chalk.gray(`  - 内存文件内容: ${memoryRead}`));

        console.log(chalk.green('✅ 内存文件系统测试完成\n'));

        // 5. 测试系统状态RPC调用
        console.log(chalk.yellow('5. 测试系统状态RPC调用...'));

        const systemStatus = await client.getSystemStatus();
        console.log(chalk.gray(`  - 系统初始化状态: ${systemStatus.initialized}`));
        console.log(chalk.gray(`  - 文件服务数量: ${systemStatus.fsServices.length}`));
        console.log(chalk.gray(`  - 核心组件数量: ${systemStatus.components.length}`));

        const fsList = await client.getFSList();
        console.log(chalk.gray(`  - 可用文件系统: ${fsList.map(fs => fs.name).join(', ')}`));

        const components = await client.getComponents();
        console.log(chalk.gray(`  - 可用组件: ${components.join(', ')}`));

        console.log(chalk.green('✅ 系统状态RPC调用完成\n'));

        // 6. 测试批量操作
        console.log(chalk.yellow('6. 测试批量操作...'));

        const batchOperations = [
            { method: 'fs.create', params: { path: '/batch1.txt', data: 'Batch 1', fsName: 'local' } },
            { method: 'fs.create', params: { path: '/batch2.txt', data: 'Batch 2', fsName: 'local' } },
            { method: 'fs.create', params: { path: '/batch3.txt', data: 'Batch 3', fsName: 'local' } }
        ];

        const batchResults = await client.batch(batchOperations);
        console.log(chalk.gray(`  - 批量操作结果: ${batchResults.length} 个操作`));
        batchResults.forEach((result, index) => {
            console.log(chalk.gray(`    ${index + 1}. ${result.success ? '✅ 成功' : '❌ 失败'}: ${result.success ? result.result : result.error}`));
        });

        console.log(chalk.green('✅ 批量操作测试完成\n'));

        // 7. 获取服务器信息
        console.log(chalk.yellow('7. 获取完整服务器信息...'));

        const serverInfo = await client.getServerInfo();
        console.log(chalk.cyan('📊 服务器信息:'));
        console.log(chalk.gray(`  - 服务器状态: ${serverInfo.status.initialized ? '✅ 已初始化' : '❌ 未初始化'}`));
        console.log(chalk.gray(`  - 文件系统: ${serverInfo.fileSystems.map(fs => `${fs.name}(${fs.type})`).join(', ')}`));
        console.log(chalk.gray(`  - 核心组件: ${serverInfo.components.join(', ')}`));
        console.log(chalk.gray(`  - 客户端连接: ${serverInfo.client.connected ? '✅ 已连接' : '❌ 未连接'}`));
        console.log(chalk.gray(`  - 连接地址: ${serverInfo.client.config.host}:${serverInfo.client.config.port}`));

        console.log(chalk.green('\n✅ 所有RPC交互测试完成!'));

    } catch (error) {
        console.error(chalk.red('❌ 演示过程中出现错误:'), error);
    } finally {
        // 清理资源
        console.log(chalk.yellow('\n🧹 清理资源...'));

        if (client) {
            client.disconnect();
            console.log(chalk.gray('  - Client断开连接'));
        }

        if (server) {
            await server.stop();
            console.log(chalk.gray('  - Server停止'));
        }

        console.log(chalk.green('✅ 资源清理完成'));
    }
}

// 运行演示
if (import.meta.url === `file://${process.argv[1]}`) {
    demonstrateServerClient().catch((error) => {
        console.error(chalk.red('❌ 演示失败:'), error);
        process.exit(1);
    });
}

export default demonstrateServerClient;
