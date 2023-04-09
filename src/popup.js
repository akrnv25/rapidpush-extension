const postService = require('./services/post.service');
const manifest = require('./manifest.json');
const isNil = require('./utilities/is-nil');
const { AUCTION_TYPES } = require('./consts/auction-types');

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
  isNil(data) ? initEditView({ id }) : initMainView(data);
})();

function initNotFoundView() {
  mainView.classList.add('hidden');
  editView.classList.add('hidden');
  notFoundView.classList.remove('hidden');
}

function initEditView(data) {
  mainView.classList.add('hidden');
  editView.classList.remove('hidden');
  notFoundView.classList.add('hidden');
  let id = data.id;
  const idControl = document.getElementById('id-control');
  idControl.value = id ?? '';
  let type = data.type ?? AUCTION_TYPES[0].value;
  const typeControl = document.getElementById('type-control');
  typeControl.value = type;
  typeControl.onchange = () => (type = typeControl.value);
  let lots = data.lots ?? '';
  const lotsControl = document.getElementById('lots-control');
  lotsControl.value = lots;
  lotsControl.oninput = () => (lots = lotsControl.value);
  let price = data.price ?? '';
  const priceControl = document.getElementById('price-control');
  priceControl.value = price;
  priceControl.oninput = () => (price = priceControl.value);
  const saveButton = document.getElementById('save-button');
  saveButton.onclick = async () => {
    const data = { id, type, lots, price };
    if (isAuctionDataValid(data)) {
      await postService.sendRuntimeMessage('saveAuctionData', { data });
      initMainView(data);
    } else {
      const errorBox = document.getElementById('error-box');
      errorBox.classList.remove('hidden');
      setTimeout(() => errorBox.classList.add('hidden'), 3000);
    }
  };
}

function initMainView(data) {
  mainView.classList.remove('hidden');
  editView.classList.add('hidden');
  notFoundView.classList.add('hidden');
  const idBox = document.getElementById('id-box');
  idBox.innerText = data.id ?? '';
  const typeBox = document.getElementById('type-box');
  typeBox.innerText = AUCTION_TYPES.find(t => t.value === data.type)?.label ?? '';
  const lotsBox = document.getElementById('lots-box');
  lotsBox.innerText = data.lots ?? '';
  const priceBox = document.getElementById('price-box');
  priceBox.innerText = data.price ?? '';
  const editButton = document.getElementById('edit-button');
  editButton.onclick = () => initEditView(data);
  const removeButton = document.getElementById('remove-button');
  removeButton.onclick = async () => {
    await postService.sendRuntimeMessage('removeAuctionData', { id: data.id });
    initEditView({ id: data.id });
  };
}

function isAuctionDataValid(data) {
  if (isNil(data)) {
    return false;
  }
  const { id, type, price, lots } = data;
  return (
    !isNil(id) &&
    id !== '' &&
    !isNil(type) &&
    !!AUCTION_TYPES.some(t => t.value === type) &&
    !isNil(lots) &&
    lots !== '' &&
    !isNil(price) &&
    price !== ''
  );
}

function patchVersion() {
  const version = `Версия ${manifest.version}`;
  const versionBox = document.getElementById('version-box');
  versionBox.innerText = version;
}
