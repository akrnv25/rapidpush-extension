const postService = require('./services/post.service');
const storageService = require('./services/storage.service');
const isNil = require('./utilities/is-nil');

postService.onRuntimeMessage({ saveAuctionPage, toConsoleAuctionPages, clearStorage });

function saveAuctionPage(context, sendRes) {
  if (!isNil(context?.id) && !isNil(context?.bodyHtml)) {
    storageService.setValue(`auction-${context.id}-${Date.now()}`, context.bodyHtml);
  }
  sendRes();
}

async function toConsoleAuctionPages(context, sendRes) {
  const auctionKeys = storageService.keys.filter(key => key.startsWith('auction'));
  for (let i = 0; i < auctionKeys.length; i += 1) {
    const bodyHtml = await storageService.getValue(auctionKeys[i]);
    const auctionKeyChips = auctionKeys[i].split('-');
    const page = { id: auctionKeyChips[1], timestamp: auctionKeyChips[2], bodyHtml };
    console.log(page);
  }
  sendRes();
}

async function clearStorage(context, sendRes) {
  const keys = storageService.keys ?? [];
  for (let i = 0; i < keys.length; i += 1) {
    await storageService.removeValue(keys[i]);
  }
  sendRes();
}
