// パスワード設定
const simplePassword = "1234";    // 演出なし版
const normalPassword = "5678";    // 通常版（3つの演出）
const adminPassword = "2256";     // 管理者版
let currentMode = 'simple';       // 'simple', 'normal', 'admin'
let isAdminMode = false;
let currentIndex = 0;

// バイブレーション機能
function vibrate(pattern) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

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

// ルーレット用の変数（タップ1回、矢の演出版）
let rouletteData = {
    canvas: null,
    ctx: null,
    rotation: 0,
    rotationSpeed: 0.1,   // 初期速度
    maxSpeed: 0.5,        // 最高速度
    tapCount: 0,
    maxTaps: 1,           // タップ回数を1回に変更
    isSpinning: false,
    isStopping: false,
    selectedResult: null,
    animationFrame: null,
    arrowShot: false
};

// 高速カウンター用の変数
let counterData = {
    interval: null,
    currentIndex: 0,
    isRunning: false,
    isStopping: false,
    selectedResult: null,
    speed: 50  // 初期速度（ミリ秒）
};

// マインクラフト用の変数
let minecraftData = {
    totalBlocks: 9,
    brokenBlocks: 0,
    selectedResult: null
};

// パスワードチェック
function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('errorMessage');
    
    console.log('パスワードチェック開始');
    console.log('入力されたパスワード:', input);
    
    if (input === simplePassword) {
        console.log('演出なし版モードでログイン成功');
        currentMode = 'simple';
        isAdminMode = false;
        sessionStorage.setItem('omikuji_auth', 'true');
        sessionStorage.setItem('omikuji_mode', 'simple');
        errorMsg.classList.remove('show');
        showOmikujiScreen();
    } else if (input === normalPassword) {
        console.log('通常版モードでログイン成功');
        currentMode = 'normal';
        isAdminMode = false;
        sessionStorage.setItem('omikuji_auth', 'true');
        sessionStorage.setItem('omikuji_mode', 'normal');
        errorMsg.classList.remove('show');
        showOmikujiScreen();
    } else if (input === adminPassword) {
        console.log('管理者モードでログイン成功');
        currentMode = 'admin';
        isAdminMode = true;
        sessionStorage.setItem('omikuji_auth', 'true');
        sessionStorage.setItem('omikuji_mode', 'admin');
        errorMsg.classList.remove('show');
        showOmikujiScreen();
        enableAdminMode();
    } else {
        console.log('パスワードが間違っています');
        errorMsg.classList.add('show');
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

// Enterキーでパスワード送信
document.addEventListener('DOMContentLoaded', function() {
    console.log('ページ読み込み完了');
    
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkPassword();
        });
        console.log('パスワード入力欄: OK');
    } else {
        console.error('パスワード入力欄が見つかりません');
    }
    
    // おみくじボタンの確認
    const drawBtn = document.getElementById('drawBtn');
    if (drawBtn) {
        console.log('おみくじボタン: OK');
        console.log('ボタンの表示状態:', window.getComputedStyle(drawBtn).display);
        
        // ボタンのクリックイベントも追加で設定（onclickが動かない場合の保険）
        drawBtn.addEventListener('click', function(e) {
            console.log('ボタンがクリックされました（addEventListener経由）');
            // onclickが設定されている場合は重複実行を防ぐ
            if (!drawBtn.onclick) {
                drawOmikuji();
            }
        });
    } else {
        console.error('おみくじボタンが見つかりません');
    }
});

// おみくじ画面表示
function showOmikujiScreen() {
    console.log('showOmikujiScreen() 呼び出し');
    const passwordScreen = document.getElementById('passwordScreen');
    const omikujiScreen = document.getElementById('omikujiScreen');
    
    console.log('passwordScreen:', passwordScreen);
    console.log('omikujiScreen:', omikujiScreen);
    
    passwordScreen.classList.add('hidden');
    omikujiScreen.classList.add('active');
    
    console.log('おみくじ画面を表示しました');
    
    // ボタンが表示されているか確認
    setTimeout(() => {
        const drawBtn = document.getElementById('drawBtn');
        if (drawBtn) {
            const displayStyle = window.getComputedStyle(drawBtn).display;
            console.log('おみくじボタンの表示状態:', displayStyle);
            if (displayStyle === 'none') {
                console.warn('警告: おみくじボタンが非表示です！');
            }
        }
    }, 100);
}

// おみくじを引く
function drawOmikuji() {
    console.log('========================================');
    console.log('drawOmikuji() が呼び出されました！');
    console.log('現在のモード:', currentMode);
    console.log('========================================');
    
    const button = document.getElementById('drawBtn');
    const resultCard = document.getElementById('resultCard');
    const rouletteContainer = document.getElementById('rouletteContainer');
    const counterContainer = document.getElementById('counterContainer');
    const minecraftContainer = document.getElementById('minecraftContainer');
    
    console.log('要素の確認:');
    console.log('- button:', button);
    console.log('- resultCard:', resultCard);
    console.log('- rouletteContainer:', rouletteContainer);
    console.log('- counterContainer:', counterContainer);
    console.log('- minecraftContainer:', minecraftContainer);
    
    if (!button) {
        console.error('エラー: drawBtn が見つかりません！');
        return;
    }
    
    // ボタンを隠して演出開始
    button.style.display = 'none';
    resultCard.classList.remove('show', 'rare-glow');
    document.getElementById('worshipGuide').classList.remove('show');
    
    // ランダムに結果を選択（事前に決定）
    const idx = Math.floor(Math.random() * omikujiResults.results.length);
    const selectedResult = omikujiResults.results[idx];
    
    // モードによって処理を分岐
    if (currentMode === 'simple') {
        // 演出なし版：すぐに結果を表示
        console.log('演出なし版：即座に結果を表示します');
        rouletteData.selectedResult = selectedResult;
        counterData.selectedResult = selectedResult;
        minecraftData.selectedResult = selectedResult;
        
        // すべての演出を非表示
        rouletteContainer.classList.remove('active');
        counterContainer.classList.remove('active');
        minecraftContainer.classList.remove('active');
        
        // 少し待ってから結果を表示（ボタンが消える演出のため）
        setTimeout(() => {
            showResult();
        }, 300);
        
    } else {
        // 通常版：3つの演出のいずれかをランダムに選択
        console.log('通常版：演出を選択します');
        
        // ランダムに演出を選択（33%ずつの確率）
        const randomValue = Math.random();
        let enshutuType;
        
        if (randomValue < 0.33) {
            enshutuType = 'roulette';
        } else if (randomValue < 0.66) {
            enshutuType = 'counter';
        } else {
            enshutuType = 'minecraft';
        }
        
        console.log('選択された演出:', enshutuType);
        console.log('選択された結果:', selectedResult);
        
        // すべての演出を非表示
        rouletteContainer.classList.remove('active');
        counterContainer.classList.remove('active');
        minecraftContainer.classList.remove('active');
        
        if (enshutuType === 'roulette') {
            // ルーレット演出
            rouletteContainer.classList.add('active');
            rouletteData.selectedResult = selectedResult;
            initRoulette();
        } else if (enshutuType === 'counter') {
            // 高速カウンター演出
            counterContainer.classList.add('active');
            counterData.selectedResult = selectedResult;
            initCounter();
        } else {
            // マインクラフト演出
            console.log('マインクラフト演出開始');
            minecraftContainer.classList.add('active');
            minecraftData.selectedResult = selectedResult;
            initMinecraft();
        }
    }
}

// ルーレットの初期化
function initRoulette() {
    rouletteData.canvas = document.getElementById('rouletteCanvas');
    rouletteData.ctx = rouletteData.canvas.getContext('2d');
    rouletteData.rotation = 0;
    rouletteData.rotationSpeed = 0.1;
    rouletteData.tapCount = 0;
    rouletteData.isSpinning = true;
    rouletteData.isStopping = false;
    rouletteData.arrowShot = false;
    
    // ダーツを表示
    const dart = document.getElementById('dart');
    const canvas = document.getElementById('rouletteCanvas');
    const pointer = document.querySelector('.roulette-pointer');
    
    dart.className = 'dart ready';
    canvas.classList.remove('zooming');
    pointer.classList.remove('zooming');
    
    // メッセージをリセット
    document.getElementById('rouletteText').textContent = '画面をタップしてください！';
    document.getElementById('rouletteText').classList.remove('stopping');
    
    // タップイベントを設定
    const container = document.getElementById('rouletteContainer');
    container.onclick = handleRouletteTap;
    
    // ルーレットを描画開始
    drawRouletteWheel();
}

// ルーレットをタップ
function handleRouletteTap() {
    if (rouletteData.isStopping || !rouletteData.isSpinning || rouletteData.arrowShot) return;
    
    rouletteData.tapCount++;
    rouletteData.arrowShot = true;
    
    const dart = document.getElementById('dart');
    const canvas = document.getElementById('rouletteCanvas');
    const pointer = document.querySelector('.roulette-pointer');
    
    // タップエフェクト
    canvas.classList.add('tap-effect');
    setTimeout(() => canvas.classList.remove('tap-effect'), 100);
    
    // メッセージ変更
    document.getElementById('rouletteText').textContent = 'ダーツが飛んでいます...';
    document.getElementById('tapCounter').style.display = 'none';
    
    // ダーツを飛ばす
    dart.classList.remove('ready');
    dart.classList.add('flying');
    
    // クリックイベントを無効化
    document.getElementById('rouletteContainer').onclick = null;
    
    // ダーツが刺さる（0.6秒後）
    setTimeout(() => {
        dart.classList.remove('flying');
        dart.classList.add('stuck', 'vibrating');
        
        // 刺さった瞬間にバイブレーション
        vibrate(100);
        
        // 振動を0.3秒後に停止
        setTimeout(() => {
            dart.classList.remove('vibrating');
            
            // 拡大演出を開始（0.5秒後）
            setTimeout(() => {
                document.getElementById('rouletteText').textContent = '結果を確認中...';
                canvas.classList.add('zooming');
                pointer.classList.add('zooming');
                dart.classList.add('zooming');
                
                // 拡大表示を1.5秒間保持してから停止開始
                setTimeout(() => {
                    stopRoulette();
                }, 1500);
            }, 500);
        }, 320);
    }, 600);
}

// ルーレットを停止
function stopRoulette() {
    rouletteData.isStopping = true;
    document.getElementById('rouletteText').textContent = '停止中...';
    document.getElementById('rouletteText').classList.add('stopping');
    document.getElementById('tapCounter').style.display = 'none';
    
    // クリックイベントを無効化
    document.getElementById('rouletteContainer').onclick = null;
    
    // バイブレーション開始（3.5秒間継続）
    vibrate([100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100, 50, 100]);
    
    // 選択された結果に対応する角度を計算
    const selectedIndex = omikujiResults.results.findIndex(
        r => r.number === rouletteData.selectedResult.number
    );
    const sectionCount = omikujiResults.results.length;
    const anglePerSection = (Math.PI * 2) / sectionCount;
    
    // 目標角度を計算（上部のポインター▼に合わせる）
    // ポインターは上部（-Math.PI/2の位置）にあるので、選択されたセクションの中央が上に来るようにする
    const targetAngle = -(selectedIndex * anglePerSection + anglePerSection / 2) - (Math.PI / 2);
    
    // 現在の角度を0〜2πの範囲に正規化
    let currentAngle = rouletteData.rotation % (Math.PI * 2);
    if (currentAngle < 0) currentAngle += Math.PI * 2;
    
    // 目標角度も0〜2πの範囲に正規化
    let normalizedTarget = targetAngle % (Math.PI * 2);
    if (normalizedTarget < 0) normalizedTarget += Math.PI * 2;
    
    // 最低でも4回転させる（より長い演出）
    const minRotations = 4;
    const finalTarget = rouletteData.rotation - currentAngle + normalizedTarget + (Math.PI * 2 * minRotations);
    
    // イージングを使った減速アニメーション
    const startRotation = rouletteData.rotation;
    const startTime = Date.now();
    const duration = 3500; // 3.5秒かけて停止（より長く）
    
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    const animateStop = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        rouletteData.rotation = startRotation + (finalTarget - startRotation) * easedProgress;
        
        if (progress < 1) {
            rouletteData.animationFrame = requestAnimationFrame(animateStop);
        } else {
            // 完全停止
            rouletteData.rotation = finalTarget;
            rouletteData.rotationSpeed = 0;
            rouletteData.isSpinning = false;
            
            // 最後に一度描画
            drawRouletteWheel();
            
            // 停止時に強めのバイブレーション
            vibrate(200);
            
            // 結果を表示
            setTimeout(showResult, 800);
        }
    };
    
    // 通常の回転を停止
    rouletteData.rotationSpeed = 0;
    
    // イージングアニメーション開始
    animateStop();
}

// ルーレットホイールを描画
function drawRouletteWheel() {
    const canvas = rouletteData.canvas;
    const ctx = rouletteData.ctx;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    
    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 回転を更新（通常回転中のみ）
    if (rouletteData.isSpinning && rouletteData.rotationSpeed > 0) {
        rouletteData.rotation += rouletteData.rotationSpeed;
    }
    
    // 54個のセクションを描画
    const sectionCount = omikujiResults.results.length;
    const anglePerSection = (Math.PI * 2) / sectionCount;
    
    for (let i = 0; i < sectionCount; i++) {
        const startAngle = rouletteData.rotation + (i * anglePerSection);
        const endAngle = startAngle + anglePerSection;
        
        // セクションの色（交互）
        const colors = ['#d4af37', '#ffd700', '#8b4513', '#a0541a'];
        ctx.fillStyle = colors[i % colors.length];
        
        // セクションを描画
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        
        // 境界線
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 番号を描画
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSection / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(omikujiResults.results[i].number, radius * 0.7, 0);
        ctx.restore();
    }
    
    // 中央の円
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#8b4513';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 中央のテキスト
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('おみくじ', centerX, centerY);
    
    // 次のフレームをリクエスト（通常回転中または停止アニメーション中）
    if ((rouletteData.isSpinning && rouletteData.rotationSpeed > 0) || rouletteData.isStopping) {
        rouletteData.animationFrame = requestAnimationFrame(drawRouletteWheel);
    }
}

// 結果を表示
function showResult() {
    const result = rouletteData.selectedResult || counterData.selectedResult || minecraftData.selectedResult;
    const rouletteContainer = document.getElementById('rouletteContainer');
    const counterContainer = document.getElementById('counterContainer');
    const minecraftContainer = document.getElementById('minecraftContainer');
    const button = document.getElementById('drawBtn');
    const resultCard = document.getElementById('resultCard');
    const dart = document.getElementById('dart');
    const canvas = document.getElementById('rouletteCanvas');
    const pointer = document.querySelector('.roulette-pointer');
    
    // すべての演出を非表示
    rouletteContainer.classList.remove('active');
    counterContainer.classList.remove('active');
    minecraftContainer.classList.remove('active');
    
    // ダーツと拡大をリセット
    dart.className = 'dart';
    canvas.classList.remove('zooming');
    pointer.classList.remove('zooming');
    
    // タップカウンターを再表示（次回のため）
    document.getElementById('tapCounter').style.display = 'inline-block';
    
    // ボタンを再表示
    button.style.display = 'inline-block';
    
    // 結果を表示
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
    
    // 参拝案内を遅延表示（結果表示の1秒後）
    setTimeout(() => {
        document.getElementById('worshipGuide').classList.add('show');
        
        // 参拝案内が表示された後、ゆっくりスクロール（さらに0.5秒後）
        setTimeout(() => {
            scrollToWorshipGuide();
        }, 500);
    }, 1000);
}

// 参拝案内までゆっくりスクロールする関数
function scrollToWorshipGuide() {
    const worshipGuide = document.getElementById('worshipGuide');
    
    if (worshipGuide) {
        console.log('参拝案内までスクロールします');
        
        // スムーズスクロール
        worshipGuide.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // バイブレーション（スクロール開始時）
        vibrate(50);
    }
}

// === 高速カウンター演出の関数 ===

// 高速カウンターの初期化
function initCounter() {
    counterData.currentIndex = 0;
    counterData.isRunning = true;
    counterData.isStopping = false;
    counterData.speed = 50;
    
    const stopBtn = document.getElementById('stopBtn');
    const fortuneDisplay = document.getElementById('fortuneDisplay');
    
    // ボタンを無効化
    stopBtn.disabled = true;
    stopBtn.classList.remove('pressed');
    fortuneDisplay.classList.remove('slowing', 'stopped');
    fortuneDisplay.classList.add('running');
    
    // カウンター開始
    startCounter();
    
    // 0.5〜1.5秒後にボタンを有効化
    const enableDelay = 500 + Math.random() * 1000;
    setTimeout(() => {
        if (counterData.isRunning && !counterData.isStopping) {
            stopBtn.disabled = false;
        }
    }, enableDelay);
}

// カウンター開始
function startCounter() {
    const fortuneDisplay = document.getElementById('fortuneDisplay');
    
    const updateFortune = () => {
        if (!counterData.isRunning) return;
        
        // ランダムに運勢を表示
        counterData.currentIndex = Math.floor(Math.random() * omikujiResults.results.length);
        const currentFortune = omikujiResults.results[counterData.currentIndex].fortune;
        fortuneDisplay.textContent = currentFortune;
        
        // 次の更新をスケジュール
        if (counterData.isRunning && !counterData.isStopping) {
            counterData.interval = setTimeout(updateFortune, counterData.speed);
        }
    };
    
    updateFortune();
}

// ストップボタンを押す
function stopCounter() {
    if (!counterData.isRunning || counterData.isStopping) return;
    
    counterData.isStopping = true;
    
    const stopBtn = document.getElementById('stopBtn');
    const fortuneDisplay = document.getElementById('fortuneDisplay');
    
    // ボタンを無効化
    stopBtn.disabled = true;
    stopBtn.classList.add('pressed');
    
    // カウンターを停止
    clearTimeout(counterData.interval);
    
    // runningクラスを削除
    fortuneDisplay.classList.remove('running');
    fortuneDisplay.classList.add('slowing');
    
    // バイブレーション開始（減速中）
    vibrate([50, 30, 50, 30, 50, 30, 50, 30, 50, 30, 50, 30, 50, 30, 50]);
    
    // 減速処理
    let slowdownSteps = 0;
    const maxSlowdownSteps = 10;
    
    const slowDown = () => {
        slowdownSteps++;
        counterData.speed = 50 + (slowdownSteps * 30); // 徐々に遅くする
        
        // ランダムに運勢を表示
        counterData.currentIndex = Math.floor(Math.random() * omikujiResults.results.length);
        const currentFortune = omikujiResults.results[counterData.currentIndex].fortune;
        fortuneDisplay.textContent = currentFortune;
        
        if (slowdownSteps < maxSlowdownSteps) {
            setTimeout(slowDown, counterData.speed);
        } else {
            // 完全停止 - 選ばれた結果を表示
            setTimeout(() => {
                fortuneDisplay.textContent = counterData.selectedResult.fortune;
                fortuneDisplay.classList.remove('slowing');
                fortuneDisplay.classList.add('stopped');
                counterData.isRunning = false;
                
                // 停止時に強めのバイブレーション
                vibrate(200);
                
                // 結果画面へ
                setTimeout(() => {
                    showResult();
                }, 1500);
            }, counterData.speed);
        }
    };
    
    slowDown();
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
        title.innerHTML = "①薬師堂中で参拝されまして<br>より深いご利益をお授かりください。";
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
    
    // 参拝案内が表示された後、ゆっくりスクロール
    setTimeout(() => {
        scrollToWorshipGuide();
    }, 500);
    
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
    console.log('セッションストレージから認証状態を復元します');
    document.addEventListener('DOMContentLoaded', function() {
        const savedMode = sessionStorage.getItem('omikuji_mode');
        console.log('保存されたモード:', savedMode);
        
        if (savedMode === 'simple') {
            currentMode = 'simple';
            isAdminMode = false;
            console.log('演出なし版モードを復元');
        } else if (savedMode === 'normal') {
            currentMode = 'normal';
            isAdminMode = false;
            console.log('通常版モードを復元');
        } else if (savedMode === 'admin') {
            currentMode = 'admin';
            isAdminMode = true;
            console.log('管理者モードを復元');
        }
        
        console.log('認証済みのため、おみくじ画面を表示します');
        showOmikujiScreen();
        
        if (isAdminMode) {
            console.log('管理者モードを有効化します');
            enableAdminMode();
        }
    });
}

// === マインクラフト演出の関数 ===

// マインクラフト演出の初期化
function initMinecraft() {
    console.log('initMinecraft() 開始');
    minecraftData.brokenBlocks = 0;
    
    const blockGrid = document.getElementById('blockGrid');
    const treasureChest = document.getElementById('treasureChest');
    
    console.log('blockGrid:', blockGrid);
    console.log('treasureChest:', treasureChest);
    
    if (!blockGrid) {
        console.error('blockGrid要素が見つかりません！');
        return;
    }
    
    if (!treasureChest) {
        console.error('treasureChest要素が見つかりません！');
        return;
    }
    
    // 既存のブロックをクリア
    blockGrid.innerHTML = '';
    treasureChest.classList.remove('show', 'opening');
    treasureChest.style.display = 'none';
    
    // 9個のブロックを生成
    for (let i = 0; i < minecraftData.totalBlocks; i++) {
        const block = document.createElement('div');
        block.className = 'block';
        block.setAttribute('data-index', i);
        block.style.cursor = 'pointer';
        
        // タッチとクリック両方に対応
        block.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('ブロック' + i + 'がクリックされました');
            breakBlock(this);
        });
        
        block.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('ブロック' + i + 'がタッチされました');
            breakBlock(this);
        });
        
        blockGrid.appendChild(block);
    }
    
    console.log('ブロック生成完了:', blockGrid.children.length + '個');
    
    // ブロックが正しく表示されているか確認
    setTimeout(() => {
        const blocks = blockGrid.querySelectorAll('.block');
        console.log('表示されているブロック数:', blocks.length);
        blocks.forEach((block, index) => {
            console.log('ブロック' + index + ':', block);
        });
    }, 100);
}

// ブロックを壊す
function breakBlock(blockElement) {
    console.log('breakBlock() 呼び出し');
    
    if (!blockElement) {
        console.error('blockElement が null です');
        return;
    }
    
    if (blockElement.classList.contains('breaking')) {
        console.log('既に壊れているブロックです');
        return;
    }
    
    console.log('ブロックを壊します');
    blockElement.classList.add('breaking');
    blockElement.style.pointerEvents = 'none';
    
    // ブロック破壊時のバイブレーション
    vibrate(50);
    
    minecraftData.brokenBlocks++;
    console.log('壊れたブロック数:', minecraftData.brokenBlocks, '/', minecraftData.totalBlocks);
    
    // すべてのブロックを壊したら宝箱を表示
    if (minecraftData.brokenBlocks >= minecraftData.totalBlocks) {
        console.log('全ブロック破壊完了！宝箱を表示します');
        setTimeout(() => {
            showTreasureChest();
        }, 600);
    }
}

// 宝箱を表示
function showTreasureChest() {
    console.log('showTreasureChest() 開始');
    const treasureChest = document.getElementById('treasureChest');
    
    if (!treasureChest) {
        console.error('treasureChest要素が見つかりません！');
        return;
    }
    
    treasureChest.style.display = 'block';
    treasureChest.classList.add('show');
    treasureChest.style.cursor = 'pointer';
    
    // 宝箱出現時のバイブレーション
    vibrate([100, 50, 100]);
    
    // 宝箱をクリック可能にする（クリックとタッチ両方）
    const openChest = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('宝箱がクリックされました');
        openTreasureChest();
    };
    
    treasureChest.addEventListener('click', openChest);
    treasureChest.addEventListener('touchstart', openChest);
    
    console.log('宝箱表示完了、クリック待機中');
}

// 宝箱を開く
function openTreasureChest() {
    console.log('openTreasureChest() 開始');
    const treasureChest = document.getElementById('treasureChest');
    
    if (!treasureChest) {
        console.error('treasureChest要素が見つかりません！');
        return;
    }
    
    treasureChest.classList.add('opening');
    treasureChest.style.pointerEvents = 'none';
    
    // 宝箱を開けた時のバイブレーション
    vibrate(150);
    
    // 結果を表示（光の演出が完了するまで待つ）
    setTimeout(() => {
        console.log('結果を表示します');
        showResult();
    }, 1000);
}
