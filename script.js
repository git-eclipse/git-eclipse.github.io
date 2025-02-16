document.addEventListener('DOMContentLoaded', () => {
    // 轮播相关代码
    const galleryImg = document.querySelector('.gallery-item img');
    let currentImageIndex = 0;
    const images = [
        'imgs/4K黄昏.png',
        'imgs/a lonely winte.png',
        'imgs/Artic Sunset.png'
    ];
    
    // 图片加载错误处理
    galleryImg.onerror = function() {
        console.error('图片加载失败:', this.src);
        this.src = 'https://picsum.photos/1200/675';
    };

    // 切换图片函数
    function changeImage() {
        galleryImg.style.opacity = '0';
        setTimeout(() => {
            galleryImg.src = images[currentImageIndex];
            galleryImg.style.opacity = '1';
            currentImageIndex = (currentImageIndex + 1) % images.length;
        }, 500);
    }

    // 设置自动轮播间隔（5秒）
    setInterval(changeImage, 5000);

    // 初始加载第一张图片
    galleryImg.src = images[0];
    
    // AI聊天相关代码
    const chatMessages = document.querySelector('.chat-messages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.querySelector('.send-btn');
    
    const MOONSHOT_API_KEY = 'sk-SsnAJdkcdjfnDI40o4YfKfsY1jvNorGCmJTTM1Xx971j4wHd';  // 临时保留，但需要注意安全性
    const API_URL = 'https://api.moonshot.cn/v1/chat/completions';

    async function getAIResponse(userMessage) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MOONSHOT_API_KEY}`
                },
                body: JSON.stringify({
                    model: "moonshot-v1-8k",
                    messages: [
                        {
                            role: "system",
                            content: `你是之岸渐的AI助手，主人是一位独特的跨界人才：金融从业者、玄学爱好者和双碳领域的探索者。请遵循以下规则：

                            1. 专业领域介绍：
                               - 金融领域：擅长分析经济趋势和市场脉动
                               - 玄学研究：对生命哲学和东方玄学有独特见解
                               - 双碳探索：致力于可持续发展和环境保护实践

                            2. 回答特点：
                               - 在金融话题上展现专业洞见
                               - 在玄学讨论中体现深度思考
                               - 在环保议题上分享实践经验
                               - 善于将这三个领域进行跨界连接

                            3. 回答风格：
                               - 用友好且专业的语气
                               - 回答简洁，通常不超过三句话
                               - 适当使用表情符号增加亲和力
                               - 在专业术语后适时添加通俗解释

                            4. 互动指南：
                               - 鼓励访客探索作品集中的创作
                               - 对不确定的问题建议直接咨询之岸渐
                               - 在合适时机推荐相关领域的探讨
                               - 对负面言论保持礼貌但坚定的回应

                            5. 核心价值观：
                               - 强调理性思维与玄学智慧的结合
                               - 突出金融与环保的可持续发展理念
                               - 展现对生命和自然的敬畏之心
                               - 传递积极向上的人生态度`
                        },
                        {
                            role: "user",
                            content: userMessage
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 800,
                    stream: false
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('AI响应错误:', error);
            return '抱歉，我现在遇到了一些问题，请稍后再试。';
        }
    }

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;  // 返回消息元素以便后续可能的移除操作
    }

    async function handleSend() {
        const text = userInput.value.trim();
        if (text === '') return;

        // 添加用户消息
        addMessage(text, true);
        
        // 显示加载状态
        const loadingMessage = addMessage('思考中...', false);
        
        try {
            // 获取AI回复
            const response = await getAIResponse(text);
            
            // 移除加载消息
            loadingMessage.remove();
            
            // 添加AI回复
            addMessage(response);
        } catch (error) {
            // 移除加载消息
            loadingMessage.remove();
            
            // 显示错误消息
            addMessage('抱歉，我遇到了一些问题，请稍后再试。');
        }

        // 清空输入框
        userInput.value = '';
    }

    // 点击发送按钮发送消息
    sendButton.addEventListener('click', handleSend);

    // 按回车键发送消息
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    // 在 DOMContentLoaded 事件处理函数中添加
    const emailLink = document.querySelector('.social-link.email');
    const emailAddress = '380022215@qq.com';

    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(emailAddress).then(() => {
            emailLink.classList.add('copied');
            setTimeout(() => {
                emailLink.classList.remove('copied');
            }, 5000);
        });
    });
}); 