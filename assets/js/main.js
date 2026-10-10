document.addEventListener('DOMContentLoaded', () => {
  const productsGrid = document.querySelector('.products-grid');
  const loader = document.getElementById('loader');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotalSum = document.getElementById('cartTotalSum');

  let cart = [];

  const productsData = [
    { id: 1, title: 'Pudge', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png', desc: 'Найвідоміший хук в історії гри. Чудово ініціює бої та збирає заряди Flesh Heap.', stat: 'Вінрейт: 65%' },
    { id: 2, title: 'Anti-Mage', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png', desc: "Фармить як монстр. Коли з'являється Manta Style — ворогам краще здаватися.", stat: 'Вінрейт: 58%' },
    { id: 3, title: 'Invoker', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/invoker.png', desc: 'Складний маг із 10 заклинаннями. Вимагає бездоганного макро та піаніно-пальців.', stat: 'Вінрейт: 53%' },
    { id: 4, title: 'Juggernaut', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png', desc: 'Надійний керрі. Blade Fury забезпечує імунітет до магії, а Omnislash - домінує в 1х1.', stat: 'Вінрейт: 60%' },
    { id: 5, title: 'Arc Warden', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/arc_warden.png', desc: 'Майстер мікроконтролю та копій. Відправляє клона на лінію, поки безпечно фармить ліс.', stat: 'Вінрейт: 80%' },
    { id: 6, title: 'Broodmother', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/broodmother.png', desc: 'Той самий справжній бруд! Захоплює лінію своїми павутинами та армією дрібних павуків.', stat: 'Вінрейт: 75%' }
  ];

  function openCartModal() {
    if (cartOverlay) {
      renderCartItems();
      cartOverlay.classList.remove('hidden');
    }
  }

  function updateCartCounter() {
    const totalCount = cart.reduce((count, item) => count + item.quantity, 0);
    const cartBtn = document.querySelector('.btn-cart');
    if (cartBtn) {
      cartBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        <span>Арсенал (${totalCount})</span>
      `;
      cartBtn.onclick = openCartModal;
    }
  }

  function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }

    updateCartCounter();
    renderCartItems();
  }

  function renderCartItems() {
    if (!cartItemsContainer || !cartTotalSum) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Пул героїв порожній.</p>';
      cartTotalSum.textContent = '0';
      return;
    }

    const html = cart.map(item => `
      <div class="cart-item-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #333;">
        <div>
          <strong>${item.title}</strong>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn-qty-minus" data-id="${item.id}" style="padding: 2px 8px; cursor: pointer;">-</button>
          <span>${item.quantity}</span>
          <button class="btn-qty-plus" data-id="${item.id}" style="padding: 2px 8px; cursor: pointer;">+</button>
        </div>
      </div>
    `).join('');

    cartItemsContainer.innerHTML = html;

    document.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => changeQuantity(Number(e.target.dataset.id), -1));
    });
    document.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => changeQuantity(Number(e.target.dataset.id), 1));
    });

    const totalHeroes = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotalSum.textContent = totalHeroes;
  }

  function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    updateCartCounter();
    renderCartItems();
  }

  function renderProducts() {
    if (!productsGrid) return;

    productsGrid.innerHTML = productsData.map(product => `
      <div class="product-card">
        <img src="${product.img}" alt="${product.title}" class="product-img">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-desc">${product.desc}</p>
        <span class="product-stat">${product.stat}</span>
        <button class="btn-buy" data-id="${product.id}">Додати в пул</button>
      </div>
    `).join('');

    document.querySelectorAll('.btn-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        addToCart(id);
      });
    });
  }

  const initialCartBtn = document.querySelector('.btn-cart');
  if (initialCartBtn) {
    initialCartBtn.onclick = openCartModal;
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      if (cartOverlay) {
        cartOverlay.classList.add('hidden');
      }
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) {
        cartOverlay.classList.add('hidden');
      }
    });
  }

  function initShop() {
    if (loader) loader.style.display = 'block';
    if (productsGrid) productsGrid.style.display = 'none';

    setTimeout(() => {
      if (loader) loader.style.display = 'none';
      if (productsGrid) productsGrid.style.display = 'grid';
      renderProducts();
    }, 1000);
  }

  initShop();
});