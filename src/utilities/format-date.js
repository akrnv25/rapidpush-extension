const isNil = require('./is-nil');

function formatDate(date, format) {
  if (isNil(date) || isNil(format)) {
    return;
  }
  const DD = date.getDate().toString().padStart(2, '0');
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  const YYYY = date.getFullYear().toString();
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  if (isNil(DD) || isNil(MM) || isNil(YYYY)) {
    return;
  }
  switch (format) {
    case 'DD.MM.YYYY':
      return `${DD}.${MM}.${YYYY}`;
    case 'YYYY-MM-DD':
      return `${YYYY}-${MM}-${DD}`;
    case 'YYYY-MM-DD hh:mm:ss':
      return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
    default:
      return;
  }
}

module.exports = formatDate;
