const operators = require('./operators');

document.addEventListener('DOMContentLoaded', () => {
  operators
    .sendRuntimeMessage('update', { name: 'Alex' })
    .then(res => console.log(JSON.stringify(res), 'content res'));
});
