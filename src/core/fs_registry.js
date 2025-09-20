/**
 * 文件服务注册器
 * 自动注册infra下的各种文件系统实现
 */
import LocalFS from '../infra/persistance/local-fs.js';
import GitFS from '../infra/persistance/git-fs.js';
import FS from '../infra/persistance/fs.js';

/**
 * 默认文件服务配置
 */
const defaultFSConfigs = {
    local: {
        basePath: './data',
        encoding: 'utf8',
        autoCreateDir: true
    },
    git: {
        basePath: './data',
        gitRepo: './data',
        autoCommit: true,
        commitMessage: 'Auto commit by system-launcher'
    },
    memory: {
        basePath: './temp'
    }
};

/**
 * 文件服务注册器类
 */
class FSRegistry {
    constructor(coreAPI) {
        this.coreAPI = coreAPI;
        this.registeredServices = new Set();
    }

    /**
     * 注册所有默认的文件服务
     * @param {Object} customConfigs - 自定义配置
     */
    async registerDefaultServices(customConfigs = {}) {
        console.log('[FSRegistry] 开始注册默认文件服务...');

        // 注册本地文件系统
        await this.registerLocalFS(customConfigs.local);

        // 注册Git文件系统
        await this.registerGitFS(customConfigs.git);

        // 注册内存文件系统
        await this.registerMemoryFS(customConfigs.memory);

        console.log('[FSRegistry] 默认文件服务注册完成');
    }

    /**
     * 注册本地文件系统
     * @param {Object} config - 配置
     */
    async registerLocalFS(config = {}) {
        const finalConfig = { ...defaultFSConfigs.local, ...config };
        const localFS = new LocalFS(finalConfig);

        this.coreAPI.registerFS('local', localFS, finalConfig);
        this.registeredServices.add('local');

        console.log('[FSRegistry] 本地文件系统注册成功');
    }

    /**
     * 注册Git文件系统
     * @param {Object} config - 配置
     */
    async registerGitFS(config = {}) {
        const finalConfig = { ...defaultFSConfigs.git, ...config };
        const gitFS = new GitFS(finalConfig);

        // 初始化Git仓库
        if (finalConfig.autoInit !== false) {
            await gitFS.initGitRepo();
        }

        this.coreAPI.registerFS('git', gitFS, finalConfig);
        this.registeredServices.add('git');

        console.log('[FSRegistry] Git文件系统注册成功');
    }

    /**
     * 注册内存文件系统
     * @param {Object} config - 配置
     */
    async registerMemoryFS(config = {}) {
        const finalConfig = { ...defaultFSConfigs.memory, ...config };
        const memoryFS = new FS(finalConfig);

        this.coreAPI.registerFS('memory', memoryFS, finalConfig);
        this.registeredServices.add('memory');

        console.log('[FSRegistry] 内存文件系统注册成功');
    }

    /**
     * 注册自定义文件服务
     * @param {string} name - 服务名称
     * @param {Object} fsInstance - 文件服务实例
     * @param {Object} config - 配置
     */
    registerCustomFS(name, fsInstance, config = {}) {
        this.coreAPI.registerFS(name, fsInstance, config);
        this.registeredServices.add(name);
        console.log(`[FSRegistry] 自定义文件服务 ${name} 注册成功`);
    }

    /**
     * 获取已注册的服务列表
     * @returns {Array} 服务名称列表
     */
    getRegisteredServices() {
        return Array.from(this.registeredServices);
    }

    /**
     * 检查服务是否已注册
     * @param {string} name - 服务名称
     * @returns {boolean} 是否已注册
     */
    isServiceRegistered(name) {
        return this.registeredServices.has(name);
    }

    /**
     * 获取文件服务实例
     * @param {string} name - 服务名称
     * @returns {Object|null} 文件服务实例
     */
    getFS(name) {
        return this.coreAPI.getFS(name);
    }

    /**
     * 获取默认文件服务（优先级：local > git > memory）
     * @returns {Object|null} 默认文件服务实例
     */
    getDefaultFS() {
        const priority = ['local', 'git', 'memory'];

        for (const name of priority) {
            if (this.isServiceRegistered(name)) {
                return this.getFS(name);
            }
        }

        return null;
    }
}

export default FSRegistry;
