const FeishuChannel = require('./channels/feishu');
const WebUIChannel = require('./channels/webui');
const HealthChecker = require('./health');
const config = require('./config');

class MessageRouter {
  constructor() {
    this.feishu = new FeishuChannel();
    this.webui = new WebUIChannel();
    this.healthChecker = new HealthChecker();
  }

  async sendMessage(content, options = {}) {
    const { channel: preferredChannel } = options;

    if (preferredChannel) {
      return await this.sendToChannel(preferredChannel, content);
    }

    const health = await this.healthChecker.checkAll();
    const bestChannel = health.bestChannel;

    if (!bestChannel) {
      console.error('[Router] No available channels!');
      return { success: false, error: 'No available channels' };
    }

    console.log(`[Router] Using best channel: ${bestChannel}`);
    return await this.sendToChannel(bestChannel, content);
  }

  async sendToChannel(channelName, content) {
    let result;

    switch (channelName) {
      case 'feishu':
        result = await this.feishu.sendMessage(content);
        break;
      case 'webui':
        result = await this.webui.sendMessage(content);
        break;
      default:
        return { success: false, error: `Unknown channel: ${channelName}` };
    }

    if (!result.success && channelName !== 'feishu') {
      console.log(`[Router] ${channelName} failed, trying feishu as fallback...`);
      result = await this.feishu.sendMessage(content);
    }

    return result;
  }

  async sendToAll(content) {
    const results = [];

    for (const channelName of config.notification.priority) {
      const result = await this.sendToChannel(channelName, content);
      results.push({ channel: channelName, ...result });
    }

    const successCount = results.filter(r => r.success).length;
    return {
      success: successCount > 0,
      results,
      successCount,
      totalCount: results.length,
    };
  }
}

module.exports = MessageRouter;
