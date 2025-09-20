# System Launcher Mini

一个简化的系统启动器，具有核心组件管理和 RPC 通信功能。

## 功能特性

- 🏗️ **分层架构**: Core → Server → Client → CLI
- 🔄 **RPC 通信**: 基于 HTTP 的 JSON-RPC 2.0 协议
- 📁 **文件系统**: 支持本地、Git、内存文件系统
- 🐳 **容器管理**: Docker 容器生命周期管理
- 📜 **脚本执行**: 脚本管理和执行
- ⚡ **触发器**: 事件驱动的触发器系统
- 🔄 **工作流**: 工作流编排和执行
- 💾 **持久化**: 数据持久化存储

## 快速开始

### 安装依赖

```bash
npm install
```

### 基本命令

#### 启动服务

```bash
# 启动RPC服务器
npm run server

# 启动CLI客户端
npm run client

# 启动智能CLI客户端（推荐，自动重试连接）
npm run smart-client
```

#### 开发模式（使用 nodemon）

```bash
# 开发模式启动服务器（自动重启）
npm run dev:server

# 开发模式启动客户端（自动重启）
npm run dev:client

# 开发模式运行演示（自动重启）
npm run dev:demo
```

#### 测试命令

```bash
# 快速测试：启动Server + 运行演示
npm run test:quick

# 完整测试：启动Server + Client交互
npm run test:server

# 运行演示
npm run demo

# 运行使用示例
npm run usage
```

#### 清理命令

```bash
# 清理所有相关进程
npm run clean
```

## 使用方式

### 1. 启动 Server

```bash
npm run server
```

Server 将在以下端口启动：

- HTTP 端口: 8080
- RPC 端口: 8081

### 2. 启动 Client

```bash
npm run client
```

Client 将连接到 Server 并显示系统状态。

### 3. 运行演示

```bash
npm run demo
```

这将运行完整的 Server-Client 交互演示。

## 开发指南

### 项目结构

```
src/
├── core/           # 核心业务逻辑
│   ├── api/        # 核心API
│   ├── container/  # 容器管理
│   ├── persistence/ # 持久化
│   ├── script/     # 脚本管理
│   ├── trigger/    # 触发器
│   ├── workflow/   # 工作流
│   └── cli/        # CLI组件
├── server/         # RPC服务器
│   ├── server_api/ # RPC接口定义
│   └── rpc_server.js # RPC服务器实现
├── client/         # RPC客户端
│   ├── rpc_client.js # RPC客户端实现
│   └── client_api.js # 客户端API
├── cli/            # 命令行界面
└── infra/          # 基础设施
    └── persistence/ # 文件系统实现
```

### 开发模式

使用 nodemon 进行开发，支持热重载：

```bash
# 开发服务器（监听server、core、infra目录）
npm run dev:server

# 开发客户端（监听client、cli目录）
npm run dev:client

# 开发演示（监听所有目录）
npm run dev:demo
```

### 测试

```bash
# 快速测试（推荐）
npm run test:quick

# 智能测试：启动Server + 智能Client（推荐）
npm run test:smart

# 完整测试
npm run test:server
```

## RPC 接口

### 文件服务

```javascript
// 通过Client API调用
const client = new ClientAPI({ host: "localhost", port: 8081 });
await client.connect();

// 文件操作
await client.createFile("/test.txt", "Hello World", "local");
const content = await client.readFile("/test.txt", "local");
await client.updateFile("/test.txt", "Updated content", "local");
await client.deleteFile("/test.txt", "local");
```

### 系统状态

```javascript
// 获取系统状态
const status = await client.getSystemStatus();
const fsList = await client.getFSList();
const components = await client.getComponents();
```

## 配置

### Server 配置

```javascript
const server = new Server({
  port: 8080, // HTTP端口
  host: "localhost", // 主机地址
  rpcPort: 8081, // RPC端口
});
```

### Client 配置

```javascript
const client = new ClientAPI({
  host: "localhost", // 服务器地址
  port: 8081, // RPC端口
  timeout: 30000, // 超时时间
});
```

## 故障排除

### 端口冲突

如果遇到端口冲突，可以：

1. 清理现有进程：

```bash
npm run clean
```

2. 或者手动清理：

```bash
lsof -ti:8081 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### 连接失败

确保 Server 已完全启动后再启动 Client：

```bash
# 等待Server完全启动
npm run server
# 在另一个终端
npm run client
```

## 许可证

MIT License
