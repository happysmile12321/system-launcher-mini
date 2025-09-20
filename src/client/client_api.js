/**
 * 客户端API
 * 提供便捷的RPC调用接口，封装RPC客户端
 */
import { RPCClient } from './rpc_client.js';

/**
 * 客户端API类
 * 提供与服务器交互的高级接口
 */
class ClientAPI {
    constructor(config = {}) {
        this.rpcClient = new RPCClient(config);
        this.connected = false;
    }

    /**
     * 连接到服务器
     */
    async connect() {
        await this.rpcClient.connect();
        this.connected = true;
    }

    /**
     * 断开连接
     */
    disconnect() {
        this.rpcClient.disconnect();
        this.connected = false;
    }

    /**
     * 检查连接状态
     */
    isConnected() {
        return this.connected && this.rpcClient.isConnected();
    }

    // ========== 文件服务方法 ==========

    /**
     * 创建文件
     */
    async createFile(path, data, fsName = 'local') {
        return await this.rpcClient.call('fs.create', { path, data, fsName });
    }

    /**
     * 读取文件
     */
    async readFile(path, fsName = 'local') {
        return await this.rpcClient.call('fs.read', { path, fsName });
    }

    /**
     * 更新文件
     */
    async updateFile(path, data, fsName = 'local') {
        return await this.rpcClient.call('fs.update', { path, data, fsName });
    }

    /**
     * 删除文件
     */
    async deleteFile(path, fsName = 'local') {
        return await this.rpcClient.call('fs.delete', { path, fsName });
    }

    /**
     * 检查文件是否存在
     */
    async fileExists(path, fsName = 'local') {
        return await this.rpcClient.call('fs.exists', { path, fsName });
    }

    /**
     * 列出文件
     */
    async listFiles(fsName = 'local') {
        return await this.rpcClient.call('fs.list', { fsName });
    }

    /**
     * 获取文件信息
     */
    async getFileInfo(path, fsName = 'local') {
        return await this.rpcClient.call('fs.getInfo', { path, fsName });
    }

    /**
     * 获取文件系统统计信息
     */
    async getFSStats(fsName = 'local') {
        return await this.rpcClient.call('fs.stats', { fsName });
    }

    // ========== 容器组件方法 ==========

    /**
     * 创建容器
     */
    async createContainer(config) {
        return await this.rpcClient.call('container.create', config);
    }

    /**
     * 启动容器
     */
    async startContainer(containerId) {
        return await this.rpcClient.call('container.start', { containerId });
    }

    /**
     * 停止容器
     */
    async stopContainer(containerId) {
        return await this.rpcClient.call('container.stop', { containerId });
    }

    /**
     * 删除容器
     */
    async removeContainer(containerId) {
        return await this.rpcClient.call('container.remove', { containerId });
    }

    /**
     * 列出容器
     */
    async listContainers() {
        return await this.rpcClient.call('container.list');
    }

    // ========== 脚本组件方法 ==========

    /**
     * 执行脚本
     */
    async executeScript(scriptPath, args = {}) {
        return await this.rpcClient.call('script.execute', { scriptPath, args });
    }

    /**
     * 列出脚本
     */
    async listScripts() {
        return await this.rpcClient.call('script.list');
    }

    /**
     * 获取脚本状态
     */
    async getScriptStatus(scriptId) {
        return await this.rpcClient.call('script.getStatus', { scriptId });
    }

    // ========== 触发器组件方法 ==========

    /**
     * 创建触发器
     */
    async createTrigger(config) {
        return await this.rpcClient.call('trigger.create', config);
    }

    /**
     * 启动触发器
     */
    async startTrigger(triggerId) {
        return await this.rpcClient.call('trigger.start', { triggerId });
    }

    /**
     * 停止触发器
     */
    async stopTrigger(triggerId) {
        return await this.rpcClient.call('trigger.stop', { triggerId });
    }

    /**
     * 列出触发器
     */
    async listTriggers() {
        return await this.rpcClient.call('trigger.list');
    }

    // ========== 工作流组件方法 ==========

    /**
     * 创建工作流
     */
    async createWorkflow(config) {
        return await this.rpcClient.call('workflow.create', config);
    }

    /**
     * 启动工作流
     */
    async startWorkflow(workflowId) {
        return await this.rpcClient.call('workflow.start', { workflowId });
    }

    /**
     * 停止工作流
     */
    async stopWorkflow(workflowId) {
        return await this.rpcClient.call('workflow.stop', { workflowId });
    }

    /**
     * 列出工作流
     */
    async listWorkflows() {
        return await this.rpcClient.call('workflow.list');
    }

    // ========== 持久化组件方法 ==========

    /**
     * 保存数据
     */
    async saveData(key, data) {
        return await this.rpcClient.call('persistence.save', { key, data });
    }

    /**
     * 加载数据
     */
    async loadData(key) {
        return await this.rpcClient.call('persistence.load', { key });
    }

    /**
     * 删除数据
     */
    async deleteData(key) {
        return await this.rpcClient.call('persistence.delete', { key });
    }

    // ========== 系统状态方法 ==========

    /**
     * 获取系统状态
     */
    async getSystemStatus() {
        return await this.rpcClient.call('system.getStatus');
    }

    /**
     * 获取文件系统列表
     */
    async getFSList() {
        return await this.rpcClient.call('system.getFSList');
    }

    /**
     * 获取组件列表
     */
    async getComponents() {
        return await this.rpcClient.call('system.getComponents');
    }

    // ========== 便捷方法 ==========

    /**
     * 获取服务器信息
     */
    async getServerInfo() {
        const status = await this.getSystemStatus();
        const fsList = await this.getFSList();
        const components = await this.getComponents();

        return {
            status,
            fileSystems: fsList,
            components,
            client: {
                connected: this.isConnected(),
                config: this.rpcClient.getConfig()
            }
        };
    }

    /**
     * 批量操作
     */
    async batch(operations) {
        const results = [];
        for (const operation of operations) {
            try {
                const result = await this.rpcClient.call(operation.method, operation.params);
                results.push({ success: true, result });
            } catch (error) {
                results.push({ success: false, error: error.message });
            }
        }
        return results;
    }
}

export { ClientAPI };
