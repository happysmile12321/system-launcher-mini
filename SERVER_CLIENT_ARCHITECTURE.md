# Server-Client 架构文档

## 概述

本项目现在采用分层架构，包含以下层次：

1. **Core 层**: 核心业务逻辑和约定式规则
2. **Server 层**: RPC 服务器，暴露 Core 功能
3. **Client 层**: RPC 客户端，与 Server 交互
4. **CLI 层**: 命令行界面，作为 Client 的封装

## 架构层次

```
┌─────────────────┐
│   CLI Client    │  ← 命令行界面
├─────────────────┤
│   Client API    │  ← RPC客户端封装
├─────────────────┤
│   RPC Client    │  ← HTTP RPC通信
├─────────────────┤
│   RPC Server    │  ← HTTP RPC服务
├─────────────────┤
│   Server API    │  ← RPC接口定义
├─────────────────┤
│   Global Core   │  ← 核心业务逻辑
├─────────────────┤
│   File Systems  │  ← 文件服务实现
└─────────────────┘
```

## 核心组件

### 1. Server 层 (`src/server/`)

#### Server (`src/server/index.js`)

- 管理 RPC 服务器和 Core 实例
- 提供服务器生命周期管理
- 配置 RPC 端口和主机

#### RPC Server (`src/server/rpc_server.js`)

- 基于 HTTP 的 RPC 服务器实现
- 支持 JSON-RPC 2.0 协议
- 处理 CORS 和错误处理

#### Server API (`src/server/server_api/index.js`)

- 定义 RPC 接口规范
- 将 Core 功能暴露为 RPC 方法
- 支持 30+个 RPC 方法

### 2. Client 层 (`src/client/`)

#### RPC Client (`src/client/rpc_client.js`)

- HTTP RPC 客户端实现
- 支持连接管理和错误处理
- 实现 JSON-RPC 2.0 协议

#### Client API (`src/client/client_api.js`)

- 高级 RPC 调用接口
- 提供便捷的方法封装
- 支持批量操作

### 3. CLI 层 (`src/cli/`)

#### CLI Client (`src/cli/index.js`)

- 命令行界面客户端
- 封装 Client API
- 提供用户友好的交互

## RPC 接口规范

### 文件服务接口

```javascript
// 文件操作
fs.create({ path, data, fsName }); // 创建文件
fs.read({ path, fsName }); // 读取文件
fs.update({ path, data, fsName }); // 更新文件
fs.delete({ path, fsName }); // 删除文件
fs.exists({ path, fsName }); // 检查文件存在
fs.list({ fsName }); // 列出文件
fs.getInfo({ path, fsName }); // 获取文件信息
fs.stats({ fsName }); // 获取统计信息
```

### 容器组件接口

```javascript
// 容器管理
container.create(config); // 创建容器
container.start({ containerId }); // 启动容器
container.stop({ containerId }); // 停止容器
container.remove({ containerId }); // 删除容器
container.list(); // 列出容器
```

### 脚本组件接口

```javascript
// 脚本管理
script.execute({ scriptPath, args }); // 执行脚本
script.list(); // 列出脚本
script.getStatus({ scriptId }); // 获取脚本状态
```

### 触发器组件接口

```javascript
// 触发器管理
trigger.create(config); // 创建触发器
trigger.start({ triggerId }); // 启动触发器
trigger.stop({ triggerId }); // 停止触发器
trigger.list(); // 列出触发器
```

### 工作流组件接口

```javascript
// 工作流管理
workflow.create(config); // 创建工作流
workflow.start({ workflowId }); // 启动工作流
workflow.stop({ workflowId }); // 停止工作流
workflow.list(); // 列出工作流
```

### 持久化组件接口

```javascript
// 数据持久化
persistence.save({ key, data }); // 保存数据
persistence.load({ key }); // 加载数据
persistence.delete({ key }); // 删除数据
```

### 系统状态接口

```javascript
// 系统信息
system.getStatus(); // 获取系统状态
system.getFSList(); // 获取文件系统列表
system.getComponents(); // 获取组件列表
```

## 使用方式

### 启动 Server

```bash
# 启动RPC服务器
node src/server/start_server.js
```

### 使用 CLI 客户端

```bash
# 启动CLI客户端
node src/cli/index.js
```

### 编程方式使用

```javascript
import { ClientAPI } from "./src/client/client_api.js";

// 创建客户端
const client = new ClientAPI({
  host: "localhost",
  port: 8081,
});

// 连接到服务器
await client.connect();

// 使用RPC调用
const result = await client.createFile("/test.txt", "Hello World", "local");
const content = await client.readFile("/test.txt", "local");

// 断开连接
client.disconnect();
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

## 优势

1. **分层架构**: 清晰的职责分离，易于维护和扩展
2. **RPC 通信**: 标准化的远程过程调用，支持跨网络部署
3. **协议标准**: 基于 JSON-RPC 2.0，兼容性好
4. **解耦设计**: Client 和 Server 可以独立部署和扩展
5. **便捷接口**: 提供高级 API 封装，简化使用
6. **批量操作**: 支持批量 RPC 调用，提高效率

## 部署场景

### 单机部署

- Server 和 Client 在同一台机器上运行
- 通过 localhost 进行通信

### 分布式部署

- Server 部署在服务器上
- 多个 Client 可以连接到同一个 Server
- 支持负载均衡和集群部署

### 微服务架构

- 每个 Core 组件可以作为独立的微服务
- 通过 RPC 进行服务间通信
- 支持服务发现和注册

## 扩展性

1. **新增 RPC 方法**: 在 ServerAPI 中注册新方法
2. **自定义协议**: 可以替换 HTTP 为其他协议（如 WebSocket、gRPC）
3. **负载均衡**: 支持多个 Server 实例
4. **认证授权**: 可以添加 JWT 或其他认证机制
5. **监控日志**: 可以集成监控和日志系统

这种架构提供了高度的灵活性和可扩展性，同时保持了代码的清晰和可维护性。
