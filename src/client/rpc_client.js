/**
 * RPC客户端
 * 提供与RPC服务器的通信功能
 */
import http from 'http';
import { EventEmitter } from 'events';

/**
 * RPC客户端类
 */
class RPCClient extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {
            host: config.host || 'localhost',
            port: config.port || 8081,
            timeout: config.timeout || 30000,
            ...config
        };
        this.connected = false;
        this.requestId = 0;
    }

    /**
     * 连接到RPC服务器
     */
    async connect() {
        if (this.connected) {
            console.log('[RPCClient] 已经连接到服务器');
            return;
        }

        try {
            // 测试连接
            await this.ping();
            this.connected = true;
            console.log(`[RPCClient] 连接到RPC服务器成功 - ${this.config.host}:${this.config.port}`);
        } catch (error) {
            console.error('[RPCClient] 连接失败:', error);
            throw error;
        }
    }

    /**
     * 断开连接
     */
    disconnect() {
        this.connected = false;
        console.log('[RPCClient] 断开连接');
    }

    /**
     * 发送RPC请求
     */
    async call(method, params = {}) {
        if (!this.connected) {
            throw new Error('Not connected to RPC server');
        }

        const request = {
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: ++this.requestId
        };

        try {
            const response = await this.sendRequest(request);

            if (response.error) {
                throw new Error(`RPC Error: ${response.error.message}`);
            }

            return response.result;

        } catch (error) {
            console.error(`[RPCClient] RPC调用失败 ${method}:`, error);
            throw error;
        }
    }

    /**
     * 发送HTTP请求
     */
    sendRequest(request) {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify(request);

            const options = {
                hostname: this.config.host,
                port: this.config.port,
                path: '/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                },
                timeout: this.config.timeout
            };

            const req = http.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve(response);
                    } catch (error) {
                        reject(new Error(`Invalid JSON response: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.write(postData);
            req.end();
        });
    }

    /**
     * 测试连接
     */
    async ping() {
        try {
            // 直接发送HTTP请求测试连接，而不是通过call方法
            const response = await this.sendRequest({
                jsonrpc: '2.0',
                method: 'system.getStatus',
                params: {},
                id: 1
            });

            if (response.error) {
                throw new Error(response.error.message);
            }

            return true;
        } catch (error) {
            throw new Error(`Ping failed: ${error.message}`);
        }
    }

    /**
     * 获取连接状态
     */
    isConnected() {
        return this.connected;
    }

    /**
     * 获取配置信息
     */
    getConfig() {
        return { ...this.config };
    }
}

export { RPCClient };
