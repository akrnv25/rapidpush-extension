const isNil = require('./is-nil');

function parseDate(value) {
  if (isNil(value)) {
    return;
  }
  try {
    const timestamp = Date.parse(value);
    return new Date(timestamp);
  } catch (err) {
    return;
  }
}

module.exports = parseDate;
