const postService = require('./services/post.service');
const storageService = require('./services/storage.service');
const isNil = require('./utilities/is-nil');

postService.onRuntimeMessage({
  saveAuctionPage,
  toConsoleAuctionPages,
  clearStorage,
  getActiveAuctionId,
  getAuctionData
});

function saveAuctionPage(context, sendRes) {
  if (!isNil(context?.id) && !isNil(context?.bodyHtml)) {
    storageService.setValue(`page-${context.id}-${Date.now()}`, context.bodyHtml);
  }
  sendRes();
}

async function toConsoleAuctionPages(context, sendRes) {
  const auctionKeys = storageService.keys.filter(key => key.startsWith('page'));
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

async function getActiveAuctionId(context, sendRes) {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = (tabs?.length && tabs[0] && tabs[0].url) || null;
    if (isNil(url)) {
      throw new Error('Active tab URL is undefined');
    }
    const searchParams = new URL(url).searchParams;
    const id = searchParams.get('id');
    if (isNil(id)) {
      throw new Error('Auction ID is undefined');
    }
    sendRes({ id });
  } catch (err) {
    sendRes({ id: null });
  }
}

async function getAuctionData(context, sendRes) {
  try {
    const id = context?.id;
    if (isNil(id)) {
      throw new Error('Auction ID is undefined');
    }
    const data = await storageService.getValue(`data-${id}`);
    if (isNil(data)) {
      throw new Error('Auction data is not found in storage');
    }
    sendRes({ data });
  } catch (err) {
    sendRes({ data: null });
  }
}
