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
  setInterval(() => {
    const countdown = document.getElementById('countdown');
    console.log('countdown: ', countdown);
    const isCountdownFinished = !countdown.innerHTML;
    console.log('isCountdownFinished: ', isCountdownFinished);
    if (isCountdownFinished) {
      saveAuctionPage(id);
    }
  }, 500);
});

async function saveAuctionPage(id) {
  const bodyHtml = document.body.innerHTML;
  await postService.sendRuntimeMessage('saveAuctionPage', { id, bodyHtml });
  console.log(`Page ${id} saved`);
}
