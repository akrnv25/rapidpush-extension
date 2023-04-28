const postService = require('./services/post.service');
const isNil = require('./utilities/is-nil');
const { AUCTION_TYPES } = require('./consts/auction-types');

console.log('Content script connected');
document.addEventListener('DOMContentLoaded', async () => {
  const searchParams = new URL(document.location).searchParams;
  const id = searchParams.get('Id');
  if (isNil(id)) {
    console.log('ID is undefined');
    return;
  }
  const dataRes = await postService.sendRuntimeMessage('getAuctionData', { id });
  const data = dataRes?.context?.data;
  if (!isNil(data?.pushTimestamp)) {
    console.log('Auction data pushed');
    console.log('Pushed data: ', data);
    return;
  }
  await parseAuctionData(id);
  const intervalId = setInterval(async () => {
    const isCountdownFinished = checkCountdownFinished();
    if (isCountdownFinished) {
      const pushedData = await pushAuctionData(id);
      if (pushedData) {
        console.log('Pushed data: ', pushedData);
        clearInterval(intervalId);
      }
    }
  }, 500);
});

async function parseAuctionData(id) {
  const items = Array.from(document.querySelectorAll('#details small'));
  const maxPriceItem = items.find(t => t.innerText === 'Макс. цена:');
  const maxPriceStr =
    maxPriceItem?.parentElement?.parentElement?.querySelector('span:nth-child(2)')?.innerText;
  const maxPriceStrChips = maxPriceStr?.trim()?.split(' ') ?? [];
  const maxPrice = (maxPriceStrChips?.length && +maxPriceStrChips[0]) || undefined;
  const productItem = items.find(t => t.innerText === 'Товар:');
  const productTitle = productItem?.parentElement?.parentElement?.querySelector(
    'span:nth-child(2) > span'
  )?.innerText;
  const productTitleChips = productTitle?.split(' ') ?? [];
  const auctionTypeLabel = (productTitleChips?.length && productTitleChips[1]) || undefined;
  const auctionType = AUCTION_TYPES.find(
    t => t.label.toLowerCase() === auctionTypeLabel?.toLowerCase()
  );
  const data = { id, maxPrice, type: auctionType?.value };
  await postService.sendRuntimeMessage('saveAuctionParsedData', { data });
}

async function pushAuctionData(id) {
  const dataRes = await postService.sendRuntimeMessage('getAuctionData', { id });
  const data = dataRes?.context?.data;
  console.log('Data: ', data);
  if (isNil(data)) {
    return;
  }
  const lotsControl = document.querySelector('th[title="Количество лотов"] input');
  const priceControl = document.querySelector('input[title="Ставка"]');
  const pushButton = document.querySelector('button[title="Подтвердить ордер"]');
  if (!isNil(lotsControl) && !isNil(priceControl) && !isNil(pushButton)) {
    lotsControl.value = data.lots;
    priceControl.value = data.price;
    pushButton.click();
    const pushedData = { ...data, pushTimestamp: Date.now() };
    await postService.sendRuntimeMessage('saveAuctionData', { data: pushedData });
    return pushedData;
  }
}

function checkCountdownFinished() {
  const countdown = document.getElementById('countdown');
  console.log('Countdown: ', countdown);
  let isCountdownFinished;
  if (isNil(countdown) || !countdown.innerHTML) {
    isCountdownFinished = true;
  } else {
    const amounts = Array.from(countdown.querySelectorAll('.countdown-amount'));
    isCountdownFinished = amounts.every(amount => !amount.innerText || +amount.innerText === 0);
  }
  console.log('Is countdown finished: ', isCountdownFinished);
  return isCountdownFinished;
}
