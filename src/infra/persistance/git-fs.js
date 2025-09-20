import FS from './fs.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Git文件系统类
 * 继承基础FS，添加Git版本控制功能
 */
class GitFS extends FS {
    constructor(config = {}) {
        super(config);
        this.config = {
            ...this.config,
            gitRepo: config.gitRepo || './data',
            autoCommit: config.autoCommit || true,
            commitMessage: config.commitMessage || 'Auto commit',
            ...config
        };
    }

    /**
     * 初始化Git仓库
     */
    async initGitRepo() {
        try {
            await execAsync(`cd ${this.config.gitRepo} && git init`);
            console.log(`[GitFS] Git仓库初始化完成: ${this.config.gitRepo}`);
            return true;
        } catch (error) {
            console.error(`[GitFS] Git仓库初始化失败:`, error);
            return false;
        }
    }

    /**
     * 添加文件到Git
     */
    async gitAdd(filePath) {
        try {
            const relativePath = path.relative(this.config.gitRepo, filePath);
            await execAsync(`cd ${this.config.gitRepo} && git add "${relativePath}"`);
            return true;
        } catch (error) {
            console.error(`[GitFS] Git添加文件失败 ${filePath}:`, error);
            return false;
        }
    }

    /**
     * 提交更改
     */
    async gitCommit(message = this.config.commitMessage) {
        try {
            await execAsync(`cd ${this.config.gitRepo} && git commit -m "${message}"`);
            console.log(`[GitFS] Git提交完成: ${message}`);
            return true;
        } catch (error) {
            console.error(`[GitFS] Git提交失败:`, error);
            return false;
        }
    }

    /**
     * 获取Git状态
     */
    async gitStatus() {
        try {
            const { stdout } = await execAsync(`cd ${this.config.gitRepo} && git status --porcelain`);
            return stdout.trim().split('\n').filter(line => line.length > 0);
        } catch (error) {
            console.error(`[GitFS] 获取Git状态失败:`, error);
            return [];
        }
    }

    /**
     * 获取提交历史
     */
    async gitLog(limit = 10) {
        try {
            const { stdout } = await execAsync(`cd ${this.config.gitRepo} && git log --oneline -${limit}`);
            return stdout.trim().split('\n').filter(line => line.length > 0);
        } catch (error) {
            console.error(`[GitFS] 获取Git日志失败:`, error);
            return [];
        }
    }

    /**
     * 重写写入文件方法，添加Git功能
     */
    async writeFile(filePath, data) {
        const result = await super.writeFile(filePath, data);

        if (result && this.config.autoCommit) {
            await this.gitAdd(filePath);
            await this.gitCommit();
        }

        return result;
    }

    /**
     * 重写删除文件方法，添加Git功能
     */
    async deleteFile(filePath) {
        const result = await super.deleteFile(filePath);

        if (result && this.config.autoCommit) {
            await this.gitAdd(filePath);
            await this.gitCommit();
        }

        return result;
    }

    /**
     * 创建分支
     */
    async createBranch(branchName) {
        try {
            await execAsync(`cd ${this.config.gitRepo} && git checkout -b ${branchName}`);
            console.log(`[GitFS] 创建分支: ${branchName}`);
            return true;
        } catch (error) {
            console.error(`[GitFS] 创建分支失败:`, error);
            return false;
        }
    }

    /**
     * 切换分支
     */
    async switchBranch(branchName) {
        try {
            await execAsync(`cd ${this.config.gitRepo} && git checkout ${branchName}`);
            console.log(`[GitFS] 切换到分支: ${branchName}`);
            return true;
        } catch (error) {
            console.error(`[GitFS] 切换分支失败:`, error);
            return false;
        }
    }
}

export default GitFS;