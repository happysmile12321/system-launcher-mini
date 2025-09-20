# 自动补全功能使用指南

## 概述

REPL 和 Trigger 管理器现在支持 Tab 自动补全功能，可以大大提高命令输入的效率和准确性。

## 🚀 功能特性

### 1. 智能命令补全

- 支持部分匹配补全
- 支持上下文感知补全
- 支持多级参数补全
- 支持历史命令补全

### 2. 分层补全系统

- **主 REPL**: 基础命令和参数补全
- **Trigger 管理**: 专门的触发器命令补全

## 📋 REPL 自动补全

### 命令补全

```bash
slm> c<Tab>        # 补全为: create, clear
slm> tr<Tab>       # 补全为: trigger
slm> h<Tab>        # 补全为: help
slm> s<Tab>        # 补全为: status, script, stats
```

### 文件操作参数补全

```bash
# 文件路径补全
slm> create <Tab>  # 显示: test.txt, data.json, config.yaml, README.md
slm> read <Tab>    # 显示: test.txt, data.json, config.yaml, README.md
slm> update <Tab>  # 显示: test.txt, data.json, config.yaml, README.md
slm> delete <Tab>  # 显示: test.txt, data.json, config.yaml, README.md
slm> exists <Tab>  # 显示: test.txt, data.json, config.yaml, README.md
slm> info <Tab>    # 显示: test.txt, data.json, config.yaml, README.md

# 文件系统名称补全
slm> list <Tab>    # 显示: local, git, memory
slm> stats <Tab>   # 显示: local, git, memory
slm> create test.txt "data" <Tab>  # 显示: local, git, memory
```

### 容器操作参数补全

```bash
# 容器操作补全
slm> container <Tab>  # 显示: list, start, stop, remove

# 容器ID补全
slm> container start <Tab>  # 显示: container-1, container-2, container-3
slm> container stop <Tab>   # 显示: container-1, container-2, container-3
slm> container remove <Tab> # 显示: container-1, container-2, container-3
```

### 脚本操作参数补全

```bash
# 脚本操作补全
slm> script <Tab>  # 显示: list, execute

# 脚本文件补全
slm> script execute <Tab>  # 显示: hello.sh, backup.sh, deploy.sh
```

## 🎯 Trigger 管理自动补全

### 事件触发器补全

```bash
# 事件操作补全
trigger> event <Tab>  # 显示: create, delete, update, get, list, trigger

# 事件名称补全
trigger> event create <Tab>  # 显示: user.login, user.logout, user.register, system.start, system.stop
trigger> event trigger <Tab> # 显示: user.login, user.logout, user.register, system.start, system.stop

# 事件ID补全
trigger> event delete <Tab>  # 显示: 1703123456789, 1703123456790, 1703123456791
trigger> event update <Tab>  # 显示: 1703123456789, 1703123456790, 1703123456791
trigger> event get <Tab>     # 显示: 1703123456789, 1703123456790, 1703123456791
```

### 事件管理补全

```bash
# 事件管理操作补全
trigger> events <Tab>  # 显示: batch-create, batch-delete, toggle, stats, cleanup

# 事件ID补全
trigger> events toggle <Tab>  # 显示: 1703123456789, 1703123456790

# 布尔值补全
trigger> events toggle 1703123456789 <Tab>  # 显示: true, false
```

### 手动触发器补全

```bash
# 手动触发器操作补全
trigger> manual <Tab>  # 显示: create, delete, update, get, list, trigger

# 工作流ID补全
trigger> manual create <Tab>  # 显示: workflow-001, workflow-002, workflow-003
trigger> manual trigger <Tab> # 显示: workflow-001, workflow-002, workflow-003

# 触发器ID补全
trigger> manual delete <Tab>  # 显示: 1703123456789, 1703123456790, 1703123456791
trigger> manual update <Tab>  # 显示: 1703123456789, 1703123456790, 1703123456791
trigger> manual get <Tab>     # 显示: 1703123456789, 1703123456790, 1703123456791
```

### 定时任务补全

```bash
# 定时任务操作补全
trigger> schedule <Tab>  # 显示: create, delete, update, get, list, validate

# Cron表达式补全
trigger> schedule create <Tab>  # 显示: "0 0 * * *", "0 */6 * * *", "*/15 * * * *", "0 2 * * 1"
trigger> schedule validate <Tab> # 显示: "0 0 * * *", "0 */6 * * *", "*/15 * * * *"

# 定时任务ID补全
trigger> schedule delete <Tab>  # 显示: 1703123456789, 1703123456790, 1703123456791
trigger> schedule update <Tab>  # 显示: 1703123456789, 1703123456790, 1703123456791
trigger> schedule get <Tab>     # 显示: 1703123456789, 1703123456790, 1703123456791
```

### Webhook 补全

```bash
# Webhook操作补全
trigger> webhook <Tab>  # 显示: create, delete, update, get, list, call

# 工作流ID补全
trigger> webhook create <Tab>  # 显示: workflow-001, workflow-002, workflow-003
trigger> webhook call <Tab>    # 显示: workflow-001, workflow-002, workflow-003

# Webhook ID补全
trigger> webhook delete <Tab>  # 显示: 1703123456789, 1703123456790, 1703123456791
trigger> webhook update <Tab>  # 显示: 1703123456789, 1703123456790, 1703123456791
trigger> webhook get <Tab>     # 显示: 1703123456789, 1703123456790, 1703123456791
```

## 🎮 使用技巧

### 1. 基本操作

- **Tab 键**: 触发自动补全
- **部分输入**: 输入命令或参数的前几个字符，按 Tab 补全
- **多次 Tab**: 如果有多个匹配项，多次按 Tab 可以循环显示

### 2. 上下文感知

- 自动补全会根据当前命令和参数位置提供相应的补全选项
- 例如：`event create` 后按 Tab 会显示事件名称，而不是其他参数

### 3. 智能匹配

- 支持部分匹配，输入 `c` 按 Tab 会显示所有以 `c` 开头的命令
- 支持大小写不敏感匹配

### 4. 多级补全

- 支持多级参数补全，每个参数位置都有相应的补全选项
- 例如：`container start` 后按 Tab 会显示容器 ID 选项

## 🔧 技术实现

### 1. REPL 补全

- 使用 `readline.createInterface` 的 `completer` 选项
- 实现 `completer` 函数提供补全逻辑
- 支持命令和参数的智能补全

### 2. Trigger 管理补全

- 独立的补全系统，专门为触发器命令设计
- 支持复杂的多级参数补全
- 上下文感知的补全逻辑

### 3. 补全数据结构

```javascript
// 补全函数返回格式
[completions, current];
// completions: 匹配的补全选项数组
// current: 当前输入的字符串
```

## 📈 性能优化

### 1. 缓存机制

- 命令列表缓存，避免重复计算
- 参数选项缓存，提高响应速度

### 2. 智能过滤

- 只显示匹配的选项，减少显示内容
- 支持部分匹配，提高用户体验

### 3. 内存优化

- 按需加载补全选项
- 避免存储大量不必要的数据

## 🎯 使用场景

### 1. 快速命令输入

- 减少打字错误
- 提高输入效率
- 快速发现可用命令

### 2. 参数提示

- 了解可用的参数选项
- 避免参数错误
- 学习命令用法

### 3. 探索功能

- 通过补全发现新功能
- 了解系统能力
- 提高使用效率

## 🚨 注意事项

### 1. 终端兼容性

- 需要支持 Tab 补全的终端
- 某些终端可能需要特殊配置

### 2. 输入模式

- 确保在正确的输入模式下使用
- 避免在特殊字符输入时使用

### 3. 补全限制

- 补全选项基于预定义的数据
- 动态数据可能需要手动输入

## 🎉 优势

1. **提高效率**: 减少手动输入，提高操作速度
2. **减少错误**: 避免输入错误，提高准确性
3. **学习辅助**: 通过补全了解可用选项
4. **用户体验**: 提供现代化的命令行体验
5. **智能提示**: 上下文感知的智能补全

自动补全功能让 REPL 和 Trigger 管理更加高效和用户友好！
