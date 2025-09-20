/**
 * RPC服务器
 * 提供基于HTTP的RPC服务
 */
import http from 'http';
import { EventEmitter } from 'events';

/**
 * RPC服务器类
 */
class RPCServer extends EventEmitter {
    constructor(serverAPI, config = {}) {
        super();
        this.serverAPI = serverAPI;
        this.config = {
            port: config.rpcPort || 8081,
            host: config.host || 'localhost',
            ...config
        };
        this.server = null;
        this.initialized = false;
    }

    /**
     * 启动RPC服务器
     */
    async start() {
        if (this.initialized) {
            console.log('[RPCServer] 服务器已经启动');
            return;
        }

        return new Promise((resolve, reject) => {
            this.server = http.createServer((req, res) => {
                this.handleRequest(req, res);
            });

            this.server.listen(this.config.port, this.config.host, (err) => {
                if (err) {
                    console.error('[RPCServer] 启动失败:', err);
                    reject(err);
                    return;
                }

                this.initialized = true;
                console.log(`[RPCServer] RPC服务器启动成功 - ${this.config.host}:${this.config.port}`);
                resolve();
            });

            this.server.on('error', (err) => {
                console.error('[RPCServer] 服务器错误:', err);
                this.emit('error', err);
            });
        });
    }

    /**
     * 停止RPC服务器
     */
    async stop() {
        if (!this.initialized) {
            console.log('[RPCServer] 服务器未启动');
            return;
        }

        return new Promise((resolve) => {
            this.server.close(() => {
                this.initialized = false;
                console.log('[RPCServer] RPC服务器停止完成');
                resolve();
            });
        });
    }

    /**
     * 处理HTTP请求
     */
    async handleRequest(req, res) {
        // 设置CORS头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // 处理预检请求
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // 只处理POST请求
        if (req.method !== 'POST') {
            this.sendError(res, 405, 'Method Not Allowed');
            return;
        }

        try {
            // 解析请求体
            const body = await this.parseBody(req);
            const rpcRequest = JSON.parse(body);

            // 处理RPC请求
            const result = await this.handleRPCRequest(rpcRequest);

            // 发送响应
            this.sendResponse(res, result);

        } catch (error) {
            console.error('[RPCServer] 处理请求失败:', error);
            this.sendError(res, 500, 'Internal Server Error', error.message);
        }
    }

    /**
     * 解析请求体
     */
    parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                resolve(body);
            });
            req.on('error', reject);
        });
    }

    /**
     * 处理RPC请求
     */
    async handleRPCRequest(request) {
        const { method, params, id } = request;

        try {
            // 验证请求格式
            if (!method || typeof method !== 'string') {
                throw new Error('Invalid method');
            }

            // 调用ServerAPI方法
            const result = await this.serverAPI.call(method, params || {});

            return {
                jsonrpc: '2.0',
                result: result,
                id: id
            };

        } catch (error) {
            return {
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal error',
                    data: error.message
                },
                id: id
            };
        }
    }

    /**
     * 发送成功响应
     */
    sendResponse(res, data) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    /**
     * 发送错误响应
     */
    sendError(res, statusCode, message, details = null) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        const error = {
            error: {
                code: statusCode,
                message: message,
                ...(details && { details })
            }
        };
        res.end(JSON.stringify(error));
    }

    /**
     * 获取服务器状态
     */
    getStatus() {
        return {
            initialized: this.initialized,
            config: this.config,
            listening: this.server ? this.server.listening : false
        };
    }
}

export { RPCServer };
