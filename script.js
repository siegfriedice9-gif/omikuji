// パスワード設定
const correctPassword = "1234";
const adminPassword = "2256";
let isAdminMode = false;
let currentIndex = 0;

// おみくじデータ
const omikujiResults = {
    results: [
        { number: 1, fortune: "大吉", message: "すべてにおいて良い運気です", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1, rate: "24%" },
        { number: 2, fortune: "中吉", message: "堅実に進めば良い結果が待っています", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1, rate: "37%" },
        { number: 3, fortune: "小吉", message: "小さな幸せを大切にしましょう", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1, rate: "48%" },
        { number: 4, fortune: "吉", message: "良い機会が訪れそうです", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1, rate: "33%" },
        { number: 5, fortune: "末吉", message: "じっくりと待つ時期です", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1, rate: "62%" },
        { number: 6, fortune: "大吉", message: "最高の運気が巡ってきました", god: "日光菩薩", godReading: "にっこうぼさつ", godNumber: 2, rate: "16%" },
        { number: 7, fortune: "中吉", message: "順調に物事が進むでしょう", god: "日光菩薩", godReading: "にっこうぼさつ", godNumber: 2, rate: "42%" },
        { number: 8, fortune: "小吉", message: "コツコツと努力が実ります", god: "日光菩薩", godReading: "にっこうぼさつ", godNumber: 2, rate: "55%" },
        { number: 9, fortune: "吉", message: "新しい出会いがありそうです", god: "日光菩薩", godReading: "にっこうぼさつ", godNumber: 2, rate: "38%" },
        { number: 10, fortune: "末吉", message: "焦らず着実に進みましょう", god: "日光菩薩", godReading: "にっこうぼさつ", godNumber: 2, rate: "68%" },
        { number: 11, fortune: "大吉", message: "願いが叶う予兆があります", god: "月光菩薩", godReading: "がっこうぼさつ", godNumber: 3, rate: "19%" },
        { number: 12, fortune: "中吉", message: "周囲の協力を得られるでしょう", god: "月光菩薩", godReading: "がっこうぼさつ", godNumber: 3, rate: "44%" },
        { number: 13, fortune: "小吉", message: "健康に気をつければ順調です", god: "月光菩薩", godReading: "がっこうぼさつ", godNumber: 3, rate: "58%" },
        { number: 14, fortune: "吉", message: "直感を信じて行動しましょう", god: "月光菩薩", godReading: "がっこうぼさつ", godNumber: 3, rate: "35%" },
        { number: 15, fortune: "末吉", message: "準備を整える時期です", god: "月光菩薩", godReading: "がっこうぼさつ", godNumber: 3, rate: "71%" },
        { number: 16, fortune: "大吉", message: "思わぬ幸運が舞い込みます", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4, rate: "21%" },
        { number: 17, fortune: "中吉", message: "人間関係が良好になります", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4, rate: "46%" },
        { number: 18, fortune: "小吉", message: "学びの機会に恵まれます", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4, rate: "59%" },
        { number: 19, fortune: "吉", message: "家族との絆が深まります", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4, rate: "40%" },
        { number: 20, fortune: "末吉", message: "心の平安を大切にしましょう", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4, rate: "73%" },
        { number: 21, fortune: "大吉", message: "大きな目標達成が近いです", god: "十二神将", godReading: "じゅうにしんしょう", godNumber: 5, rate: "18%" },
        { number: 22, fortune: "中吉", message: "仕事運が上昇します", god: "十二神将", godReading: "じゅうにしんしょう", godNumber: 5, rate: "43%" },
        { number: 23, fortune: "小吉", message: "金運に恵まれそうです", god: "十二神将", godReading: "じゅうにしんしょう", godNumber: 5, rate: "56%" },
        { number: 24, fortune: "吉", message: "旅行運が良好です", god: "十二神将", godReading: "じゅうにしんしょう", godNumber: 5, rate: "36%" },
        { number: 25, fortune: "末吉", message: "慎重に行動すれば安全です", god: "十二神将", godReading: "じゅうにしんしょう", godNumber: 5, rate: "69%" },
        { number: 26, fortune: "大吉", message: "すべてが好転する時期です", god: "愛染明王", godReading: "あいぜんみょうおう", godNumber: 6, rate: "20%" },
        { number: 27, fortune: "中吉", message: "恋愛運が高まっています", god: "愛染明王", godReading: "あいぜんみょうおう", godNumber: 6, rate: "45%" },
        { number: 28, fortune: "小吉", message: "新しい縁に恵まれます", god: "愛染明王", godReading: "あいぜんみょうおう", godNumber: 6, rate: "57%" },
        { number: 29, fortune: "吉", message: "心が満たされる出来事があります", god: "愛染明王", godReading: "あいぜんみょうおう", godNumber: 6, rate: "39%" },
        { number: 30, fortune: "末吉", message: "自分を大切にする時期です", god: "愛染明王", godReading: "あいぜんみょうおう", godNumber: 6, rate: "70%" },
        { number: 31, fortune: "大吉", message: "強い意志で乗り越えられます", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7, rate: "17%" },
        { number: 32, fortune: "中吉", message: "困難を克服できる力があります", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7, rate: "41%" },
        { number: 33, fortune: "小吉", message: "粘り強さが幸運を呼びます", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7, rate: "54%" },
        { number: 34, fortune: "吉", message: "勇気を持って前進しましょう", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7, rate: "34%" },
        { number: 35, fortune: "末吉", message: "忍耐が報われる時です", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7, rate: "67%" },
        { number: 36, fortune: "大吉", message: "豊かさに恵まれます", god: "大黒天", godReading: "だいこくてん", godNumber: 8, rate: "22%" },
        { number: 37, fortune: "中吉", message: "財運が向上します", god: "大黒天", godReading: "だいこくてん", godNumber: 8, rate: "47%" },
        { number: 38, fortune: "小吉", message: "収入アップの可能性があります", god: "大黒天", godReading: "だいこくてん", godNumber: 8, rate: "60%" },
        { number: 39, fortune: "吉", message: "貯蓄が増える兆しです", god: "大黒天", godReading: "だいこくてん", godNumber: 8, rate: "41%" },
        { number: 40, fortune: "末吉", message: "無駄遣いに注意すれば安心です", god: "大黒天", godReading: "だいこくてん", godNumber: 8, rate: "72%" },
        { number: 41, fortune: "特大吉", message: "今年最高の運気です", god: "弘法大師", godReading: "こうぼうだいし", godNumber: 9, rate: "8%" },
        { number: 42, fortune: "ダブル大吉", message: "二重の幸運が訪れます", god: "興教大師", godReading: "こうぎょうだいし", godNumber: 10, rate: "12%" },
        { number: 43, fortune: "果報吉", message: "寝れば寝るほど大吉が訪れます", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1, rate: "53%" },
        { number: 44, fortune: "大吉", message: "今年は大躍進を遂げるでしょう", god: "薬師如来", godReading: "やくしにょらい", godNumber: 1, rate: "23%" },
        { number: 45, fortune: "みな吉", message: "自分と周囲が皆幸せな一年でしょう", god: "十一面観音菩薩", godReading: "じゅういちめんかんのんぼさつ", godNumber: 4, rate: "32%" },
        { number: 46, fortune: "堅実吉", message: "とにかくまじめに頑張れば結果が出ます", god: "帝釈天", godReading: "たいしゃくてん", godNumber: 5, rate: "15%" },
        { number: 47, fortune: "変化吉", message: "思ってる事をやってみましょう", god: "毘沙門天", godReading: "びしゃもんてん", godNumber: 5, rate: "23%" },
        { number: 48, fortune: "中吉", message: "金運が良いでしょう", god: "大黒天", godReading: "だいこくてん", godNumber: 8, rate: "45%" },
        { number: 49, fortune: "通い吉", message: "毎月パワースポットを巡ると幸運キープ", god: "三十三観音", godReading: "さんじゅうさんかんのん", godNumber: 13, rate: "48%" },
        { number: 50, fortune: "旅吉", message: "いつか行きたい場所へ今年行きましょう", god: "弘法大師", godReading: "こうぼうだいし", godNumber: 9, rate: "14%" },
        { number: 51, fortune: "縁切り吉", message: "悪縁、腐れ縁がやっと切れます", god: "青面金剛", godReading: "しょうめんこんごう", godNumber: 11, rate: "63%" },
        { number: 52, fortune: "小吉", message: "もやもやが全て水に流せます", god: "水天", godReading: "すいてん", godNumber: 5, rate: "62%" },
        { number: 53, fortune: "鬼吉", message: "強い心が身に付く年になります", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7, rate: "26%" },
        { number: 54, fortune: "守護吉", message: "振れない心を得られる自信が付くでしょう", god: "不動明王", godReading: "ふどうみょうおう", godNumber: 7, rate: "42%" }
    ]
};

// パスワードチェック
function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('errorMessage');
    
    if (input === correctPassword) {
        isAdminMode = false;
        sessionStorage.setItem('omikuji_auth', 'true');
        sessionStorage.setItem('omikuji_admin', 'false');
        errorMsg.classList.remove('show');
        showOmikujiScreen();
    } else if (input === adminPassword) {
        isAdminMode = true;
        sessionStorage.setItem('omikuji_auth', 'true');
        sessionStorage.setItem('omikuji_admin', 'true');
        errorMsg.classList.remove('show');
        showOmikujiScreen();
        enableAdminMode();
    } else {
        errorMsg.classList.add('show');
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

// Enterキーでパスワード送信
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkPassword();
        });
    }
});

// おみくじ画面表示
function showOmikujiScreen() {
    document.getElementById('passwordScreen').classList.add('hidden');
    document.getElementById('omikujiScreen').classList.add('active');
}

// おみくじを引く
function drawOmikuji() {
    const button = document.getElementById('drawBtn');
    const resultCard = document.getElementById('resultCard');
    
    button.disabled = true;
    button.classList.add('spinning');
    button.textContent = '🔄 引いています...';
    resultCard.classList.remove('show', 'rare-glow');
    document.getElementById('worshipGuide').classList.remove('show');
    
    // ランダムに結果を選択
    const idx = Math.floor(Math.random() * omikujiResults.results.length);
    const result = omikujiResults.results[idx];
    
    // 1.5秒待機してから結果表示
    setTimeout(() => {
        document.getElementById('resultNumber').textContent = `第${result.number}番`;
        document.getElementById('resultFortune').textContent = result.fortune;
        document.getElementById('resultMessage').textContent = result.message;
        
        // ご縁仏の情報を表示
        const godHtml = `
            <div class="god-name">${result.god}</div>
            <div class="god-reading">(${result.godReading})</div>
            <div class="god-info">ご縁仏の番号: ${result.godNumber}</div>
        `;
        document.getElementById('resultGod').innerHTML = godHtml;
        
        const fortuneElement = document.getElementById('resultFortune');
        fortuneElement.classList.remove('rare');
        resultCard.classList.remove('rare-glow');
        
        resultCard.classList.add('show');
        
        // 参拝案内の表示内容切替（ご縁仏番号）
        const wg = document.getElementById('worshipGuide');
        const title = wg.querySelector('.worship-guide-title');
        const imgs = wg.querySelectorAll('.temple-item');
        if (result.godNumber <= 5) {
            title.innerHTML = "①薬師堂中で参拝されまして<br>より深いご利益をお授かりください。";
            imgs[0].style.display = "block";
            imgs[1].style.display = "none";
        } else if (result.godNumber <= 8) {
            title.innerHTML = "②光龍閣で参拝されまして<br>より深いご利益をお授かりください。";
            imgs[0].style.display = "none";
            imgs[1].style.display = "block";
        } else {
            title.innerHTML = "①薬師堂と②光龍閣で<br>参拝されまして<br>より深いご利益をお授かりください。";
            imgs[0].style.display = "block";
            imgs[1].style.display = "block";
        }
        
        // 参拝案内を遅延表示（結果表示の1.5秒後）
        setTimeout(() => {
            document.getElementById('worshipGuide').classList.add('show');
        }, 1500);
        
        button.classList.remove('spinning');
        button.disabled = false;
        button.textContent = '🎋 おみくじを引く';
    }, 1500);
}

// 管理者モード有効化
function enableAdminMode() {
    isAdminMode = true;
    currentIndex = 0;
    document.getElementById('drawBtn').style.display = 'none';
    document.getElementById('adminNavigation').classList.add('show');
    showAdminResult(currentIndex);
}

// 管理者モードで結果を表示
function showAdminResult(index) {
    const result = omikujiResults.results[index];
    const resultCard = document.getElementById('resultCard');
    
    document.getElementById('resultNumber').textContent = `第${result.number}番`;
    document.getElementById('resultFortune').textContent = result.fortune;
    document.getElementById('resultMessage').textContent = result.message;
    
    // ご縁仏の情報を表示
    const godHtml = `
        <div class="god-name">${result.god}</div>
        <div class="god-reading">(${result.godReading})</div>
        <div class="god-info">ご縁仏の番号: ${result.godNumber}</div>
    `;
    document.getElementById('resultGod').innerHTML = godHtml;
    
    resultCard.classList.add('show');
    
    // 参拝案内の表示内容切替（ご縁仏番号）
    const wg = document.getElementById('worshipGuide');
    const title = wg.querySelector('.worship-guide-title');
    const imgs = wg.querySelectorAll('.temple-item');
    if (result.godNumber <= 5) {
        title.innerHTML = "①薬師堂で参拝されまして<br>より深いご利益をお授かりください。";
        imgs[0].style.display = "block";
        imgs[1].style.display = "none";
    } else if (result.godNumber <= 8) {
        title.innerHTML = "②光龍閣で参拝されまして<br>より深いご利益をお授かりください。";
        imgs[0].style.display = "none";
        imgs[1].style.display = "block";
    } else {
        title.innerHTML = "①薬師堂と②光龍閣の両方で<br>参拝されまして<br>より深いご利益をお授かりください。";
        imgs[0].style.display = "block";
        imgs[1].style.display = "block";
    }
    
    document.getElementById('worshipGuide').classList.add('show');
    
    // カウンター更新
    document.getElementById('adminCounter').textContent = `${index + 1} / ${omikujiResults.results.length}`;
    
    // ボタンの有効/無効化
    document.getElementById('prevBtn').disabled = (index === 0);
    document.getElementById('nextBtn').disabled = (index === omikujiResults.results.length - 1);
}

// 前の結果を表示
function showPrevious() {
    if (currentIndex > 0) {
        currentIndex--;
        showAdminResult(currentIndex);
    }
}

// 次の結果を表示
function showNext() {
    if (currentIndex < omikujiResults.results.length - 1) {
        currentIndex++;
        showAdminResult(currentIndex);
    }
}

// セッションストレージから状態を復元
if (sessionStorage.getItem('omikuji_auth') === 'true') {
    document.addEventListener('DOMContentLoaded', function() {
        showOmikujiScreen();
        if (sessionStorage.getItem('omikuji_admin') === 'true') {
            enableAdminMode();
        }
    });
}
