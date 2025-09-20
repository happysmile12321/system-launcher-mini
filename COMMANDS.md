# 命令使用指南

## 📋 可用命令

### 🚀 基本启动命令

```bash
# 启动RPC服务器
npm run server

# 启动CLI客户端
npm run client

# 运行演示
npm run demo

# 运行使用示例
npm run usage
```

### 🔄 开发模式（使用 nodemon）

```bash
# 开发模式启动服务器（自动重启）
npm run dev:server

# 开发模式启动客户端（自动重启）
npm run dev:client

# 开发模式运行演示（自动重启）
npm run dev:demo
```

### 🧪 测试命令

```bash
# 快速测试：启动Server + 运行演示（推荐）
npm run test:quick

# 完整测试：启动Server + Client交互
npm run test:server

# 传统测试：启动Server + 等待 + 运行演示
npm run test:full
```

### 🧹 清理命令

```bash
# 清理所有相关进程
npm run clean
```

## 🎯 推荐使用流程

### 1. 快速测试（推荐）

```bash
npm run test:quick
```

这个命令会：

- 启动 Server
- 等待 Server 完全就绪
- 运行完整的 Server-Client 演示
- 自动清理资源

### 2. 开发模式

```bash
# 终端1：启动开发服务器
npm run dev:server

# 终端2：启动开发客户端
npm run dev:client
```

### 3. 手动测试

```bash
# 终端1：启动服务器
npm run server

# 终端2：启动客户端
npm run client
```

## 🔧 命令详解

### `npm run test:quick`

- **功能**: 一键测试 Server 和 Client 的完整交互
- **特点**: 自动管理进程生命周期，包含错误处理
- **适用**: 快速验证功能，CI/CD 测试

### `npm run dev:server`

- **功能**: 开发模式启动服务器
- **监听**: `src/server/`, `src/core/`, `src/infra/`
- **特点**: 文件变化时自动重启
- **适用**: 服务器端开发

### `npm run dev:client`

- **功能**: 开发模式启动客户端
- **监听**: `src/client/`, `src/cli/`
- **特点**: 文件变化时自动重启
- **适用**: 客户端开发

### `npm run dev:demo`

- **功能**: 开发模式运行演示
- **监听**: 所有`src/`和`example/`目录
- **特点**: 文件变化时自动重启
- **适用**: 端到端测试开发

## 🚨 故障排除

### 端口冲突

如果遇到端口冲突：

```bash
# 清理所有相关进程
npm run clean

# 或者手动清理特定端口
lsof -ti:8081 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### 连接失败

确保 Server 完全启动后再启动 Client：

```bash
# 等待Server输出 "RPC服务器启动成功" 后再启动Client
npm run server
# 在另一个终端
npm run client
```

### 进程卡死

如果进程卡死：

```bash
# 强制清理
npm run clean
# 或者
pkill -f 'node.*system-launcher'
```

## 📊 命令对比

| 命令                  | 用途       | 自动重启 | 进程管理 | 推荐场景   |
| --------------------- | ---------- | -------- | -------- | ---------- |
| `npm run server`      | 启动服务器 | ❌       | 手动     | 生产环境   |
| `npm run client`      | 启动客户端 | ❌       | 手动     | 生产环境   |
| `npm run dev:server`  | 开发服务器 | ✅       | 手动     | 服务器开发 |
| `npm run dev:client`  | 开发客户端 | ✅       | 手动     | 客户端开发 |
| `npm run test:quick`  | 快速测试   | ❌       | 自动     | 功能测试   |
| `npm run test:server` | 完整测试   | ❌       | 自动     | 集成测试   |

## 🎉 最佳实践

1. **开发时**: 使用`npm run dev:server`和`npm run dev:client`
2. **测试时**: 使用`npm run test:quick`
3. **演示时**: 使用`npm run demo`
4. **生产时**: 使用`npm run server`和`npm run client`

## 🔍 调试技巧

### 查看进程状态

```bash
# 查看相关进程
ps aux | grep system-launcher

# 查看端口占用
lsof -i :8081
lsof -i :3000
```

### 查看日志

所有命令都会输出详细的日志信息，包括：

- 服务器启动状态
- RPC 方法注册
- 组件初始化
- 连接状态
- 错误信息

### 环境变量

可以通过环境变量自定义配置：

```bash
# 自定义端口
PORT=8082 npm run server

# 自定义主机
HOST=0.0.0.0 npm run server
```
