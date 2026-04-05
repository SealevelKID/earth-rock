// ==============================
// --- 學生進度追蹤系統 ---
// ==============================
const studentProgress = {
    screenTimes: {},           // 紀錄各頁面/頁籤停留的總毫秒數
    clickedButtons: new Set(), // 紀錄按過的關鍵按鈕 ID
    isCompleted: false         // 是否全部完成
};

let currentViewId = 'screen-map'; // 初始畫面
let viewEntryTime = Date.now();   // 進入畫面的時間點

// 結算當前畫面停留時間的函數
function recordViewTime() {
    const timeSpent = Date.now() - viewEntryTime;
    if (!studentProgress.screenTimes[currentViewId]) {
        studentProgress.screenTimes[currentViewId] = 0;
    }
    studentProgress.screenTimes[currentViewId] += timeSpent;
}

// 切換畫面/頁籤時，重新計時的函數
function updateCurrentView(newViewId) {
    recordViewTime();           // 先把上一個畫面的時間存起來
    currentViewId = newViewId;  // 更新現在的畫面 ID
    viewEntryTime = Date.now(); // 重新開始滴答計時
}
// 記錄學生完成了哪個重要動作
function trackAction(actionId) {
    studentProgress.clickedButtons.add(actionId);
    // console.log("已記錄動作：", actionId); // 開發測試時可以把這行打開，方便觀察
}
// --- 導航邏輯 ---
const btnBackMap = document.getElementById('btn-back-map');

function navTo(screenId) {
    updateCurrentView(screenId); // 🌟 新增這行：記錄切換時間

    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    if (screenId === 'screen-map') {
        btnBackMap.classList.add('hidden');
    } else {
        btnBackMap.classList.remove('hidden');
    }
}

btnBackMap.addEventListener('click', () => navTo('screen-map'));

// --- 關卡一：頁籤切換邏輯 (補回) ---
function switchTab(tabId) {
    updateCurrentView(`task-1-${tabId}`); // 🌟 新增這行：記錄切換時間
    // 隱藏兩個任務區塊
    document.getElementById('task-1-1').classList.add('hidden');
    document.getElementById('task-1-2').classList.add('hidden');

    // 按鈕重置為灰色狀態
    const btn1 = document.getElementById('tab-btn-1');
    const btn2 = document.getElementById('tab-btn-2');
    btn1.className = "bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-t-lg font-bold transition shadow-inner";
    btn2.className = "bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-t-lg font-bold transition shadow-inner";

    // 顯示被點擊的區塊與按鈕高亮
    document.getElementById(`task-1-${tabId}`).classList.remove('hidden');
    if (tabId === 1) {
        btn1.className = "bg-blue-500 text-white px-4 py-2 rounded-t-lg font-bold transition";
    } else {
        btn2.className = "bg-blue-500 text-white px-4 py-2 rounded-t-lg font-bold transition";
    }
}
// --- 關卡二：頁籤切換邏輯 ---
function switchTabL2(tabId) {
    updateCurrentView(`task-2-${tabId}`); // 🌟 新增這行：記錄切換時間
    // 1. 隱藏兩個任務區塊
    document.getElementById('task-2-1').classList.add('hidden');
    document.getElementById('task-2-2').classList.add('hidden');

    // 2. 按鈕重置為灰色未選取狀態
    const btn1 = document.getElementById('tab-l2-btn-1');
    const btn2 = document.getElementById('tab-l2-btn-2');
    btn1.className = "bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-t-lg font-bold transition shadow-inner";
    btn2.className = "bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-t-lg font-bold transition shadow-inner";

    // 3. 顯示被點擊的區塊與按鈕高亮 (青色)
    document.getElementById(`task-2-${tabId}`).classList.remove('hidden');
    if (tabId === 1) {
        btn1.className = "bg-cyan-500 text-white px-4 py-2 rounded-t-lg font-bold transition";
    } else {
        btn2.className = "bg-cyan-500 text-white px-4 py-2 rounded-t-lg font-bold transition";
    }
}

// --- 關卡一：臺灣誕生時光機 (補回) ---
function updateTimeMachine(value) {
    trackAction('task_1_1_slider'); // 🌟 新增：記錄拉動時光機
    const val = parseInt(value);

    const layer2 = document.getElementById('layer-2');
    val >= 2 ? layer2.classList.replace('opacity-0', 'opacity-100') : layer2.classList.replace('opacity-100', 'opacity-0');

    const layer3 = document.getElementById('layer-3');
    val >= 3 ? layer3.classList.replace('opacity-0', 'opacity-100') : layer3.classList.replace('opacity-100', 'opacity-0');

    const layer4 = document.getElementById('layer-4');
    val >= 4 ? layer4.classList.replace('opacity-0', 'opacity-100') : layer4.classList.replace('opacity-100', 'opacity-0');

    const layer5 = document.getElementById('layer-5');
    val >= 5 ? layer5.classList.replace('opacity-0', 'opacity-100') : layer5.classList.replace('opacity-100', 'opacity-0');
}
// 🌟 加入第二個參數 title，如果沒傳遞就預設為 "哎呀，放錯囉！"
function showErrorModal(text, title = "哎呀，放錯囉！") {
    const modal = document.getElementById('error-modal');
    const modalContent = document.getElementById('error-modal-content');
    const errorText = document.getElementById('error-modal-text');
    const errorTitle = document.getElementById('error-modal-title'); // 🌟 抓取標題元素

    errorTitle.innerHTML = title; // 🌟 替換成我們傳入的標題
    errorText.innerHTML = text;
    modal.classList.remove('hidden');

    // 延遲一點點時間觸發動畫
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);
}

function closeErrorModal() {
    const modal = document.getElementById('error-modal');
    const modalContent = document.getElementById('error-modal-content');

    // 先播放退場動畫 (變透明、縮小)
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');

    // 等動畫結束(300毫秒)後，再把容器徹底隱藏
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// --- 關卡一：分類遊戲 (點擊、拖曳與說明機制) ---
let selectedForceItem = null;
let selectedForceType = null;

// 1. 顯示卡片說明的函數
function showDescription(text) {
    document.getElementById('force-description').innerHTML = `<span class="text-blue-700">${text}</span>`;
}
function clearDescription() {
    document.getElementById('force-description').innerHTML = "請點選或將游標移至卡片上。";
}

// 2. 綁定卡片的事件 (點擊、懸停、拖曳起點)
function setupCards() {
    document.querySelectorAll('.force-card').forEach(card => {
        // 點擊選取 (平板/PC 通用)
        card.onclick = () => {
            document.querySelectorAll('.force-card').forEach(el => el.classList.remove('selected-item'));
            card.classList.add('selected-item');
            selectedForceItem = card;
            selectedForceType = card.getAttribute('data-type');
            showDescription(card.getAttribute('data-desc'));
        };
        // 滑鼠懸停顯示說明 (PC 專用)
        card.onmouseenter = () => showDescription(card.getAttribute('data-desc'));
        card.onmouseleave = () => {
            if (selectedForceItem) {
                showDescription(selectedForceItem.getAttribute('data-desc')); // 恢復顯示被選取的卡片
            } else {
                clearDescription();
            }
        };
        // 拖曳起點 (PC 專用)
        card.ondragstart = (ev) => {
            ev.dataTransfer.setData("cardId", card.id);
            showDescription(card.getAttribute('data-desc'));
        };
    });
}

// 3. 處理拖曳經過與放下
function allowDrop(ev) {
    ev.preventDefault(); // 允許放下
}

function drop(ev, targetZoneType) {
    ev.preventDefault();
    const cardId = ev.dataTransfer.getData("cardId");
    const draggedCard = document.getElementById(cardId);
    if (draggedCard) {
        selectedForceItem = draggedCard;
        selectedForceType = draggedCard.getAttribute('data-type');
        placeForce(targetZoneType); // 呼叫共用的放置邏輯
    }
}

// 4. 共用的放置邏輯 (點擊或拖曳共用)
function placeForce(targetZoneType) {
    if (!selectedForceItem) {
        alert("請先點選右方的力量卡片！");
        return;
    }

    if (selectedForceType === targetZoneType) {
        // 答對了，移動元素並拔除事件
        selectedForceItem.classList.remove('selected-item');
        selectedForceItem.classList.add('bg-white', 'border-none', 'shadow', 'text-sm');
        selectedForceItem.draggable = false;
        selectedForceItem.onclick = null;

        document.getElementById(`zone-${targetZoneType}`).appendChild(selectedForceItem);

        selectedForceItem = null;
        selectedForceType = null;
        clearDescription();

        // 檢查是否全部完成
        if (document.getElementById('force-cards').children.length === 0) {
            trackAction('task_1_2_cards'); // 🌟 新增：記錄完成卡片分類
            document.getElementById('force-cards').innerHTML =
                '<div class="text-green-600 font-bold col-span-2 text-center py-4 text-lg">恭喜！全部分類正確！</div>';
        }
    } else {
        // 答錯專屬提示 (已改為自訂的置中彈出視窗)
        const cardText = selectedForceItem.innerText;
        if (cardText.includes("石灰岩")) {
            showErrorModal("開採石灰岩是「人為力量」，未做防護極易造成山崩！");
        } else if (cardText.includes("地下水")) {
            showErrorModal("人類「超抽地下水」會導致嚴重地層下陷喔！");
        } else if (cardText.includes("人工造林")) {
            showErrorModal("再想想！雖然樹木是自然植物，但「人工造林」是人類主動保護地表的力量！");
        } else {
            showErrorModal("分類好像不太對喔，請再想想看！");
        }
    }
}

// --- 關卡二：坡度與水流搬運實驗 ---
let currentSlope = 1; // 記錄目前坡度狀態

function updateSlope(value) {
    trackAction('task_2_1_slope'); // 🌟 新增：記錄調整過坡度
    currentSlope = parseInt(value);
    const mountain = document.getElementById('mountain-shape');
    const effErosion = document.getElementById('eff-erosion');
    const effTransport = document.getElementById('eff-transport');
    const effDeposit = document.getElementById('eff-deposit');

    // --- 新增：處理按鈕的顏色切換 ---
    for (let i = 1; i <= 3; i++) {
        const btn = document.getElementById(`btn-slope-${i}`);
        if (i === currentSlope) {
            // 選中的變成藍色
            btn.className = "px-4 py-2 rounded-lg font-bold bg-blue-500 text-white shadow transition-colors";
        } else {
            // 沒選中的變成灰色
            btn.className = "px-4 py-2 rounded-lg font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors";
        }
    }
    // 調整山體形狀 (改為單邊傾斜的視覺效果)
    if (value === 1) {
        // 坡度緩
        mountain.style.borderLeftWidth = "60px";
        mountain.style.borderRightWidth = "120px";
        mountain.style.borderBottomWidth = "80px";
        effErosion.textContent = "較弱 (溝紋淺)";
        effTransport.textContent = "較弱";
        effDeposit.textContent = "較強";
    } else if (value === 2) {
        // 坡度中
        mountain.style.borderLeftWidth = "40px";
        mountain.style.borderRightWidth = "100px";
        mountain.style.borderBottomWidth = "120px";
        effErosion.textContent = "中等";
        effTransport.textContent = "中等";
        effDeposit.textContent = "中等";
    } else if (value === 3) {
        // 坡度陡
        mountain.style.borderLeftWidth = "20px";
        mountain.style.borderRightWidth = "80px";
        mountain.style.borderBottomWidth = "160px";
        effErosion.textContent = "較強 (溝紋深)";
        effTransport.textContent = "較強 (泥沙小石被沖走)";
        effDeposit.textContent = "較弱";
    }
}

// 觸發水流與搬運動畫
function playWaterFlow() {
    trackAction('task_2_1_water_test'); // 🌟 新增：記錄學生按了倒水測試
    const simArea = document.getElementById('simulation-area');
    const riverBed = document.getElementById('river-bed');
    const bedWidth = riverBed.clientWidth;
    const btn = document.querySelector('button[onclick="playWaterFlow()"]');

    // --- 0. 動畫期間暫時禁用按鈕 ---
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    // 清除畫面上前一次的水流與石頭
    simArea.querySelectorAll('.mountain-water').forEach(el => el.remove());
    riverBed.querySelectorAll('.particle, .water-wave').forEach(el => el.remove());
    simArea.querySelectorAll('.fa-droplet').forEach(el => el.parentElement.remove()); // 清除前一次的水滴

    // --- 1. 計算目前山坡的頂點位置、斜坡長度與傾斜角度 ---
    const slopeStats = {
        1: { leftWidth: 60, rightWidth: 120, height: 80 },
        2: { leftWidth: 40, rightWidth: 100, height: 120 },
        3: { leftWidth: 20, rightWidth: 80, height: 160 }
    };
    const stat = slopeStats[currentSlope];
    const peakX = stat.leftWidth;
    const peakY = stat.height;
    const slopeLength = Math.sqrt(stat.height ** 2 + stat.rightWidth ** 2);
    const angleDeg = Math.atan2(stat.height, stat.rightWidth) * (180 / Math.PI);

    // --- 2. 建立山坡上的水流 (先設為寬度 0) ---
    const mWater = document.createElement('div');
    mWater.className = 'mountain-water';
    mWater.style.left = `${peakX}px`;
    mWater.style.bottom = `${peakY}px`;
    mWater.style.height = '20px'; // 水流粗細
    mWater.style.transformOrigin = 'bottom left';
    mWater.style.transform = `rotate(${angleDeg}deg)`;
    mWater.style.width = '0px';
    mWater.style.transition = 'width 0.4s ease-in';
    simArea.appendChild(mWater);

    // --- 3. 準備平原區的水流與沉積物 ---
    const water = document.createElement('div');
    water.className = 'water-wave rounded-r-full';
    riverBed.appendChild(water);

    const particles = [];
    particles.push({ type: 'rock-big', el: createParticle('rock-big', 5) });
    for (let i = 0; i < 3; i++) particles.push({ type: 'rock-small', el: createParticle('rock-small', Math.random() * 15) });
    for (let i = 0; i < 10; i++) particles.push({ type: 'sand', el: createParticle('sand', Math.random() * 30) });
    particles.forEach(p => riverBed.appendChild(p.el));

    const distConfig = {
        1: { 'rock-big': 0.05, 'rock-small': 0.25, 'sand': 0.50 },
        2: { 'rock-big': 0.20, 'rock-small': 0.50, 'sand': 0.80 },
        3: { 'rock-big': 0.45, 'rock-small': 0.85, 'sand': 0.95 }
    };

    // --- 4. 建立水滴掉落與炸開(Splash)動畫 ---
    const bucket = document.createElement('div');
    bucket.innerHTML = '<i class="fa-solid fa-droplet"></i>';

    // 使用 transition-all 讓位移、形變、透明度都能有動畫效果
    bucket.className = 'absolute text-6xl text-blue-500 z-20 transition-all duration-300 ease-in';
    bucket.style.left = `${peakX - 28}px`;
    bucket.style.bottom = `${peakY + 80}px`;
    bucket.style.transformOrigin = 'bottom center';
    simArea.appendChild(bucket);


    // --- 5. 執行連貫動畫的時間軸 ---

    // [動作 A] 觸發水滴往下掉 (0 毫秒)
    setTimeout(() => {
        // translateY(80px) 往下掉，scale(1, 1) 保持原比例
        bucket.style.transform = 'translateY(80px) scale(1, 1)';
    }, 50);

    // [動作 B] 水滴砸到山頂的瞬間 (350毫秒) -> 炸開並觸發山坡水流
    setTimeout(() => {
        // 覆蓋原本的動畫設定，讓炸開的動作更短促 (0.15秒)
        bucket.style.transition = 'all 0.15s ease-out';
        // X軸拉寬 2 倍，Y軸壓扁成 0.2 倍，並完全透明
        bucket.style.transform = 'translateY(80px) scale(2, 0.2)';
        bucket.style.opacity = '0';

        // 同步觸發山坡水流往下衝
        mWater.style.width = `${slopeLength + 5}px`;
    }, 350);

    // [動作 C] 山坡水流抵達平原時 (750毫秒) -> 觸發平原搬運動畫
    setTimeout(() => {
        water.style.width = '100%';
        particles.forEach(p => {
            const baseDist = distConfig[currentSlope][p.type];
            const randomOffset = (Math.random() - 0.5) * 0.15;
            const finalDist = Math.max(0, (baseDist + randomOffset)) * bedWidth;
            const rotation = p.type !== 'sand' ? `rotate(${finalDist * 1.5}deg)` : '';
            p.el.style.transform = `translateX(${finalDist}px) ${rotation}`;
        });

        mWater.style.transition = 'opacity 0.8s ease-out';
        mWater.style.opacity = '0';
    }, 750);

    // [動作 D] 等待所有動畫跑完，恢復按鈕狀態 (2300毫秒)
    setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }, 2300);
}
// 產生單顆石頭/泥沙的輔助函數
function createParticle(className, bottomOffset) {
    const div = document.createElement('div');
    div.className = `particle ${className}`;
    div.style.left = '-10px'; // 讓石頭一開始藏在山腳下交界處
    div.style.bottom = `${bottomOffset}px`;
    return div;
}

// --- 關卡三：資訊展示 ---
function showInfo(targetId, htmlContent) {
    const target = document.getElementById(targetId);
    target.innerHTML = htmlContent;
    target.style.animation = 'none';
    target.offsetHeight; /* trigger reflow */
    target.style.animation = 'fadeIn 0.3s ease-in-out';
}


// --- 初始化與洗牌機制 (已清理重複代碼) ---
function shuffleCards() {
    const container = document.getElementById('force-cards');
    if (!container) return;
    const cards = Array.from(container.children);
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    cards.forEach(card => container.appendChild(card));

    // 洗完牌後，綁定拖曳與點擊事件！
    setupCards();
}

document.addEventListener('DOMContentLoaded', () => {
    initSafetyLock();
    initReportStains();
    initBagGame();
    initGeoParks();
    shuffleCards();
    updateMohs(1);
    startPKGame();

    const preloadImages = [
    "earth-rockimages/dinosaur1.png", "earth-rockimages/dinosaur2.png",
    "earth-rockimages/dinosaur3.png", "earth-rockimages/dinosaur4.png"
];
preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
});
});
// --- 專屬：化石補充說明彈出視窗 ---
function showFossilExtraInfo() {
    const content = `
        <div class="text-left">
            <h4 class="text-2xl font-black text-amber-800 mb-4 border-b-4 border-amber-200 pb-2">
                <i class="fas fa-question-circle text-amber-500 mr-2 animate-pulse"></i>所有的恐龍都能變成化石嗎？
            </h4>
            <ul class="text-gray-700 space-y-5 text-base md:text-lg leading-relaxed mt-4">
                <li class="flex items-start">
                    <i class="fas fa-bone text-amber-600 mt-1 mr-3 w-6 text-center shrink-0 text-xl"></i>
                    <div><span class="font-bold text-amber-900">1. 容易腐爛與被吃掉：</span><br>恐龍死後，如果沒有馬上被泥沙掩埋，柔軟的肉會腐爛，骨頭也可能被其他動物破壞。</div>
                </li>
                <li class="flex items-start">
                    <i class="fas fa-water text-cyan-500 mt-1 mr-3 w-6 text-center shrink-0 text-xl"></i>
                    <div><span class="font-bold text-cyan-800">2. 需要極端的好環境：</span><br>化石的形成需要特定的地點（如安靜的湖底或海底），讓泥沙能迅速將遺體蓋住，隔絕空氣。</div>
                </li>
                <li class="flex items-start">
                    <i class="fas fa-volcano text-red-500 mt-1 mr-3 w-6 text-center shrink-0 text-xl"></i>
                    <div><span class="font-bold text-red-800">3. 大自然的無情考驗：</span><br>就算順利變成了石頭，在漫長的千萬年裡，也可能因為地震、岩漿高溫或地殼擠壓而粉碎。</div>
                </li>
            </ul>
            <div class="mt-6 bg-amber-50 py-3 px-4 rounded-xl border border-amber-200 text-center shadow-inner">
                <p class="text-amber-900 font-bold">💡 所以，能變成化石的都是經歷千萬年考驗的「超級幸運兒」喔！</p>
            </div>
        </div>
    `;

    // 呼叫你原本就寫好的視窗函數！
    showInfoModal(content);
}
// --- 關卡二 (任務 2-2)：地形圖鑑資料與邏輯 ---
let currentTerrainMode = 'river';

// 1. 在資料庫中加入 img 屬性，對應你存檔的圖片名稱
const terrainData = {
    river: {
        // 加上 earth-rockimages/
        up: { img: "earth-rockimages/river-up.png", title: "🔴 上游 (侵蝕為主)", desc: "地勢陡峭，水流急，向下切割力量強烈。容易形成深邃的 <span class='bg-yellow-200 px-1 font-bold'>V形谷</span>，河床常堆積著有稜有角的巨大石塊。", titleColor: "text-red-600", borderColor: "border-red-500" },
        mid: {
            img: "earth-rockimages/river-mid.png",
            title: "🟢 中游 (搬運為主)",
            desc: "地勢漸緩。石塊隨流水搬運互相碰撞，邊角被磨圓形成光滑的 <span class='bg-yellow-200 px-1 font-bold'>鵝卵石</span>。水流彎曲處易形成 <span class='bg-yellow-200 px-1 font-bold'>曲流</span>，產生 <button onclick='showMeanderInfo(\"erosion\")' class='text-red-600 underline font-black hover:text-red-800 transition'>凹岸侵蝕</button> 與 <button onclick='showMeanderInfo(\"deposit\")' class='text-green-600 underline font-black hover:text-green-800 transition'>凸岸堆積</button> 的現象。",
            titleColor: "text-green-600",
            borderColor: "border-green-500"
        },
        down: { img: "earth-rockimages/river-down.png", title: "🔵 下游 (堆積為主)", desc: "地勢平坦，流速最慢。泥沙在此大量堆積，在山腳出谷處形成 <span class='bg-yellow-200 px-1 font-bold'>沖積扇</span>，而在河水流入海洋的出海口則會形成 <span class='bg-yellow-200 px-1 font-bold'>三角洲</span>。", titleColor: "text-blue-600", borderColor: "border-blue-500" }
    },
    coast: {
        // 加上 earth-rockimages/
        erosion: { img: "earth-rockimages/coast-erosion.png", title: "🌊 侵蝕海岸", desc: "受強烈海浪不斷拍打，侵蝕作用大於堆積作用。常見的地形景觀包含：海蝕崖(貢寮)、海蝕平臺(七美)、海蝕柱(金山)以及豆腐岩(野柳)。", titleColor: "text-purple-600", borderColor: "border-purple-500" },
        deposit: { img: "earth-rockimages/coast-deposit.png", title: "🏖️ 堆積海岸", desc: "泥沙沿著平緩的海岸線漸漸堆積，堆積作用大於侵蝕作用。常見的地形景觀包含：沙洲(七股)、廣闊平坦的沙灘(福隆)以及陸連島。", titleColor: "text-yellow-600", borderColor: "border-yellow-500" }
    }
};

// 2. 切換河流與海岸模式
function toggleTerrainMode() {
    trackAction('task_2_2_toggle'); // 🌟 新增：記錄切換過海岸/河流地圖
    const btnToggle = document.getElementById('btn-toggle-terrain');
    const title = document.getElementById('terrain-title');
    const hotspotsRiver = document.getElementById('hotspots-river');
    const hotspotsCoast = document.getElementById('hotspots-coast');
    const mainMapImg = document.getElementById('main-map-image'); // 取得大地圖圖片

    document.getElementById('detail-placeholder').classList.remove('hidden');
    document.getElementById('detail-content').classList.add('hidden');

    if (currentTerrainMode === 'river') {
        currentTerrainMode = 'coast';
        title.innerHTML = "🌊 海岸地形圖鑑";
        btnToggle.innerHTML = "切換至河流地形 <i class='fas fa-exchange-alt'></i>";
        btnToggle.className = "bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full font-bold shadow-sm transition flex items-center gap-2";
        hotspotsRiver.classList.add('hidden');
        hotspotsCoast.classList.remove('hidden');
        // 加上 earth-rockimages/
        mainMapImg.src = "earth-rockimages/coast-main.png";
    } else {
        currentTerrainMode = 'river';
        title.innerHTML = "🏞️ 河流地形圖鑑";
        btnToggle.innerHTML = "切換至海岸地形 <i class='fas fa-exchange-alt'></i>";
        btnToggle.className = "bg-cyan-100 hover:bg-cyan-200 text-cyan-800 px-4 py-2 rounded-full font-bold shadow-sm transition flex items-center gap-2";
        hotspotsCoast.classList.add('hidden');
        hotspotsRiver.classList.remove('hidden');
        mainMapImg.src = "earth-rockimages/river-main.png"; // 切換回河流大地圖
    }
}

// 3. 顯示右側詳細資料
function showTerrainDetail(type, spot) {
    trackAction(`task_2_2_viewed_${type}_${spot}`); // 🌟 新增：記錄看了哪個地形標記
    const data = terrainData[type][spot];

    document.getElementById('detail-placeholder').classList.add('hidden');
    document.getElementById('detail-content').classList.remove('hidden');

    const titleEl = document.getElementById('detail-title');
    titleEl.innerHTML = data.title;
    titleEl.className = `text-2xl font-bold mb-2 border-b-4 pb-2 transition-colors ${data.titleColor} ${data.borderColor}`;

    document.getElementById('detail-desc').innerHTML = data.desc;

    // 更新細節圖片的來源
    const detailImg = document.getElementById('detail-image');
    detailImg.src = data.img;
}
// --- 彈窗控制邏輯 ---
function showInfoModal(contentHtml) {
    const modal = document.getElementById('info-modal');
    const modalContent = document.getElementById('info-modal-content');
    document.getElementById('info-modal-body').innerHTML = contentHtml;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.replace('scale-95', 'scale-100');
    }, 10);
}

function closeInfoModal() {
    const modal = document.getElementById('info-modal');
    const modalContent = document.getElementById('info-modal-content');
    modal.classList.add('opacity-0');
    modalContent.classList.replace('scale-100', 'scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

// --- 專屬：曲流放大鏡內容 (動畫進化版) ---
function showMeanderInfo(type) {
    let content = "";
    if (type === 'erosion') {
        content = `
            <div class="text-center">
                <div class="meander-anim-container">
                    <div class="meander-river-bend">
                        <i class="fas fa-chevron-down meander-flow-arrow meander-flow-arrow-erosion"></i>
                    </div>
                </div>
                
                <h4 class="text-2xl font-bold text-red-600 mb-3">凹岸 (外側) 侵蝕</h4>
                <div class="bg-gray-50 p-4 rounded-xl text-left border-l-4 border-red-500">
                    <p class="text-gray-700 leading-relaxed">當河水流經彎道時，外側的距離較長，水流為了趕上進度，<span class="text-red-600 font-bold">流速會變得非常快</span>！</p>
                    <p class="mt-2 text-gray-700">強勁的水流會像怪手一樣不斷拍打、挖掘岸邊，造成嚴重的<b>侵蝕作用</b>，使岸邊變得陡峭。</p>
                </div>
            </div>`;
    } else {
        content = `
            <div class="text-center">
                <div class="meander-anim-container">
                    <div class="meander-river-bend">
                        <i class="fas fa-chevron-right meander-flow-arrow meander-flow-arrow-deposit"></i>
                        
                        <div class="meander-sediment"></div>
                        <div class="meander-sediment" style="left: 36px; bottom: 8px; width: 8px; height: 8px; animation-delay: 0.5s;"></div>
                        <div class="meander-sediment" style="left: 16px; bottom: 36px; width: 10px; height: 10px; animation-delay: 1s;"></div>
                    </div>
                </div>
                
                <h4 class="text-2xl font-bold text-green-600 mb-3">凸岸 (內側) 堆積</h4>
                <div class="bg-gray-50 p-4 rounded-xl text-left border-l-4 border-green-500">
                    <p class="text-gray-700 leading-relaxed">河道內側的距離較短，水流在這裡會<span class="text-green-600 font-bold">明顯減速</span>。</p>
                    <p class="mt-2 text-gray-700">當水流變慢，原本搬運的泥沙與小石子就會在此停下來。長久下來，這裡會產生明顯的<b>堆積作用</b>，形成平緩的沙灘或礫石灘。</p>
                </div>
            </div>`;
    }
    showInfoModal(content);
}
// ==============================
// --- 關卡三：尋寶礦坑與化石谷 ---
// ==============================

// --- 1. 頁籤切換邏輯 ---
function switchTabL3(tabId) {
    updateCurrentView(`task-3-${tabId}`); // 🌟 新增這行：記錄切換時間
    // 隱藏三個任務區塊
    document.getElementById('task-3-1').classList.add('hidden');
    document.getElementById('task-3-2').classList.add('hidden');
    document.getElementById('task-3-3').classList.add('hidden');

    // 把三個按鈕都先變回灰色的未選取狀態
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`tab-l3-btn-${i}`).className = "bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-t-lg font-bold transition shadow-inner";
    }

    // 顯示被點擊的區塊，並把該按鈕變成琥珀色 (高亮狀態)
    document.getElementById(`task-3-${tabId}`).classList.remove('hidden');
    document.getElementById(`tab-l3-btn-${tabId}`).className = "bg-amber-500 text-white px-4 py-2 rounded-t-lg font-bold transition";
}

// --- 2. 岩石分類圖鑑資料庫 (進階版：包含動態範例子項目) ---
const rockData = {
    igneous: {
        title: "🔥 火成岩",
        titleColor: "text-red-700",
        btnTheme: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
        origin: "高溫的<b>岩漿</b>在地表或地底深處冷卻凝固而成的岩石。",
        mainImg: "earth-rockimages/rock-igneous.png",
        examples: [
            { name: "玄武岩", desc: "岩漿噴出地表快速冷卻而成，質地細密。常見於澎湖的柱狀玄武岩景觀。", img: "earth-rockimages/ex-basalt.png" },
            { name: "花岡岩", desc: "岩漿在地底下緩慢冷卻，結晶顆粒較大，質地非常堅硬，常被拿來做建築物的外牆或地板。", img: "earth-rockimages/ex-granite.png" },
            { name: "安山岩", desc: "臺灣北部大屯火山群常見的岩石，常被雕刻成傳統廟宇的龍柱或石雕。", img: "earth-rockimages/ex-andesite.png" }
        ]
    },
    sedimentary: {
        title: "🌊 沉積岩",
        titleColor: "text-blue-700",
        btnTheme: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
        origin: "岩石碎屑、泥沙或生物遺骸，被流水搬運後，經過長時間的沉積、壓密和膠結而成的岩石。",
        mainImg: "earth-rockimages/rock-sedimentary.png",
        examples: [
            { name: "砂岩", desc: "主要由沙子膠結組成，表面摸起來粗粗的，像砂紙一樣。", img: "earth-rockimages/ex-sandstone.png" },
            { name: "頁岩", desc: "由細小的泥土沉積組成，一層一層的，很容易剝落裂成薄片。", img: "earth-rockimages/ex-shale.png" },
            { name: "石灰岩", desc: "主要由珊瑚、貝殼等海洋生物遺骸堆積而成，是製造水泥的重要原料喔！", img: "earth-rockimages/ex-limestone.png" }
        ]
    },
    metamorphic: {
        title: "⚡ 變質岩",
        titleColor: "text-purple-700",
        btnTheme: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300",
        origin: "原本存在的岩石，受到地底下的<b>高溫</b>與<b>高壓</b>影響，改變了內部的礦物排列與結構，就像是烤麵包一樣發生了「變質」。",
        mainImg: "earth-rockimages/rock-metamorphic.png",
        examples: [
            { name: "大理岩", desc: "由石灰岩變質而來，花紋漂亮且硬度適中易雕刻，常做成花盆或石桌（太魯閣國家公園非常多！）。", img: "earth-rockimages/ex-marble.png" },
            { name: "板岩", desc: "由頁岩變質而來，有平整的劈理，原住民（如排灣族、魯凱族）常拿來疊起來蓋石板屋。", img: "earth-rockimages/ex-slate.png" },
            { name: "片麻岩", desc: "由花岡岩等地殼深部岩石變質而來，有明顯的黑白相間條紋，在金門最常見。", img: "earth-rockimages/ex-gneiss.png" }
        ]
    }
};

// --- 3. 顯示岩石大類詳細資料與動態生成按鈕 ---
function showRockDetail(type) {
    trackAction('task_3_1_rock'); // 🌟 修改：記錄點擊過岩石分類
    const data = rockData[type];

    // 切換顯示佔位符與內容區塊
    document.getElementById('rock-info-placeholder').classList.add('hidden');
    document.getElementById('rock-info-content').classList.remove('hidden');
    document.getElementById('rock-placeholder-img').classList.add('hidden');

    // 【新增】每次切換大分類時，先隱藏下方的範例詳細資料卡，保持畫面乾淨
    document.getElementById('rock-example-detail').classList.add('hidden');

    // 更新左側大圖
    const mainImg = document.getElementById('rock-main-img');
    mainImg.src = data.mainImg;
    mainImg.onerror = function () { this.style.display = 'none'; document.getElementById('rock-placeholder-img').classList.remove('hidden'); };
    mainImg.onload = function () { this.style.display = 'block'; };
    mainImg.classList.remove('hidden');

    // 更新右側大標題與成因文字
    const titleEl = document.getElementById('rock-type-title');
    titleEl.innerHTML = data.title;
    titleEl.className = `text-2xl font-black mb-3 ${data.titleColor}`;
    document.getElementById('rock-type-origin').innerHTML = data.origin;

    // 清空並動態生成下方的範例按鈕
    const listEl = document.getElementById('rock-example-list');
    listEl.innerHTML = "";

    data.examples.forEach((ex, index) => {
        const btn = document.createElement('button');
        btn.className = `px-4 py-2 rounded-lg font-bold shadow-sm border-2 transition hover:scale-105 ${data.btnTheme}`;
        btn.innerHTML = `<i class="fas fa-search plus mr-1"></i> ${ex.name}`;

        // 【修改】點擊事件改為呼叫新的行內顯示函數
        btn.onclick = () => showRockExampleInline(type, index);
        listEl.appendChild(btn);
    });
}

// --- 4. 直接在右下方顯示範例詳細資料 (取代原本的彈窗) ---
function showRockExampleInline(type, index) {
    const rock = rockData[type];
    const ex = rock.examples[index];

    // 取得範例卡片的元素
    const detailCard = document.getElementById('rock-example-detail');
    const titleEl = document.getElementById('rock-ex-title');
    const descEl = document.getElementById('rock-ex-desc');
    const imgEl = document.getElementById('rock-ex-img');

    // 更新文字與標題顏色 (顏色跟隨大分類)
    titleEl.innerHTML = ex.name;
    titleEl.className = `text-xl font-bold mb-2 ${rock.titleColor}`;
    descEl.innerHTML = ex.desc;

    // 更新圖片 (先設為透明，載入成功會自動觸發 onload 變回不透明)
    imgEl.style.opacity = '0';
    imgEl.src = ex.img;

    // 移除 hidden，讓卡片顯示出來
    detailCard.classList.remove('hidden');
}
// ==============================
// --- 任務 3-2：摩氏硬度圖鑑與 PK 賽 ---
// ==============================

// 1. 摩氏硬度資料庫 (擴充生活應用版：1~10級)
const mohsData = {
    1: { name: "滑石", desc: "硬度最小 (<span class='text-red-500 font-bold'>1級</span>)。指甲就可以輕易劃出痕跡。摸起來有滑膩感，常被磨成粉末做成嬰兒的<b>「爽身粉」</b>、媽媽化妝用的粉餅，或是裁縫師用來在布料上做記號的畫線粉塊。", img: "earth-rockimages/mohs-1滑石.png" },
    2: { name: "石墨", desc: "硬度約 (<span class='text-red-500 font-bold'>1.5級</span>)。質地非常軟，輕輕在紙上摩擦就能留下黑色痕跡。外觀呈現灰黑色且摸起來滑溜溜的，最常被混合黏土用來製作我們寫字用的<b>「鉛筆芯」</b>，在工業上也會做成保護機器的潤滑劑。", img: "earth-rockimages/mohs-石墨.png" },
    3: { name: "硫磺", desc: "硬度約 (<span class='text-red-500 font-bold'>2級</span>)。硬度偏低且容易碎裂。顏色是鮮豔的黃色，靠近聞會有一股像溫泉或臭雞蛋一樣的特殊氣味，最常被用來製作<b>「火柴頭」</b>、鞭炮裡的火藥，或是能治療皮膚的醫藥用品。", img: "earth-rockimages/mohs-硫磺.png" },
    4: { name: "石膏", desc: "硬度 (<span class='text-red-500 font-bold'>2級</span>)。指甲可以劃出痕跡。除了用於製作黑板粉筆、雕塑模型與骨折時的醫療固定外，我們常吃的<span class='bg-yellow-200 px-1 rounded font-bold text-amber-800'>傳統豆花</span>其實就是加入少量食用石膏凝固而成的喔！在建築上也會做成輕鋼架天花板。", img: "earth-rockimages/mohs-2石膏.png" },
    5: { name: "黑雲母", desc: "硬度約 (<span class='text-red-500 font-bold'>2.5級</span>)。硬度較軟，用指甲稍微用力就能剝下一層層的薄片。外觀呈現黑色或深褐色，在陽光下會閃閃發亮，因為非常耐熱且不導電，常被用來製作吹風機或烤箱裡的<b>「電器絕緣零件」</b>。", img: "earth-rockimages/mohs-黑雲母.png" },
    6: { name: "方解石", desc: "硬度 (<span class='text-red-500 font-bold'>3級</span>)。與銅幣硬度差不多，敲碎後常呈現平行四邊形的解理。它不僅是蓋房子用的<b>「水泥」</b>不可或缺的原料，因為具有奇妙的<span class='text-purple-600 font-bold'>雙折射特性</span>，也常被應用在製造精密的顯微鏡與光學儀器中。", img: "earth-rockimages/mohs-3方解石.png" },
    7: { name: "螢石", desc: "硬度 (<span class='text-red-500 font-bold'>4級</span>)。小刀可以輕易劃傷它。又稱「天才之石」，常呈現美麗的紫色或綠色。在工業上常作為煉鋼的<b> 助熔劑 </b>；因為透光與折射率極佳，也被用於製作<b>「高級鏡頭鏡片」</b>。", img: "earth-rockimages/mohs-4螢石.png" },
    8: { name: "磷灰石", desc: "硬度 (<span class='text-red-500 font-bold'>5級</span>)。硬度與小刀相近。它含有豐富的磷，是幫助植物長大的「農業肥料」重要原料。最酷的是，我們人類的「牙齒和骨骼」主要成分，其實也就是由類似磷灰石的磷酸鈣所構成的呢！", img: "earth-rockimages/mohs-5磷灰石.png" },
    9: { name: "正長石", desc: "硬度 (<span class='text-red-500 font-bold'>6級</span>)。小刀無法劃出痕跡。它是地殼中常見的礦物，也是「<span class='bg-yellow-200 px-1 rounded font-bold text-amber-800'>陶瓷工業</span>」的靈魂人物。我們家裡的瓷磚、馬桶、精緻的陶瓷茶杯，表面那層光滑漂亮的釉料，大多都含有正長石的成分。", img: "earth-rockimages/mohs-6正長石.png" },
    10: { name: "黃鐵礦", desc: "硬度約 (<span class='text-red-500 font-bold'>6.5級</span>)。硬度偏高，用一般的小刀很難劃出痕跡。外觀閃爍著亮麗的金屬光澤，因為顏色像黃金，常被誤認而有<b>「愚人金」</b>的稱號，在工業上則是製造<b>「硫酸」</b>的重要原料。", img: "earth-rockimages/mohs-黃鐵礦.png" },
    11: { name: "石英", desc: "硬度 (<span class='text-red-500 font-bold'>7級</span>)。硬度很高，可以輕易在玻璃上劃出深深的刻痕。結晶完美的石英就像透明玻璃一樣透亮，它不僅是維持<b>「石英錶」</b>準確運作的核心，更被應用於製造高速傳遞網路訊號的「光纖」，以及提煉出矽來製作「手機半導體晶片」。", img: "earth-rockimages/mohs-7石英.png" },
    12: { name: "黃玉", desc: "硬度 (<span class='text-red-500 font-bold'>8級</span>)。非常堅硬，可以劃傷石英。它具有美麗的顏色（常見為金黃色或藍色），常被切割拋光作為璀璨的寶石項鍊或戒指。此外，因為它非常耐高溫，也用於煉鋼爐的<b>「耐火材料」</b>。", img: "earth-rockimages/mohs-8黃玉.png" },
    13: { name: "剛玉", desc: "硬度 (<span class='text-red-500 font-bold'>9級</span>)。硬度僅次於金剛石。紅色的稱為紅寶石，藍色的稱為藍寶石。因為它極度堅硬，常用於製作<b>「工業砂紙」</b>與抗刮鏡面。", img: "earth-rockimages/mohs-9剛玉.png" },
    14: { name: "金剛石", desc: "硬度最高 (<span class='text-red-500 font-bold'>10級</span>)。自然界中已知最硬的物質，也就是我們熟知的<b>「鑽石」</b>！除了作為頂級珠寶，它無堅不摧的特性使它成為強力的<b>「工業鑽孔工具」</b>。", img: "earth-rockimages/mohs-10金剛石.png" }
};

// 2. 更新上方圖鑑區塊的函數
function updateMohs(level) {
    trackAction('task_3_2_mohs'); // 🌟 新增：記錄拉動過硬度滑桿
    const data = mohsData[level];

    // 【新增】自動從介紹詞中抓取真實的硬度數字 (例如從 ">1.5級" 抓出 "1.5")
    const match = data.desc.match(/>(\d+(\.\d+)?)級/);
    const realHardness = match ? match[1] : level;

    // 【修改】顯示真實硬度，取代原本的 level
    document.getElementById('mohs-level-badge').innerText = `硬度 ${realHardness}`;
    document.getElementById('mohs-title').innerText = data.name;
    document.getElementById('mohs-desc').innerHTML = data.desc;

    const imgEl = document.getElementById('mohs-img');
    imgEl.style.opacity = '0'; // 先變透明，準備載入
    imgEl.src = data.img;

    // 如果圖片載入成功，顯示圖片
    imgEl.onload = () => { imgEl.style.opacity = '1'; };
}
let currentRound = 0;
let score = 0;
let gamePool = [];
let currentPK = { a: 0, b: 0, nameA: "", nameB: "" };

// 1. 定義日常物品的硬度
const extraItems = [
    { name: "肥皂", hardness: 1.0, isMineral: false },
    { name: "指甲", hardness: 2.5, isMineral: false },
    { name: "銅幣(硬幣)", hardness: 3.5, isMineral: false },
    { name: "鐵釘", hardness: 4.5, isMineral: false },
    { name: "玻璃/小刀", hardness: 5.5, isMineral: false },
    { name: "鋼銼刀", hardness: 6.5, isMineral: false }
];

// 2. 建立完整的遊戲池 (包含 PK 賽的硬度抓取)
function getGamePool() {
    const minerals = Object.values(mohsData).map(m => {
        // 同樣利用程式自動從介紹詞中精準抓取真實數字
        const match = m.desc.match(/>(\d+(\.\d+)?)級/);
        const realHardness = match ? parseFloat(match[1]) : 1;

        return {
            name: m.name,
            hardness: realHardness,
            isMineral: true
        };
    });

    // 【注意】我們把原本一大串 minerals[0].hardness = 1.0 的手動設定刪除了！
    // 現在全部自動抓取，不管以後加幾個礦物，PK 賽的數值都不會錯！

    return [...minerals, ...extraItems];
}

// 3. 開始全新的一局 (重置分數)
function startPKGame() {
    currentRound = 0;
    score = 0;
    gamePool = getGamePool();

    // 隱藏右上角的重新開始按鈕，並清空回饋文字
    const restartBtn = document.getElementById('pk-restart-btn');
    if (restartBtn) restartBtn.classList.add('hidden');
    document.getElementById('pk-header-feedback').innerText = "";

    nextPKRound();
}

// 4. 進入下一題
// 4. 進入下一題 (確保一定會出現礦物)
function nextPKRound() {
    currentRound++;

    const roundIndicator = document.getElementById('pk-round-indicator');
    if (roundIndicator) roundIndicator.innerText = `第 ${currentRound} / 5 題`;

    const btnA = document.getElementById('pk-btn-a');
    const btnB = document.getElementById('pk-btn-b');
    const resultArea = document.getElementById('pk-result-area');

    resultArea.classList.add('hidden');

    btnA.disabled = false;
    btnB.disabled = false;
    btnA.className = "flex-1 bg-white border-4 border-gray-300 rounded-xl p-4 md:p-6 flex items-center justify-center hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer min-h-[100px]";
    btnB.className = "flex-1 bg-white border-4 border-gray-300 rounded-xl p-4 md:p-6 flex items-center justify-center hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer min-h-[100px]";

    // --- 修改後的隨機選題邏輯 ---

    // 1. 先從遊戲池中過濾出所有的「礦物」
    const mineralOnlyPool = gamePool.filter(item => item.isMineral === true);

    // 2. 第一個物件 (itemA) 必定從礦物池中抽出
    let itemA = mineralOnlyPool[Math.floor(Math.random() * mineralOnlyPool.length)];

    // 3. 第二個物件 (itemB) 從整個大池子中抽，但要確保不跟 A 重複
    let itemB;
    do {
        itemB = gamePool[Math.floor(Math.random() * gamePool.length)];
    } while (itemA.name === itemB.name || itemA.hardness === itemB.hardness);

    // 4. 隨機對調 A 與 B 的位置，避免礦物永遠出現在左邊
    if (Math.random() > 0.5) {
        [itemA, itemB] = [itemB, itemA];
    }

    currentPK.a = itemA.hardness;
    currentPK.b = itemB.hardness;
    currentPK.nameA = itemA.name;
    currentPK.nameB = itemB.name;

    document.getElementById('pk-name-a').innerText = `${itemA.name} (硬度 ?)`;
    document.getElementById('pk-name-b').innerText = `${itemB.name} (硬度 ?)`;
}

// 5. 檢查答案與視覺回饋
function checkPKAnswer(choice) {
    const btnA = document.getElementById('pk-btn-a');
    const btnB = document.getElementById('pk-btn-b');
    const feedbackEl = document.getElementById('pk-header-feedback');

    btnA.disabled = true;
    btnB.disabled = true;
    btnA.classList.remove('hover:border-blue-400', 'hover:shadow-lg', 'hover:-translate-y-1', 'cursor-pointer');
    btnB.classList.remove('hover:border-blue-400', 'hover:shadow-lg', 'hover:-translate-y-1', 'cursor-pointer');

    document.getElementById('pk-name-a').innerText = `${currentPK.nameA} (硬度 ${currentPK.a})`;
    document.getElementById('pk-name-b').innerText = `${currentPK.nameB} (硬度 ${currentPK.b})`;

    const isACorrect = currentPK.a > currentPK.b;
    const isCorrect = (choice === 'A' && isACorrect) || (choice === 'B' && !isACorrect);

    if (isACorrect) {
        btnA.classList.replace('border-gray-300', 'border-green-500');
        btnA.classList.add('bg-green-50');
        btnB.classList.replace('border-gray-300', 'border-red-200');
        btnB.classList.add('opacity-60');
    } else {
        btnB.classList.replace('border-gray-300', 'border-green-500');
        btnB.classList.add('bg-green-50');
        btnA.classList.replace('border-gray-300', 'border-red-200');
        btnA.classList.add('opacity-60');
    }

    if (isCorrect) {
        score++;
        feedbackEl.innerText = "🎉 答對了！";
        feedbackEl.className = "font-black text-lg text-green-600 animate-bounce";
    } else {
        feedbackEl.innerText = "❌ 答錯囉！";
        feedbackEl.className = "font-black text-lg text-red-500";
    }

    if (currentRound < 5) {
        setTimeout(() => {
            feedbackEl.innerText = "";
            nextPKRound();
        }, 2000);
    } else {
        showFinalResult();
    }
}

// 6. 結算畫面 (移至右上角顯示)
function showFinalResult() {
    trackAction('task_3_2_pk_finish'); // 🌟 新增：記錄完成硬度 PK 賽
    const feedbackEl = document.getElementById('pk-header-feedback');
    let comment = score >= 4 ? "太厲害了！" : "繼續努力！";

    // 在原本顯示「答對/答錯」的地方，改成顯示最終總分
    feedbackEl.innerHTML = `🏁 總分：<span class="text-blue-600 mx-1">${score} / 5</span> (${comment})`;
    feedbackEl.className = "font-black text-lg text-gray-800";

    // 顯示右上角的重新挑戰按鈕
    document.getElementById('pk-restart-btn').classList.remove('hidden');
}

// --- 關卡三：3-3 化石秘密的子頁籤切換邏輯 ---
function switchSubTabL3(subTabId) {
    // 1. 隱藏兩個子頁面
    document.getElementById('subtask-3-3-1').classList.add('hidden');
    document.getElementById('subtask-3-3-2').classList.add('hidden');

    // 2. 重置按鈕狀態
    const btn1 = document.getElementById('subtab-btn-1');
    const btn2 = document.getElementById('subtab-btn-2');
    const defaultClass = "bg-gray-100 text-gray-600 px-6 py-2 rounded-full font-bold border-2 border-gray-200 hover:bg-gray-200 transition transform hover:scale-105";

    btn1.className = defaultClass;
    btn2.className = defaultClass;

    // 3. 顯示被選取的子頁面
    document.getElementById(`subtask-3-3-${subTabId}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`subtab-btn-${subTabId}`);
    activeBtn.className = "bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-orange-600 transition transform hover:scale-105";

    // 🌟 4. 動態改變上方的共用標題，與隱藏/顯示「重新掩埋」按鈕
    const titleEl = document.getElementById('subtask-3-3-title');
    const resetBtn = document.getElementById('btn-reset-dig');

    if (subTabId === 1) {
        titleEl.innerHTML = "⏳ 化石形成時光機";
        resetBtn.classList.add('hidden');
    } else {
        titleEl.innerHTML = "🕵️‍♂️ 化石獵人特區";
        resetBtn.classList.remove('hidden'); // 切換到獵人時顯示重新掩埋
        // 載入畫布
        setTimeout(initDigGame, 350);
    }
}
// --- 關卡三：化石誕生時光機拉桿邏輯 (圖片 + 文字切換版) ---
function updateFossilTimeMachine(value) {
    trackAction('task_3_3_fossil_slider'); // 🌟 新增：記錄拉動化石時光機
    const val = parseInt(value);

    // 取得圖片與文字標籤
    const imgEl = document.getElementById('fossil-display-img');
    const titleEl = document.getElementById('fossil-stage-title');
    const descEl = document.getElementById('fossil-stage-desc');

    // 定義四個階段的圖片路徑與說明文字
    const stages = {
        1: {
            img: "earth-rockimages/dinosaur1.png",
            title: "1. 古生物死亡",
            titleColor: "text-sky-900",
            desc: "恐龍倒在河川、湖泊邊緣或海洋中。"
        },
        2: {
            img: "earth-rockimages/dinosaur2.png",
            title: "2. 泥沙迅速掩埋",
            titleColor: "text-amber-900",
            desc: "被層層泥沙覆蓋，隔絕空氣，保護遺骸不會腐爛。"
        },
        3: {
            img: "earth-rockimages/dinosaur3.png",
            title: "3. 漫長歲月：石化作用",
            titleColor: "text-stone-900",
            desc: "地下水帶來礦物質，漸漸取代了原本的骨骼，變成堅硬的石頭。"
        },
        4: {
            img: "earth-rockimages/dinosaur4.png",
            title: "4. 地殼抬升與風化",
            titleColor: "text-green-900",
            desc: "歷經地殼變動與流水侵蝕，化石重見天日，被我們發現！"
        }
    };

    // 根據拉桿數值更新畫面
    if (stages[val]) {
        imgEl.src = stages[val].img;
        titleEl.innerText = stages[val].title;
        titleEl.className = `text-lg font-bold mb-1 ${stages[val].titleColor}`;
        descEl.innerText = stages[val].desc;
    }
}
// ==============================
// --- 關卡三：化石獵人挖掘小遊戲 ---
// ==============================
let digCanvas = null;
let digCtx = null;
let isDigging = false;
let digGameInitialized = false;

// 🌟 新增：回合制變數
let digRounds = [];      // 存放這局的三個化石
let currentDigRound = 0; // 目前進行到第幾題

function initDigGame() {
    digCanvas = document.getElementById('dig-canvas');
    if (!digCanvas) return;

    digCtx = digCanvas.getContext('2d', { willReadFrequently: true });

    // 設定畫布真實大小與 CSS 顯示大小一致，避免畫筆偏移
    const container = document.getElementById('dig-container');
    digCanvas.width = container.clientWidth;
    digCanvas.height = container.clientHeight;

    fillDirt();

    // 如果已經綁定過事件，就不要重複綁定
    if (!digGameInitialized) {
        // 滑鼠事件
        digCanvas.addEventListener('mousedown', startDigging);
        digCanvas.addEventListener('mousemove', dig);
        digCanvas.addEventListener('mouseup', stopDigging);
        digCanvas.addEventListener('mouseleave', stopDigging);

        // 觸控事件 (支援平板/手機)
        digCanvas.addEventListener('touchstart', startDigging, { passive: false });
        digCanvas.addEventListener('touchmove', dig, { passive: false });
        digCanvas.addEventListener('touchend', stopDigging);

        digGameInitialized = true;
    }
    // 🌟 每次載入畫面時，重新抽三題開始新遊戲
    startNewDigGame();
}
// 監聽視窗大小改變
window.addEventListener('resize', () => {
    const container = document.getElementById('dig-container');
    if (digCanvas && container && !document.getElementById('subtask-3-3-2').classList.contains('hidden')) {
        // 保存當前的畫面資料
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = digCanvas.width;
        tempCanvas.height = digCanvas.height;
        tempCanvas.getContext('2d').drawImage(digCanvas, 0, 0);
        
        // 重新設定尺寸
        digCanvas.width = container.clientWidth;
        digCanvas.height = container.clientHeight;
        
        // 將剛剛的畫面畫回來 (並恢復橡皮擦設定)
        digCtx.drawImage(tempCanvas, 0, 0, digCanvas.width, digCanvas.height);
        digCtx.globalCompositeOperation = 'source-over'; // 先恢復預設
    }
});
// 🌟 新增：產生一局三題的邏輯 (各種類各一題)
function startNewDigGame() {
    // 1. 將題庫分成三大類
    const type1 = fossilPool.filter(f => f.type === "實體化石");
    const type2 = fossilPool.filter(f => f.type === "印模化石");
    const type3 = fossilPool.filter(f => f.type === "痕跡化石");

    // 2. 從每類隨機抽出一題
    const q1 = type1[Math.floor(Math.random() * type1.length)];
    const q2 = type2[Math.floor(Math.random() * type2.length)];
    const q3 = type3[Math.floor(Math.random() * type3.length)];

    // 3. 裝入陣列並打亂順序
    digRounds = [q1, q2, q3];
    digRounds.sort(() => Math.random() - 0.5);

    currentDigRound = 0; // 重置進度
    fillDirt(); // 鋪上泥土
}

// 鋪上泥土
function fillDirt() {
    if (!digCtx || digRounds.length === 0) return;

    // 🌟 改為從這局的三題中取出當前題目
    currentDugFossil = digRounds[currentDigRound];

    const imgEl = document.getElementById('fossil-hidden-img');
    imgEl.src = currentDugFossil.img;

    document.getElementById('dig-result-panel').classList.add('hidden');
    document.getElementById('fossil-feedback').innerHTML = "";
    document.getElementById('btn-next-dig').classList.add('hidden');
    document.getElementById('dig-success-overlay').classList.add('hidden');

    digCtx.globalCompositeOperation = 'source-over';
    digCtx.fillStyle = '#8B5A2B';
    digCtx.fillRect(0, 0, digCanvas.width, digCanvas.height);

    digCtx.fillStyle = '#A0522D';
    for (let i = 0; i < 100; i++) {
        digCtx.beginPath();
        digCtx.arc(Math.random() * digCanvas.width, Math.random() * digCanvas.height, Math.random() * 5, 0, Math.PI * 2);
        digCtx.fill();
    }

    // 🌟 等泥土完全蓋好後，才顯示圖片，完美解決圖片走光問題
    imgEl.style.opacity = '1';

    updateDigProgress(0);
}

function resetDigGame() {
    const container = document.getElementById('dig-container');
    if (digCanvas && container) {
        digCanvas.width = container.clientWidth;
        digCanvas.height = container.clientHeight;
    }

    // 🌟 如果三題都答完了，點擊按鈕就是重新開始新的一局
    if (currentDigRound >= 3) {
        startNewDigGame();
    } else {
        // 否則只是把當前這題重新鋪上泥土
        fillDirt();
    }
}

// 開始挖掘
function startDigging(e) {
    isDigging = true;
    dig(e); // 點擊下去的第一下也要挖掉
}

// 停止挖掘
function stopDigging() {
    isDigging = false;
    checkDigProgress(); // 停下來的時候檢查一下進度
}

// 挖掘 (擦除畫布) 動作
function dig(e) {
    if (!isDigging) return;
    e.preventDefault(); // 防止手機端滑動螢幕時跟著捲動

    // 取得畫布的邊界位置
    const rect = digCanvas.getBoundingClientRect();

    // 判斷是滑鼠還是觸控
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    // 計算在畫布上的相對座標
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 將畫筆模式設為「擦除」(destination-out)
    digCtx.globalCompositeOperation = 'destination-out';
    digCtx.beginPath();
    digCtx.arc(x, y, 25, 0, Math.PI * 2); // 25 是刷子的大小
    digCtx.fill();
}

// 計算挖掘進度 (計算有多少像素變透明了)
function checkDigProgress() {
    if (!digCtx) return;

    const imageData = digCtx.getImageData(0, 0, digCanvas.width, digCanvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // 每 4 個值代表一個像素 (R, G, B, Alpha)，我們只檢查 Alpha 值 (透明度)
    // 為了效能，我們跳著檢查 (例如每 16 個像素檢查一次)
    const step = 4 * 4;
    let totalChecked = 0;

    for (let i = 3; i < pixels.length; i += step) {
        totalChecked++;
        if (pixels[i] < 10) { // Alpha 值極低，代表被擦掉了
            transparentPixels++;
        }
    }

    const percentage = Math.round((transparentPixels / totalChecked) * 100);
    updateDigProgress(percentage);

    // 當挖開超過 60%，我們就當作挖到了！
    if (percentage > 60) {
        // 清除剩下的全部泥土
        digCtx.clearRect(0, 0, digCanvas.width, digCanvas.height);
        updateDigProgress(100);

        // 🌟 新增：泥土清空後，才讓「挖到化石了！」的文字浮現
        document.getElementById('dig-success-overlay').classList.remove('hidden');

        // 🌟 修改：將延遲時間從 0.8秒 改為 1.2秒，讓小朋友有時間看清楚完整的化石圖與恭喜文字
        setTimeout(() => {
            document.getElementById('dug-fossil-name').innerText = currentDugFossil.name;
            document.getElementById('dig-result-panel').classList.remove('hidden');
            isDigging = false; // 強制停止挖掘動作
        }, 1200);
    }
} // 🌟 把它移到這裡：關閉 checkDigProgress 函數

// 🌟 確保這是一個獨立在外的函數
function updateDigProgress(percent) {
    document.getElementById('dig-progress-bar').style.width = `${percent}%`;
    document.getElementById('dig-progress-text').innerText = `${percent}%`;
}
// --- 化石獵人題庫與鑑定邏輯 (擴充為 10 種) ---
const fossilPool = [
    // --- 原本的 5 種 ---
    { name: "琥珀中的蚊子", type: "實體化石", img: "earth-rockimages/fossil-amber.png" },
    { name: "貝殼的壓印", type: "印模化石", img: "earth-rockimages/fossil-shell.png" },
    { name: "恐龍的腳印", type: "痕跡化石", img: "earth-rockimages/fossil-footprint.png" },
    { name: "三葉蟲外殼", type: "實體化石", img: "earth-rockimages/fossil-trilobite.png" },
    { name: "恐龍便便", type: "痕跡化石", img: "earth-rockimages/fossil-poop.png" },

    // --- 🌟 新增的 5 種 ---
    { name: "三角龍的腿骨", type: "實體化石", img: "earth-rockimages/fossil-bone.png" }, // 骨頭
    { name: "巨齒鯊的牙齒", type: "實體化石", img: "earth-rockimages/fossil-tooth.png" }, // 牙齒
    { name: "蕨類葉片印痕", type: "印模化石", img: "earth-rockimages/fossil-leaf.png" }, // 葉片印痕
    { name: "古代魚類印模", type: "印模化石", img: "earth-rockimages/fossil-fish.png" }, // 魚類
    { name: "遠古生物爬行軌跡", type: "痕跡化石", img: "earth-rockimages/fossil-trail.png" } // 爬行痕跡
];

let currentDugFossil = null;

// 🌟 修改：鑑定成功的按鈕與文字邏輯
function checkFossilCategory(selectedType) {
    const feedbackEl = document.getElementById('fossil-feedback');
    const nextBtn = document.getElementById('btn-next-dig');

    if (selectedType === currentDugFossil.type) {
        // 答對了，進入下一題
        currentDigRound++;
        const isGameOver = currentDigRound >= 3;

        if (isGameOver) {
            trackAction('task_3_3_dig_finish'); // 🌟 新增：記錄完成挖掘遊戲
            feedbackEl.innerHTML = "🏆 鑑定正確！恭喜完成三大化石探險！";
            nextBtn.innerHTML = '<i class="fas fa-redo mr-2"></i>再玩一次';
        } else {
            feedbackEl.innerHTML = `✅ 鑑定正確！(進度: ${currentDigRound}/3)`;
            nextBtn.innerHTML = '<i class="fas fa-arrow-right mr-2"></i>下一題';
        }

        feedbackEl.className = "mt-4 text-lg font-black text-green-600 h-8 animate-bounce flex items-center justify-center w-full text-center";
        nextBtn.classList.remove('hidden');
    } else {
        // 答錯了
        feedbackEl.innerHTML = "❌ 好像不太對喔...";
        feedbackEl.className = "mt-4 text-lg font-black text-red-500 h-8 flex items-center justify-center w-full text-center";
        showErrorModal("再想想看！<br>實體化石是生物遺骸，印模是立體壓痕，而痕跡化石是活動留下的(如腳印、便便)！");
    }
}
// ==============================
// --- 關卡四：守護者基地 ---
// ==============================

// --- 1. 頁籤切換邏輯 ---
function switchTabL4(tabId) {
    updateCurrentView(`task-4-${tabId}`); // 🌟 新增這行：記錄切換時間
    // 隱藏三個子任務區塊
    document.getElementById('subtask-4-1').classList.add('hidden');
    document.getElementById('subtask-4-2').classList.add('hidden');
    document.getElementById('subtask-4-3').classList.add('hidden');

    // 重置按鈕顏色
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`tab-l4-btn-${i}`).className = "bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-t-lg font-bold transition shadow-inner";
    }

    // 顯示選取的任務與按鈕高亮
    document.getElementById(`subtask-4-${tabId}`).classList.remove('hidden');
    document.getElementById(`tab-l4-btn-${tabId}`).className = "bg-red-500 text-white px-4 py-2 rounded-t-lg font-bold transition";
}

// --- 2. 任務 4-1：保命三步驟解鎖機制 ---
const safetyOptions = [
    { text: "趴下 (Drop)", correct: true },
    { text: "掩護 (Cover)", correct: true },
    { text: "穩住 (Hold on)", correct: true },
    { text: "立刻往外衝", correct: false },
    { text: "尋找黃金三角", correct: false },
    { text: "趕快去開大門", correct: false },
    { text: "搭電梯逃生", correct: false },
    { text: "躲在玻璃窗旁", correct: false },
    { text: "大聲尖叫呼救", correct: false },
    { text: "保護頭部並站著", correct: false }
];

let foundStepsCount = 0;

function initSafetyLock() {
    const grid = document.getElementById('safety-options-grid');
    grid.innerHTML = '';
    foundStepsCount = 0;

    // 重置燈號
    for (let i = 1; i <= 3; i++) {
        const light = document.getElementById(`step-light-${i}`);
        light.className = "w-12 h-12 rounded-full bg-gray-300 border-4 border-white shadow-inner flex items-center justify-center text-gray-400 font-bold text-xl transition-colors";
    }

    // 洗牌演算法
    const shuffledOptions = [...safetyOptions].sort(() => Math.random() - 0.5);

    // 生成按鈕
    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt.text;
        btn.className = "bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 px-2 rounded-lg shadow-sm hover:border-red-400 hover:bg-red-50 transition transform hover:-translate-y-1 text-sm md:text-base";

        btn.onclick = () => {
            if (opt.correct) {
                // 答對的處理
                btn.classList.replace('border-gray-300', 'border-green-500');
                btn.classList.replace('text-gray-700', 'text-green-700');
                btn.classList.add('bg-green-100', 'pointer-events-none');
                btn.innerHTML = `<i class="fas fa-check-circle mr-1"></i>${opt.text}`;

                foundStepsCount++;
                const light = document.getElementById(`step-light-${foundStepsCount}`);
                light.classList.replace('bg-gray-300', 'bg-green-500');
                light.classList.replace('text-gray-400', 'text-white');

                // 檢查是否集滿三個
                if (foundStepsCount === 3) {
                    trackAction('task_4_1_safety'); // 🌟 新增：記錄解鎖保命三步驟
                    setTimeout(() => {
                        document.getElementById('earthquake-lock-screen').classList.add('hidden');
                        document.getElementById('earthquake-main-content').classList.remove('hidden');
                        document.getElementById('earthquake-main-content').classList.add('animate-[fadeIn_0.5s_ease-in-out]');
                    }, 800);
                }
            } else {
                // 答錯的處理 (呼叫您原本就有的 showErrorModal)
                showErrorModal(`「${opt.text}」是很危險的行為喔！<br>地震搖晃時應優先保護頭頸部，避免移動以免跌倒或被掉落物砸傷。`);
                btn.classList.replace('border-gray-300', 'border-red-300');
                btn.classList.add('bg-gray-100', 'text-gray-400', 'pointer-events-none');
                btn.innerText = "❌ 錯誤";
            }
        };
        grid.appendChild(btn);
    });
}

// --- 3. 任務 4-1：地震報告解密 ---
const reportData = [
    {
        id: "epicenter",
        top: "49%", left: "55%",
        width: "70px", height: "45px", // 👈 新增這行：個別設定這塊污漬的寬高
        term: "震央",
        options: ["震央", "震源", "震度"],
        desc: "地震錯動的起始點稱為「震源」，而震源垂直向上與地表相交的點就叫做<span class='font-bold text-red-600'>「震央」</span>。在地圖上常以 ★ 符號來標示位置。"
    },
    {
        id: "magnitude",
        top: "25%", left: "55%",
        width: "70px", height: "45px", // 👈 新增這行：個別設定這塊污漬的寬高
        term: "芮氏",
        options: ["芮氏", "震度", "深度"],
        desc: "<span class='font-bold text-red-600'>「芮氏規模」</span>是用來表示這場地震所釋放出來的總能量大小。一場地震只會有一個規模數值，而且<span class='bg-yellow-200 px-1 font-bold'>沒有單位</span>喔！"
    },
    {
        id: "intensity",
        top: "65%", left: "45%",
        width: "70px", height: "155px", // 👈 新增這行：個別設定這塊污漬的寬高
        term: "震度",
        options: ["震度", "溫度", "速度"],
        desc: "<span class='font-bold text-red-600'>「震度」</span>代表地表搖晃的劇烈程度。離震央越近通常震度越大。臺灣在109年啟用了新制，將震度分為 <span class='font-bold text-blue-600'>0~4級、5弱、5強、6弱、6強、7級</span> 共 10 個等級。"
    }
];

function initReportStains() {
    const layer = document.getElementById('stain-layer');
    layer.innerHTML = ''; // 清空

    reportData.forEach(item => {
        const stain = document.createElement('div');
        // 移除原本的 w-16 h-10，將背景改為不透光的 bg-gray-900 (接近純黑)
        stain.className = "absolute bg-gray-900 rounded-[50%_40%_60%_30%] cursor-pointer animate-stain hover:bg-black transition flex items-center justify-center border-2 border-dashed border-white/50";

        // 套用您在資料庫設定的位置與大小
        stain.style.top = item.top;
        stain.style.left = item.left;
        stain.style.width = item.width;   // 👈 套用自訂寬度
        stain.style.height = item.height; // 👈 套用自訂高度
        stain.id = `stain-${item.id}`;

        stain.innerHTML = `<i class="fas fa-question text-white/80"></i>`;

        stain.onclick = () => showReportQuestion(item);
        layer.appendChild(stain);
    });
}

function showReportQuestion(item) {
    const qArea = document.getElementById('report-question-area');

    // 💡 關鍵修復：先抓取選項容器，如果因為上一題答對而被刪除了，就重新建立一個！
    let optContainer = document.getElementById('report-options');
    if (!optContainer) {
        optContainer = document.createElement('div');
        optContainer.id = 'report-options';
        optContainer.className = "w-full flex flex-wrap justify-center gap-3";
    }

    // 更新上方文字 (這行會清空 qArea，包含舊的 optContainer)
    qArea.innerHTML = `<h5 class="text-lg font-bold text-gray-800 mb-4">這塊污漬底下蓋住的是什麼名詞呢？</h5>`;

    // 清空選項容器並確保它是顯示狀態
    optContainer.innerHTML = '';
    optContainer.classList.remove('hidden');

    // 將選項洗牌
    const shuffledOptions = [...item.options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = "bg-white border-2 border-blue-400 text-blue-700 font-bold py-2 px-6 rounded-full shadow-sm hover:bg-blue-50 transition transform hover:scale-105";

        btn.onclick = () => {
            if (opt === item.term) {
                // 答對了
                handleCorrectReportAnswer(item);
            } else {
                showErrorModal("不對喔！請重新觀察報告內容再試一次。");
            }
        };
        optContainer.appendChild(btn);
    });

    // 最後，把裝滿新選項的容器「加回」操作區中
    qArea.appendChild(optContainer);
}

function handleCorrectReportAnswer(item) {
    trackAction('task_4_1_report'); // 🌟 新增：記錄清除過地震污漬
    // 👈 獲取這塊污漬，然後直接加入 hidden 讓它消失！
    const stain = document.getElementById(`stain-${item.id}`);
    stain.classList.add('hidden');

    // 顯示解答與說明 (這部分保留原本的設定)
    const qArea = document.getElementById('report-question-area');
    const feedbackArea = document.getElementById('report-feedback-area');
    const titleEl = document.getElementById('report-term-title');
    const descEl = document.getElementById('report-term-desc');

    qArea.innerHTML = `
        <div class="text-green-600 mb-2">
            <i class="fas fa-check-circle text-4xl mb-2"></i>
            <p class="font-bold">答對了！污漬已被清除。</p>
        </div>
        <p class="text-sm text-gray-500">你可以點擊報告上的其他污漬繼續解密。</p>
    `;

    titleEl.innerText = `💡 ${item.term}`;
    descEl.innerHTML = item.desc;

    feedbackArea.classList.remove('hidden');
    feedbackArea.classList.add('animate-[fadeIn_0.3s_ease-in-out]');
}

// --- 4. 任務 4-2：避難背包整理遊戲 ---
const bagItemsData = [
    // 8 個正確的必需品 (名稱已縮短)
    { id: "item-1", name: "礦泉水", correct: true },
    { id: "item-2", name: "乾糧餅乾", correct: true },
    { id: "item-3", name: "手電筒", correct: true },
    { id: "item-4", name: "急救包", correct: true },
    { id: "item-5", name: "求救哨子", correct: true },
    { id: "item-6", name: "保暖毛毯", correct: true },
    { id: "item-7", name: "輕便雨衣", correct: true },
    { id: "item-8", name: "棉手套", correct: true },
    // 7 個錯誤的干擾選項 (名稱已縮短)
    { id: "item-9", name: "遊戲機", correct: false, errorMsg: "雖然遊戲機很好玩，但避難包空間有限，災難時沒有電也不能充，請優先帶生存必需品喔！" },
    { id: "item-10", name: "絨毛娃娃", correct: false, errorMsg: "娃娃太佔空間了！避難時要盡量減輕重量與體積。" },
    { id: "item-11", name: "故事書", correct: false, errorMsg: "厚重的書本會增加逃生時的負擔，避難包以輕便為原則。" },
    { id: "item-12", name: "玻璃汽水", correct: false, errorMsg: "玻璃瓶在地震搖晃時容易破裂，可能會割傷自己，請帶塑膠瓶裝的礦泉水！" },
    { id: "item-13", name: "遊戲卡牌", correct: false, errorMsg: "雖然這組遊戲卡牌很好玩，但在地震避難時，背包空間有限，要優先裝入生存必備的東西，不能帶玩具喔！" },
    { id: "item-14", name: "洋芋片", correct: false, errorMsg: "洋芋片體積大且吃不飽，建議改帶巧克力或營養口糧等體積小、熱量高的食物。" },
    { id: "item-15", name: "小豬公", correct: false, errorMsg: "整個存錢筒太重啦！帶少量的零錢與身分證件影本放在包包裡即可。" }
];

let itemsInBag = [];

// (initBagGame 保持原本的邏輯不變，我們只需替換下面這三個函數)
function initBagGame() {
    const pool = document.getElementById('items-pool');
    const bagZone = document.getElementById('bag-zone');
    pool.innerHTML = '';
    bagZone.innerHTML = '';
    itemsInBag = [];
    updateBagCount();
    document.getElementById('family-card-screen').classList.add('hidden');

    const shuffledItems = [...bagItemsData].sort(() => Math.random() - 0.5);

    shuffledItems.forEach(item => {
        const btn = document.createElement('button');
        btn.id = item.id;
        btn.innerText = item.name;
        // 為了適應 2x4 的網格，稍微調整了按鈕的文字大小和 padding
        btn.className = "bg-white border-2 border-gray-300 text-gray-700 font-bold py-2 px-1 rounded-lg shadow-sm hover:border-blue-400 hover:bg-blue-50 transition transform hover:-translate-y-1 text-sm text-center flex items-center justify-center";

        btn.onclick = () => toggleBagItem(item, btn);
        pool.appendChild(btn);
    });
}

function toggleBagItem(item, btnElement) {
    const pool = document.getElementById('items-pool');
    const bagZone = document.getElementById('bag-zone');

    const index = itemsInBag.findIndex(i => i.id === item.id);

    if (index === -1) {
        // 🌟 新增邏輯：如果是錯誤物品，直接跳出警告，並中斷程式 (不放進背包)
        if (item.correct === false) {
            showErrorModal(`哎呀！避難包不能帶「${item.name}」。<br><br>${item.errorMsg}`);
            return;
        }

        // 準備放入背包
        if (itemsInBag.length >= 8) {
            showErrorModal("背包已經塞滿 8 件物品囉！請先從背包拿出現有物品，才能放新的進去。");
            return;
        }
        // 從右側清單移除，加入左側背包
        itemsInBag.push(item);
        btnElement.classList.replace('border-gray-300', 'border-orange-500');
        btnElement.classList.replace('text-gray-700', 'text-orange-800');
        btnElement.classList.add('bg-orange-100');
        bagZone.appendChild(btnElement);
    } else {
        // 從背包拿出，放回右側清單
        itemsInBag.splice(index, 1);
        btnElement.classList.replace('border-orange-500', 'border-gray-300');
        btnElement.classList.replace('text-orange-800', 'text-gray-700');
        btnElement.classList.remove('bg-orange-100');
        pool.appendChild(btnElement);
    }

    updateBagCount();
}

function updateBagCount() {
    const countEl = document.getElementById('bag-count');
    const checkBtn = document.getElementById('btn-check-bag');

    countEl.innerText = itemsInBag.length;

    if (itemsInBag.length === 8) {
        countEl.classList.replace('text-red-600', 'text-green-600');
        checkBtn.classList.remove('hidden');
        checkBtn.classList.add('animate-pulse');
    } else {
        countEl.classList.replace('text-green-600', 'text-red-600');
        checkBtn.classList.add('hidden');
        checkBtn.classList.remove('animate-pulse');
    }
}

function checkBag() {
    trackAction('task_4_2_bag_completed'); // 🌟 新增：記錄完成了避難包
    document.getElementById('family-card-screen').classList.remove('hidden');
}

// --- 5. 任務 4-3：地景保育巡禮 (全新分類資料庫) ---
const geoDataByCounty = {
    "新北市": [
        {
            id: "yehliu",
            name: "野柳地質公園",
            type: "豆腐岩、蕈狀岩",
            desc: "因為海水侵蝕加上風化作用，岩層產生了交錯的裂縫，切割出像是一格一格的格狀<span class='text-blue-600 font-bold'>「豆腐岩」</span>地形。此外，這裡也以豐富的<span class='text-blue-600 font-bold'>「蕈狀岩」</span>景觀聞名，其中最具代表性的地標便是歷經長期差異侵蝕、外觀宛如尊貴女王側臉的<span class='text-blue-600 font-bold'>「女王頭」</span>。",
            img: "earth-rockimages/geo-野柳.png"
        },
        {
            id: "ruifang",
            name: "瑞芳區",
            type: "海蝕拱門",
            desc: "這裡的岩石有一層層紅褐色花紋；過去擁有非常著名的<span class='text-blue-600 font-bold'>「象鼻岩」</span>海蝕拱門，是大自然經過漫長歲月雕刻出來的。遺憾的是，由於長期的自然風化與海水侵蝕，象鼻部分已於2023年底斷裂。",
            img: "earth-rockimages/geo-瑞芳.png"
        },
        { id: "jinshan", name: "金山燭臺雙嶼", type: "海蝕柱", desc: "原本是與陸地相連的海岬，長期被海水侵蝕後，只剩下最堅硬的岩塊孤立在海中，形成像燭臺一樣的<span class='text-blue-600 font-bold'>「海蝕柱」</span>。", img: "earth-rockimages/geo-金山.png" },
        { id: "gongliao", name: "貢寮區", type: "海蝕崖 / 沙灘", desc: "海岸邊受到海浪強烈掏刷，形成了陡峭的<span class='text-blue-600 font-bold'>「海蝕崖」</span>地形；而在水流較平緩的地方，則有泥沙堆積而成的福隆海水浴場沙灘。", img: "earth-rockimages/geo-貢寮.png" }
    ],
    "宜蘭縣": [
        { id: "nanao", name: "南澳鄉", type: "海蝕洞", desc: "海岸岩壁比較脆弱的地方，被強烈的海浪不斷往內掏挖侵蝕，最後形成了一個個深邃的<span class='text-blue-600 font-bold'>「海蝕洞」</span>。", img: "earth-rockimages/geo-南澳.png" }
    ],
    "花蓮縣": [
        { id: "taroko", name: "太魯閣峽谷", type: "V形谷", desc: "立霧溪湍急的溪水向下強烈切割，加上地殼不斷抬升，將堅硬的灰白相間岩石（大理岩）刻劃出深邃壯觀的<span class='text-yellow-600 font-bold'>「V形谷」</span>。", img: "earth-rockimages/geo-太魯閣.png" }
    ],
    "臺東縣": [
        { id: "donghe", name: "東河鄉金樽", type: "陸連島", desc: "海浪將泥沙搬運到近海的島嶼後方，長久下來泥沙越堆積越多，最後形成一條沙洲將島嶼和陸地連接起來，稱為<span class='text-yellow-600 font-bold'>「陸連島」</span>。", img: "earth-rockimages/geo-金樽.png" }
    ],
    "臺中市": [
        { id: "dajia", name: "大甲溪", type: "斷層瀑布", desc: "河流流經斷層帶時，因為地層錯動產生了巨大的高低落差，溪水直奔而下，形成了壯觀的<span class='text-red-500 font-bold'>「斷層瀑布」</span>。", img: "earth-rockimages/geo-大甲溪.png" }
    ],
    "臺南市": [
        { id: "liujia", name: "六甲區水流東", type: "化石地層", desc: "這裡的溪流附近地層中，藏著非常豐富的<span class='text-amber-600 font-bold'>「貝殼化石」</span>，證明這裡在很久很久以前，其實是一片溫暖的海洋喔！", img: "earth-rockimages/geo-六甲.png" },
        { id: "qigu", name: "七股區", type: "沙洲", desc: "河川帶下來的泥沙，在海浪的推波助瀾下，於海岸外側堆積出狹長的沙地，也就是著名的「新浮崙<span class='text-yellow-600 font-bold'>沙洲</span>」。", img: "earth-rockimages/geo-七股.png" }
    ],
    "高雄市": [
        { id: "tianliao", name: "田寮區", type: "惡地 / 泥火山", desc: "在崇德與古亭兩里之間，分布著二十多個<span class='text-red-500 font-bold'>「泥火山」</span>。細小的泥岩被大雨沖刷出深溝，形成光禿禿、植物難以生長的標準「月世界」惡地地形。", img: "earth-rockimages/geo-田寮.png" },
        { id: "gushan", name: "鼓山區柴山", type: "海蝕洞", desc: "過去的珊瑚礁石灰岩受到海水長期的侵蝕，形成了<span class='text-blue-600 font-bold'>「海蝕洞」</span>，後來因為地殼抬升，現在這些海蝕洞已經跑到山上去了！", img: "earth-rockimages/geo-鼓山.png" }
    ],
    "澎湖縣": [
        { id: "xiji", name: "西吉嶼", type: "玄武岩裂痕", desc: "由黑色的岩石（玄武岩）構成，岩漿冷卻時產生了垂直的裂痕，形成了獨特的柱狀節理。", img: "earth-rockimages/geo-西吉嶼.png" },
        { id: "qimei", name: "七美鄉", type: "海蝕平臺", desc: "海岸邊的岩石被海浪削平，當退潮時，就會露出一大片平坦的岩石，稱為<span class='text-blue-600 font-bold'>「海蝕平臺」</span>。", img: "earth-rockimages/geo-七美鄉.png" },
        { id: "reserve", name: "玄武岩自然保留區", type: "柱狀玄武岩", desc: "這裡是為了保護極為壯觀的「大葉菜柱狀玄武岩」景觀而設立的保護區，是大自然珍貴的火山教室。", img: "earth-rockimages/geo-玄武岩.png" }
    ],
    "連江縣(馬祖)": [
        { id: "matsu", name: "馬祖地質公園", type: "花岡岩坑道", desc: "南竿官帽山景觀區的大漢據點，是在極度堅硬的<span class='text-purple-600 font-bold'>「花岡岩」</span>中開鑿出來的軍事坑道，展現了人與堅硬岩石搏鬥的歷史。", img: "earth-rockimages/geo-馬祖.png" }
    ],
    // 👇 新增第十個縣市：屏東縣 (記得馬祖的陣列大括號後面要加逗號喔！)
    "屏東縣": [
        { id: "kenting", name: "墾丁/小琉球", type: "珊瑚礁岩", desc: "這裡擁有豐富的<span class='text-amber-600 font-bold'>「珊瑚礁岩」</span>。遠古的珊瑚死亡後骨骼堆積，隨著地殼抬升露出海面，形成了崎嶇不平的裙礁海岸，像是著名的「船帆石」就是一塊巨大的珊瑚礁岩！", img: "earth-rockimages/geo-墾丁.png" }
    ]
};

// 初始化縣市選單
function initGeoParks() {
    const countyList = document.getElementById('geo-county-list');
    countyList.innerHTML = '';

    // 取得所有縣市名稱
    const counties = Object.keys(geoDataByCounty);

    counties.forEach(county => {
        const btn = document.createElement('button');
        btn.innerText = county;
        btn.className = "county-btn w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-2 px-1 rounded-xl shadow-sm hover:border-green-500 hover:bg-green-50 transition transform hover:-translate-y-1 text-sm md:text-base text-center shrink-0";

        btn.onclick = () => selectGeoCounty(county, btn);
        countyList.appendChild(btn);
    });
}

// 選擇縣市，動態生成該縣市的地點按鈕
function selectGeoCounty(county, btnElement) {
    // 1. 處理左側按鈕的顏色切換
    document.querySelectorAll('.county-btn').forEach(btn => {
        btn.classList.remove('border-green-500', 'bg-green-100', 'text-green-800');
        btn.classList.add('border-gray-200', 'bg-white', 'text-gray-700');
    });
    btnElement.classList.remove('border-gray-200', 'bg-white', 'text-gray-700');
    btnElement.classList.add('border-green-500', 'bg-green-100', 'text-green-800');

    // 2. 清空並隱藏下方展示區
    document.getElementById('geo-placeholder').classList.remove('hidden');
    document.getElementById('geo-content').classList.add('hidden');

    // 3. 準備上方的地點按鈕 (移至標題列)
    const locationContainer = document.getElementById('geo-location-buttons');
    const hintText = document.getElementById('geo-location-hint');

    locationContainer.innerHTML = '';
    // 將提示文字改成醒目的標籤樣式
    hintText.innerHTML = `<span class="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-bold shadow-inner"><i class="fas fa-map-marker-alt text-red-500 mr-1"></i> ${county}</span>`;

    const locations = geoDataByCounty[county];

    locations.forEach(loc => {
        const btn = document.createElement('button');
        // 為了配合標題列高度，將按鈕改為單行，拿掉副標題
        btn.innerHTML = `<span class="font-black">${loc.name}</span>`;
        // 樣式改為較小巧的圓角藥丸狀 (rounded-full)
        btn.className = "loc-btn bg-white border-2 border-gray-300 text-gray-700 py-1 px-4 rounded-full shadow-sm hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition transform hover:scale-105 text-sm whitespace-nowrap";

        btn.onclick = () => showGeoParkDetail(loc, btn);
        locationContainer.appendChild(btn);
    });

    // 🌟 🌟 🌟 新增邏輯：自動點擊/顯示第一個地點 🌟 🌟 🌟
    if (locationContainer.children.length > 0) {
        // 直接觸發第一個按鈕的點擊事件，讓畫面馬上顯示該地點的圖文！
        locationContainer.children[0].click();
    }
}
// 點擊地點，顯示詳細圖文
function showGeoParkDetail(data, btnElement) {
    trackAction('task_4_3_geo'); // 🌟 修改：記錄點擊過地景保育景點
    // 1. 處理地點按鈕的顏色切換
    document.querySelectorAll('.loc-btn').forEach(btn => {
        btn.classList.remove('border-blue-500', 'bg-blue-100');
        btn.classList.add('border-gray-300', 'bg-white');
    });
    btnElement.classList.remove('border-gray-300', 'bg-white');
    btnElement.classList.add('border-blue-500', 'bg-blue-100');

    // 2. 顯示內容區
    document.getElementById('geo-placeholder').classList.add('hidden');
    const contentZone = document.getElementById('geo-content');

    // 3. 動態組合 HTML 內容
    contentZone.innerHTML = `
        <div class="flex items-end justify-between border-b-2 border-gray-200 pb-2 mb-4 shrink-0">
            <h4 class="text-2xl font-black text-green-800">${data.name}</h4>
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">${data.type}</span>
        </div>
        
        <div class="w-full flex-1 min-h-[300px] bg-gray-200 rounded-xl mb-4 relative overflow-hidden border-4 border-white shadow-md">
            <div class="absolute inset-0 flex items-center justify-center text-gray-400 z-0">
                <div class="flex flex-col items-center"><i class="fas fa-image text-4xl mb-2"></i><span>圖片準備中...</span></div>
            </div>
            <img src="${data.img}" alt="${data.name}" class="absolute inset-0 w-full h-full object-cover z-10 opacity-0 transition-opacity duration-700" onload="this.style.opacity='1'" onerror="this.style.display='none'">
        </div>
        
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-left shrink-0">
            <p class="text-gray-700 leading-relaxed text-base md:text-lg">${data.desc}</p>
        </div>
    `;

    // 4. 重新觸發淡入動畫
    contentZone.classList.remove('hidden');
    contentZone.style.animation = 'none';
    contentZone.offsetHeight;
    contentZone.style.animation = 'fadeIn 0.5s ease-in-out';
}
// ==============================
// --- 第三批次：結算與防呆機制 (純動作操作版) ---
// ==============================

function verifyAllProgress() {
    let incompleteReasons = [];

    // 🌟 完整的必做動作對照表
    const actionNames = {
        'task_1_1_slider': '關卡一：拉動「臺灣誕生」時光機',
        'task_1_2_cards': '關卡一：完成「力量卡片」正確分類',
        'task_2_1_slope': '關卡二：調整過造山流水「坡度」',
        'task_2_1_water_test': '關卡二：進行「倒水測試」',
        'task_2_2_toggle': '關卡二：切換觀察「河流與海岸」地形',
        'task_3_1_rock': '關卡三：點擊觀察「岩石分類」',
        'task_3_2_mohs': '關卡三：拉動「礦物硬度」滑桿',
        'task_3_2_pk_finish': '關卡三：完成 5 題「硬度 PK 賽」',
        'task_3_3_fossil_slider': '關卡三：拉動「化石形成」時光機',
        'task_3_3_dig_finish': '關卡三：完成 3 題「化石挖掘與鑑定」',
        'task_4_1_safety': '關卡四：解鎖「保命 3 步驟」',
        'task_4_1_report': '關卡四：清除「地震報告」污漬',
        'task_4_2_bag_completed': '關卡四：完成「避難包整理」',
        'task_4_3_geo': '關卡四：點擊觀察「地景保育」景點'
    };

    let missedActions = [];

    // --- 檢查：是否所有重要按鈕都有按到 ---
    for (let actionId in actionNames) {
        if (!studentProgress.clickedButtons.has(actionId)) { // 沒按過的都抓出來
            missedActions.push(actionNames[actionId]);
        }
    }

    if (missedActions.length > 0) {
        // 將未完成的動作組合成 HTML 清單
        let listHtml = missedActions.map(name => `<li class="mb-1">${name}</li>`).join('');
        incompleteReasons.push(
            `<div class="text-left mb-3">
                <span class="font-bold text-orange-600"><i class="fas fa-hand-pointer mr-2"></i>你還有以下實驗或機關尚未操作：</span>
                <ul class="list-disc ml-6 text-gray-700 text-sm mt-2">${listHtml}</ul>
            </div>`
        );
    }

    // --- 最終判定 ---
    if (incompleteReasons.length > 0) {
        // 把未完成的清單塞進錯誤彈窗中
        showErrorModal(
            incompleteReasons.join(''),
            "探險任務尚未完成！" 
        );
    } else {
        // 全過關！顯示鼓勵畫面
        showInfoModal(`
            <div class="text-center p-4">
                <h3 class="text-5xl mb-4 animate-bounce">🏆</h3>
                <h4 class="text-3xl font-black text-green-600 mb-4 border-b-4 border-green-200 pb-2">恭喜過關！</h4>
                <p class="text-lg text-gray-700 font-bold leading-relaxed">
                    你已經親自動手完成了所有的探險任務！<br>
                    你是一位合格的「大地探險家」了！
                </p>
            </div>
        `);
    }
}