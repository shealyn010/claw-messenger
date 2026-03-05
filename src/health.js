const FeishuChannel = require('./channels/feishu');
const WebUIChannel = require('./channels/webui');
const config = require('./config');

class HealthChecker {
  constructor() {
    this.feishu = new FeishuChannel();
    this.webui = new WebUIChannel();
  }

  async checkAll() {
    const results = {
      feishu: await this.feishu.healthCheck(),
      webui: await this.webui.healthCheck(),
      timestamp: new Date().toISOString(),
    };

    results.bestChannel = this.getBestChannel(results);
    return results;
  }

  getBestChannel(results) {
    for (const channelName of config.notification.priority) {
      const result = results[channelName];
      if (result && result.status === 'ok') {
        return channelName;
      }
    }
    return null;
  }

  async checkChannel(channelName) {
    switch (channelName) {
      case 'feishu':
        return await this.feishu.healthCheck();
      case 'webui':
        return await this.webui.healthCheck();
      default:
        return { status: 'error', channel: channelName, error: 'Unknown channel' };
    }
  }
}

module.exports = HealthChecker;
