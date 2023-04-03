const postService = require('./services/post.service');
const storageService = require('./services/storage.service');
const isNil = require('./utilities/is-nil');
const delay = require('./utilities/delay');

postService.onRuntimeMessage({ saveAuctionPage, downloadAuctionPages });

function saveAuctionPage(context, sendRes) {
  if (!isNil(context?.id) && !isNil(context?.bodyHtml)) {
    storageService.setValue(`auction-${context.id}-${Date.now()}`, context.bodyHtml);
  }
  sendRes();
}

async function downloadAuctionPages(context, sendRes) {
  const auctionKeys = storageService.keys.filter(key => key.startsWith('auction'));
  for (let i = 0; i < auctionKeys.length; i += 1) {
    const bodyHtml = await storageService.getValue(auctionKeys[i]);
    const auctionKeyChips = auctionKeys[i].split('-');
    const page = { id: auctionKeyChips[1], timestamp: auctionKeyChips[2], bodyHtml };
    chrome.downloads.download({
      url: `data:text/plain,${JSON.stringify(page)}`,
      filename: `${auctionKeys[i]}.txt`
    });
    await delay(1000);
  }
  sendRes();
}
