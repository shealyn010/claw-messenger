const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'icon.png'),
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('save-config', async (event, config) => {
  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-config', async () => {
  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return { success: true, config: JSON.parse(data) };
    }
    return { success: true, config: {} };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('send-message', async (event, { channel, message, config }) => {
  try {
    if (channel === 'feishu') {
      const result = await sendFeishuMessage(message, config);
      return result;
    }
    return { success: false, error: 'Unknown channel' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

async function sendFeishuMessage(message, config) {
  const axios = require('axios');
  
  try {
    const tokenRes = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      {
        app_id: config.feishuAppId,
        app_secret: config.feishuAppSecret,
      }
    );

    if (tokenRes.data.code !== 0) {
      throw new Error(`Failed to get token: ${tokenRes.data.msg}`);
    }

    const token = tokenRes.data.tenant_access_token;

    const res = await axios.post(
      'https://open.feishu.cn/open-apis/im/v1/messages',
      {
        receive_id: config.feishuChatId,
        msg_type: 'text',
        content: JSON.stringify({ text: message }),
      },
      {
        params: { receive_id_type: 'chat_id' },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, messageId: res.data.data?.message_id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
