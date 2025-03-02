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

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    createRainDrops();
    displayRandomSentence();
});

// 删除所有点击相关的事件监听器 