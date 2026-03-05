const axios = require('axios');
const config = require('../config');

class WebUIChannel {
  constructor() {
    this.url = config.openclaw.url;
    this.token = config.openclaw.token;
  }

  async sendMessage(content) {
    try {
      // 这里需要根据OpenClaw的实际API来实现
      // 暂时返回一个模拟的成功响应
      console.log('[WebUI] Would send message:', content);
      console.log('[WebUI] Note: WebUI channel implementation depends on OpenClaw API');
      return { success: true, note: 'WebUI channel not fully implemented yet' };
    } catch (error) {
      console.error('[WebUI] Send message error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.url}/status`, {
        timeout: 5000,
      });
      return { status: 'ok', channel: 'webui' };
    } catch (error) {
      console.error('[WebUI] Health check failed:', error.message);
      return { status: 'error', channel: 'webui', error: error.message };
    }
  }
}

module.exports = WebUIChannel;
