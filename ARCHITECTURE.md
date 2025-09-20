# 系统架构 - 约定式规则

## 概述

本项目采用约定式规则架构，通过全局 Core 对象提供统一的系统访问入口。这种设计实现了高度的解耦和模块化，让各个组件可以专注于自己的职责，而不需要关心具体的实现细节。

## 核心设计原则

### 1. 统一访问入口

- 所有服务和组件都通过全局`Core`对象访问
- 提供一致的 API 接口，简化使用方式
- 支持便捷的 getter 方法快速访问常用服务

### 2. 自动注册机制

- `infra`下的文件系统实现自动注册到`core`
- 核心组件自动注册到全局 Core
- 支持自定义服务注册

### 3. 解耦设计

- `core`下的概念只依赖注册的文件服务接口
- 不关心具体的实现细节
- 支持运行时切换不同的实现

## 架构组件

### Core API (`src/core/api/index.js`)

提供文件服务和组件的注册、管理功能：

- `registerFS(name, fsInstance, config)` - 注册文件服务
- `getFS(name)` - 获取文件服务
- `registerComponent(name, component)` - 注册核心组件
- `getComponent(name)` - 获取核心组件
- `initialize()` - 初始化所有服务
- `destroy()` - 销毁所有服务

### FS Registry (`src/core/fs_registry.js`)

文件服务注册器，自动注册 infra 下的各种文件系统：

- 本地文件系统 (LocalFS)
- Git 文件系统 (GitFS)
- 内存文件系统 (FS)
- 支持自定义文件服务注册

### Global Core (`src/core/global_core.js`)

全局 Core 对象，系统的统一入口点：

- 集成所有核心功能
- 提供便捷的访问方法
- 管理整个系统的生命周期

## 使用方式

### 基本使用

```javascript
import { Core } from "./src/core/index.js";

// 初始化全局Core
await Core.initialize();

// 访问文件服务
const localFS = Core.getFS("local");
const gitFS = Core.getFS("git");
const memoryFS = Core.getFS("memory");

// 访问核心组件
const container = Core.container;
const persistence = Core.persistence;
const script = Core.script;
const trigger = Core.trigger;
const workflow = Core.workflow;
const cli = Core.cli;

// 获取系统状态
const status = Core.getStatus();

// 销毁系统
await Core.destroy();
```

### 便捷访问

```javascript
// 文件服务便捷访问
const localFS = Core.localFS;
const gitFS = Core.gitFS;
const memoryFS = Core.memoryFS;

// 组件便捷访问
const container = Core.container;
const persistence = Core.persistence;
// ... 其他组件
```

### 自定义文件服务注册

```javascript
import { Core } from "./src/core/index.js";

// 创建自定义文件服务
class CustomFS extends FS {
  // 自定义实现
}

// 注册自定义服务
const customFS = new CustomFS(config);
Core.registerFS("custom", customFS, config);

// 使用自定义服务
const fs = Core.getFS("custom");
```

## 文件系统实现

### 本地文件系统 (LocalFS)

- 基于 Node.js fs 模块
- 支持自动目录创建
- 同步内存和磁盘数据

### Git 文件系统 (GitFS)

- 继承基础 FS 功能
- 集成 Git 版本控制
- 支持自动提交和分支管理

### 内存文件系统 (FS)

- 纯内存存储
- 适合临时数据
- 高性能读写

## CLI 集成

CLI 服务器使用新的约定式规则：

```javascript
import { Core } from "../core/index.js";

class CLIServer {
  constructor() {
    this.core = Core;
  }

  async start() {
    // 初始化全局Core
    await this.core.initialize();

    // 访问各种服务
    const localFS = this.core.localFS;
    const container = this.core.container;
    // ...
  }
}
```

## 优势

1. **统一管理**: 所有服务和组件由全局 Core 统一管理
2. **自动注册**: infra 下的文件系统自动注册，无需手动配置
3. **解耦设计**: 组件只依赖接口，不关心具体实现
4. **便捷访问**: 提供 getter 方法快速访问常用服务
5. **灵活扩展**: 支持自定义服务注册和配置
6. **生命周期管理**: 统一的初始化和销毁流程

## 约定式规则

1. **文件服务约定**: infra 下的所有文件系统实现都会自动注册到 core
2. **组件约定**: core 下的所有组件都会自动注册到全局 Core
3. **接口约定**: 所有文件服务都实现统一的 FS 接口
4. **命名约定**: 服务名称使用小写，组件名称使用小写
5. **配置约定**: 所有服务都支持配置对象初始化

这种约定式规则让系统更加简洁、可维护，同时保持了高度的灵活性和扩展性。
