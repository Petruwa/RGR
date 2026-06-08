document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. ЛОГИКА ТЕМНОЙ ТЕМЫ ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // === 2. ЛОГИКА СЧЕТЧИКА КОРЗИНЫ В ШАПКЕ ===
    let cart = JSON.parse(localStorage.getItem('cart-data')) || [];

    function updateCartCount() {
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }
    updateCartCount();

    // === 3. ДОБАВЛЕНИЕ В КОРЗИНУ (catalog.html) ===
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const id = card.dataset.id;
                const name = card.dataset.name;
                const price = parseInt(card.dataset.price);

                const existingItem = cart.find(item => item.id === id);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ id, name, price, quantity: 1 });
                }

                localStorage.setItem('cart-data', JSON.stringify(cart));
                updateCartCount();
                alert(`Товар "${name}" добавлен в корзину!`);
            });
        });
    }

    // === 4. ОТОБРАЖЕНИЕ И УДАЛЕНИЕ ТОВАРОВ (cart.html) ===
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');
    const totalPriceEl = document.getElementById('total-price');

    function renderCart() {
        if (!cartItemsList) return; // Выходим, если мы не на странице корзины

        if (cart.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'none';
            cartItemsList.innerHTML = '';
        } else {
            if (emptyMessage) emptyMessage.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'block';
            cartItemsList.innerHTML = '';

            let total = 0;

            cart.forEach(item => {
                total += item.price * item.quantity;
                
                const li = document.createElement('li');
                li.style.cssText = 'background: var(--card-bg); padding: 15px; margin-bottom: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #ccc;';
                
                // Добавляем верстку элемента и кнопку удаления с data-id
                li.innerHTML = `
                    <div>
                        <strong>${item.name}</strong> — ${item.price} руб. x ${item.quantity} шт.
                        <br><span style="font-size: 0.9rem; color: #888;">Всего: ${item.price * item.quantity} руб.</span>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}" style="background-color: #dc3545; color: white; padding: 5px 10px; font-size: 0.9rem;">Удалить</button>
                `;
                cartItemsList.appendChild(li);
            });

            if (totalPriceEl) totalPriceEl.textContent = total;
            
            // Навешиваем событие удаления на каждую созданную кнопку
            initRemoveButtons();
        }
    }

    // Функция для обработки кликов по кнопкам "Удалить"
    function initRemoveButtons() {
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const idToRemove = e.target.dataset.id;
                
                // Фильтруем массив, исключая товар с выбранным id
                cart = cart.filter(item => item.id !== idToRemove);
                
                // Пересохраняем данные и обновляем интерфейс
                localStorage.setItem('cart-data', JSON.stringify(cart));
                updateCartCount();
                renderCart();
            });
        });
    }
    
    renderCart();

    // Кнопка очистки всей корзины
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            localStorage.setItem('cart-data', JSON.stringify(cart));
            updateCartCount();
            renderCart();
        });
    }

    // Кнопка оформления заказа
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Спасибо за заказ! Заявка успешно отправлена.');
            cart = [];
            localStorage.setItem('cart-data', JSON.stringify(cart));
            updateCartCount();
            renderCart();
        });
    }

    // === 5. ВАЛИДАЦИЯ ФОРМЫ (contacts.html) ===
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const name = document.getElementById('form-name').value;
            alert(`Спасибо, ${name}! Ваше сообщение успешно отправлено.`);
            contactForm.reset(); 
        });
    }
});
