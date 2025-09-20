import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * CLI模块初始化函数
 */
export async function initialize(config = {}) {
    console.log('[CLI] 初始化CLI服务器...');

    const cli = {
        config: {
            port: config.port || 3000,
            host: config.host || 'localhost',
            ...config
        },
        app: null,
        server: null,
        components: {},
        apis: {},
        initialized: true
    };

    // 初始化Express应用
    const express = await import('express');
    cli.app = express.default();

    // 设置基本中间件
    cli.app.use(express.default.json());
    cli.app.use((req, res, next) => {
        console.log(`[CLI] ${req.method} ${req.path}`);
        next();
    });

    // 扫描并注册API方法
    await scanAndRegisterAPIMethods(cli);

    // 设置基本路由
    cli.app.get('/', (req, res) => {
        res.json({
            status: 'running',
            components: Object.keys(cli.components),
            apis: Object.keys(cli.apis),
            timestamp: new Date().toISOString()
        });
    });

    cli.app.get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString()
        });
    });

    // 启动HTTP服务器
    cli.server = cli.app.listen(cli.config.port, cli.config.host, () => {
        console.log(`[CLI] HTTP服务器启动: http://${cli.config.host}:${cli.config.port}`);
    });

    console.log('[CLI] CLI服务器初始化完成');
    return cli;
}

/**
 * 扫描并注册API方法
 */
async function scanAndRegisterAPIMethods(cli) {
    console.log('[CLI] 扫描并注册API方法...');

    const coreDir = path.join(__dirname, '..');
    const apiDirs = await fs.promises.readdir(coreDir, { withFileTypes: true });

    for (const dir of apiDirs) {
        if (dir.isDirectory() && dir.name.endsWith('_api')) {
            const apiName = dir.name;
            const apiDir = path.join(coreDir, apiName);

            console.log(`[CLI] 发现API目录: ${apiName}`);

            try {
                // 扫描API目录中的文件
                const apiFiles = await fs.promises.readdir(apiDir);

                for (const file of apiFiles) {
                    if (file.endsWith('.js')) {
                        const apiPath = path.join(apiDir, file);
                        const apiModule = await import(apiPath);

                        // 注册API方法到core对象
                        const methodName = file === 'index.js' ? apiName : file.replace('.js', '');
                        cli.apis[methodName] = apiModule;

                        console.log(`[CLI] 注册API方法: ${methodName}`);
                    }
                }
            } catch (error) {
                console.error(`[CLI] 注册API方法失败 ${apiName}:`, error);
            }
        }
    }

    console.log(`[CLI] API方法注册完成，共注册 ${Object.keys(cli.apis).length} 个API模块`);
}
