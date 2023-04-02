const config = require('./config');

function sendRuntimeMessage(type, context) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ primaryKey: config.primaryKey, type, context }, res => {
      if (chrome.runtime.lastError) {
        return;
      }
      if (res?.primaryKey === config.primaryKey && res?.type) {
        resolve({ type: res.type, context: res.context });
      } else {
        reject(new Error('Primary key is invalid'));
      }
    });
  });
}

function onRuntimeMessage(handlers) {
  chrome.runtime.onMessage.addListener((message, sender, sendRes) => {
    if (message?.primaryKey === config.primaryKey && message?.type) {
      if (!!handlers && !!handlers[message.type]) {
        handlers[message.type](message.context, resContext =>
          sendRes({ primaryKey: message.primaryKey, type: message.type, context: resContext })
        );
        return true;
      }
    }
    return false;
  });
}

module.exports = { sendRuntimeMessage, onRuntimeMessage };
