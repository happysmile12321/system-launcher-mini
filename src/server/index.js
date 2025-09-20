/**
 * Server模块
 * 提供RPC服务，作为Core的服务器端实现
 */
import { Core } from '../core/index.js';
import { ServerAPI } from './server_api/index.js';
import { RPCServer } from './rpc_server.js';

/**
 * Server类
 * 管理RPC服务器和Core实例
 */
class Server {
    constructor(config = {}) {
        this.config = {
            port: config.port || 8080,
            host: config.host || 'localhost',
            rpcPort: config.rpcPort || 8081,
            ...config
        };

        this.core = Core;
        this.serverAPI = new ServerAPI(this.core);
        this.rpcServer = new RPCServer(this.serverAPI, {
            port: this.config.rpcPort,
            host: this.config.host
        });
        this.initialized = false;
    }

    /**
     * 启动服务器
     */
    async start() {
        if (this.initialized) {
            console.log('[Server] 服务器已经启动');
            return;
        }

        try {
            console.log('[Server] 启动服务器...');

            // 1. 初始化Core
            await this.initializeCore();

            // 2. 启动RPC服务器
            await this.rpcServer.start();

            this.initialized = true;
            console.log(`[Server] 服务器启动成功 - RPC端口: ${this.config.rpcPort}`);

        } catch (error) {
            console.error('[Server] 服务器启动失败:', error);
            throw error;
        }
    }

    /**
     * 停止服务器
     */
    async stop() {
        if (!this.initialized) {
            console.log('[Server] 服务器未启动');
            return;
        }

        try {
            console.log('[Server] 停止服务器...');

            // 1. 停止RPC服务器
            await this.rpcServer.stop();

            // 2. 销毁Core
            await this.core.destroy();

            this.initialized = false;
            console.log('[Server] 服务器停止完成');

        } catch (error) {
            console.error('[Server] 服务器停止失败:', error);
            throw error;
        }
    }

    /**
     * 初始化Core
     */
    async initializeCore() {
        console.log('[Server] 初始化Core...');

        // 自定义文件服务配置
        const fsConfigs = {
            local: {
                basePath: './server-data',
                encoding: 'utf8',
                autoCreateDir: true
            },
            git: {
                basePath: './server-data',
                gitRepo: './server-data',
                autoCommit: true,
                commitMessage: 'Auto commit by server'
            },
            memory: {
                basePath: './server-temp'
            }
        };

        await this.core.initialize(fsConfigs);
        console.log('[Server] Core初始化完成');
    }

    /**
     * 获取服务器状态
     */
    getStatus() {
        return {
            initialized: this.initialized,
            config: this.config,
            core: this.core.getStatus(),
            rpcServer: this.rpcServer.getStatus()
        };
    }

    /**
     * 获取Core实例（用于直接访问）
     */
    getCore() {
        return this.core;
    }

    /**
     * 获取ServerAPI实例
     */
    getServerAPI() {
        return this.serverAPI;
    }
}

export default Server;
