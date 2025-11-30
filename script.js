// パスワード設定
const simplePassword = "1234";
const normalPassword = "5678";
const adminPassword = "2256";
const wg = document.getElementById('worshipGuide');
const title = wg.querySelector('.worship-guide-title');
const imgs = wg.querySelectorAll('.temple-item');
let currentMode = 'simple';
let isAdminMode = false;
let currentIndex = 0;

function vibrate(pattern) {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
}

// おみくじデータ（54種類）
const omikujiResults = {
    results: [
        { number: 1, fortune: "大吉", message: "すべてにおいて良い運気です", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1 },
        { number: 2, fortune: "中吉", message: "堅実に進めば良い結果が待っています", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1 },
        { number: 3, fortune: "小吉", message: "小さな幸せを大切にしましょう", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1 },
        { number: 4, fortune: "吉", message: "良い機会が訪れそうです", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1 },
        { number: 5, fortune: "末吉", message: "じっくりと待つ時期です", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1 },
        { number: 6, fortune: "大吉", message: "最高の運気が巡ってきました", god: "日光菩薩", godReading: "にっこうぼさつ", godNumber: 2 },
        { number: 7, fortune: "中吉", message: "順調に物事が進むでしょう", god: "日光菩薩", godReading: "にっこうぼさつ", godNumber: 2 },
        { number: 8, fortune: "小吉", message: "コツコツと努力が実ります", god: "日光菩薩", godReading: "にっこうぼさつ", godNumber: 2 },
        { number: 9, fortune: "吉", message: "新しい出会いがありそうです", god: "日光菩薩", godReading: "にっこうぼさつ", godNumber: 2 },
        { number: 10, fortune: "末吉", message: "焦らず着実に進みましょう", god: "日光菩薩", godReading: "にっこうぼさつ", godNumber: 2 },
        { number: 11, fortune: "大吉", message: "願いが叶う予兆があります", god: "月光菩薩", godReading: "がっこうぼさつ", godNumber: 3 },
        { number: 12, fortune: "中吉", message: "周囲の協力を得られるでしょう", god: "月光菩薩", godReading: "がっこうぼさつ", godNumber: 3 },
        { number: 13, fortune: "小吉", message: "健康に気をつければ順調です", god: "月光菩薩", godReading: "がっこうぼさつ", godNumber: 3 },
        { number: 14, fortune: "吉", message: "直感を信じて行動しましょう", god: "月光菩薩", godReading: "がっこうぼさつ", godNumber: 3 },
        { number: 15, fortune: "末吉", message: "準備を整える時期です", god: "月光菩薩", godReading: "がっこうぼさつ", godNumber: 3 },
        { number: 16, fortune: "大吉", message: "思わぬ幸運が舞い込みます", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4 },
        { number: 17, fortune: "中吉", message: "人間関係が良好になります", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4 },
        { number: 18, fortune: "小吉", message: "学びの機会に恵まれます", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4 },
        { number: 19, fortune: "吉", message: "家族との絆が深まります", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4 },
        { number: 20, fortune: "末吉", message: "心の平安を大切にしましょう", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4 },
        { number: 21, fortune: "大吉", message: "大きな目標達成が近いです", god: "十二神将", godReading: "じゅうにしんしょう", godNumber: 5 },
        { number: 22, fortune: "中吉", message: "仕事運が上昇します", god: "十二神将", godReading: "じゅうにしんしょう", godNumber: 5 },
        { number: 23, fortune: "小吉", message: "金運に恵まれそうです", god: "十二神将", godReading: "じゅうにしんしょう", godNumber: 5 },
        { number: 24, fortune: "吉", message: "旅行運が良好です", god: "十二神将", godReading: "じゅうにしんしょう", godNumber: 5 },
        { number: 25, fortune: "末吉", message: "慎重に行動すれば安全です", god: "十二神将", godReading: "じゅうにしんしょう", godNumber: 5 },
        { number: 26, fortune: "大吉", message: "すべてが好転する時期です", god: "愛染明王", godReading: "あいぜんみょうおう", godNumber: 6 },
        { number: 27, fortune: "中吉", message: "恋愛運が高まっています", god: "愛染明王", godReading: "あいぜんみょうおう", godNumber: 6 },
        { number: 28, fortune: "小吉", message: "新しい縁に恵まれます", god: "愛染明王", godReading: "あいぜんみょうおう", godNumber: 6 },
        { number: 29, fortune: "吉", message: "心が満たされる出来事があります", god: "愛染明王", godReading: "あいぜんみょうおう", godNumber: 6 },
        { number: 30, fortune: "末吉", message: "自分を大切にする時期です", god: "愛染明王", godReading: "あいぜんみょうおう", godNumber: 6 },
        { number: 31, fortune: "大吉", message: "強い意志で乗り越えられます", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7 },
        { number: 32, fortune: "中吉", message: "困難を克服できる力があります", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7 },
        { number: 33, fortune: "小吉", message: "粘り強さが幸運を呼びます", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7 },
        { number: 34, fortune: "吉", message: "勇気を持って前進しましょう", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7 },
        { number: 35, fortune: "末吉", message: "忍耐が報われる時です", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7 },
        { number: 36, fortune: "大吉", message: "豊かさに恵まれます", god: "大黒天", godReading: "だいこくてん", godNumber: 8 },
        { number: 37, fortune: "中吉", message: "財運が向上します", god: "大黒天", godReading: "だいこくてん", godNumber: 8 },
        { number: 38, fortune: "小吉", message: "収入アップの可能性があります", god: "大黒天", godReading: "だいこくてん", godNumber: 8 },
        { number: 39, fortune: "吉", message: "貯蓄が増える兆しです", god: "大黒天", godReading: "だいこくてん", godNumber: 8 },
        { number: 40, fortune: "末吉", message: "無駄遣いに注意すれば安心です", god: "大黒天", godReading: "だいこくてん", godNumber: 8 },
        { number: 41, fortune: "特大吉", message: "今年最高の運気です", god: "弘法大師", godReading: "こうぼうだいし", godNumber: 9 },
        { number: 42, fortune: "ダブル大吉", message: "二重の幸運が訪れます", god: "興教大師", godReading: "こうぎょうだいし", godNumber: 10 },
        { number: 43, fortune: "果報吉", message: "寝れば寝るほど大吉が訪れます", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1 },
        { number: 44, fortune: "大吉", message: "今年は大躍進を遂げるでしょう", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1 },
        { number: 45, fortune: "みな吉", message: "自分と周囲が皆幸せな一年でしょう", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4 },
        { number: 46, fortune: "堅実吉", message: "とにかくまじめに頑張れば結果が出ます", god: "帝釈天", godReading: "たいしゃくてん", godNumber: 5 },
        { number: 47, fortune: "変化吉", message: "思ってる事をやってみましょう", god: "毘沙門天", godReading: "びしゃもんてん", godNumber: 5 },
        { number: 48, fortune: "中吉", message: "金運が良いでしょう", god: "大黒天", godReading: "だいこくてん", godNumber: 8 },
        { number: 49, fortune: "通い吉", message: "毎月パワースポットを巡ると幸運キープ", god: "三十三観音", godReading: "さんじゅうさんかんのん", godNumber: 13 },
        { number: 50, fortune: "旅吉", message: "いつか行きたい場所へ今年行きましょう", god: "弘法大師", godReading: "こうぼうだいし", godNumber: 9 },
        { number: 51, fortune: "縁切り吉", message: "悪縁、腐れ縁がやっと切れます", god: "青面金剛", godReading: "しょうめんこんごう", godNumber: 11 },
        { number: 52, fortune: "小吉", message: "もやもやが全て水に流せます", god: "水天", godReading: "すいてん", godNumber: 5 },
        { number: 53, fortune: "鬼吉", message: "強い心が身に付く年になります", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7 },
        { number: 54, fortune: "守護吉", message: "振れない心を得られる自信が付くでしょう", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7 }
    ]
};

let powerData = { power: 0, tapCount: 0, charging: false, complete: false, selectedResult: null, startTime: null, countdownTimer: null };

function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('errorMessage');
    
    if (input === simplePassword) {
        currentMode = 'simple';
        isAdminMode = false;
        sessionStorage.setItem('omikuji_auth', 'true');
        sessionStorage.setItem('omikuji_mode', 'simple');
    } else if (input === normalPassword) {
        currentMode = 'normal';
        isAdminMode = false;
        sessionStorage.setItem('omikuji_auth', 'true');
        sessionStorage.setItem('omikuji_mode', 'normal');
    } else if (input === adminPassword) {
        currentMode = 'admin';
        isAdminMode = true;
        sessionStorage.setItem('omikuji_auth', 'true');
        sessionStorage.setItem('omikuji_mode', 'admin');
    } else {
        errorMsg.classList.add('show');
        document.getElementById('passwordInput').value = '';
        return;
    }
    
    errorMsg.classList.remove('show');
    showOmikujiScreen();
    if (isAdminMode) enableAdminMode();
}

document.addEventListener('DOMContentLoaded', function() {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes blinkTriple {
            0% { opacity: 1; }
            16.6% { opacity: 0; }
            33.3% { opacity: 1; }
            50% { opacity: 0; }
            66.6% { opacity: 1; }
            83.3% { opacity: 0; }
            100% { opacity: 1; }
        }
        .blink-triple {
            animation: blinkTriple 2.1s ease-in-out forwards;
        }
        .inline-result {
            display: inline-block !important;
        }
        #resultNumber {
            margin-right: 15px; 
        }
    `;
    document.head.appendChild(styleSheet);

    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkPassword();
        });
    }

    // 確認ボタンのクリックイベント
    const checkBtn = document.getElementById('checkBtn');
    if (checkBtn) {
        checkBtn.addEventListener('click', checkPassword);
    }
    
    if (sessionStorage.getItem('omikuji_auth') === 'true') {
        const savedMode = sessionStorage.getItem('omikuji_mode');
        if (savedMode === 'simple') {
            currentMode = 'simple';
        } else if (savedMode === 'normal') {
            currentMode = 'normal';
        } else if (savedMode === 'admin') {
            currentMode = 'admin';
            isAdminMode = true;
        }
        
        showOmikujiScreen();
        if (isAdminMode) enableAdminMode();
    }
});

function showOmikujiScreen() {
    document.getElementById('passwordScreen').classList.add('hidden');
    document.getElementById('omikujiScreen').classList.add('active');
    
    // 【修正箇所】画面表示時に、結果や管理ナビ、参拝ガイドを確実に非表示にする
    document.getElementById('resultCard').classList.remove('show');
    document.getElementById('worshipGuide').classList.remove('show');
    document.getElementById('adminNavigation').classList.remove('show');
    document.getElementById('drawBtn').style.display = 'inline-block';
}

function drawOmikuji() {
    const button = document.getElementById('drawBtn');
    const resultCard = document.getElementById('resultCard');
    const powerContainer = document.getElementById('powerChargeContainer');
    
    button.style.display = 'none';
    resultCard.classList.remove('show');
    document.getElementById('worshipGuide').classList.remove('show');
    
    const idx = Math.floor(Math.random() * omikujiResults.results.length);
    const selectedResult = omikujiResults.results[idx];
    
    if (currentMode === 'simple') {
        powerData.selectedResult = selectedResult;
        setTimeout(showResult, 300);
    } else {
        powerContainer.classList.remove('active');
        powerContainer.classList.add('active');
        powerData.selectedResult = selectedResult;
        initPowerCharge();
    }
}

function initPowerCharge() {
    powerData.power = 0;
    powerData.tapCount = 0;
    powerData.charging = false;
    powerData.complete = false;
    powerData.startTime = null;
    
    if (powerData.countdownTimer) {
        clearInterval(powerData.countdownTimer);
        powerData.countdownTimer = null;
    }
    
    const countdownArea = document.getElementById('countdownArea');
    const gameArea = document.getElementById('gameArea');
    const countdownNumber = document.getElementById('countdownNumber');
    
    countdownArea.style.display = 'block';
    gameArea.style.display = 'none';
    
    let count = 3;
    countdownNumber.textContent = count;
    countdownNumber.classList.remove('start');
    vibrate(100);
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
            vibrate(100);
        } else {
            clearInterval(countdownInterval);
            countdownNumber.textContent = 'スタート！';
            countdownNumber.classList.add('start');
            vibrate([100, 50, 100]);
            
            setTimeout(() => {
                countdownArea.style.display = 'none';
                gameArea.style.display = 'flex';
                startPowerCharge();
            }, 800);
        }
    }, 1000);
}

function startPowerCharge() {
    powerData.charging = true;
    powerData.startTime = Date.now();
    
    const tapArea = document.getElementById('tapArea');
    const fill = document.getElementById('powerGaugeFill');
    const percentage = document.getElementById('powerPercentage');
    const cheerMsg = document.getElementById('cheerMessage');
    const tapDisplay = document.getElementById('tapCountDisplay');
    const gauge = document.getElementById('powerGauge');
    
    fill.style.width = '0%';
    percentage.textContent = '0%';
    cheerMsg.textContent = 'がんばれ！';
    tapDisplay.textContent = 'タップ数: 0';
    gauge.classList.remove('complete');
    cheerMsg.classList.remove('complete');
    
    const newTapArea = tapArea.cloneNode(true);
    tapArea.parentNode.replaceChild(newTapArea, tapArea);
    
    const handleTap = (e) => {
        e.preventDefault();
        if (!powerData.charging || powerData.complete) return;
        
        powerData.tapCount++;
        const increase = 8 + Math.floor(Math.random() * 3);
        powerData.power = Math.min(powerData.power + increase, 100);
        
        document.getElementById('powerGaugeFill').style.width = powerData.power + '%';
        document.getElementById('powerPercentage').textContent = Math.floor(powerData.power) + '%';
        document.getElementById('tapCountDisplay').textContent = 'タップ数: ' + powerData.tapCount;
        
        const msg = document.getElementById('cheerMessage');
        if (powerData.power < 30) {
            msg.textContent = 'もっと！もっと！';
        } else if (powerData.power < 60) {
            msg.textContent = 'いい調子！';
        } else if (powerData.power < 90) {
            msg.textContent = 'すごい！あと少し！';
        } else {
            msg.textContent = 'ラストスパート！';
        }
        
        newTapArea.classList.add('tapped');
        setTimeout(() => newTapArea.classList.remove('tapped'), 100);
        
        vibrate(30);
        
        if (powerData.power >= 100) {
            completePowerCharge();
        }
    };
    
    newTapArea.addEventListener('click', handleTap);
    newTapArea.addEventListener('touchstart', handleTap);
    
    powerData.countdownTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - powerData.startTime) / 1000);
        const remaining = 5 - elapsed;
        
        if (remaining <= 5 && remaining > 0 && powerData.tapCount === 0) {
            document.getElementById('cheerMessage').textContent = `あと${remaining}秒で終了します`;
        }
        
        if (remaining <= 0) {
            clearInterval(powerData.countdownTimer);
            powerData.countdownTimer = null;
            if (!powerData.complete) {
                completePowerCharge();
            }
        }
    }, 1000);
}

function completePowerCharge() {
    if (powerData.complete) return;
    
    powerData.complete = true;
    powerData.charging = false;
    
    if (powerData.countdownTimer) {
        clearInterval(powerData.countdownTimer);
        powerData.countdownTimer = null;
    }
    
    const gauge = document.getElementById('powerGauge');
    const cheerMsg = document.getElementById('cheerMessage');
    const tapArea = document.getElementById('tapArea');
    
    if (powerData.tapCount === 0) {
        cheerMsg.textContent = '時間切れです...';
    } else {
        gauge.classList.add('complete');
        cheerMsg.textContent = 'ご縁仏降臨☆';
        cheerMsg.classList.add('complete');
    }
    
    tapArea.style.pointerEvents = 'none';
    
    tapArea.style.pointerEvents = "auto";
    setTimeout(() => {
        showResult();
        powerData.power = 0;
        powerData.tapCount = 0;
        powerData.charging = false;
        powerData.complete = false;
        powerData.startTime = null;
    }, 1500);
}

function showResult() {
    const result = powerData.selectedResult;
    
    document.getElementById('powerChargeContainer').classList.remove('active');
    document.getElementById('drawBtn').style.display = 'inline-block';
    
    const resultCard = document.getElementById('resultCard');
    const resultNumEl = document.getElementById('resultNumber');
    const resultFortuneEl = document.getElementById('resultFortune');
    const resultMessageEl = document.getElementById('resultMessage');
    const resultGodEl = document.getElementById('resultGod');
    
    resultNumEl.textContent = `${result.number}番`;
    resultFortuneEl.textContent = result.fortune;
    resultMessageEl.textContent = result.message;
    
    resultNumEl.classList.add('inline-result');
    resultFortuneEl.classList.add('inline-result');
    
    const godHtml = `
        <div class=\"god-name\">${result.god}</div>
        <div class=\"god-reading\">(${result.godReading})</div>
        <div class=\"god-info\">ご縁仏の番号: ${result.godNumber}</div>
    `;
    resultGodEl.innerHTML = godHtml;
    
    resultNumEl.style.opacity = '0';
    resultFortuneEl.style.opacity = '0';
    resultMessageEl.style.opacity = '0';
    const godNameEl = resultGodEl.querySelector('.god-name');
    const godReadingEl = resultGodEl.querySelector('.god-reading');
    const godInfoEl = resultGodEl.querySelector('.god-info');
    godNameEl.style.opacity = '0';
    godReadingEl.style.opacity = '0';
    godInfoEl.style.opacity = '0';

    resultCard.classList.add('show');
    
    const BLINK_DURATION = 2100;
    const DELAY = 500;

    function applyBlink(elements) {
        elements.forEach(el => {
            el.style.opacity = '1';
            el.classList.remove('blink-triple');
            void el.offsetWidth;
            el.classList.add('blink-triple');
        });
    }

    setTimeout(() => {
        applyBlink([resultNumEl, resultFortuneEl]);
    }, 0);

    setTimeout(() => {
        applyBlink([resultMessageEl]);
    }, BLINK_DURATION + DELAY * 1);

    setTimeout(() => {
        applyBlink([godNameEl, godReadingEl]);
    }, BLINK_DURATION * 2 + DELAY * 2);

    setTimeout(() => {
        applyBlink([godInfoEl]);
    }, BLINK_DURATION * 3 + DELAY * 3);

    const FINAL_DELAY = BLINK_DURATION * 4 + DELAY * 4;

    setTimeout(() => {
        const wg = document.getElementById('worshipGuide');
        const title = wg.querySelector('.worship-guide-title');
        const imgs = wg.querySelectorAll('.temple-item');
        
        if (result.godNumber <= 5) {
            title.innerHTML = "薬師堂で参拝されまして<br>より深いご利益をお授かりください<br>ご縁仏の配置は画面一番下を参照下さい。";
            imgs[0].style.display = "block";
            imgs[0].querySelector('img').src = `image/1yakushidou.jpg`;
            imgs[0].querySelector('.temple-label').textContent = `薬師堂`;
            imgs[1].style.display = "block";
            imgs[1].querySelector('img').src = `image/${result.godNumber}.jpg`;
            imgs[1].querySelector('.temple-label').textContent = `ご縁仏 ${result.godNumber}`;
        } else if (result.godNumber <= 9) {
            title.innerHTML = "光龍閣で参拝されまして<br>より深いご利益をお授かりください<br>ご縁仏の配置は画面一番下を参照下さい。";
            imgs[0].style.display = "block";
            imgs[0].querySelector('img').src = `image/2kouryuukaku.jpg`;
            imgs[0].querySelector('.temple-label').textContent = `光龍閣`;
            imgs[1].style.display = "block";
            imgs[1].querySelector('img').src = `image/${result.godNumber}.jpg`;
            imgs[1].querySelector('.temple-label').textContent = `ご縁仏 ${result.godNumber}`;
        } else {
            title.innerHTML = "参拝されまして<br>より深いご利益をお授かりください。";
            imgs[0].style.display = "block";
            imgs[0].querySelector('img').src = `image/${result.godNumber}.jpg`;
            imgs[0].querySelector('.temple-label').textContent = `ご縁仏 ${result.godNumber}`;
            imgs[1].style.display = "none";
        }
        
        wg.classList.add('show');
        wg.scrollIntoView({ behavior: 'smooth', block: 'start' });
        vibrate(50);
    }, FINAL_DELAY + 300);

}

function enableAdminMode() {
    isAdminMode = true;
    currentIndex = 0;
    document.getElementById('drawBtn').style.display = 'none';
    document.getElementById('adminNavigation').classList.add('show');
    showAdminResult(currentIndex);
}

function showAdminResult(index) {
    const result = omikujiResults.results[index];
    
    const resultNumEl = document.getElementById('resultNumber');
    const resultFortuneEl = document.getElementById('resultFortune');

    resultNumEl.textContent = `${result.number}番`;
    resultFortuneEl.textContent = result.fortune;
    document.getElementById('resultMessage').textContent = result.message;
    
    resultNumEl.classList.add('inline-result');
    resultFortuneEl.classList.add('inline-result');

    const godHtml = `
        <div class=\"god-name\">${result.god}</div>
        <div class=\"god-reading\">(${result.godReading})</div>
        <div class=\"god-info\">ご縁仏の番号: ${result.godNumber}</div>
    `;
    document.getElementById('resultGod').innerHTML = godHtml;
    
    const animTargets = [
        resultNumEl,
        resultFortuneEl,
        document.getElementById('resultMessage'),
        document.querySelector('#resultGod .god-name'),
        document.querySelector('#resultGod .god-reading'),
        document.querySelector('#resultGod .god-info')
    ];
    
    animTargets.forEach(el => {
        if(el) {
            el.style.opacity = '1';
            el.classList.remove('blink-triple');
            void el.offsetWidth;
            el.classList.add('blink-triple');
        }
    });

    document.getElementById('resultCard').classList.add('show');
    
    const wg = document.getElementById('worshipGuide');
    const title = wg.querySelector('.worship-guide-title');
    const imgs = wg.querySelectorAll('.temple-item');
    
    if (result.godNumber <= 5) {
        title.innerHTML = "薬師堂で参拝されまして<br>より深いご利益をお授かりください<br>ご縁仏の配置は画面一番下を参照下さい。";
        imgs[0].style.display = "block";
        imgs[1].style.display = "none";
        imgs[0].querySelector('img').src = `image/1yakushidou.jpg`;
        imgs[0].querySelector('.temple-label').textContent = `薬師堂`;
    } else if (result.godNumber <= 9) {
        title.innerHTML = "光龍閣で参拝されまして<br>より深いご利益をお授かりください<br>ご縁仏の配置は画面一番下を参照下さい。";
        imgs[0].style.display = "none";
        imgs[1].style.display = "block";
        imgs[1].querySelector('img').src = `image/2kouryuukaku.jpg`;
        imgs[1].querySelector('.temple-label').textContent = `光龍閣`;
    } else {
        title.innerHTML = "ご縁仏を参拝されまして<br>より深いご利益をお授かりください<br>ご縁仏の配置は画面一番下を参照下さい。";
        imgs[0].style.display = "block";
        imgs[1].style.display = "block";
    }
    
    setTimeout(() => {
        wg.classList.add('show');
        wg.scrollIntoView({ behavior: 'smooth', block: 'start' });
        vibrate(50);
    }, 3000);
    
    document.getElementById('adminCounter').textContent = `${index + 1} / ${omikujiResults.results.length}`;
    document.getElementById('prevBtn').disabled = (index === 0);
    document.getElementById('nextBtn').disabled = (index === omikujiResults.results.length - 1);
}

function showPrevious() {
    if (currentIndex > 0) {
        currentIndex--;
        showAdminResult(currentIndex);
    }
}

function showNext() {
    if (currentIndex < omikujiResults.results.length - 1) {
        currentIndex++;
        showAdminResult(currentIndex);
    }
}