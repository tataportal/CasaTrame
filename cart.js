/* ===========================================
   CART — shared across all pages
   Uses localStorage for persistence.
   =========================================== */

let cart = [];
try { cart = JSON.parse(localStorage.getItem('ct_cart') || '[]'); } catch(e) {}
cart.forEach(c => { if (c.img) c.img = c.img.replace(/^\.\.\//g, ''); });

function syncCartToStorage() {
  try { localStorage.setItem('ct_cart', JSON.stringify(cart)); } catch(e) {}
}

function addToCart(id, color, size, img, name, price) {
  const existing = cart.find(c => c.id === id && c.color === color && c.size === size);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, color, size, img, name, price, qty: 1 });
  }
  syncCartToStorage();
  updateCartBadge();
  renderCart();
  openCart();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  syncCartToStorage();
  updateCartBadge();
  renderCart();
  if (cart.length === 0) closeCart();
}

function updateCartQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty < 1) cart[idx].qty = 1;
  syncCartToStorage();
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const total = cart.reduce((sum, c) => sum + c.qty, 0);
  badge.style.display = total > 0 ? 'block' : 'none';
}

function openCart() {
  renderCart();
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  const subtotalEl = document.getElementById('cartSubtotal');
  if (!itemsEl) return;

  if (cart.length === 0) {
    emptyEl.style.display = 'block';
    footerEl.style.display = 'none';
    itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';
  itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());

  cart.forEach((c, idx) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item__img"><img src="${c.img}" alt="${c.name}" loading="lazy"></div>
      <div class="cart-item__details">
        <div class="cart-item__name">${c.name}</div>
        <div class="cart-item__meta">
          <span class="cart-item__meta-dot" style="background:${c.color}"></span>
          Talla ${c.size}
        </div>
        <div class="cart-item__price">$ ${(c.price * c.qty).toLocaleString()}</div>
        <div class="cart-item__qty">
          <button onclick="updateCartQty(${idx}, -1)">&minus;</button>
          <span>${c.qty}</span>
          <button onclick="updateCartQty(${idx}, +1)">+</button>
        </div>
        <button class="cart-item__remove" onclick="removeFromCart(${idx})">Eliminar</button>
      </div>
    `;
    itemsEl.appendChild(div);
  });

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  subtotalEl.textContent = '$ ' + subtotal.toLocaleString();
}

// Init badge on load
document.addEventListener('DOMContentLoaded', () => { updateCartBadge(); });
