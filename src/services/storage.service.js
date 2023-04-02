const config = require('./config');
const isNil = require('../utilities/is-nil');

class StorageService {
  constructor() {
    this._keys = [];
    this.getValue('keys').then(keys => {
      if (!isNil(keys?.length)) {
        this._keys = keys;
      }
    });
  }

  get keys() {
    return this._keys;
  }

  getValue(key) {
    return chrome.storage.local
      .get(`${config.primaryKey}/${key}`)
      .then(data => data[`${config.primaryKey}/${key}`])
      .catch(() => Promise.resolve());
  }

  setValue(key, value) {
    chrome.storage.local.set({ [`${config.primaryKey}/${key}`]: value });
    this._keys.push(key);
    chrome.storage.local.set({ [`${config.primaryKey}/keys`]: this._keys });
  }

  removeValue(key) {
    chrome.storage.local.remove(`${config.primaryKey}/${key}`);
  }
}

module.exports = new StorageService();
