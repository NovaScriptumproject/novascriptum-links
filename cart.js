/* ============================================
   NovaScriptum — корзина заказа
   Собирает выбранные услуги и отправляет их
   менеджеру в Telegram готовым сообщением.
   ============================================ */

(function () {
    'use strict';

    const CART_KEY = 'ns-cart-v1';
    const ADMIN_URL = 'https://t.me/NovaScriptum_admin';

    const bar = document.getElementById('cart-bar');
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    const itemsEl = document.getElementById('cart-items');
    const countEl = document.getElementById('cart-count');
    const sumEl = document.getElementById('cart-sum');
    const totalEl = document.getElementById('cart-total');
    const sendEl = document.getElementById('cart-send');

    if (!bar || !drawer || !itemsEl) return;

    let cart = [];

    const rub = (n) => n.toLocaleString('ru-RU') + ' ₽';

    function plural(n, one, few, many) {
        const a = Math.abs(n) % 100;
        const b = a % 10;
        if (a > 10 && a < 20) return many;
        if (b === 1) return one;
        if (b >= 2 && b <= 4) return few;
        return many;
    }

    /* ---------- Хранилище ---------- */

    function load() {
        try {
            const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
            cart = Array.isArray(raw) ? raw.filter(i => i && i.key && i.name) : [];
        } catch (e) {
            cart = [];
        }
    }

    function save() {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (e) {
            /* приватный режим — работаем без сохранения */
        }
    }

    /* ---------- Расчёты ---------- */

    const sum = () => cart.reduce((s, i) => s + (i.quote ? 0 : i.price * i.qty), 0);
    const count = () => cart.reduce((s, i) => s + i.qty, 0);
    const hasQuote = () => cart.some(i => i.quote);

    function message() {
        const lines = cart.map((item, idx) => {
            const meta = item.meta ? ` (${item.meta})` : '';
            if (item.quote) {
                return `${idx + 1}. ${item.name}${meta} — сумма по расчёту`;
            }
            if (item.qty > 1) {
                return `${idx + 1}. ${item.name}${meta} — ${item.qty} × ${rub(item.price)} = ${rub(item.price * item.qty)}`;
            }
            return `${idx + 1}. ${item.name}${meta} — ${rub(item.price)}`;
        });

        const total = rub(sum()) + (hasQuote() ? ' + работы по расчёту' : '');

        return [
            'Здравствуйте! Хочу оформить заказ:',
            '',
            ...lines,
            '',
            'Итого: ' + total,
            '',
            'Тема: '
        ].join('\n');
    }

    /* ---------- Отрисовка ---------- */

    function render() {
        const empty = cart.length === 0;
        const totalText = rub(sum()) + (hasQuote() ? ' + по расчёту' : '');

        bar.hidden = empty;
        document.body.classList.toggle('has-cart', !empty);

        countEl.textContent = count();
        sumEl.textContent = totalText;
        totalEl.textContent = totalText;

        if (empty) {
            itemsEl.innerHTML = '<p class="cart-empty">Пока пусто. Добавьте услугу из блока с тарифами.</p>';
        } else {
            itemsEl.innerHTML = cart.map((item, idx) => [
                '<div class="cart-item">',
                '<div>',
                '<p class="cart-item-name">' + item.name + '</p>',
                item.meta ? '<p class="cart-item-meta">' + item.meta + '</p>' : '',
                '<div class="cart-qty">',
                '<button type="button" data-act="dec" data-idx="' + idx + '" aria-label="Уменьшить количество">−</button>',
                '<span>' + item.qty + '</span>',
                '<button type="button" data-act="inc" data-idx="' + idx + '" aria-label="Увеличить количество">+</button>',
                '</div>',
                '<button type="button" class="cart-remove" data-act="del" data-idx="' + idx + '">Удалить</button>',
                '</div>',
                '<p class="cart-item-price">' + (item.quote ? 'по расчёту' : rub(item.price * item.qty)) + '</p>',
                '</div>'
            ].join('')).join('');
        }

        sendEl.href = ADMIN_URL + '?text=' + encodeURIComponent(message());
    }

    function add(item) {
        const same = cart.find(i => i.key === item.key);
        if (same) {
            same.qty += 1;
        } else {
            cart.push(Object.assign({}, item, { qty: 1 }));
        }
        save();
        render();
    }

    /* ---------- Открытие / закрытие ---------- */

    function openDrawer() {
        drawer.classList.add('open');
        backdrop.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /* ---------- Слайды презентации ---------- */

    document.querySelectorAll('.price-card[data-slides]').forEach(function (card) {
        const slidesEl = card.querySelector('[data-role="slides"]');
        const wordEl = card.querySelector('[data-role="slides-word"]');
        const priceEl = card.querySelector('[data-role="price"]');

        const base = Number(card.dataset.priceBase);
        const baseSlides = Number(card.dataset.slidesBase);
        const step = Number(card.dataset.slideStep);
        const stepPrice = Number(card.dataset.slidePrice);
        const maxSlides = 97;

        function update() {
            const slides = Number(card.dataset.slides);
            const price = base + ((slides - baseSlides) / step) * stepPrice;

            if (slidesEl) slidesEl.textContent = slides;
            if (wordEl) wordEl.textContent = plural(slides, 'слайд', 'слайда', 'слайдов');
            if (priceEl) priceEl.textContent = price.toLocaleString('ru-RU');

            card.querySelectorAll('.slide-btn').forEach(function (btn) {
                const dir = Number(btn.dataset.dir);
                btn.disabled = dir < 0 ? slides <= baseSlides : slides >= maxSlides;
            });
        }

        card.querySelectorAll('.slide-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const dir = Number(btn.dataset.dir);
                const next = Number(card.dataset.slides) + dir * step;
                card.dataset.slides = Math.min(maxSlides, Math.max(baseSlides, next));
                update();
            });
        });

        update();
    });

    /* ---------- Добавление в корзину ---------- */

    document.querySelectorAll('.js-add').forEach(function (btn) {
        if (!btn.dataset.label) btn.dataset.label = btn.textContent.trim();

        btn.addEventListener('click', function () {
            const card = btn.closest('.price-card');
            let price = Number(btn.dataset.price || 0);
            let meta = btn.dataset.meta || '';
            let key = btn.dataset.id;

            if (card && card.dataset.slides) {
                const slides = Number(card.dataset.slides);

                price = Number(card.dataset.priceBase)
                    + ((slides - Number(card.dataset.slidesBase)) / Number(card.dataset.slideStep))
                    * Number(card.dataset.slidePrice);

                meta = slides + ' ' + plural(slides, 'слайд', 'слайда', 'слайдов');
                key = 'pre-' + slides;
            }

            add({
                key: key,
                name: btn.dataset.name,
                meta: meta,
                price: price,
                quote: btn.dataset.quote === '1'
            });

            btn.textContent = 'Добавлено ✓';
            clearTimeout(btn._t);
            btn._t = setTimeout(function () {
                btn.textContent = btn.dataset.label;
            }, 1200);
        });
    });

    /* ---------- Управление списком ---------- */

    document.getElementById('cart-open').addEventListener('click', openDrawer);
    document.getElementById('cart-checkout').addEventListener('click', openDrawer);
    document.getElementById('cart-close').addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDrawer();
    });

    itemsEl.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-act]');
        if (!btn) return;

        const idx = Number(btn.dataset.idx);
        const act = btn.dataset.act;

        if (!cart[idx]) return;

        if (act === 'inc') cart[idx].qty += 1;
        if (act === 'dec') cart[idx].qty -= 1;
        if (act === 'del') cart.splice(idx, 1);
        if (cart[idx] && cart[idx].qty <= 0) cart.splice(idx, 1);

        save();
        render();
    });

    load();
    render();
})();
