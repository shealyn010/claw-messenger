const axios = require('axios');
const config = require('../config');

class FeishuChannel {
  constructor() {
    this.appId = config.feishu.appId;
    this.appSecret = config.feishu.appSecret;
    this.chatId = config.feishu.chatId;
    this.tenantAccessToken = null;
    this.tokenExpireTime = 0;
  }

  async ensureToken() {
    const now = Date.now();
    if (!this.tenantAccessToken || now >= this.tokenExpireTime - 60000) {
      await this.refreshToken();
    }
  }

  async refreshToken() {
    try {
      const response = await axios.post(
        'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
        {
          app_id: this.appId,
          app_secret: this.appSecret,
        }
      );

      const data = response.data;
      if (data.code !== 0) {
        throw new Error(`Failed to get tenant access token: ${data.msg}`);
      }

      this.tenantAccessToken = data.tenant_access_token;
      this.tokenExpireTime = now + data.expire * 1000;
      console.log('[Feishu] Token refreshed');
    } catch (error) {
      console.error('[Feishu] Refresh token error:', error.message);
      throw error;
    }
  }

  async sendMessage(content) {
    try {
      await this.ensureToken();

      const response = await axios.post(
        'https://open.feishu.cn/open-apis/im/v1/messages',
        {
          receive_id: this.chatId,
          msg_type: 'text',
          content: JSON.stringify({ text: content }),
        },
        {
          params: { receive_id_type: 'chat_id' },
          headers: {
            Authorization: `Bearer ${this.tenantAccessToken}`,
          },
        }
      );

      console.log('[Feishu] Message sent successfully');
      return { success: true, messageId: response.data.data?.message_id };
    } catch (error) {
      console.error('[Feishu] Send message error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async healthCheck() {
    try {
      await this.ensureToken();
      return { status: 'ok', channel: 'feishu' };
    } catch (error) {
      return { status: 'error', channel: 'feishu', error: error.message };
    }
  }
}

module.exports = FeishuChannel;
