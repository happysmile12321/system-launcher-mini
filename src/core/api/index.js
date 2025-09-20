/**
 * 核心API模块
 * 提供文件服务注册和访问的统一接口
 */
class CoreAPI {
    constructor() {
        this.fsServices = new Map(); // 存储注册的文件服务
        this.components = new Map(); // 存储核心组件
        this.initialized = false;
    }

    /**
     * 注册文件服务
     * @param {string} name - 服务名称
     * @param {Object} fsInstance - 文件服务实例
     * @param {Object} config - 配置信息
     */
    registerFS(name, fsInstance, config = {}) {
        if (this.fsServices.has(name)) {
            console.warn(`[CoreAPI] 文件服务 ${name} 已存在，将被覆盖`);
        }

        this.fsServices.set(name, {
            instance: fsInstance,
            config: config,
            type: fsInstance.constructor.name
        });

        console.log(`[CoreAPI] 文件服务 ${name} (${fsInstance.constructor.name}) 注册成功`);
    }

    /**
     * 获取文件服务
     * @param {string} name - 服务名称
     * @returns {Object|null} 文件服务实例
     */
    getFS(name) {
        const service = this.fsServices.get(name);
        return service ? service.instance : null;
    }

    /**
     * 获取所有注册的文件服务
     * @returns {Array} 服务列表
     */
    getAllFS() {
        return Array.from(this.fsServices.entries()).map(([name, service]) => ({
            name,
            type: service.type,
            config: service.config
        }));
    }

    /**
     * 注册核心组件
     * @param {string} name - 组件名称
     * @param {Object} component - 组件实例
     */
    registerComponent(name, component) {
        if (this.components.has(name)) {
            console.warn(`[CoreAPI] 组件 ${name} 已存在，将被覆盖`);
        }

        this.components.set(name, component);
        console.log(`[CoreAPI] 组件 ${name} 注册成功`);
    }

    /**
     * 获取核心组件
     * @param {string} name - 组件名称
     * @returns {Object|null} 组件实例
     */
    getComponent(name) {
        return this.components.get(name) || null;
    }

    /**
     * 获取所有注册的组件
     * @returns {Array} 组件列表
     */
    getAllComponents() {
        return Array.from(this.components.keys());
    }

    /**
     * 初始化所有注册的服务和组件
     */
    async initialize() {
        if (this.initialized) {
            console.log('[CoreAPI] 已经初始化过了');
            return;
        }

        console.log('[CoreAPI] 开始初始化所有服务和组件...');

        // 初始化文件服务
        for (const [name, service] of this.fsServices) {
            if (service.instance.initialize && typeof service.instance.initialize === 'function') {
                try {
                    await service.instance.initialize();
                    console.log(`[CoreAPI] 文件服务 ${name} 初始化完成`);
                } catch (error) {
                    console.error(`[CoreAPI] 文件服务 ${name} 初始化失败:`, error);
                }
            }
        }

        // 初始化核心组件
        for (const [name, component] of this.components) {
            if (component.initialize && typeof component.initialize === 'function') {
                try {
                    await component.initialize();
                    console.log(`[CoreAPI] 组件 ${name} 初始化完成`);
                } catch (error) {
                    console.error(`[CoreAPI] 组件 ${name} 初始化失败:`, error);
                }
            }
        }

        this.initialized = true;
        console.log('[CoreAPI] 所有服务和组件初始化完成');
    }

    /**
     * 销毁所有注册的服务和组件
     */
    async destroy() {
        console.log('[CoreAPI] 开始销毁所有服务和组件...');

        // 销毁核心组件
        for (const [name, component] of this.components) {
            if (component.destroy && typeof component.destroy === 'function') {
                try {
                    await component.destroy();
                    console.log(`[CoreAPI] 组件 ${name} 销毁完成`);
                } catch (error) {
                    console.error(`[CoreAPI] 组件 ${name} 销毁失败:`, error);
                }
            }
        }

        // 销毁文件服务
        for (const [name, service] of this.fsServices) {
            if (service.instance.destroy && typeof service.instance.destroy === 'function') {
                try {
                    await service.instance.destroy();
                    console.log(`[CoreAPI] 文件服务 ${name} 销毁完成`);
                } catch (error) {
                    console.error(`[CoreAPI] 文件服务 ${name} 销毁失败:`, error);
                }
            }
        }

        this.initialized = false;
        console.log('[CoreAPI] 所有服务和组件销毁完成');
    }

    /**
     * 获取API状态信息
     * @returns {Object} 状态信息
     */
    getStatus() {
        return {
            initialized: this.initialized,
            fsServices: this.getAllFS(),
            components: this.getAllComponents(),
            totalServices: this.fsServices.size,
            totalComponents: this.components.size
        };
    }
}

export default CoreAPI;
