const postService = require('./services/post.service');
const isNil = require('./utilities/is-nil');

console.log('Content script connected');
document.addEventListener('DOMContentLoaded', async () => {
  const searchParams = new URL(document.location).searchParams;
  const id = searchParams.get('id');
  if (isNil(id)) {
    console.log('ID is undefined');
    return;
  }
  saveAuctionPage(id);
  let countSaving = 0;
  setInterval(() => {
    const countdown = document.getElementById('countdown');
    console.log('countdown: ', countdown);
    let isCountdownFinished;
    if (isNil(countdown) || !countdown.innerHTML) {
      isCountdownFinished = true;
    } else {
      const amounts = Array.from(countdown.querySelectorAll('.countdown-amount'));
      isCountdownFinished = amounts.every(amount => !amount.innerText || +amount.innerText === 0);
    }
    console.log('isCountdownFinished: ', isCountdownFinished);
    if (isCountdownFinished && countSaving < 10) {
      saveAuctionPage(id);
      countSaving += 1;
    }
  }, 500);
});

async function saveAuctionPage(id) {
  const bodyHtml = document.body.innerHTML;
  await postService.sendRuntimeMessage('saveAuctionPage', { id, bodyHtml });
  console.log(`Page ${id} saved`);
}
