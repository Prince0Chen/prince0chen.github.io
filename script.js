// 获取元素
const wheel = document.getElementById('wheel');
const pointer = document.getElementById('pointer');
const popup = document.getElementById('popup');
const prizeImg = document.getElementById('prizeImg');
const spinSound = document.getElementById('spinSound');
const wheelContainer = document.querySelector('.wheel-container');

// 奖品配置（对应images/image3到image10）
const prizes = [
    'images/image3.png',  // 奖品1
    'images/image4.png',  // 奖品2
    'images/image5.png',  // 奖品3
    'images/image6.png',  // 奖品4
    'images/image7.png',  // 奖品5
    'images/image8.png',  // 奖品6
    'images/image9.png',  // 奖品7
    'images/image10.png'  // 奖品8
];

// 概率配置（总和100）
const probabilities = [5, 10, 15, 30, 15, 10, 8, 7];
let isSpinning = false;
let drawCount = 0;
const maxDraws = 1; // 最多抽奖1次

// 生成概率范围
function getProbRanges() {
    const ranges = [];
    let start = 0;
    for (const p of probabilities) {
        ranges.push([start, start + p]);
        start += p;
    }
    return ranges;
}
const probRanges = getProbRanges();

// 随机选择奖品
function selectPrize() {
    const rand = Math.floor(Math.random() * 100);
    for (let i = 0; i < probRanges.length; i++) {
        const [min, max] = probRanges[i];
        if (rand >= min && rand < max) return i;
    }
    return 0;
}

// 开始旋转（8秒，4-8圈）
function startSpin() {
    if (isSpinning || drawCount >= maxDraws) return;
    isSpinning = true;
    drawCount++;

    // 播放8秒音频（同步旋转时间）
    spinSound.currentTime = 0;
    spinSound.play().catch(() => {
        console.log('请先点击页面激活音频权限');
    });

    // 计算旋转角度：4-8圈 + 目标奖品角度
    const prizeIndex = selectPrize();
    const anglePerPrize = 360 / prizes.length; // 每个奖品角度
    const minCircles = 4; // 最少4圈
    const maxCircles = 8; // 最多8圈
    const totalCircles = minCircles + Math.random() * (maxCircles - minCircles);
    const targetAngle = Math.floor(
        360 - (prizeIndex * anglePerPrize + anglePerPrize / 2) + totalCircles * 360
    );

    // 触发旋转
    wheel.style.transform = 'rotate(0deg)';
    setTimeout(() => {
        wheel.style.transform = `rotate(${targetAngle}deg)`;
    }, 10);

    // 8秒后显示结果（与旋转/音频时长一致）
    setTimeout(() => {
        isSpinning = false;
        prizeImg.src = prizes[prizeIndex];
        popup.style.display = 'flex';
    }, 8000);
}

// 点击转盘中心启动（80px范围）
wheelContainer.addEventListener('click', (e) => {
    const rect = wheelContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    if (distance <= 80) startSpin();
});

// 关闭弹窗
popup.addEventListener('click', () => {
    popup.style.display = 'none';
});