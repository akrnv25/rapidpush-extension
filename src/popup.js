const postService = require('./services/post.service');
const manifest = require('./manifest.json');
const isNil = require('./utilities/is-nil');
const { AUCTION_TYPES } = require('./consts/auction-types');
const formatDate = require('./utilities/format-date');

const notFoundView = document.getElementById('not-found-view');
const mainView = document.getElementById('main-view');
const resultView = document.getElementById('result-view');
const editView = document.getElementById('edit-view');

(async () => {
  patchVersion();
  const idRes = await postService.sendRuntimeMessage('getActiveAuctionId');
  const id = idRes?.context?.id;
  await selectView(id);
})();

async function selectView(id) {
  if (isNil(id)) {
    initNotFoundView();
    return;
  }
  const dataRes = await postService.sendRuntimeMessage('getAuctionData', { id });
  const data = dataRes?.context?.data;
  if (isNil(data)) {
    const parsedDataRes = await postService.sendRuntimeMessage('getAuctionParsedData', { id });
    const parsedData = parsedDataRes?.context?.data;
    initEditView({ id }, parsedData);
    return;
  }
  if (isNil(data.pushTimestamp)) {
    initMainView(data);
  } else {
    initResultView(data);
  }
}

function initEditView(data, parsedData) {
  mainView.classList.add('hidden');
  resultView.classList.add('hidden');
  editView.classList.remove('hidden');
  notFoundView.classList.add('hidden');
  let id = data.id;
  const idControl = document.getElementById('ev-id-ctrl');
  idControl.value = id ?? '';
  let type = data.type || parsedData?.type || AUCTION_TYPES[0].value;
  const typeControl = document.getElementById('ev-type-ctrl');
  typeControl.value = type;
  typeControl.onchange = () => (type = typeControl.value);
  let lots = data.lots ?? '';
  const lotsControl = document.getElementById('ev-lots-ctrl');
  lotsControl.value = lots;
  lotsControl.oninput = () => (lots = lotsControl.value);
  let price = data.price || parsedData?.maxPrice || '';
  const priceControl = document.getElementById('ev-price-ctrl');
  priceControl.value = price;
  priceControl.oninput = () => (price = priceControl.value);
  const saveButton = document.getElementById('ev-save-btn');
  saveButton.onclick = async () => {
    const data = { id, type, lots, price };
    if (isAuctionDataValid(data)) {
      await postService.sendRuntimeMessage('saveAuctionData', { data });
      await selectView(data.id);
    } else {
      const errorBox = document.getElementById('ev-error-box');
      errorBox.classList.remove('hidden');
      setTimeout(() => errorBox.classList.add('hidden'), 3000);
    }
  };
}

function initMainView(data) {
  mainView.classList.remove('hidden');
  resultView.classList.add('hidden');
  editView.classList.add('hidden');
  notFoundView.classList.add('hidden');
  const idBox = document.getElementById('mv-id-box');
  idBox.innerText = data.id ?? '';
  const typeBox = document.getElementById('mv-type-box');
  typeBox.innerText = AUCTION_TYPES.find(t => t.value === data.type)?.label ?? '';
  const lotsBox = document.getElementById('mv-lots-box');
  lotsBox.innerText = data.lots ?? '';
  const priceBox = document.getElementById('mv-price-box');
  priceBox.innerText = data.price ?? '';
  const editButton = document.getElementById('mv-edit-btn');
  editButton.onclick = () => initEditView(data);
  const removeButton = document.getElementById('mv-remove-btn');
  removeButton.onclick = async () => {
    await postService.sendRuntimeMessage('removeAuctionData', { id: data.id });
    await selectView(data.id);
  };
}

function initResultView(data) {
  mainView.classList.add('hidden');
  resultView.classList.remove('hidden');
  editView.classList.add('hidden');
  notFoundView.classList.add('hidden');
  const idBox = document.getElementById('rv-id-box');
  idBox.innerText = data.id ?? '';
  const typeBox = document.getElementById('rv-type-box');
  typeBox.innerText = AUCTION_TYPES.find(t => t.value === data.type)?.label ?? '';
  const lotsBox = document.getElementById('rv-lots-box');
  lotsBox.innerText = data.lots ?? '';
  const priceBox = document.getElementById('rv-price-box');
  priceBox.innerText = data.price ?? '';
  const pushDateBox = document.getElementById('rv-push-date-box');
  pushDateBox.innerText = formatDate(new Date(data.pushTimestamp), 'YYYY-MM-DD hh:mm:ss');
}

function initNotFoundView() {
  mainView.classList.add('hidden');
  editView.classList.add('hidden');
  notFoundView.classList.remove('hidden');
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
