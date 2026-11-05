const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

class ClassList {
  constructor(element) {
    this.element = element;
    this.values = new Set();
  }
  add(...names) { names.forEach(name => this.values.add(name)); }
  remove(...names) { names.forEach(name => this.values.delete(name)); }
  contains(name) { return this.values.has(name); }
  setFromString(value) {
    this.values = new Set(String(value).split(/\s+/).filter(Boolean));
  }
  toString() { return [...this.values].join(' '); }
}

class Element {
  constructor(tagName, id = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.children = [];
    this.parentNode = null;
    this.classList = new ClassList(this);
    this.style = {};
    this.dataset = {};
    this.attributes = new Map();
    this.textContent = '';
    this._innerHTML = '';
    this.disabled = false;
    this.onclick = null;
  }
  get className() { return this.classList.toString(); }
  set className(value) { this.classList.setFromString(value); }
  get src() { return this.getAttribute('src') || ''; }
  set src(value) { this.setAttribute('src', value); }
  get innerHTML() { return this._innerHTML; }
  set innerHTML(value) {
    this._innerHTML = String(value);
    this.children = [];
    const divPattern = /<div class="([^"]+)">([\s\S]*?)<\/div>/g;
    for (const match of this._innerHTML.matchAll(divPattern)) {
      const child = new Element('div');
      child.className = match[1];
      child.textContent = match[2].replace(/<[^>]+>/g, '');
      this.append(child);
    }
  }
  append(...elements) {
    for (const element of elements) {
      element.parentNode = this;
      this.children.push(element);
    }
  }
  appendChild(element) { this.append(element); return element; }
  remove() {
    if (!this.parentNode) return;
    this.parentNode.children = this.parentNode.children.filter(child => child !== this);
    this.parentNode = null;
  }
  addEventListener() {}
  scrollIntoView() {}
  get offsetWidth() { return 0; }
  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name.startsWith('data-')) {
      const key = name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      this.dataset[key] = String(value);
    }
  }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) {
    const descendants = [];
    const visit = element => {
      for (const child of element.children) {
        descendants.push(child);
        visit(child);
      }
    };
    visit(this);
    if (selector.startsWith('.')) {
      const className = selector.slice(1);
      return descendants.filter(element => element.classList.contains(className));
    }
    if (selector === 'img') return descendants.filter(element => element.tagName === 'IMG');
    const dataMatch = selector.match(/^\[data-juniten-code="([^"]+)"\]$/);
    if (dataMatch) {
      return descendants.filter(element => element.dataset.junitenCode === dataMatch[1]);
    }
    return [];
  }
}

function templeItem(src, label) {
  const item = new Element('div');
  item.className = 'temple-item';
  const img = new Element('img');
  img.src = src;
  const text = new Element('p');
  text.className = 'temple-label';
  text.textContent = label;
  item.append(img, text);
  return item;
}

function createDocument() {
  const elements = new Map();
  const add = (id, tag = 'div') => {
    const element = new Element(tag, id);
    elements.set(id, element);
    return element;
  };
  const document = {
    readyState: 'complete',
    head: new Element('head'),
    createElement: tag => new Element(tag),
    addEventListener() {},
    getElementById: id => elements.get(id) || null,
    querySelector(selector) {
      if (selector === '#resultGod .god-info') {
        return elements.get('resultGod').querySelector('.god-info');
      }
      return null;
    }
  };

  [
    'resultGod', 'worshipGuide', 'resultCard', 'resultNumber', 'resultFortune',
    'resultMessage', 'powerChargeContainer', 'drawBtn', 'adminCounter',
    'prevBtn', 'nextBtn', 'adminNavigation', 'exitBtn'
  ].forEach(id => add(id, id === 'drawBtn' ? 'button' : 'div'));

  const guide = elements.get('worshipGuide');
  const title = new Element('h2');
  title.className = 'worship-guide-title';
  const images = new Element('div');
  images.className = 'temple-images';
  images.append(
    templeItem('image/1yakushidou.jpg', '薬師堂'),
    templeItem('image/2kouryuukaku.jpg', '光龍閣')
  );
  guide.append(title, images);
  return document;
}

const observerCallbacks = [];
class MutationObserver {
  constructor(callback) { this.callback = callback; observerCallbacks.push(callback); }
  observe() {}
}

const storage = () => {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value))
  };
};

const document = createDocument();
const context = vm.createContext({
  console,
  document,
  MutationObserver,
  navigator: {vibrate() {}},
  localStorage: storage(),
  sessionStorage: storage(),
  window: {close() {}, closed: false, location: {href: ''}},
  alert() {},
  setTimeout: callback => { callback(); return 1; },
  clearTimeout() {},
  setInterval: () => 1,
  clearInterval() {},
  Math,
  Date
});

const scriptSource = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const adapterSource = fs.readFileSync(path.join(root, 'juniten.js'), 'utf8');
vm.runInContext(scriptSource, context, {filename: 'script.js'});
vm.runInContext(adapterSource, context, {filename: 'juniten.js'});

const results = vm.runInContext('omikujiResults', context);
assert.equal(results.length, 54, '54 results must remain available');
assert.deepEqual(Array.from(results, result => result.number), Array.from({length: 54}, (_, i) => i + 1));
assert.equal(new Set(results.map(result => result.number)).size, 54, 'result numbers must be unique');
assert.deepEqual(Array.from(vm.runInContext('[normalPassword, adminPassword]', context)), ['2026', '2256']);

const canonicalResults = Array.from(results, result => ({
  number: result.number,
  fortune: result.fortune,
  message: result.message,
  god: result.god,
  godReading: result.godReading,
  godNumber: result.godNumber,
  weight: result.weight
}));
const canonicalHash = crypto.createHash('sha256')
  .update(JSON.stringify(canonicalResults))
  .digest('hex');
assert.equal(canonicalHash, '9d312de3de6f8d433d008863446149b5b6a4a409177827a3dc29982fd5416010', 'all 54 source records must match the approved dataset');

const lowWeightNumbers = new Set([3, 4, 10, 15, 27, 48, 53, 54]);
for (const result of results) {
  assert.equal(result.weight, lowWeightNumbers.has(result.number) ? 1 : 2, `weight ${result.number}`);
  assert.ok(result.weight > 0, `weight ${result.number} must be positive`);
}
assert.equal(results.reduce((total, result) => total + result.weight, 0), 100, 'weights must total 100%');

assert.equal(results[0].message, '素晴らしい１年となるでしょう');
assert.equal(results[29].message, '異変を感じたら迷わず休め');
assert.equal(results[33].fortune, '返却吉');
assert.equal(results[35].message, '２度寝しても何とかなります');
assert.equal(results[40].message, '今年は幸せのピークが２度有り');
assert.equal(results[41].message, '月に１回は良いことが有るでしょう');
assert.deepEqual(
  canonicalResults[46],
  {number: 47, fortune: '変化吉', message: '思ってる事をやってみましょう', god: '青面金剛', godReading: 'しょうめんこんごう', godNumber: 10, weight: 2}
);
assert.deepEqual(
  canonicalResults[50],
  {number: 51, fortune: '縁切り吉', message: '悪縁、腐れ縁がやっと切れます', god: '伊舎那天', godReading: 'いざなてん', godNumber: 5, weight: 2}
);

const expectedDeities = new Map([
  ['羅刹天', ['⑤_1']], ['水天', ['⑤_2']], ['風天', ['⑤_3']],
  ['毘沙門天', ['⑤_4']], ['日天・月天', ['⑤_5', '⑤_11']],
  ['焔摩天', ['⑤_6']], ['地天', ['⑤_7']], ['火天', ['⑤_8']],
  ['帝釈天', ['⑤_9']], ['伊舎那天', ['⑤_10']], ['梵天', ['⑤_12']]
]);

for (const result of results) {
  if (result.godNumber !== 5) {
    assert.equal(result.godDisplayNumber, undefined);
    assert.equal(result.godImageNumbers, undefined);
    continue;
  }
  const expected = expectedDeities.get(result.god);
  assert.ok(expected, `godNumber 5 must have a mapping: result ${result.number} ${result.god}`);
  assert.equal(result.godDisplayNumber, expected.join('・'));
  assert.deepEqual(Array.from(result.godImageNumbers), expected);
}
assert.equal(results[24].god, '日天・月天');
assert.deepEqual(Array.from(results[24].godImageNumbers), ['⑤_5', '⑤_11']);
assert.equal(results[50].god, '伊舎那天');
assert.deepEqual(Array.from(results[50].godImageNumbers), ['⑤_10']);

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'juniten_image_manifest.json'), 'utf8'));
assert.equal(manifest.length, 12);
const manifestNames = new Map(manifest.map(item => [item.number, item.name]));
const allExpectedImages = new Map([
  ['⑤_1', '羅刹天'], ['⑤_2', '水天'], ['⑤_3', '風天'],
  ['⑤_4', '毘沙門天'], ['⑤_5', '日天'], ['⑤_6', '焔摩天'],
  ['⑤_7', '地天'], ['⑤_8', '火天'], ['⑤_9', '帝釈天'],
  ['⑤_10', '伊舎那天'], ['⑤_11', '月天'], ['⑤_12', '梵天']
]);
assert.deepEqual([...manifestNames], [...allExpectedImages]);

function jpegDimensions(buffer) {
  assert.equal(buffer[0], 0xff);
  assert.equal(buffer[1], 0xd8);
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) { offset++; continue; }
    const marker = buffer[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7)};
    }
    offset += 2 + length;
  }
  throw new Error('JPEG dimensions not found');
}

function pngDimensions(buffer) {
  assert.deepEqual(Array.from(buffer.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);
  return {width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20)};
}

for (const item of manifest) {
  const file = path.join(root, ...item.filename.split('/'));
  const bytes = fs.readFileSync(file);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), item.sha256);
  assert.deepEqual(jpegDimensions(bytes), {width: 768, height: 1376});
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(html, /<script src="script\.js\?v=20250101"><\/script>\s*<script src="juniten\.js\?v=20261104"><\/script>/);
assert.match(html, /<img src="image\/3mitorizu\.png" alt="法楽寺見取り図" class="temple-map">/);
assert.doesNotMatch(html, /src="image\/3mitorizu\.jpg"/);

const mapFile = path.join(root, 'image', '3mitorizu.png');
assert.ok(fs.existsSync(mapFile), 'the approved temple map PNG must exist');
assert.deepEqual(pngDimensions(fs.readFileSync(mapFile)), {width: 1353, height: 1163});
assert.ok(fs.existsSync(path.join(root, 'image', '3mitorizu.jpg')), 'the previous map must remain for rollback');

for (const match of html.matchAll(/<img\s+[^>]*src="([^"]+)"/g)) {
  const src = match[1].split('?')[0];
  if (!src.startsWith('image/')) continue;
  assert.ok(fs.existsSync(path.join(root, ...src.split('/'))), `referenced image must exist: ${src}`);
}

function triggerObservers() { observerCallbacks.forEach(callback => callback([])); }
function imageItems() {
  return document.getElementById('worshipGuide').querySelector('.temple-images');
}
function itemImageState(item) {
  return {
    display: item.style.display === 'none' ? 'none' : 'block',
    src: item.querySelector('img').src,
    label: item.querySelector('.temple-label').textContent
  };
}
function deityState(code, display = 'block') {
  return {
    display,
    src: `image/${code}.jpg`,
    label: `ご縁仏 ${code}・${allExpectedImages.get(code)}`
  };
}
function expectedAdminImageState(result, expected) {
  if (expected) {
    return [
      {display: 'block', src: 'image/1yakushidou.jpg', label: '薬師堂'},
      deityState(expected[0]),
      ...expected.slice(1).map(code => deityState(code))
    ];
  }
  const legacy = {src: `image/${result.godNumber}.jpg`, label: `ご縁仏 ${result.godNumber}`};
  if (result.godNumber <= 5) {
    return [
      {display: 'block', src: 'image/1yakushidou.jpg', label: '薬師堂'},
      {display: 'block', ...legacy}
    ];
  }
  if (result.godNumber <= 9) {
    return [
      {display: 'block', src: 'image/2kouryuukaku.jpg', label: '光龍閣'},
      {display: 'block', ...legacy}
    ];
  }
  return [
    {display: 'block', ...legacy},
    {display: 'none', ...legacy}
  ];
}
function expectedNormalVisibleState(result, expected) {
  if (expected) {
    return [
      {display: 'block', src: 'image/1yakushidou.jpg', label: '薬師堂'},
      deityState(expected[0]),
      ...expected.slice(1).map(code => deityState(code))
    ];
  }
  const legacy = {display: 'block', src: `image/${result.godNumber}.jpg`, label: `ご縁仏 ${result.godNumber}`};
  if (result.godNumber <= 5) {
    return [{display: 'block', src: 'image/1yakushidou.jpg', label: '薬師堂'}, legacy];
  }
  if (result.godNumber <= 9) {
    return [{display: 'block', src: 'image/2kouryuukaku.jpg', label: '光龍閣'}, legacy];
  }
  return [legacy];
}
function assertRendered(result, mode) {
  const expected = result.godNumber === 5 ? expectedDeities.get(result.god) : undefined;
  const info = document.querySelector('#resultGod .god-info');
  const items = imageItems();
  const extras = items.querySelectorAll('.juniten-extra');
  assert.equal(document.getElementById('resultNumber').textContent, `${result.number}番`, `${mode} number ${result.number}`);
  assert.equal(document.getElementById('resultFortune').textContent, result.fortune, `${mode} fortune ${result.number}`);
  assert.equal(document.getElementById('resultMessage').textContent, result.message, `${mode} message ${result.number}`);
  assert.equal(document.getElementById('resultGod').querySelector('.god-name').textContent, result.god, `${mode} god ${result.number}`);
  assert.equal(document.getElementById('resultGod').querySelector('.god-reading').textContent, `(${result.godReading})`, `${mode} reading ${result.number}`);
  const allImageStates = Array.from(items.children, itemImageState);
  if (mode.startsWith('admin')) {
    assert.deepEqual(allImageStates, expectedAdminImageState(result, expected), `${mode} complete image state ${result.number}`);
  } else {
    assert.deepEqual(
      allImageStates.filter(item => item.display === 'block'),
      expectedNormalVisibleState(result, expected),
      `${mode} visible image state ${result.number}`
    );
  }
  if (!expected) {
    assert.equal(info.textContent, `ご縁仏の番号: ${result.godNumber}`, `${mode} legacy number ${result.number}`);
    assert.equal(extras.length, 0, `${mode} no stale extra image ${result.number}`);
    if (result.number === 47 && mode === 'normal') {
      assert.equal(items.children[0].querySelector('img').src, 'image/10.jpg', `${mode} result 47 Shomen Kongo image`);
      assert.notEqual(items.children[0].querySelector('img').src, 'image/⑤_10.jpg', `${mode} result 47 must not use a Twelve Devas image`);
    }
    return;
  }
  assert.equal(info.textContent, `ご縁仏の番号: ${expected.join('・')}`, `${mode} deity code ${result.number}`);
  const deityItem = items.children[1];
  assert.equal(deityItem.style.display, 'block', `${mode} first deity visible ${result.number}`);
  assert.equal(deityItem.querySelector('img').src, `image/${expected[0]}.jpg`, `${mode} first image ${result.number}`);
  if (result.number === 51) {
    assert.equal(deityItem.querySelector('img').src, 'image/⑤_10.jpg', `${mode} result 51 Isanaten image`);
  }
  assert.equal(extras.length, expected.length - 1, `${mode} extra image count ${result.number}`);
  if (expected.length === 2) {
    assert.equal(extras[0].querySelector('img').src, 'image/⑤_11.jpg');
    assert.equal(extras[0].querySelector('.temple-label').textContent, 'ご縁仏 ⑤_11・月天');
  }
}

for (let index = 0; index < results.length; index++) {
  vm.runInContext(`isAdminMode = true; currentIndex = ${index}; showAdminResult(${index});`, context);
  triggerObservers();
  assertRendered(results[index], 'admin');
}

const adminTransitionSequences = [
  [46, 47, 48],
  [47, 51, 47],
  [25, 47],
  [51, 25, 47],
  [1, 15, 25, 27, 47, 48, 51, 53, 54, 1],
  [54, 53, 51, 50, 48, 47, 46, 25, 24, 15, 1]
];
for (const sequence of adminTransitionSequences) {
  for (const number of sequence) {
    const index = number - 1;
    vm.runInContext(`isAdminMode = true; currentIndex = ${index}; showAdminResult(${index});`, context);
    triggerObservers();
    assertRendered(results[index], `admin transition ${sequence.join('→')}`);
  }
}

// 管理者モードの前へ・次へは両端でも有効で、1↔54を循環すること。
function assertCircularNavigation(expectedNumber, description) {
  const index = expectedNumber - 1;
  triggerObservers();
  assert.equal(vm.runInContext('currentIndex', context), index, `${description} currentIndex`);
  assertRendered(results[index], `admin circular ${description}`);
  assert.equal(document.getElementById('prevBtn').disabled, false, `${description} prev enabled`);
  assert.equal(document.getElementById('nextBtn').disabled, false, `${description} next enabled`);
}
vm.runInContext('isAdminMode = true; currentIndex = 0; showAdminResult(0);', context);
assertCircularNavigation(1, 'start 1');
vm.runInContext('showPrevious()', context);
assertCircularNavigation(54, '1→prev→54');
vm.runInContext('showPrevious()', context);
assertCircularNavigation(53, '54→prev→53');
vm.runInContext('showNext()', context);
assertCircularNavigation(54, '53→next→54');
vm.runInContext('showNext()', context);
assertCircularNavigation(1, '54→next→1');
vm.runInContext('showNext()', context);
assertCircularNavigation(2, '1→next→2');
vm.runInContext('isAdminMode = true; currentIndex = 53; showAdminResult(53);', context);
assertCircularNavigation(54, 'start 54');
vm.runInContext('showNext()', context);
assertCircularNavigation(1, '54→next→1 direct');
vm.runInContext('showPrevious()', context);
assertCircularNavigation(54, '1→prev→54 direct');

for (let index = 0; index < results.length; index++) {
  vm.runInContext(`isAdminMode = false; powerData.selectedResult = omikujiResults[${index}]; showResult();`, context);
  triggerObservers();
  assertRendered(results[index], 'normal');
}

console.log('PASS: approved 54-result dataset, 100% weights, all admin/normal image states, required transitions, 12 image mappings, temple map, image integrity, and script loading');
