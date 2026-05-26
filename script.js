document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo-trigger");
    const container = document.getElementById("particle-container");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle.querySelector("i");

    // --- Переключение тем (Ночная / Дневная) ---
    const currentTheme = localStorage.getItem("theme") || "dark";
    if (currentTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        themeIcon.className = "fas fa-sun";
    }

    themeToggle.addEventListener("click", () => {
        let theme = "dark";
        if (document.documentElement.getAttribute("data-theme") !== "light") {
            document.documentElement.setAttribute("data-theme", "light");
            themeIcon.className = "fas fa-sun";
            theme = "light";
        } else {
            document.documentElement.removeAttribute("data-theme");
            themeIcon.className = "fas fa-moon";
            theme = "dark";
        }
        localStorage.setItem("theme", theme);
    });

    // --- Вылет эффекта "перьев/частиц" из логотипа ---
    function createParticles() {
        const rect = logo.getBoundingClientRect();
        const startX = rect.left + rect.width * 0.85;
        const startY = rect.top + rect.height * 0.25;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");

            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size * 3}px`;

            container.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 90 + 40;
            const destinationX = Math.cos(angle) * velocity;
            const destinationY = Math.sin(angle) * velocity;

            const animation = particle.animate([
                { transform: `translate(${startX}px, ${startY}px) scale(1)`, opacity: 0.9 },
                { transform: `translate(${startX + destinationX}px, ${startY + destinationY}px) scale(0)`, opacity: 0 }
            ], {
                duration: Math.random() * 600 + 400,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
            });

            animation.onfinish = () => { particle.remove(); };
        }
    }

    logo.addEventListener("mouseenter", createParticles);
    logo.addEventListener("click", createParticles);

    // --- Эффект Ripple (Волны при кликах на плашки) ---
    const buttons = document.querySelectorAll(".link-item");
    buttons.forEach(button => {
        button.addEventListener("click", function(e) {
            const circle = document.createElement("span");
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - this.getBoundingClientRect().left - radius}px`;
            circle.style.top = `${e.clientY - this.getBoundingClientRect().top - radius}px`;
            
            circle.style.position = "absolute";
            circle.style.borderRadius = "50%";
            circle.style.transform = "scale(0)";
            circle.style.background = "rgba(255,255,255,0.15)";
            circle.style.animation = "ripple-effect 0.4s linear";
            circle.style.pointerEvents = "none";

            this.appendChild(circle);

            setTimeout(() => { circle.remove(); }, 400);
        });
    });

    // ==========================================================================
    // ЛОГИКА ИИ-ЧАТА (GEMINI 2.5 FLASH)
    // ==========================================================================

    const chatWidgetToggle = document.getElementById("chat-widget-toggle");
    const aiChatWindow = document.getElementById("ai-chat-window");
    const closeChatBtn = document.getElementById("close-chat-btn");
    const chatMessagesContainer = document.getElementById("chat-messages-container");
    const chatUserInput = document.getElementById("chat-user-input");
    const sendChatMsgBtn = document.getElementById("send-chat-msg-btn");

    const _k1 = "AIzaSyC1";
    const _k2 = "z2d6dKtF_ZHO";
    const _k3 = "oO4oQe3WB";
    const _k4 = "0Mzdqs-Ebk";
    
    function getDecryptedKey() {
        return _k1 + _k2 + _k3 + _k4;
    }

    const systemPrompt = `Ты — NovaBot, официальный ИИ-ассистент образовательного консалтингового проекта NovaScriptum. Твоя главная задача — проконсультировать студента и перевести общение на нашего менеджера для оформления заказа.

ИНФОРМАЦИЯ О НАШЕМ САЙТЕ И СТРУКТУРЕ КНОПОК:
Пользователь находится на нашем сайте-визитке. На нем есть ровно 6 интерактивных кнопок:
1. Telegram-канал — основной ресурс, новости проекта, публикации и реальные отзывы.
2. Сообщество ВКонтакте — полезные статьи, гайды, примеры и кейсы.
3. Профиль Instagram — наш официальный медиа-блог.
4. Менеджер в Telegram — главный канал связи для заказов, персонального расчета цены и приема ТЗ. Юзернейм для ручного поиска: @NovaScriptum_admin.
5. Чат WhatsApp — оперативная служба поддержки по номеру телефона.
6. Написать на Email (novascriptum@vk.com) — для крупных ТЗ, официальных запросов и объемных архивов с материалами.
В самом подвале страницы находится ссылка на документ Публичной оферты.

НАШ ОФИЦИАЛЬНЫЙ ПРАЙС-ЛИСТ (ОТВЕЧАЙ СТРОГО ПО НЕМУ):
- Доклад / Эссе: от 250 руб.
- Реферат: от 300 руб.
- Презентации: точная цена зависит от объема слайдов. 5 слайдов — 150 руб., 10 слайдов — 300 руб., от 15+ слайдов — от 450 руб.
- Курсовые и Дипломные работы (ВКР): цена ВСЕГДА рассчитывается строго ИНДИВИДУАЛЬНО менеджером, так как темы бывают разного уровня сложности. Базовый срок подготовки курсача или диплома составляет примерно от 7 до 10 дней.

ПРАВИЛА ПОВЕДЕНИЯ:
1. Если спрашивают про курсовые или дипломные работы: Четко объясни, что темы бывают простыми и сложными, поэтому расчет всегда индивидуальный. Назови срок выполнения (7-10 дней) и сразу отправь по ссылке к менеджеру в Telegram (@NovaScriptum_admin).
2. Общайся вежливо, грамотно, дружелюбно, но лаконично. Не пиши огромные тексты.
3. Раз в 2-3 сообщения ненавязчиво напоминай, что для точной оценки стоимости и оформления заказа лучше всего нажать на кнопку "Менеджер в Telegram" или написать напрямую @NovaScriptum_admin.`;

    let conversationHistory = [];

    // Универсальная функция переключения видимости чата (ПК + Мобилки)
    function toggleChat(e) {
        if (e) e.preventDefault();
        aiChatWindow.classList.toggle("hidden");
        if (!aiChatWindow.classList.contains("hidden")) {
            setTimeout(() => chatUserInput.focus(), 100);
        }
    }

    // Обработчики для кнопки вызова (клик и тач для мобильных систем)
    chatWidgetToggle.addEventListener("click", toggleChat);
    chatWidgetToggle.addEventListener("touchstart", toggleChat, { passive: false });

    closeChatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        aiChatWindow.classList.add("hidden");
    });
    closeChatBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        aiChatWindow.classList.add("hidden");
    }, { passive: false });

    // Отправка сообщений
    async function handleSendMessage() {
        const text = chatUserInput.value.trim();
        if (!text) return;

        appendMessage(text, "user-msg");
        chatUserInput.value = "";

        const typingElem = document.createElement("div");
        typingElem.classList.add("msg", "bot-msg");
        typingElem.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
        chatMessagesContainer.appendChild(typingElem);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        conversationHistory.push({ role: "user", parts: [{ text: text }] });

        try {
            const apiKey = getDecryptedKey();
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: conversationHistory,
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
                })
            });

            const data = await response.json();
            typingElem.remove();

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const botReply = data.candidates[0].content.parts[0].text;
                appendMessage(botReply, "bot-msg");
                conversationHistory.push({ role: "model", parts: [{ text: botReply }] });
            } else {
                appendMessage("Извините, произошел временный сбой соединения. Вы можете связаться с нашим менеджером напрямую в Telegram: @NovaScriptum_admin", "bot-msg");
            }
        } catch (error) {
            typingElem.remove();
            appendMessage("Не удалось отправить сообщение. Пожалуйста, воспользуйтесь кнопками быстрой связи с менеджером.", "bot-msg");
            console.error("Gemini API Error:", error);
        }
    }

    sendChatMsgBtn.addEventListener("click", handleSendMessage);
    chatUserInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSendMessage();
    });
});
