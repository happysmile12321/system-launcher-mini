/**
 * 抽象文件数据结构
 * 提供同步的增删改查方法
 */
class FS {
    constructor(config = {}) {
        this.config = {
            basePath: config.basePath || './data',
            encoding: config.encoding || 'utf8',
            ...config
        };
        this.files = new Map(); // 内存中的文件数据
    }

    /**
     * 创建文件
     * @param {string} path - 文件路径
     * @param {string|Buffer} data - 文件内容
     * @returns {boolean} 是否成功
     */
    create(path, data) {
        try {
            this.files.set(path, {
                data: data,
                created: new Date(),
                modified: new Date(),
                size: typeof data === 'string' ? data.length : data.length
            });
            return true;
        } catch (error) {
            console.error(`[FS] 创建文件失败 ${path}:`, error);
            return false;
        }
    }

    /**
     * 读取文件
     * @param {string} path - 文件路径
     * @returns {string|Buffer|null} 文件内容
     */
    read(path) {
        const file = this.files.get(path);
        return file ? file.data : null;
    }

    /**
     * 更新文件
     * @param {string} path - 文件路径
     * @param {string|Buffer} data - 新内容
     * @returns {boolean} 是否成功
     */
    update(path, data) {
        const file = this.files.get(path);
        if (!file) {
            return false;
        }

        try {
            file.data = data;
            file.modified = new Date();
            file.size = typeof data === 'string' ? data.length : data.length;
            return true;
        } catch (error) {
            console.error(`[FS] 更新文件失败 ${path}:`, error);
            return false;
        }
    }

    /**
     * 删除文件
     * @param {string} path - 文件路径
     * @returns {boolean} 是否成功
     */
    delete(path) {
        return this.files.delete(path);
    }

    /**
     * 检查文件是否存在
     * @param {string} path - 文件路径
     * @returns {boolean} 是否存在
     */
    exists(path) {
        return this.files.has(path);
    }

    /**
     * 获取文件信息
     * @param {string} path - 文件路径
     * @returns {Object|null} 文件信息
     */
    getInfo(path) {
        const file = this.files.get(path);
        if (!file) {
            return null;
        }

        return {
            path,
            size: file.size,
            created: file.created,
            modified: file.modified
        };
    }

    /**
     * 列出所有文件
     * @returns {Array} 文件路径列表
     */
    list() {
        return Array.from(this.files.keys());
    }

    /**
     * 搜索文件
     * @param {string} pattern - 搜索模式
     * @returns {Array} 匹配的文件路径
     */
    search(pattern) {
        const regex = new RegExp(pattern);
        return this.list().filter(path => regex.test(path));
    }

    /**
     * 获取文件大小
     * @param {string} path - 文件路径
     * @returns {number} 文件大小
     */
    size(path) {
        const file = this.files.get(path);
        return file ? file.size : 0;
    }

    /**
     * 清空所有文件
     */
    clear() {
        this.files.clear();
    }

    /**
     * 获取存储统计信息
     * @returns {Object} 统计信息
     */
    stats() {
        const files = Array.from(this.files.values());
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);

        return {
            fileCount: this.files.size,
            totalSize,
            averageSize: this.files.size > 0 ? totalSize / this.files.size : 0
        };
    }
}

export default FS;