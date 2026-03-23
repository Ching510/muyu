
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
    // 跳出確認視窗，避免誤觸
    if (!confirm('確定要清除所有功德嗎？')) return;
    count = 0;

    // 更新畫面上的數字
    document.getElementById('count').textContent = count;

    // 清除 localStorage 裡的紀錄
    localStorage.removeItem('merit');
}

// 監聽鍵盤，按下空白鍵也能敲
document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        knock();
    }
});
