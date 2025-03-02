// 创建雨滴效果
function createRainDrops() {
    const rainContainer = document.querySelector('.rain-container');
    const dropCount = 200; // 雨滴数量

    for (let i = 0; i < dropCount; i++) {
        createDrop(rainContainer);
    }
}

function createDrop(container) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    
    // 随机初始位置（包括顶部以上的区域）
    const left = Math.random() * 100;
    const top = Math.random() * -100; // 从顶部上方开始
    const duration = Math.random() * 0.5 + 1; // 1-1.5秒的下落时间
    
    drop.style.left = `${left}%`;
    drop.style.top = `${top}%`;
    drop.style.animationDuration = `${duration}s`;
    
    container.appendChild(drop);
    
    // 当动画结束时重新创建雨滴
    drop.addEventListener('animationend', () => {
        container.removeChild(drop);
        createDrop(container);
    });
}

async function loadSentences() {
    try {
        const response = await fetch('sentense.jsonl');
        const text = await response.text();
        const data = JSON.parse(text);
        return data['action-success']; // 返回引用数组
    } catch (error) {
        console.error('Failed to load quotes:', error);
        return [{
            author: 'Unknown',
            quote: 'The best way to get started is to begin.'
        }];
    }
}

async function displayRandomSentence() {
    const sentences = await loadSentences();
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const quote = sentences[randomIndex];
    
    const sentenceElement = document.getElementById('sentence');
    const authorElement = document.getElementById('author');
    
    sentenceElement.textContent = '';
    authorElement.textContent = '';
    
    // 逐字显示句子
    let index = 0;
    sentenceElement.classList.remove('visible');
    authorElement.classList.remove('visible');
    
    setTimeout(() => {
        sentenceElement.classList.add('visible');
        const interval = setInterval(() => {
            if (index < quote.quote.length) {
                sentenceElement.textContent += quote.quote[index];
                index++;
            } else {
                clearInterval(interval);
                // 显示作者
                authorElement.textContent = `— ${quote.author}`;
                authorElement.classList.add('visible');
            }
        }, 50);
    }, 100);
}

// 修改背景音乐控制逻辑
const bgMusic = document.getElementById('bgMusic');
const musicDisc = document.getElementById('musicDisc');

// 音乐播放控制
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            musicDisc.classList.add('rotating');
        }).catch(error => console.log("播放失败:", error));
    } else {
        bgMusic.pause();
        musicDisc.classList.remove('rotating');
    }
}

// 为光碟添加点击事件
musicDisc.addEventListener('click', toggleMusic);

// 尝试自动播放
function tryAutoPlay() {
    bgMusic.play().then(() => {
        musicDisc.classList.add('rotating');
    }).catch(function(error) {
        console.log("自动播放失败，等待用户交互:", error);
        // 如果自动播放失败，则监听任意点击事件来播放
        document.addEventListener('click', function() {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicDisc.classList.add('rotating');
                }).catch(error => console.log("播放失败:", error));
            }
        }, { once: true });
    });
}

// 添加点击涟漪效果
function createRipple(event) {
    // 排除光碟和文字区域的点击
    if (event.target.closest('#musicDisc') || 
        event.target.closest('#sentence') || 
        event.target.closest('#author')) {
        return;
    }
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    // 设置涟漪的位置
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    
    document.body.appendChild(ripple);
    
    // 动画结束后移除涟漪元素
    ripple.addEventListener('animationend', () => {
        document.body.removeChild(ripple);
    });
}

// 添加计时器功能
let timerInterval = null;
let seconds = 0;
let minutes = 0;
let hours = 0;
let isRunning = false;

function updateTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    const hoursElement = document.querySelector('.hours');
    const minutesElement = document.querySelector('.minutes');
    const secondsElement = document.querySelector('.seconds');
    
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
    const startBtn = document.querySelector('.timer-btn.start');
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = 'Pause';
        startBtn.classList.add('active');
        timerInterval = setInterval(updateTimer, 1000);
    } else {
        isRunning = false;
        startBtn.textContent = 'Start';
        startBtn.classList.remove('active');
        clearInterval(timerInterval);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    seconds = 0;
    minutes = 0;
    hours = 0;
    
    const startBtn = document.querySelector('.timer-btn.start');
    startBtn.textContent = 'Start';
    startBtn.classList.remove('active');
    
    const hoursElement = document.querySelector('.hours');
    const minutesElement = document.querySelector('.minutes');
    const secondsElement = document.querySelector('.seconds');
    
    hoursElement.textContent = '00';
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';
}

// 在页面加载完成后的事件监听中添加计时器控制
document.addEventListener('DOMContentLoaded', () => {
    createRainDrops();
    displayRandomSentence();
    tryAutoPlay();
    document.addEventListener('click', createRipple);
    
    // 添加计时器控制事件监听
    document.querySelector('.timer-btn.start').addEventListener('click', startTimer);
    document.querySelector('.timer-btn.reset').addEventListener('click', resetTimer);
    
    // 初始化计时器显示
    resetTimer();
}); 