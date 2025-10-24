// 获取页面元素
const wheel = document.getElementById('wheel');
const popup = document.getElementById('popup');
const prizeImg = document.getElementById('prizeImg');
const wheelContainer = document.querySelector('.wheel-container');
const spinSound = document.getElementById('spinSound'); // 音频元素

// 奖品配置（英文文件名）
const prizes = [
    'images/prize1.png',
    'images/prize2.png',
    'images/prize3.png',
    'images/prize4.png',
    'images/prize5.png',
    'images/prize6.png',
    'images/prize7.png',
    'images/prize8.png'
];
const probabilities = [5, 10, 15, 30, 15, 10, 8, 7]; // 概率总和100
let drawCount = 0; // 已抽奖次数
const maxDrawCount = 1; // 最多抽奖1次
let isSpinning = false; // 是否正在旋转

// 生成概率范围
function getProbabilityRanges() {
    const ranges = [];
    let start = 0;
    for (const p of probabilities) {
        ranges.push([start, start + p]);
        start += p;
    }
    return ranges;
}
const probRanges = getProbabilityRanges();

// 随机选择中奖奖品
function selectPrize() {
    const randomNum = Math.floor(Math.random() * 100);
    for (let i = 0; i < probRanges.length; i++) {
        const [min, max] = probRanges[i];
        if (randomNum >= min && randomNum < max) {
            return i;
        }
    }
    return 0; // 兜底
}

// 开始旋转（核心逻辑）
function startSpin() {
    // 限制：超过次数或正在旋转则不执行
    if (drawCount >= maxDrawCount || isSpinning) return;
    drawCount++;
    isSpinning = true;

    // 1. 播放8秒音频（与旋转同步）
    spinSound.currentTime = 0; // 重置音频到开头
    spinSound.play().catch(err => {
        console.log('提示：请先点击页面任意位置，再旋转（浏览器限制）');
    });

    // 2. 计算旋转角度（4-8圈，8秒完成）
    const prizeIndex = selectPrize();
    const anglePerPrize = 360 / prizes.length; // 每个奖品角度
    const minCircles = 4; // 最少4圈
    const maxCircles = 8; // 最多8圈
    const totalCircles = minCircles + Math.random() * (maxCircles - minCircles);
    const targetAngle = Math.floor(
        360 - (prizeIndex * anglePerPrize + anglePerPrize / 2) + totalCircles * 360
    );

    // 3. 触发旋转（先重置角度，避免累积误差）
    wheel.style.transform = 'rotate(0deg)';
    setTimeout(() => {
        wheel.style.transform = `rotate(${targetAngle}deg)`;
    }, 10);

    // 4. 8秒后显示结果（与音频、动画时长一致）
    setTimeout(() => {
        isSpinning = false;
        prizeImg.src = prizes[prizeIndex];
        popup.style.display = 'flex';
    }, 8000);
}

// 点击转盘中心区域触发旋转（80px范围）
wheel.addEventListener('click', (e) => {
    const rect = wheelContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clickX = e.clientX;
    const clickY = e.clientY;
    const distance = Math.hypot(clickX - centerX, clickY - centerY);

    if (distance <= 80) { // 中心80px内点击有效
        startSpin();
    }
});

// 点击弹窗关闭
popup.addEventListener('click', () => {
    popup.style.display = 'none';
});