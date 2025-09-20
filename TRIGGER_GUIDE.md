# Trigger 管理指南

## 概述

Trigger 管理功能提供了完整的触发器管理交互模式，支持事件触发器、手动触发器、定时任务和 Webhook 的管理。

## 启动方式

### 1. 启动服务器

```bash
npm run server
```

### 2. 启动 REPL 客户端

```bash
npm run repl
```

### 3. 进入 Trigger 管理

```bash
slm> trigger
```

### 4. 一键演示

```bash
npm run trigger-demo
```

## Trigger 管理界面

进入 trigger 管理后会看到：

```
🎯 进入Trigger管理交互模式
输入 "help" 查看可用命令，输入 "exit" 退出

trigger>
```

## 可用命令

### 🎯 事件触发器

#### 创建事件监听器

```bash
trigger> event create user.login workflow-001 '{"priority": "high"}'
✅ 事件监听器创建成功:
{
  "id": 1703123456789,
  "type": "event",
  "eventName": "user.login",
  "workflowId": "workflow-001",
  "config": {"priority": "high"},
  "status": "created",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

#### 删除事件监听器

```bash
trigger> event delete 1703123456789
✅ 事件监听器删除成功:
{
  "success": true,
  "message": "事件监听器 1703123456789 已删除"
}
```

#### 更新事件监听器

```bash
trigger> event update 1703123456789 '{"priority": "low", "enabled": true}'
✅ 事件监听器更新成功:
{
  "id": 1703123456789,
  "priority": "low",
  "enabled": true,
  "updatedAt": "2024-01-01T10:05:00.000Z"
}
```

#### 获取事件监听器

```bash
trigger> event get 1703123456789
✅ 事件监听器信息:
{
  "id": 1703123456789,
  "type": "event",
  "status": "active",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

#### 列出所有事件监听器

```bash
trigger> event list
✅ 所有事件监听器:
{
  "events": [],
  "count": 0
}
```

#### 触发事件

```bash
trigger> event trigger user.login '{"userId": "123", "timestamp": "2024-01-01T10:00:00.000Z"}'
✅ 事件触发成功:
{
  "eventName": "user.login",
  "data": {"userId": "123", "timestamp": "2024-01-01T10:00:00.000Z"},
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### 📊 事件管理

#### 批量创建事件

```bash
trigger> events batch-create '[{"eventName": "user.logout", "workflowId": "workflow-002"}, {"eventName": "user.register", "workflowId": "workflow-003"}]'
✅ 批量创建事件成功:
{
  "success": true,
  "created": 2,
  "results": [...]
}
```

#### 批量删除事件

```bash
trigger> events batch-delete '[1703123456789, 1703123456790]'
✅ 批量删除事件成功:
{
  "success": true,
  "deleted": 2,
  "results": [...]
}
```

#### 切换事件状态

```bash
trigger> events toggle 1703123456789 true
✅ 事件状态切换成功:
{
  "id": 1703123456789,
  "enabled": true,
  "status": "active",
  "updatedAt": "2024-01-01T10:05:00.000Z"
}
```

#### 获取事件统计

```bash
trigger> events stats
✅ 事件统计信息:
{
  "total": 5,
  "active": 3,
  "disabled": 2,
  "byType": {},
  "lastUpdated": "2024-01-01T10:00:00.000Z"
}
```

#### 清理过期事件

```bash
trigger> events cleanup
✅ 过期事件清理完成:
{
  "success": true,
  "cleaned": 0,
  "message": "过期事件清理完成"
}
```

### 👆 手动触发器

#### 创建手动触发器

```bash
trigger> manual create workflow-002 '{"description": "Manual backup trigger"}'
✅ 手动触发器创建成功:
{
  "id": 1703123456789,
  "type": "manual",
  "workflowId": "workflow-002",
  "config": {"description": "Manual backup trigger"},
  "status": "created",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

#### 删除手动触发器

```bash
trigger> manual delete 1703123456789
✅ 手动触发器删除成功:
{
  "success": true,
  "message": "手动触发器 1703123456789 已删除"
}
```

#### 更新手动触发器

```bash
trigger> manual update 1703123456789 '{"description": "Updated manual trigger"}'
✅ 手动触发器更新成功:
{
  "id": 1703123456789,
  "description": "Updated manual trigger",
  "updatedAt": "2024-01-01T10:05:00.000Z"
}
```

#### 获取手动触发器

```bash
trigger> manual get 1703123456789
✅ 手动触发器信息:
{
  "id": 1703123456789,
  "type": "manual",
  "status": "active",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

#### 列出所有手动触发器

```bash
trigger> manual list
✅ 所有手动触发器:
{
  "triggers": [],
  "count": 0
}
```

#### 手动触发工作流

```bash
trigger> manual trigger workflow-002 '{"triggerType": "manual", "source": "demo"}'
✅ 工作流手动触发成功:
{
  "workflowId": "workflow-002",
  "triggerType": "manual",
  "data": {"triggerType": "manual", "source": "demo"},
  "executionId": 1703123456789,
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### ⏰ 定时任务

#### 创建定时任务

```bash
trigger> schedule create "0 0 * * *" workflow-003 '{"description": "Daily backup task"}'
✅ 定时任务创建成功:
{
  "id": 1703123456789,
  "type": "schedule",
  "cronExpression": "0 0 * * *",
  "workflowId": "workflow-003",
  "config": {"description": "Daily backup task"},
  "status": "created",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

#### 删除定时任务

```bash
trigger> schedule delete 1703123456789
✅ 定时任务删除成功:
{
  "success": true,
  "message": "定时任务 1703123456789 已删除"
}
```

#### 更新定时任务

```bash
trigger> schedule update 1703123456789 '{"cronExpression": "0 2 * * *", "description": "Updated daily backup"}'
✅ 定时任务更新成功:
{
  "id": 1703123456789,
  "cronExpression": "0 2 * * *",
  "description": "Updated daily backup",
  "updatedAt": "2024-01-01T10:05:00.000Z"
}
```

#### 获取定时任务

```bash
trigger> schedule get 1703123456789
✅ 定时任务信息:
{
  "id": 1703123456789,
  "type": "schedule",
  "status": "active",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

#### 列出所有定时任务

```bash
trigger> schedule list
✅ 所有定时任务:
{
  "schedules": [],
  "count": 0
}
```

#### 验证 Cron 表达式

```bash
trigger> schedule validate "0 0 * * *"
✅ Cron表达式验证结果:
{
  "valid": true,
  "expression": "0 0 * * *"
}
```

### 🌐 Webhook

#### 创建 Webhook

```bash
trigger> webhook create workflow-004 '{"description": "GitHub webhook", "secret": "webhook-secret-123"}'
✅ Webhook创建成功:
{
  "id": 1703123456789,
  "type": "webhook",
  "workflowId": "workflow-004",
  "config": {"description": "GitHub webhook", "secret": "webhook-secret-123"},
  "url": "/api/webhook/workflow-004",
  "status": "created",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

#### 删除 Webhook

```bash
trigger> webhook delete 1703123456789
✅ Webhook删除成功:
{
  "success": true,
  "message": "Webhook 1703123456789 已删除"
}
```

#### 更新 Webhook

```bash
trigger> webhook update 1703123456789 '{"description": "Updated GitHub webhook"}'
✅ Webhook更新成功:
{
  "id": 1703123456789,
  "description": "Updated GitHub webhook",
  "updatedAt": "2024-01-01T10:05:00.000Z"
}
```

#### 获取 Webhook

```bash
trigger> webhook get 1703123456789
✅ Webhook信息:
{
  "id": 1703123456789,
  "type": "webhook",
  "status": "active",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

#### 列出所有 Webhook

```bash
trigger> webhook list
✅ 所有Webhook:
{
  "webhooks": [],
  "count": 0
}
```

#### 调用 Webhook

```bash
trigger> webhook call workflow-004 '{"event": "push", "repository": "my-repo", "commits": [{"message": "Update README"}]}'
✅ Webhook调用成功:
{
  "workflowId": "workflow-004",
  "payload": {"event": "push", "repository": "my-repo", "commits": [{"message": "Update README"}]},
  "taskId": 1703123456789,
  "status": "accepted",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### 🛠️ 通用命令

#### 列出所有触发器类型

```bash
trigger> list
📋 所有触发器类型:
  - event: 事件触发器
  - manual: 手动触发器
  - schedule: 定时任务触发器
  - webhook: Webhook触发器

使用 "help" 查看详细命令
```

#### 获取系统状态

```bash
trigger> status
📊 系统状态:
  初始化状态: ✅ 已初始化
  触发器组件: ✅ 可用
```

#### 显示帮助

```bash
trigger> help
📖 Trigger管理命令:

🎯 事件触发器:
  event create <eventName> <workflowId> [config]  - 创建事件监听器
  event delete <eventId>                        - 删除事件监听器
  event update <eventId> <updates>              - 更新事件监听器
  event get <eventId>                           - 获取事件监听器
  event list                                    - 列出所有事件监听器
  event trigger <eventName> [data]              - 触发事件

📊 事件管理:
  events batch-create <eventsJson>              - 批量创建事件
  events batch-delete <eventIdsJson>            - 批量删除事件
  events toggle <eventId> <enabled>             - 切换事件状态
  events stats                                  - 获取事件统计
  events cleanup                                - 清理过期事件

👆 手动触发器:
  manual create <workflowId> [config]           - 创建手动触发器
  manual delete <triggerId>                     - 删除手动触发器
  manual update <triggerId> <updates>           - 更新手动触发器
  manual get <triggerId>                        - 获取手动触发器
  manual list                                   - 列出所有手动触发器
  manual trigger <workflowId> [data]            - 手动触发工作流

⏰ 定时任务:
  schedule create <cron> <workflowId> [config]  - 创建定时任务
  schedule delete <scheduleId>                  - 删除定时任务
  schedule update <scheduleId> <updates>        - 更新定时任务
  schedule get <scheduleId>                     - 获取定时任务
  schedule list                                 - 列出所有定时任务
  schedule validate <cronExpression>            - 验证Cron表达式

🌐 Webhook:
  webhook create <workflowId> [config]          - 创建Webhook
  webhook delete <webhookId>                    - 删除Webhook
  webhook update <webhookId> <updates>          - 更新Webhook
  webhook get <webhookId>                       - 获取Webhook
  webhook list                                  - 列出所有Webhook
  webhook call <workflowId> [payload]           - 调用Webhook

🛠️ 通用命令:
  list                                          - 列出所有触发器类型
  status                                        - 获取系统状态
  help                                          - 显示帮助
  clear                                         - 清屏
  exit/quit                                     - 退出

💡 提示:
  - 所有JSON参数需要用引号包围
  - 例如: '{"key": "value"}'
  - 布尔值使用 "true" 或 "false"
```

#### 清屏

```bash
trigger> clear
```

#### 退出

```bash
trigger> exit
👋 退出Trigger管理
```

## 使用技巧

### 1. JSON 参数格式

- 所有 JSON 参数需要用引号包围
- 例如：`'{"key": "value"}'`
- 布尔值使用 `"true"` 或 `"false"`

### 2. Cron 表达式

- 标准 5 位格式：`分 时 日 月 周`
- 例如：`"0 0 * * *"` 表示每天午夜执行
- 使用 `schedule validate` 验证表达式

### 3. 批量操作

- 支持批量创建和删除事件
- JSON 数组格式：`'[{"key": "value"}, {"key2": "value2"}]'`

### 4. 状态管理

- 使用 `events toggle` 启用/禁用事件
- 使用 `events stats` 查看统计信息
- 使用 `events cleanup` 清理过期事件

## 故障排除

### 连接失败

- 确保服务器已启动：`npm run server`
- 检查端口是否被占用：`lsof -i :8081`

### 命令错误

- 检查 JSON 格式是否正确
- 确保参数数量正确
- 使用 `help` 查看正确用法

### 触发器不工作

- 检查触发器状态：`event get <id>`
- 查看系统状态：`status`
- 验证工作流 ID 是否正确

## 示例工作流

### 1. 创建完整的事件驱动系统

```bash
# 1. 创建事件监听器
trigger> event create user.login workflow-auth '{"priority": "high"}'

# 2. 创建定时备份任务
trigger> schedule create "0 2 * * *" workflow-backup '{"description": "Daily backup"}'

# 3. 创建 Webhook 接收器
trigger> webhook create workflow-ci '{"description": "CI/CD webhook"}'

# 4. 查看所有触发器
trigger> list
```

### 2. 批量管理事件

```bash
# 1. 批量创建事件
trigger> events batch-create '[{"eventName": "user.logout", "workflowId": "workflow-002"}, {"eventName": "user.register", "workflowId": "workflow-003"}]'

# 2. 查看事件统计
trigger> events stats

# 3. 批量删除事件
trigger> events batch-delete '[1703123456789, 1703123456790]'
```

Trigger 管理功能提供了强大而灵活的触发器管理能力，支持各种类型的触发器创建、管理和监控。
