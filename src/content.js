const postService = require('./services/post.service');
const isNil = require('./utilities/is-nil');

document.addEventListener('DOMContentLoaded', async () => {
  const searchParams = new URL(document.location).searchParams;
  const id = searchParams.get('id');
  if (!isNil(id)) {
    const bodyHtml = document.body.innerHTML;
    await postService.sendRuntimeMessage('saveAuctionPage', { id, bodyHtml });
  }
});
