import FS from './fs.js';
import fs from 'fs';
import path from 'path';

/**
 * 本地文件系统实现
 * 继承抽象FS，实现本地磁盘文件操作
 */
class LocalFS extends FS {
    constructor(config = {}) {
        super(config);
        this.config = {
            ...this.config,
            autoCreateDir: config.autoCreateDir !== false,
            ...config
        };
    }

    /**
     * 确保目录存在
     */
    _ensureDir(dirPath) {
        if (this.config.autoCreateDir) {
            try {
                fs.mkdirSync(dirPath, { recursive: true });
            } catch (error) {
                // 目录可能已存在，忽略错误
            }
        }
    }

    /**
     * 创建文件
     */
    create(filePath, data) {
        try {
            const dir = path.dirname(filePath);
            this._ensureDir(dir);

            fs.writeFileSync(filePath, data, this.config.encoding);

            // 同步到内存
            super.create(filePath, data);
            return true;
        } catch (error) {
            console.error(`[LocalFS] 创建文件失败 ${filePath}:`, error);
            return false;
        }
    }

    /**
     * 读取文件
     */
    read(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, this.config.encoding);
                // 同步到内存
                super.create(filePath, data);
                return data;
            }
            return null;
        } catch (error) {
            console.error(`[LocalFS] 读取文件失败 ${filePath}:`, error);
            return null;
        }
    }

    /**
     * 更新文件
     */
    update(filePath, data) {
        try {
            if (fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, data, this.config.encoding);
                // 同步到内存
                super.update(filePath, data);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[LocalFS] 更新文件失败 ${filePath}:`, error);
            return false;
        }
    }

    /**
     * 删除文件
     */
    delete(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                // 同步到内存
                super.delete(filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[LocalFS] 删除文件失败 ${filePath}:`, error);
            return false;
        }
    }

    /**
     * 检查文件是否存在
     */
    exists(filePath) {
        return fs.existsSync(filePath);
    }

    /**
     * 获取文件信息
     */
    getInfo(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                return {
                    path: filePath,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            }
            return null;
        } catch (error) {
            console.error(`[LocalFS] 获取文件信息失败 ${filePath}:`, error);
            return null;
        }
    }

    /**
     * 列出目录内容
     */
    listDir(dirPath) {
        try {
            if (fs.existsSync(dirPath)) {
                return fs.readdirSync(dirPath);
            }
            return [];
        } catch (error) {
            console.error(`[LocalFS] 列出目录失败 ${dirPath}:`, error);
            return [];
        }
    }

    /**
     * 递归列出所有文件
     */
    listAll(dirPath = this.config.basePath) {
        const files = [];

        const scanDir = (dir) => {
            try {
                const items = fs.readdirSync(dir);
                for (const item of items) {
                    const fullPath = path.join(dir, item);
                    const stats = fs.statSync(fullPath);

                    if (stats.isDirectory()) {
                        scanDir(fullPath);
                    } else {
                        files.push(fullPath);
                    }
                }
            } catch (error) {
                console.error(`[LocalFS] 扫描目录失败 ${dir}:`, error);
            }
        };

        scanDir(dirPath);
        return files;
    }

    /**
     * 复制文件
     */
    copy(srcPath, destPath) {
        try {
            const data = this.read(srcPath);
            if (data !== null) {
                return this.create(destPath, data);
            }
            return false;
        } catch (error) {
            console.error(`[LocalFS] 复制文件失败 ${srcPath} -> ${destPath}:`, error);
            return false;
        }
    }

    /**
     * 移动文件
     */
    move(srcPath, destPath) {
        try {
            if (this.copy(srcPath, destPath)) {
                return this.delete(srcPath);
            }
            return false;
        } catch (error) {
            console.error(`[LocalFS] 移动文件失败 ${srcPath} -> ${destPath}:`, error);
            return false;
        }
    }
}

export default LocalFS;
