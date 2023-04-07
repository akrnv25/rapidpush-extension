const postService = require('./services/post.service');
const manifest = require('./manifest.json');
const isNil = require('./utilities/is-nil');

const notFoundView = document.getElementById('not-found-view');
const mainView = document.getElementById('main-view');
const editView = document.getElementById('edit-view');

(async () => {
  patchVersion();
  const idRes = await postService.sendRuntimeMessage('getActiveAuctionId');
  const id = idRes?.context?.id;
  if (isNil(id)) {
    initNotFoundView();
    return;
  }
  const dataRes = await postService.sendRuntimeMessage('getAuctionData', { id });
  const data = dataRes?.context?.data;
  isNil(data) ? initEditView() : initMainView();
})();

function initNotFoundView() {
  mainView.classList.add('hidden');
  editView.classList.add('hidden');
  notFoundView.classList.remove('hidden');
}

function initEditView() {
  mainView.classList.add('hidden');
  editView.classList.remove('hidden');
  notFoundView.classList.add('hidden');
}

function initMainView() {
  mainView.classList.remove('hidden');
  editView.classList.add('hidden');
  notFoundView.classList.add('hidden');
}

function patchVersion() {
  const version = `Версия ${manifest.version}`;
  const versionBox = document.getElementById('version-box');
  versionBox.innerText = version;
}
