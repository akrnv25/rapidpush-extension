const config = require('./config');

function getValue(key) {
  const fullKey = `${config.primaryKey}/${key}`;
  return chrome.storage.sync
    .get(fullKey)
    .then(data => data[fullKey])
    .catch(() => Promise.resolve());
}

function setValue(key, value) {
  const fullKey = `${config.primaryKey}/${key}`;
  chrome.storage.sync.set({ [fullKey]: value });
}

function removeValue(key) {
  const fullKey = `${config.primaryKey}/${key}`;
  chrome.storage.sync.remove(fullKey);
}

module.exports = {
  getValue,
  setValue,
  removeValue
};
