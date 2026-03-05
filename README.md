# OpenClaw 多渠道通知系统

## 🎯 解决的痛点

- OpenClaw Web UI 经常挂掉
- Token错误导致无法使用
- 聊天界面空白
- 缺乏备用通信渠道

## ✨ 功能特性

- ✅ **多渠道通知** - 飞书 + Web UI 双保险
- ✅ **健康检查** - 自动监控OpenClaw状态
- ✅ **自动重试** - Web UI失败自动切换到飞书
- ✅ **消息同步** - 两边消息保持同步
- ✅ **配置管理** - 简单的配置文件

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置

复制 `.env.example` 为 `.env` 并填写配置：

```env
# OpenClaw配置
OPENCLAW_URL=http://localhost:18789
OPENCLAW_TOKEN=your_token_here

# 飞书配置
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
FEISHU_CHAT_ID=your_chat_id

# 通知配置
NOTIFY_PRIORITY=feishu,webui
```

### 3. 运行

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 📖 使用说明

### 发送消息

```javascript
const { sendMessage } = require('./src');

// 自动选择最佳渠道发送
await sendMessage('你好，世界！');

// 指定渠道发送
await sendMessage('飞书消息', { channel: 'feishu' });
await sendMessage('Web UI消息', { channel: 'webui' });
```

### 健康检查

```javascript
const { healthCheck } = require('./src');

// 检查OpenClaw状态
const status = await healthCheck();
console.log(status);
// { webui: 'ok', feishu: 'ok', bestChannel: 'feishu' }
```

## 🏗️ 架构

```
openclaw-notifier/
├── src/
│   ├── index.js           # 主入口
│   ├── channels/          # 通知渠道
│   │   ├── feishu.js    # 飞书渠道
│   │   └── webui.js     # Web UI渠道
│   ├── health.js         # 健康检查
│   ├── router.js         # 消息路由
│   └── config.js         # 配置管理
├── test/                 # 测试
├── .env.example         # 配置示例
└── package.json
```

## 📊 渠道优先级

默认优先级：`feishu > webui`

- 总是优先使用第一个可用的渠道
- 渠道失败自动降级到下一个
- 所有渠道都失败时记录错误

## 💰 为什么这个能赚钱？

1. **解决真实痛点** - OpenClaw用户确实遇到这些问题
2. **可以开源** - 放到GitHub获得Star
3. **可以打赏** - 添加Buy Me a Coffee链接
4. **可以扩展** - 后续可以支持更多平台（企业微信、钉钉、Slack等）

## 📝 后续计划

- [ ] 支持企业微信
- [ ] 支持钉钉
- [ ] 支持Slack
- [ ] 支持Telegram
- [ ] Web管理界面
- [ ] Docker部署

## 📄 License

MIT
