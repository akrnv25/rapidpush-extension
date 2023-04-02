const postService = require('./services/post.service');
const storageService = require('./services/storage.service');
const isNil = require('./utilities/is-nil');

postService.onRuntimeMessage({
  saveAuctionPage: (context, sendRes) => {
    if (!isNil(context?.id) && !isNil(context?.bodyHtml)) {
      storageService.setValue(`${context.id}-${Date.now()}`, context.bodyHtml);
    }
    sendRes();
  },
  getAuctionPages: (context, sendRes) => {
    Promise.all(storageService.keys.map(key => storageService.getValue(key))).then(res =>
      sendRes(res)
    );
  }
});
