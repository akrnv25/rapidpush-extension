const postService = require('./services/post.service');
const manifest = require('./manifest.json');

const menuView = document.getElementById('menu-view');
const addDataView = document.getElementById('add-data-view');

patchVersion();
initMenuView();

function initMenuView() {
  menuView.classList.remove('hidden');
  addDataView.classList.add('hidden');
  const addDataButton = document.getElementById('add-data-button');
  addDataButton.onclick = initAddDataView;
  const listButton = document.getElementById('list-button');
  const toConsolePagesButton = document.getElementById('to-console-pages-button');
  toConsolePagesButton.onclick = async () => {
    await postService.sendRuntimeMessage('toConsoleAuctionPages');
  };
  const clearStorageButton = document.getElementById('clear-storage-button');
  clearStorageButton.onclick = async () => {
    await postService.sendRuntimeMessage('clearStorage');
  };
}

function initAddDataView() {
  addDataView.classList.remove('hidden');
  menuView.classList.add('hidden');
  const typeControl = document.getElementById('type-control');
  const idControl = document.getElementById('ide-control');
  const priceControl = document.getElementById('price-control');
  const volumeControl = document.getElementById('volume-control');
  const saveButton = document.getElementById('save-button');
  const menuButton = document.getElementById('menu-button');
  menuButton.onclick = initMenuView;
}

function patchVersion() {
  const version = `Версия ${manifest.version}`;
  const versionBox = document.getElementById('version-box');
  versionBox.innerText = version;
}
