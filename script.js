// 引入 Firebase 功能（必須放在最頂端）
import { submitScore, getLeaderboard } from './firebase.js';


// 隨機法號清單
const randomNames = [
    '升天大聖', '慧明法師', '無量真人', '渡劫散人',
    '逍遙道士', '般若居士', '清虛子', '無為真君',
    '悟空行者', '普渡神僧', '超然散人', '妙法禪師'
];

// 隨機取一個法號
function getRandomName() {
    return randomNames[Math.floor(Math.random() * randomNames.length)];
}

// 玩家名字，進入遊戲後設定
let playerName = '';

// 開始遊戲：儲存名字並隱藏遮罩
async function startGame() {
    const name = document.getElementById('player-name').value.trim();

    if (!name) {
        alert('請輸入名字！');
        return;
    }
/*
    // 檢查排行榜是否已有同名玩家
    const data = await getLeaderboard();
    const isDuplicate = data.some(item => item.name === name);

    if (isDuplicate) {
        alert(`「${name}」已經有人用了，請換一個法號！`);
        return;
    }
*/
    // 儲存名字
    playerName = name;

    // 進入遊戲時功德歸零，確保每個玩家從 0 開始
    count = 0;
    document.getElementById('count').textContent = count;
    localStorage.removeItem('merit');


    // 隱藏遮罩，顯示遊戲
    document.getElementById('name-screen').classList.add('hidden');
}

// 提交分數（現在直接用 playerName，不用再輸入）
async function handleSubmit() {
    if (!playerName) {
        alert('請先輸入名字！');
        return;
    }

    await submitScore(playerName, count);
    alert(`${playerName} 的 ${count} 功德已提交！`);
    loadLeaderboard();
}

// 用 localStorage 讀取上次的功德值，如果沒有就從 0 開始
let count = Number(localStorage.getItem('merit')) || 0;

// 頁面載入時，先把功德值顯示出來
document.getElementById('count').textContent = count;

// 每次敲擊時執行這個函式
function knock() {
    // 功德 +1
    count += 1;

    // 更新畫面上的數字
    document.getElementById('count').textContent = count;

    // 存入 localStorage 一個「鍵值對」的儲存空間，讓重新整理後不歸零
    localStorage.setItem('merit', count);

    // 觸發敲擊動畫
    playHitAnimation();

    // 產生浮字 ← 這行是新增的
    showFloatText();

}

// 觸發木魚棒和木魚的動畫
function playHitAnimation() {
    const stick = document.getElementById('stick');
    const muyu = document.getElementById('muyu');

    // 先移除 hitting class，讓動畫可以重複觸發
    stick.classList.remove('hitting');
    muyu.classList.remove('hitting');

    // 強制瀏覽器重新計算樣式，否則連續點擊動畫不會重播
    void stick.offsetWidth;

    // 加上 hitting class，開始播放動畫
    stick.classList.add('hitting');
    muyu.classList.add('hitting');
}


// 產生浮字的函式
function showFloatText() {
    // 建立一個新的 <span> 元素
    const el = document.createElement('span');

    // 套用浮字的 CSS 樣式
    el.classList.add('float-text');

    // 浮字內容
    el.textContent = '功德 +1';

    // 隨機水平位置，避免每次都在同一個地方。PS固定的像素值，視窗大小改變時浮字位置就會跑掉
    // el.style.left = (Math.random() * 10 + 300) + 'px';

    // 取得木魚的位置資訊，實際位置計算
    const muyuRect = document.getElementById('muyu').getBoundingClientRect();

    // 在木魚的水平範圍內隨機出現
    el.style.left = (muyuRect.left + Math.random() * muyuRect.width) + 'px';


    // 垂直位置固定在畫面中間偏下
    el.style.top = '50%';

    // 把浮字加入畫面
    document.body.appendChild(el);

    // 動畫播完後自動移除元素，避免垃圾堆積
    el.addEventListener('animationend', () => el.remove());
}



// 重新開始
function restart() {

    count = 0;

    // 更新畫面上的數字
    document.getElementById('count').textContent = count;

    // 清除 localStorage 裡的紀錄
    localStorage.removeItem('merit');
}






// 載入排行榜
async function loadLeaderboard() {
    const list = document.getElementById('leaderboard-list');

    // 清空舊資料
    list.innerHTML = '';

    const data = await getLeaderboard();

    // 把每筆資料加入排行榜
    data.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name}：${item.score} 功德`;
        list.appendChild(li);
    });
}



// 綁定點擊木魚
document.getElementById('muyu-wrap').addEventListener('click', knock);

// 綁定重新開始
document.getElementById('restart').addEventListener('click', restart);

// 綁定提交功德
document.getElementById('submit-btn').addEventListener('click', handleSubmit);

// 綁定重新整理排行榜
document.getElementById('refresh-btn').addEventListener('click', loadLeaderboard);

// 按空白鍵也能敲
document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') knock();
});

// 綁定開始按鈕
document.getElementById('start-btn').addEventListener('click', startGame);

// 點隨機法號按鈕，自動填入輸入框
document.getElementById('random-btn').addEventListener('click', function() {
  document.getElementById('player-name').value = getRandomName();
});

// 頁面載入時自動顯示排行榜
loadLeaderboard();