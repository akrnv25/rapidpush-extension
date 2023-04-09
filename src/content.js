const postService = require('./services/post.service');
const isNil = require('./utilities/is-nil');

console.log('Content script connected');
document.addEventListener('DOMContentLoaded', async () => {
  const searchParams = new URL(document.location).searchParams;
  const id = searchParams.get('Id');
  if (isNil(id)) {
    console.log('ID is undefined');
    return;
  }
  const intervalId = setInterval(async () => {
    const isCountdownFinished = checkCountdownFinished();
    if (isCountdownFinished) {
      const pushedData = await pushAuctionData(id);
      if (pushedData) {
        console.log('Pushed data: ', pushedData);
        clearInterval(intervalId);
        showSuccessMessage();
      }
    }
  }, 500);
});

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
    await postService.sendRuntimeMessage('removeAuctionData', { id });
    return data;
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

function showSuccessMessage() {
  const div = document.createElement('div');
  div.innerText = 'Данные отправлены';
  div.style.padding = '16px';
  div.style.fontSize = '14px';
  div.style.fontFamily = 'Arial, sans-serif';
  div.style.boxSizing = 'border-box';
  div.style.fontWeight = '400';
  div.style.lineHeight = '1.2em';
  div.style.backgroundColor = '#0b546a';
  div.style.color = '#ffffff';
  div.style.position = 'fixed';
  div.style.bottom = '0';
  div.style.right = '0';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}
