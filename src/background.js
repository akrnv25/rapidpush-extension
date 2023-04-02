const operators = require('./operators');

operators.onRuntimeMessage({
  update: (context, sendRes) => {
    console.log(JSON.stringify(context), 'background context');
    sendRes({ success: true });
  }
});
