# REPL CLI 使用指南

## 概述

REPL CLI 是一个交互式命令行界面，连接后进入 REPL（Read-Eval-Print Loop）模式，允许用户交互式地发送命令与服务器进行交互。

## 启动方式

### 1. 启动服务器

```bash
npm run server
```

### 2. 启动 REPL 客户端

```bash
npm run repl
```

### 3. 一键测试（推荐）

```bash
npm run test:repl
```

## REPL 界面

启动后会看到类似以下的界面：

```
🚀 启动REPL CLI客户端...
🔄 智能连接到RPC服务器...
  尝试连接 (1/10)...
✅ 连接到RPC服务器成功
✅ CLI客户端启动成功!

📊 系统状态:
- 连接状态: ✅ 已连接
- 服务器状态: ✅ 已初始化
- 文件服务数量: 3
- 核心组件数量: 6

🗂️ 可用文件服务:
  - local (LocalFS)
  - git (GitFS)
  - memory (FS)

🔧 可用核心组件:
  - container
  - persistence
  - script
  - trigger
  - workflow
  - cli

🌐 连接信息:
  - 服务器地址: localhost:8081
  - 连接状态: ✅ 已连接

🎯 进入REPL模式
输入 "help" 查看可用命令，输入 "exit" 退出

slm>
```

## 可用命令

### 📁 文件操作

#### 创建文件

```bash
slm> create test.txt "Hello World"
✅ 文件创建成功: test.txt

slm> create data.json '{"name": "test"}' memory
✅ 文件创建成功: data.json
```

#### 读取文件

```bash
slm> read test.txt
✅ 文件内容 (test.txt):
Hello World

slm> read data.json memory
✅ 文件内容 (data.json):
{"name": "test"}
```

#### 更新文件

```bash
slm> update test.txt "Updated content"
✅ 文件更新成功: test.txt
```

#### 删除文件

```bash
slm> delete test.txt
✅ 文件删除成功: test.txt
```

#### 检查文件存在

```bash
slm> exists test.txt
📁 文件 存在: test.txt

slm> exists nonexistent.txt
📁 文件 不存在: nonexistent.txt
```

#### 列出文件

```bash
slm> list
📁 文件列表 (local):
  - test.txt
  - data.json

slm> list memory
📁 文件列表 (memory):
  - temp.txt
```

#### 获取文件信息

```bash
slm> info test.txt
📄 文件信息 (test.txt):
  大小: 12 字节
  创建时间: 2024-01-01T10:00:00.000Z
  修改时间: 2024-01-01T10:05:00.000Z
```

#### 获取文件系统统计

```bash
slm> stats
📊 文件系统统计 (local):
  文件数量: 5
  总大小: 1024 字节
  平均大小: 204.80 字节
```

### 🐳 容器操作

#### 列出容器

```bash
slm> container list
🐳 容器列表:
  - container1: running
  - container2: stopped
```

#### 启动容器

```bash
slm> container start container1
✅ 容器启动成功: container1
```

#### 停止容器

```bash
slm> container stop container1
✅ 容器停止成功: container1
```

### 📜 脚本操作

#### 列出脚本

```bash
slm> script list
📜 脚本列表:
  - hello.sh: ready
  - backup.sh: running
```

#### 执行脚本

```bash
slm> script execute hello.sh
✅ 脚本执行完成: hello.sh
结果: {"status": "success", "output": "Hello World"}
```

### 📊 系统状态

#### 获取系统状态

```bash
slm> status
📊 系统状态:
  初始化状态: ✅ 已初始化
  文件服务数量: 3
  核心组件数量: 6
```

#### 获取服务器信息

```bash
slm> info
🌐 服务器信息:
  服务器状态: ✅ 已初始化
  文件系统: local, git, memory
  核心组件: container, persistence, script, trigger, workflow, cli
  连接地址: localhost:8081
```

### 🛠️ 工具命令

#### 显示帮助

```bash
slm> help
📖 可用命令:

📁 文件操作:
  create <path> <data> [fsName]  - 创建文件
  read <path> [fsName]          - 读取文件
  update <path> <data> [fsName] - 更新文件
  delete <path> [fsName]        - 删除文件
  exists <path> [fsName]        - 检查文件存在
  list [fsName]                 - 列出文件
  info <path> [fsName]          - 获取文件信息
  stats [fsName]                - 获取文件系统统计

🐳 容器操作:
  container list                - 列出容器
  container start <id>          - 启动容器
  container stop <id>           - 停止容器

📜 脚本操作:
  script list                   - 列出脚本
  script execute <path> [args]  - 执行脚本

📊 系统状态:
  status                        - 获取系统状态
  info                          - 获取服务器信息

🛠️ 工具命令:
  help                          - 显示帮助
  clear                         - 清屏
  exit/quit                     - 退出

💡 提示: 所有文件操作默认使用 "local" 文件系统
```

#### 清屏

```bash
slm> clear
```

#### 退出

```bash
slm> exit
👋 正在退出...
```

或者使用 `quit` 命令：

```bash
slm> quit
👋 正在退出...
```

## 使用技巧

### 1. 文件系统选择

- 默认使用 `local` 文件系统
- 可以指定其他文件系统：`local`、`git`、`memory`
- 例如：`create test.txt "data" memory`

### 2. 命令补全

- 支持 Tab 键补全（如果终端支持）
- 输入部分命令后按 Tab 查看可用选项

### 3. 历史记录

- 支持上下箭头键浏览命令历史
- 支持 Ctrl+R 搜索历史命令

### 4. 多行输入

- 支持多行输入（如果命令未完成）
- 使用反斜杠 `\` 继续下一行

### 5. 错误处理

- 所有命令都有详细的错误信息
- 输入 `help` 查看正确的命令格式

## 示例会话

```bash
slm> help
📖 可用命令:
...

slm> create hello.txt "Hello, REPL!"
✅ 文件创建成功: hello.txt

slm> read hello.txt
✅ 文件内容 (hello.txt):
Hello, REPL!

slm> list
📁 文件列表 (local):
  - hello.txt

slm> status
📊 系统状态:
  初始化状态: ✅ 已初始化
  文件服务数量: 3
  核心组件数量: 6

slm> exit
👋 正在退出...
```

## 故障排除

### 连接失败

- 确保服务器已启动：`npm run server`
- 检查端口是否被占用：`lsof -i :8081`
- 使用 `npm run clean` 清理进程

### 命令不识别

- 输入 `help` 查看可用命令
- 检查命令拼写和参数数量
- 确保使用正确的文件系统名称

### 文件操作失败

- 检查文件路径是否正确
- 确保有足够的权限
- 检查文件系统是否可用

## 开发模式

使用 nodemon 进行开发：

```bash
# 终端1：开发模式服务器
npm run dev:server

# 终端2：REPL客户端
npm run repl
```

这样可以在开发时自动重启服务器，同时保持 REPL 连接。
