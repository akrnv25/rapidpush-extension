const config = require('../config');
const isNil = require('../utilities/is-nil');

class PostService {
  constructor() {}

  sendRuntimeMessage(type, context) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ primaryKey: config.primaryKey, type, context }, res => {
        if (chrome.runtime.lastError) {
          return;
        }
        if (res?.primaryKey === config.primaryKey && !isNil(res?.type)) {
          resolve({ type: res.type, context: res.context });
        } else {
          reject(new Error('Primary key is invalid'));
        }
      });
    });
  }

  onRuntimeMessage(handlers) {
    chrome.runtime.onMessage.addListener((message, sender, sendRes) => {
      if (message?.primaryKey === config.primaryKey && message?.type) {
        if (!isNil(handlers) && !isNil(handlers[message.type])) {
          handlers[message.type](message.context, resContext =>
            sendRes({ primaryKey: message.primaryKey, type: message.type, context: resContext })
          );
          return true;
        }
      }
      return false;
    });
  }
}

module.exports = new PostService();
