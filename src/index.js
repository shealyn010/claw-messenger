const HealthChecker = require('./health');
const MessageRouter = require('./router');

class OpenClawNotifier {
  constructor() {
    this.healthChecker = new HealthChecker();
    this.messageRouter = new MessageRouter();
  }

  async healthCheck() {
    return await this.healthChecker.checkAll();
  }

  async sendMessage(content, options = {}) {
    return await this.messageRouter.sendMessage(content, options);
  }

  async sendToAll(content) {
    return await this.messageRouter.sendToAll(content);
  }
}

let instance = null;

function getInstance() {
  if (!instance) {
    instance = new OpenClawNotifier();
  }
  return instance;
}

module.exports = {
  OpenClawNotifier,
  getInstance,
  sendMessage: (content, options) => getInstance().sendMessage(content, options),
  sendToAll: (content) => getInstance().sendToAll(content),
  healthCheck: () => getInstance().healthCheck(),
};

// 如果直接运行这个文件，做一个简单的测试
if (require.main === module) {
  (async () => {
    console.log('🧪 OpenClaw Notifier - Running self-test...');
    
    const notifier = getInstance();
    
    console.log('\n📊 Running health check...');
    const health = await notifier.healthCheck();
    console.log('Health check result:', health);
    
    console.log('\n✅ Self-test complete!');
    console.log('Best channel:', health.bestChannel);
  })();
}
