require('dotenv').config();

module.exports = {
  openclaw: {
    url: process.env.OPENCLAW_URL || 'http://localhost:18789',
    token: process.env.OPENCLAW_TOKEN || '',
  },
  feishu: {
    appId: process.env.FEISHU_APP_ID || '',
    appSecret: process.env.FEISHU_APP_SECRET || '',
    chatId: process.env.FEISHU_CHAT_ID || '',
  },
  notification: {
    priority: (process.env.NOTIFY_PRIORITY || 'feishu,webui').split(','),
    retryAttempts: 3,
    retryDelay: 1000,
  },
};
