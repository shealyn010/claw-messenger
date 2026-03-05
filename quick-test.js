#!/usr/bin/env node

/**
 * Claw Messenger - 快速测试脚本
 * 
 * 用法：
 *   1. 复制 .env.example 为 .env
 *   2. 填写飞书配置
 *   3. 运行：node quick-test.js
 */

require('dotenv').config();
const FeishuChannel = require('./src/channels/feishu');

console.log('========================================');
console.log('  Claw Messenger - 快速测试');
console.log('========================================');
console.log('');

// 检查配置
const { FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_CHAT_ID } = process.env;

if (!FEISHU_APP_ID || !FEISHU_APP_SECRET || !FEISHU_CHAT_ID) {
  console.error('❌ 请先配置 .env 文件！');
  console.log('');
  console.log('步骤：');
  console.log('  1. 复制 .env.example 为 .env');
  console.log('  2. 填写飞书配置：');
  console.log('     - FEISHU_APP_ID');
  console.log('     - FEISHU_APP_SECRET');
  console.log('     - FEISHU_CHAT_ID');
  console.log('  3. 重新运行：node quick-test.js');
  console.log('');
  process.exit(1);
}

console.log('✅ 配置检查通过！');
console.log('');

console.log('[1/3] 初始化飞书渠道...');
const feishu = new FeishuChannel();
console.log('✅ 飞书渠道初始化完成！');
console.log('');

console.log('[2/3] 测试飞书健康检查...');
feishu.healthCheck().then((health) => {
  console.log('✅ 健康检查结果:', health);
  console.log('');

  console.log('[3/3] 发送测试消息...');
  const testMessage = '🎉 你好！Claw Messenger 测试消息！\n\n' +
    '如果你收到这条消息，说明飞书渠道工作正常！\n\n' +
    '发送时间：' + new Date().toLocaleString('zh-CN');

  return feishu.sendMessage(testMessage);
}).then((result) => {
  if (result.success) {
    console.log('✅ 测试消息发送成功！');
    console.log('   消息ID:', result.messageId);
    console.log('');
    console.log('🎉🎉🎉 测试通过！！！');
    console.log('');
    console.log('现在你可以：');
    console.log('  1. 在飞书中查看收到的消息');
    console.log('  2. 继续完善项目');
    console.log('  3. 准备发布到GitHub');
    console.log('');
  } else {
    console.error('❌ 消息发送失败！');
    console.error('   错误信息:', result.error);
    console.log('');
  }
}).catch((error) => {
  console.error('❌ 测试过程出错！');
  console.error('   错误信息:', error.message);
  console.error('   错误堆栈:', error.stack);
  console.log('');
});
