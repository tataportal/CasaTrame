(function () {
  const cartForm = document.querySelector('[data-cart-form]');
  if (!cartForm) return;

  const subtotal = cartForm.querySelector('[data-cart-subtotal]');
  const moneyFormat = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2
  });
  let pendingChange = Promise.resolve();
  const checkoutPrefill = {
    'checkout[shipping_address][country]': 'Peru',
    'checkout[shipping_address][province]': 'Lima',
    'checkout[shipping_address][city]': 'Lima'
  };

  function formatMoney(cents) {
    return moneyFormat.format(Number(cents || 0) / 100).replace('PEN', 'S/.').replace('S/', 'S/.');
  }

  async function syncQuantity(item, input) {
    const lineKey = item.dataset.cartLineKey || '';
    const quantity = Math.max(Number(input.getAttribute('min') || 0), Number(input.value || 0));
    if (!lineKey) return;

    input.value = String(quantity);
    item.classList.add('is-updating');
    pendingChange = fetch('/cart/change.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: lineKey, quantity: quantity })
    })
      .then(function (response) {
        if (!response.ok) throw new Error('cart change failed');
        return response.json();
      })
      .then(function (cart) {
        const updatedLine = cart.items.find(function (cartItem) {
          return cartItem.key === lineKey;
        });
        if (!updatedLine || quantity === 0) {
          window.location.reload();
          return;
        }
        const price = item.querySelector('[data-cart-line-price]');
        if (price) price.textContent = formatMoney(updatedLine.final_line_price);
        if (subtotal) subtotal.textContent = formatMoney(cart.total_price);
      })
      .catch(function () {
        window.location.reload();
      })
      .finally(function () {
        item.classList.remove('is-updating');
      });

    await pendingChange;
  }

  document.querySelectorAll('[data-cart-quantity]').forEach(function (control) {
    const input = control.querySelector('[data-cart-qty-input]');
    const minus = control.querySelector('[data-cart-qty-minus]');
    const plus = control.querySelector('[data-cart-qty-plus]');
    const item = control.closest('[data-cart-item]');
    if (!input) return;

    function setQuantity(delta) {
      const current = Number(input.value || 0);
      const min = Number(input.getAttribute('min') || 0);
      input.value = String(Math.max(min, current + delta));
      syncQuantity(item, input);
    }

    if (minus) minus.addEventListener('click', function () { setQuantity(-1); });
    if (plus) plus.addEventListener('click', function () { setQuantity(1); });
    input.addEventListener('change', function () { syncQuantity(item, input); });
  });

  cartForm.addEventListener('submit', function (event) {
    const submitter = event.submitter;
    if (!submitter || submitter.name !== 'checkout') return;
    event.preventDefault();
    pendingChange.finally(function () {
      const checkoutUrl = new URL('/checkout', window.location.origin);
      Object.entries(checkoutPrefill).forEach(function ([key, value]) {
        checkoutUrl.searchParams.set(key, value);
      });
      window.location.href = checkoutUrl.pathname + checkoutUrl.search;
    });
  });
})();

(function () {
  const transparentNav = document.querySelector('[data-transparent-nav]');
  const transparentHero = document.querySelector('.hero');
  const nav = document.getElementById('mainNav');
  const hero = document.querySelector('.hero') || document.querySelector('.pdp-gallery');
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.nav__hamburger');
  const ctNav = document.querySelector('.ct-v-nav');
  const ctMenuToggle = document.querySelector('[data-ct-menu-toggle]');
  const ctMobileMenu = document.querySelector('[data-ct-mobile-menu]');
  let menuOpen = false;
  let ctMenuOpen = false;

  function updateTransparentNav() {
    if (!transparentNav || !transparentHero) return;
    if (ctMenuOpen) {
      transparentNav.classList.remove('ct-v-nav--transparent');
      return;
    }
    const heroBottom = transparentHero.getBoundingClientRect().bottom;
    const navHeight = transparentNav.offsetHeight || 0;
    transparentNav.classList.toggle('ct-v-nav--transparent', heroBottom > navHeight);
  }

  function setCtMenuOpen(open) {
    if (!ctNav || !ctMenuToggle || !ctMobileMenu) return;
    ctMenuOpen = open;
    ctNav.classList.toggle('is-menu-open', ctMenuOpen);
    ctMenuToggle.classList.toggle('is-open', ctMenuOpen);
    ctMenuToggle.setAttribute('aria-expanded', String(ctMenuOpen));
    ctMenuToggle.setAttribute('aria-label', ctMenuOpen ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = ctMenuOpen ? 'hidden' : '';
    updateTransparentNav();
  }

  function updateNav() {
    if (!nav || !hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom <= window.innerHeight * 0.5) {
      nav.classList.remove('nav--transparent');
      nav.classList.add('nav--solid');
    } else {
      nav.classList.remove('nav--solid');
      nav.classList.add('nav--transparent');
    }
  }

  window.toggleMobileMenu = function toggleMobileMenu() {
    if (!mobileMenu || !hamburger || !nav) return;
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    hamburger.classList.toggle('is-open', menuOpen);

    if (menuOpen) {
      nav.classList.remove('nav--transparent');
      nav.classList.add('nav--solid');
    } else {
      updateNav();
    }
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('scroll', updateTransparentNav, { passive: true });
  if (ctMenuToggle) {
    ctMenuToggle.addEventListener('click', function () {
      setCtMenuOpen(!ctMenuOpen);
    });
  }
  if (ctMobileMenu) {
    ctMobileMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setCtMenuOpen(false);
    });
  }
  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', hash);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && menuOpen) {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.classList.remove('is-open');
      updateNav();
    }
    if (window.innerWidth > 768 && ctMenuOpen) {
      setCtMenuOpen(false);
    }
    updateTransparentNav();
  });
  updateNav();
  updateTransparentNav();
  if (window.location.search.includes('customer_posted=true') || window.location.hash === '#contact_form') {
    window.history.replaceState(null, '', window.location.pathname || '/');
  }

  const grid = document.querySelector('.collection-grid');
  const track = document.querySelector('.collection-grid__track');
  if (!grid || !track) return;

  const arrowL = grid.querySelector('.carousel-arrow--left');
  const arrowR = grid.querySelector('.carousel-arrow--right');
  const mobileCarouselMq = window.matchMedia('(max-width: 900px)');
  let pos = 0;
  let dragging = false;
  let startX = 0;
  let dragStartPos = 0;
  let lastDragX = 0;
  let dragVelocity = 0;
  let didDrag = false;

  function maxPos() {
    const viewport = mobileCarouselMq.matches ? track : grid;
    return Math.max(0, track.scrollWidth - viewport.clientWidth);
  }
  function clampPos() {
    pos = Math.max(0, Math.min(pos, maxPos()));
  }
  function updateArrows() {
    if (!arrowL || !arrowR) return;
    const current = mobileCarouselMq.matches ? track.scrollLeft : pos;
    arrowL.style.opacity = current <= 5 ? '0' : '';
    arrowL.style.pointerEvents = current <= 5 ? 'none' : '';
    arrowR.style.opacity = current >= maxPos() - 5 ? '0' : '';
    arrowR.style.pointerEvents = current >= maxPos() - 5 ? 'none' : '';
  }
  function loop() {
    if (mobileCarouselMq.matches) {
      track.style.transform = '';
      updateArrows();
      requestAnimationFrame(loop);
      return;
    }
    if (!dragging && Math.abs(dragVelocity) > 0.5) {
      pos -= dragVelocity;
      dragVelocity *= 0.95;
    } else if (!dragging) {
      dragVelocity = 0;
    }
    clampPos();
    track.style.transform = 'translateX(' + (-pos) + 'px)';
    updateArrows();
    requestAnimationFrame(loop);
  }
  function getCardWidth() {
    const card = track.querySelector('.collection-card');
    return card ? card.offsetWidth + 2 : 300;
  }
  function smoothScroll(delta) {
    if (mobileCarouselMq.matches) {
      track.scrollBy({ left: delta, behavior: 'smooth' });
      window.setTimeout(updateArrows, 320);
      return;
    }
    const target = Math.max(0, Math.min(pos + delta, maxPos()));
    const start = pos;
    const duration = 400;
    const startTime = performance.now();
    dragVelocity = 0;
    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      pos = start + (target - start) * ease;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (arrowL) arrowL.addEventListener('click', function (e) { e.stopPropagation(); smoothScroll(-getCardWidth()); });
  if (arrowR) arrowR.addEventListener('click', function (e) { e.stopPropagation(); smoothScroll(getCardWidth()); });

  grid.addEventListener('mousedown', function (e) {
    if (mobileCarouselMq.matches) return;
    if (e.target.closest('.carousel-arrow')) return;
    dragging = true;
    didDrag = false;
    grid.classList.add('is-dragging');
    startX = e.clientX;
    dragStartPos = pos;
    lastDragX = e.clientX;
    dragVelocity = 0;
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    didDrag = true;
    dragVelocity = e.clientX - lastDragX;
    lastDragX = e.clientX;
    pos = dragStartPos - (e.clientX - startX);
  });
  window.addEventListener('mouseup', function () {
    if (!dragging) return;
    dragging = false;
    grid.classList.remove('is-dragging');
  });
  grid.addEventListener('touchstart', function (e) {
    if (mobileCarouselMq.matches) return;
    dragging = true;
    didDrag = false;
    startX = e.touches[0].clientX;
    dragStartPos = pos;
    lastDragX = e.touches[0].clientX;
    dragVelocity = 0;
  }, { passive: true });
  grid.addEventListener('touchmove', function (e) {
    if (mobileCarouselMq.matches) return;
    if (!dragging) return;
    didDrag = true;
    dragVelocity = e.touches[0].clientX - lastDragX;
    lastDragX = e.touches[0].clientX;
    pos = dragStartPos - (e.touches[0].clientX - startX);
  }, { passive: true });
  grid.addEventListener('touchend', function () { dragging = false; });
  grid.addEventListener('click', function (e) {
    if (didDrag) e.preventDefault();
  }, true);
  grid.addEventListener('wheel', function (e) {
    if (mobileCarouselMq.matches) return;
    if (Math.abs(e.deltaX) < 2) return;
    pos += e.deltaX;
    dragVelocity = 0;
    e.preventDefault();
  }, { passive: false });

  track.addEventListener('scroll', function () {
    if (!mobileCarouselMq.matches) return;
    updateArrows();
  }, { passive: true });
  if (mobileCarouselMq.addEventListener) {
    mobileCarouselMq.addEventListener('change', function () {
      dragging = false;
      dragVelocity = 0;
      pos = 0;
      track.style.transform = '';
      updateArrows();
    });
  }

  requestAnimationFrame(loop);
})();

(function () {
  const pdp = document.querySelector('[data-pdp]');
  if (!pdp) return;

  const track = pdp.querySelector('[data-pdp-gallery-track]');
  const prev = pdp.querySelector('[data-pdp-gallery-prev]');
  const next = pdp.querySelector('[data-pdp-gallery-next]');
  const dotsWrap = pdp.querySelector('[data-pdp-gallery-dots]');
  let dots = Array.from(pdp.querySelectorAll('[data-pdp-gallery-dot]'));
  const colorButtons = Array.from(pdp.querySelectorAll('[data-pdp-color]'));
  const colorLabel = pdp.querySelector('[data-pdp-color-label]');
  const sizeSelect = pdp.querySelector('[data-pdp-size-select]');
  const sizeToggle = pdp.querySelector('[data-pdp-size-toggle]');
  const sizeLabel = pdp.querySelector('[data-pdp-size-label]');
  const sizeError = pdp.querySelector('[data-pdp-size-error]');
  const sizeButtons = Array.from(pdp.querySelectorAll('[data-pdp-size]'));
  const variantInput = pdp.querySelector('[data-product-variant-id]');
  const variantsEl = pdp.querySelector('[data-pdp-variants]');
  const mediaEl = pdp.querySelector('[data-pdp-media]');
  const form = pdp.querySelector('form');
  const addCta = pdp.querySelector('[data-pdp-add-cta]');
  const waitlistForm = pdp.querySelector('[data-pdp-waitlist-tags]')?.closest('form');
  const waitlistTags = pdp.querySelector('[data-pdp-waitlist-tags]');
  const waitlistStatus = pdp.querySelector('[data-pdp-waitlist-status]');
  const vestidorLink = pdp.querySelector('[data-pdp-vestidor-link]');
  const productTitle = (document.querySelector('.pdp-info__title')?.textContent || '').trim();
  const productId = pdp.dataset.productId || '';
  const productHandle = pdp.dataset.productHandle || normalizeText(productTitle);
  const colorPosition = Number(pdp.dataset.colorPosition || 0);
  const sizePosition = Number(pdp.dataset.sizePosition || 0);
  let selectedColor = colorButtons[0] ? colorButtons[0].dataset.pdpColor : '';
  let selectedSize = '';
  let variants = [];
  let mediaItems = [];

  if (variantsEl) {
    try {
      variants = JSON.parse(variantsEl.textContent || '[]');
    } catch (error) {
      variants = [];
    }
  }

  if (mediaEl) {
    try {
      mediaItems = JSON.parse(mediaEl.textContent || '[]');
    } catch (error) {
      mediaItems = [];
    }
  }

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function colorAliases(color) {
    const slug = normalizeText(color);
    return slug ? [slug] : [];
  }

  function updateVestidorLink() {
    if (!vestidorLink || !productId) return;
    const itemId = selectedColor ? productId + '-' + normalizeText(selectedColor) : productId;
    const url = new URL(vestidorLink.getAttribute('href') || '/pages/vestidor', window.location.origin);
    url.searchParams.set('add', itemId);
    vestidorLink.href = url.pathname + url.search + url.hash;
  }

  function fallbackImageForColor(color) {
    const activeButton = colorButtons.find(function (button) {
      return button.dataset.pdpColor === color;
    });
    if (!activeButton || !activeButton.dataset.pdpImage) return [];
    return [{
      url: activeButton.dataset.pdpImage,
      thumb: activeButton.dataset.pdpImage,
      alt: productTitle + ' — ' + color,
      width: 1200,
      height: 1500
    }];
  }

  function explicitGalleryForColor(color) {
    const activeButton = colorButtons.find(function (button) {
      return button.dataset.pdpColor === color;
    });
    if (!activeButton || !activeButton.dataset.pdpGallery) return [];
    return activeButton.dataset.pdpGallery.split('|').filter(Boolean).map(function (url, index) {
      return {
        url: url,
        thumb: url,
        alt: productTitle + ' — ' + color + ' — foto ' + (index + 1),
        width: 1200,
        height: 1500
      };
    });
  }

  function filenameFromUrl(url) {
    return String(url || '').split('/').pop().split('?')[0];
  }

  function variantForColor(color) {
    if (!colorPosition || !color) return null;
    return variants.find(function (variant) {
      return optionValue(variant, colorPosition) === color && variant.featured_image && variant.featured_image.src;
    }) || null;
  }

  function imagesFromVariantBlock(color) {
    if (!mediaItems.length || !variants.length || !colorPosition) return [];

    const starts = colorButtons.map(function (button) {
      const variant = variantForColor(button.dataset.pdpColor || '');
      if (!variant || !variant.featured_image) return null;
      const filename = filenameFromUrl(variant.featured_image.src);
      const index = mediaItems.findIndex(function (item) {
        return item.filename === filename || filenameFromUrl(item.url) === filename;
      });
      return index >= 0 ? { color: button.dataset.pdpColor, index } : null;
    }).filter(Boolean).sort(function (a, b) {
      return a.index - b.index;
    });

    const current = starts.find(function (item) {
      return item.color === color;
    });
    if (!current) return [];

    const next = starts.find(function (item) {
      return item.index > current.index;
    });
    return mediaItems.slice(current.index, next ? next.index : mediaItems.length);
  }

  function imagesForColor(color) {
    const explicitGallery = explicitGalleryForColor(color);
    if (explicitGallery.length) return explicitGallery;

    const baseImages = fallbackImageForColor(color);
    const aliases = colorAliases(color);
    const matches = mediaItems.filter(function (item) {
      const haystack = normalizeText([item.alt, item.filename, item.url].join(' '));
      return aliases.some(function (alias) {
        return haystack.indexOf(alias) !== -1;
      });
    });
    if (matches.length) return baseImages.concat(matches);

    const variantBlock = imagesFromVariantBlock(color);
    if (variantBlock.length) return baseImages.concat(variantBlock);

    return baseImages;
  }

  function renderDots(count) {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let index = 0; index < count; index += 1) {
      const dot = document.createElement('button');
      dot.className = 'pdp-gallery__dot' + (index === 0 ? ' active' : '');
      dot.type = 'button';
      dot.dataset.pdpGalleryDot = String(index);
      dot.setAttribute('aria-label', 'Ir a foto ' + (index + 1));
      dotsWrap.appendChild(dot);
    }
    dots = Array.from(dotsWrap.querySelectorAll('[data-pdp-gallery-dot]'));
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToSlide(Number(dot.dataset.pdpGalleryDot || 0));
      });
    });
  }

  function renderGallery(color) {
    if (!track) return;
    const images = imagesForColor(color);
    if (!images.length) return;
    track.innerHTML = '';
    images.forEach(function (item) {
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.alt || (productTitle + ' — ' + color);
      img.width = item.width || 1200;
      img.height = item.height || 1500;
      img.dataset.frame = 'product';
      track.appendChild(img);
    });
    track.classList.toggle('pdp-gallery__pair--single', images.length <= 1);
    renderDots(images.length);
    const hasMultiple = images.length > 1;
    if (prev) {
      prev.hidden = !hasMultiple;
      prev.disabled = true;
    }
    if (next) {
      next.hidden = !hasMultiple;
      next.disabled = !hasMultiple;
    }
    if (dotsWrap) dotsWrap.hidden = !hasMultiple;
    goToSlide(0, 'auto');
    window.requestAnimationFrame(updateGallery);
  }

  function optionValue(variant, position) {
    if (!variant || !position) return '';
    return variant['option' + position] || '';
  }

  function variantIsAvailable(variant) {
    return Boolean(variant && (variant.available || variant.available_for_sale));
  }

  function variantMatchesColor(variant, color) {
    return !colorPosition || !color || optionValue(variant, colorPosition) === color;
  }

  function variantMatchesSize(variant, size) {
    return !sizePosition || !size || optionValue(variant, sizePosition) === size;
  }

  function variantById(id) {
    if (!id) return null;
    return variants.find(function (variant) {
      return String(variant.id) === String(id);
    }) || null;
  }

  function variantsForColor(color) {
    return variants.filter(function (variant) {
      return variantMatchesColor(variant, color);
    });
  }

  function preferredVariantForColor(color, preferredSize) {
    const colorVariants = variantsForColor(color);
    if (!colorVariants.length) return null;

    const preferredAvailable = colorVariants.find(function (variant) {
      return variantIsAvailable(variant) && variantMatchesSize(variant, preferredSize);
    });
    if (preferredAvailable) return preferredAvailable;

    return colorVariants.find(variantIsAvailable) || colorVariants[0] || null;
  }

  function syncColorUi() {
    const activeColor = colorButtons.find(function (button) {
      return button.dataset.pdpColor === selectedColor;
    }) || colorButtons[0];
    if (!activeColor) return;

    selectedColor = activeColor.dataset.pdpColor || selectedColor;
    if (colorLabel) colorLabel.textContent = activeColor.dataset.pdpColorDisplay || selectedColor;
    colorButtons.forEach(function (button) {
      button.classList.toggle('active', button === activeColor);
    });
  }

  function syncSizeUi() {
    if (sizeLabel) sizeLabel.textContent = selectedSize ? 'Talla ' + selectedSize : 'Selecciona una talla';
    if (sizeError) sizeError.classList.remove('show');
    sizeButtons.forEach(function (button) {
      button.classList.toggle('is-active', Boolean(selectedSize) && button.dataset.pdpSize === selectedSize);
    });
  }

  function selectBestInitialVariant() {
    const currentVariant = variantById(variantInput ? variantInput.value : '');
    const availableVariant = variants.find(variantIsAvailable) || null;
    const baseVariant = currentVariant || availableVariant || variants[0] || null;
    if (!baseVariant) return null;

    if (colorPosition) selectedColor = optionValue(baseVariant, colorPosition) || selectedColor;
    const preferredSize = sizePosition && currentVariant ? optionValue(currentVariant, sizePosition) : '';
    const colorVariant = preferredVariantForColor(selectedColor, preferredSize);

    if (colorVariant && sizePosition) selectedSize = optionValue(colorVariant, sizePosition);
    return colorVariant || baseVariant;
  }

  function promptWaitlistIfNeeded(variant) {
    if (variantIsAvailable(variant) || !waitlistForm) return;
    setWaitlistStatus('Déjanos tu email y te avisaremos cuando vuelva a estar disponible.', false);
    const emailInput = waitlistForm.querySelector('input[type="email"]');
    if (emailInput) {
      window.requestAnimationFrame(function () {
        emailInput.focus({ preventScroll: true });
      });
    }
  }

  function updateVariant() {
    if (!variantInput || !variants.length) return null;
    const match = variants.find(function (variant) {
      return variantMatchesColor(variant, selectedColor) && variantMatchesSize(variant, selectedSize);
    });
    if (match) variantInput.value = match.id;
    updatePurchaseState(match);
    return match || null;
  }

  function updatePurchaseState(variant) {
    const waitingForSize = Boolean(sizeButtons.length && !selectedSize);
    const isAvailable = variantIsAvailable(variant);

    if (addCta) {
      addCta.hidden = !waitingForSize && !isAvailable;
      addCta.disabled = !waitingForSize && !isAvailable;
      addCta.textContent = isAvailable || waitingForSize ? 'Añadir al Carrito' : 'Próximamente';
    }

    if (waitlistForm) {
      if ((waitingForSize || isAvailable) && waitlistStatus && waitlistStatus.textContent.trim()) {
        setWaitlistStatus('', false);
      }
      const hasFeedback = Boolean(waitlistStatus && !waitlistStatus.hidden && waitlistStatus.textContent.trim());
      const shouldHideWaitlist = !hasFeedback && (waitingForSize || isAvailable);
      waitlistForm.hidden = shouldHideWaitlist;
      waitlistForm.classList.toggle('is-hidden', shouldHideWaitlist);
    }

    if (waitlistTags) {
      const tags = ['waitlist'];
      tags.push('waitlist-' + productHandle);
      if (selectedColor) tags.push('color-' + normalizeText(selectedColor));
      if (selectedSize) tags.push('talla-' + normalizeText(selectedSize));
      if (variant && variant.id) tags.push('variant-' + variant.id);
      waitlistTags.value = tags.join(', ');
    }
  }

  function setWaitlistStatus(message, isError) {
    if (!waitlistStatus) return;
    waitlistStatus.textContent = message;
    waitlistStatus.hidden = !message;
    waitlistStatus.classList.toggle('pdp-waitlist__status--error', Boolean(isError));
  }

  async function submitWaitlist(event) {
    if (!waitlistForm) return;
    event.preventDefault();
    event.stopPropagation();

    const emailInput = waitlistForm.querySelector('input[type="email"]');
    const emailValue = emailInput ? String(emailInput.value || '').trim() : '';
    if (emailInput && (!emailValue || !emailInput.checkValidity())) {
      emailInput.classList.add('is-invalid');
      setWaitlistStatus('Ingresa un email válido para avisarte cuando vuelva a estar disponible.', true);
      emailInput.focus();
      return;
    }
    if (emailInput) emailInput.classList.remove('is-invalid');

    const submitButton = waitlistForm.querySelector('button[type="submit"]');
    const previousText = submitButton ? submitButton.textContent : '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Anotando...';
    }
    setWaitlistStatus('', false);

    try {
      const formData = new FormData(waitlistForm);
      const email = String(formData.get('contact[email]') || '').trim();
      const tags = String(formData.get('contact[tags]') || '').trim();
      const entry = {
        email: email,
        product: productTitle,
        handle: productHandle,
        color: selectedColor,
        size: selectedSize,
        variantId: variantInput ? variantInput.value : '',
        tags: tags,
        createdAt: new Date().toISOString()
      };
      const saved = JSON.parse(window.localStorage.getItem('ctWaitlist') || '[]');
      const nextSaved = saved.filter(function (item) {
        return !(item.email === entry.email && item.variantId === entry.variantId);
      });
      nextSaved.push(entry);
      window.localStorage.setItem('ctWaitlist', JSON.stringify(nextSaved));
      fetch('/cart/update.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          attributes: {
            ['waitlist_' + productHandle]: [entry.color, entry.size, entry.email].filter(Boolean).join(' / ')
          }
        })
      }).catch(function () {});
      setWaitlistStatus('Listo. Te avisaremos cuando vuelva a estar disponible.', false);
      if (emailInput) emailInput.value = '';
    } catch (error) {
      setWaitlistStatus('No se pudo guardar. Intenta otra vez.', true);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = previousText;
      }
    }
  }

  function slideWidth() {
    const slide = track ? track.querySelector('img') : null;
    return slide ? slide.getBoundingClientRect().width : 1;
  }

  function currentSlideIndex() {
    if (!track) return 0;
    return Math.round(track.scrollLeft / Math.max(1, slideWidth()));
  }

  function updateGallery() {
    if (!track) return;
    const slideCount = track.querySelectorAll('img').length;
    const current = Math.min(slideCount - 1, Math.max(0, currentSlideIndex()));
    dots.forEach(function (dot, index) {
      dot.classList.toggle('active', index === current);
    });
    if (prev) prev.disabled = current <= 0;
    if (next) next.disabled = current >= slideCount - 1;
  }

  function goToSlide(index, behavior) {
    if (!track) return;
    const slideCount = track.querySelectorAll('img').length;
    const nextIndex = Math.min(slideCount - 1, Math.max(0, index));
    const left = nextIndex * slideWidth();
    if (typeof track.scrollTo === 'function') {
      track.scrollTo({ left: left, behavior: behavior || 'smooth' });
    } else {
      track.scrollLeft = left;
    }
    if (behavior === 'auto') track.scrollLeft = left;
    window.requestAnimationFrame(updateGallery);
    window.setTimeout(updateGallery, 260);
  }

  function enableDragScroll() {
    if (!track || !window.PointerEvent) return;

    let pointerDown = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;

    function endDrag(event) {
      if (!pointerDown) return;
      if (dragging) {
        track.classList.remove('is-dragging');
        goToSlide(currentSlideIndex());
        if (event && track.releasePointerCapture) {
          try { track.releasePointerCapture(event.pointerId); } catch (error) {}
        }
      }
      pointerDown = false;
      dragging = false;
    }

    track.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.pointerType !== 'mouse') return;
      pointerDown = true;
      dragging = false;
      startX = event.clientX;
      startY = event.clientY;
      startScrollLeft = track.scrollLeft;
    });

    track.addEventListener('pointermove', function (event) {
      if (!pointerDown) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      if (!dragging) {
        if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          endDrag(event);
          return;
        }
        dragging = true;
        track.classList.add('is-dragging');
        if (track.setPointerCapture) {
          try { track.setPointerCapture(event.pointerId); } catch (error) {}
        }
      }

      event.preventDefault();
      track.scrollLeft = startScrollLeft - deltaX;
      updateGallery();
    });

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', endDrag);
  }

  if (track) track.addEventListener('scroll', updateGallery, { passive: true });
  if (prev) prev.addEventListener('click', function () { goToSlide(currentSlideIndex() - 1); });
  if (next) next.addEventListener('click', function () { goToSlide(currentSlideIndex() + 1); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goToSlide(Number(dot.dataset.pdpGalleryDot || 0));
    });
  });

  selectBestInitialVariant();
  syncColorUi();
  syncSizeUi();
  renderGallery(selectedColor);
  enableDragScroll();

  colorButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedColor = button.dataset.pdpColor || '';
      if (colorLabel) colorLabel.textContent = button.dataset.pdpColorDisplay || selectedColor;
      colorButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      const preferredVariant = preferredVariantForColor(selectedColor, selectedSize);
      selectedSize = preferredVariant && sizePosition ? optionValue(preferredVariant, sizePosition) : '';
      syncSizeUi();
      renderGallery(selectedColor);
      promptWaitlistIfNeeded(updateVariant());
      updateVestidorLink();
    });
  });

  if (sizeToggle && sizeSelect) {
    sizeToggle.addEventListener('click', function () {
      const isOpen = sizeSelect.classList.toggle('open');
      sizeToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  sizeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedSize = button.dataset.pdpSize || '';
      if (sizeSelect) sizeSelect.classList.remove('open');
      if (sizeToggle) sizeToggle.setAttribute('aria-expanded', 'false');
      syncSizeUi();
      promptWaitlistIfNeeded(updateVariant());
    });
  });

  if (form) {
    form.addEventListener('submit', function (event) {
      if (sizeButtons.length && !selectedSize) {
        event.preventDefault();
        if (sizeError) sizeError.classList.add('show');
      }
    });
  }

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', submitWaitlist, true);
  }

  promptWaitlistIfNeeded(updateVariant());
  updateVestidorLink();
  updateGallery();
})();

(function () {
  const detail = document.querySelector('[data-product-detail]');
  if (!detail) return;

  const heroImage = detail.querySelector('[data-product-hero-image]');
  const variantInput = detail.querySelector('[data-product-variant-id]');

  detail.querySelectorAll('[data-product-color]').forEach(function (button) {
    button.addEventListener('click', function () {
      const imageUrl = button.dataset.image || '';
      const variantId = button.dataset.variantId || '';

      if (heroImage && imageUrl) heroImage.src = imageUrl;
      if (variantInput && variantId) variantInput.value = variantId;

      detail.querySelectorAll('[data-product-color]').forEach(function (swatch) {
        swatch.classList.toggle('is-active', swatch === button);
      });
    });
  });
})();

(function () {
  const section = document.querySelector('[data-ct-collection]');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('[data-product-card]'));
  const filterButtons = Array.from(section.querySelectorAll('[data-filter]'));
  const countEl = section.querySelector('[data-visible-count]');
  const emptyState = section.querySelector('[data-empty-state]');
  const grid = section.querySelector('[data-product-grid]');
  const gridButtons = Array.from(section.querySelectorAll('[data-grid-cols]'));
  const toggleButtons = Array.from(section.querySelectorAll('[data-toggle-target]'));
  const togglePanels = Array.from(section.querySelectorAll('[data-toggle-panel]'));
  const modal = section.querySelector('[data-quick-modal]');
  const favoriteStorageKey = 'casa-trame-favorites-v1';

  function readFavorites() {
    try {
      const parsed = JSON.parse(localStorage.getItem(favoriteStorageKey) || '[]');
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (error) {
      return [];
    }
  }

  function writeFavorites(ids) {
    const uniqueIds = Array.from(new Set(ids.map(String).filter(Boolean)));
    try {
      localStorage.setItem(favoriteStorageKey, JSON.stringify(uniqueIds));
      window.dispatchEvent(new CustomEvent('ct:favorites-changed'));
    } catch (error) {
      // Favoritos son una mejora local; si el navegador bloquea storage, no rompemos el catálogo.
    }
  }

  function updateFavoriteButton(card) {
    const button = card && card.querySelector('[data-favorite-toggle]');
    if (!button) return;
    const favoriteId = String(card.dataset.favoriteId || '');
    const isActive = favoriteId && readFavorites().includes(favoriteId);
    button.classList.toggle('is-active', Boolean(isActive));
    button.setAttribute('aria-pressed', String(Boolean(isActive)));
    button.setAttribute('aria-label', isActive ? 'Quitar de favoritos' : 'Guardar en favoritos');
  }

  function toggleFavorite(card) {
    const favoriteId = String(card && card.dataset.favoriteId ? card.dataset.favoriteId : '');
    if (!favoriteId) return;
    const favorites = readFavorites();
    const nextFavorites = favorites.includes(favoriteId)
      ? favorites.filter(function (id) { return id !== favoriteId; })
      : favorites.concat(favoriteId);
    writeFavorites(nextFavorites);
    updateFavoriteButton(card);
  }

  function sortCatalogCards() {
    if (!grid || !cards.length) return;
    const categoryOrder = new Map();
    filterButtons.forEach(function (button) {
      const filter = button.dataset.filter || '';
      if (filter && filter !== 'all' && !categoryOrder.has(filter)) {
        categoryOrder.set(filter, categoryOrder.size);
      }
    });

    cards
      .slice()
      .sort(function (a, b) {
        const categoryA = a.dataset.category || '';
        const categoryB = b.dataset.category || '';
        const categoryIndexA = categoryOrder.has(categoryA) ? categoryOrder.get(categoryA) : 999;
        const categoryIndexB = categoryOrder.has(categoryB) ? categoryOrder.get(categoryB) : 999;
        if (categoryIndexA !== categoryIndexB) return categoryIndexA - categoryIndexB;
        return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'es', { sensitivity: 'base' });
      })
      .forEach(function (card) {
        grid.appendChild(card);
      });
  }

  function parseCardGallery(value) {
    return String(value || '')
      .split('|')
      .map(function (url) {
        return url.trim();
      })
      .filter(Boolean);
  }

  function updateCardGalleryControls(card, gallery) {
    if (!card) return;

    const images = gallery || parseCardGallery(card.dataset.gallery);
    const hasGallery = images.length > 0;
    const hasControls = images.length > 1;
    const currentIndex = Math.min(
      Math.max(Number.parseInt(card.dataset.galleryIndex || '0', 10) || 0, 0),
      Math.max(images.length - 1, 0)
    );

    card.classList.toggle('catalog-card--has-gallery', hasGallery);
    card.dataset.galleryIndex = String(currentIndex);

    const prev = card.querySelector('[data-card-gallery-prev]');
    const next = card.querySelector('[data-card-gallery-next]');

    if (prev) {
      const hidePrev = !hasControls || currentIndex <= 0;
      prev.hidden = hidePrev;
      prev.disabled = hidePrev;
    }

    if (next) {
      const hideNext = !hasControls || currentIndex >= images.length - 1;
      next.hidden = hideNext;
      next.disabled = hideNext;
    }
  }

  function setCardGalleryIndex(card, index) {
    if (!card) return;

    const gallery = parseCardGallery(card.dataset.gallery);
    if (!gallery.length) return;

    const nextIndex = Math.min(Math.max(index, 0), gallery.length - 1);
    const nextImage = gallery[nextIndex];
    const primaryImage = card.querySelector('.catalog-card__img--primary');
    const secondaryImage = card.querySelector('.catalog-card__img--secondary');

    if (nextImage && primaryImage) primaryImage.src = nextImage;
    if (nextImage && secondaryImage) secondaryImage.src = nextImage;

    card.dataset.galleryIndex = String(nextIndex);
    card.dataset.image = nextImage;
    updateCardGalleryControls(card, gallery);
  }

  function setCardColor(card, button) {
    if (!card || !button) return;

    const colorGallery = parseCardGallery(button.dataset.colorGallery);
    const imageUrl = colorGallery[0] || button.dataset.colorImage || '';
    const modalImageUrl = colorGallery[0] || button.dataset.colorModalImage || imageUrl;
    const colorUrl = button.dataset.colorUrl || card.dataset.url || '#';
    const variantId = button.dataset.variantId || '';
    const colorName = button.dataset.colorName || '';
    const colorDisplay = button.dataset.colorDisplay || colorName;

    const primaryImage = card.querySelector('.catalog-card__img--primary');
    const secondaryImage = card.querySelector('.catalog-card__img--secondary');
    const imageLink = card.querySelector('.catalog-card__image-link');
    const textLink = card.querySelector('.catalog-card__text');
    const cartLink = card.querySelector('[data-card-cart-link]');

    if (imageUrl && primaryImage) primaryImage.src = imageUrl;
    if (imageUrl && secondaryImage) secondaryImage.src = imageUrl;
    if (imageLink) imageLink.href = colorUrl;
    if (textLink) textLink.href = colorUrl;
    if (cartLink) {
      cartLink.dataset.productUrl = colorUrl;
      if (variantId) cartLink.dataset.variantId = variantId;
    }

    card.dataset.image = modalImageUrl;
    card.dataset.gallery = colorGallery.join('|');
    card.dataset.galleryIndex = '0';
    card.dataset.url = colorUrl;
    if (variantId) card.dataset.variantId = variantId;
    if (button.dataset.favoriteId) card.dataset.favoriteId = button.dataset.favoriteId;
    card.dataset.currentColor = colorName;
    card.dataset.currentColorDisplay = colorDisplay;
    updateCardGalleryControls(card, colorGallery);
    updateFavoriteButton(card);

    card.querySelectorAll('[data-color-swatch]').forEach(function (swatch) {
      swatch.classList.toggle('is-active', swatch === button);
    });
  }

  async function addCardToCart(button) {
    const card = button.closest('[data-product-card]');
    if (!card) return;

    const variantId = button.dataset.variantId || card.dataset.variantId || '';
    if (!variantId) {
      const productUrl = button.dataset.productUrl || card.dataset.url || '#';
      if (productUrl && productUrl !== '#') window.location.href = productUrl;
      return;
    }

    const previousText = button.textContent;
    button.disabled = true;
    button.textContent = 'Agregando';

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: Number(variantId), quantity: 1 })
      });

      if (!response.ok) throw new Error('cart add failed');
      button.textContent = 'Agregado';
      window.setTimeout(function () {
        button.textContent = previousText;
        button.disabled = false;
      }, 1400);
    } catch (error) {
      button.textContent = 'Error';
      window.setTimeout(function () {
        button.textContent = previousText;
        button.disabled = false;
      }, 1600);
    }
  }

  function updateVisibleCount() {
    if (!countEl) return;
    const visibleCards = cards.filter(function (card) {
      return !card.hidden;
    });
    countEl.textContent = String(visibleCards.length);
    if (emptyState) emptyState.hidden = visibleCards.length !== 0;
  }

  function applyFilter(filterValue) {
    cards.forEach(function (card) {
      const matches = filterValue === 'all' || card.dataset.category === filterValue;
      card.hidden = !matches;
    });

    filterButtons.forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.filter === filterValue);
    });

    updateVisibleCount();
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyFilter(button.dataset.filter || 'all');
    });
  });
  sortCatalogCards();
  cards.forEach(function (card) {
    updateCardGalleryControls(card);
    updateFavoriteButton(card);
  });
  updateVisibleCount();

  function setGridCols(cols) {
    if (!grid) return;
    grid.classList.remove('cols-1', 'cols-3');
    if (cols !== '2') grid.classList.add('cols-' + cols);
    gridButtons.forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.gridCols === cols);
    });
  }

  gridButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setGridCols(button.dataset.gridCols || '2');
    });
  });

  function closeAllPanels(except) {
    togglePanels.forEach(function (panel) {
      const key = panel.dataset.togglePanel;
      const isOpen = key === except ? !panel.classList.contains('is-open') : false;
      panel.classList.toggle('is-open', isOpen);

      const button = section.querySelector('[data-toggle-target="' + key + '"]');
      const icon = section.querySelector('[data-toggle-icon="' + key + '"]');
      if (button) button.classList.toggle('is-active', isOpen);
      if (icon) icon.textContent = isOpen ? '−' : '+';
    });
  }

  toggleButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      closeAllPanels(button.dataset.toggleTarget || '');
    });
  });

  section.querySelectorAll('[data-card-gallery-prev], [data-card-gallery-next]').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      const card = button.closest('[data-product-card]');
      const currentIndex = Number.parseInt(card && card.dataset.galleryIndex ? card.dataset.galleryIndex : '0', 10) || 0;
      const direction = button.hasAttribute('data-card-gallery-next') ? 1 : -1;
      setCardGalleryIndex(card, currentIndex + direction);
    });
  });

  section.querySelectorAll('[data-favorite-toggle]').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(button.closest('[data-product-card]'));
    });
  });

  window.addEventListener('storage', function (event) {
    if (event.key !== favoriteStorageKey) return;
    cards.forEach(updateFavoriteButton);
  });

  if (modal) {
    const modalImage = modal.querySelector('[data-modal-image]');
    const modalCategory = modal.querySelector('[data-modal-category]');
    const modalTitle = modal.querySelector('[data-modal-title]');
    const modalPrice = modal.querySelector('[data-modal-price]');
    const modalDescription = modal.querySelector('[data-modal-description]');
    const modalLink = modal.querySelector('[data-modal-link]');

    function openModal(card) {
      if (!card) return;
      if (modalImage) {
        modalImage.src = card.dataset.image || '';
        modalImage.alt = card.dataset.title || '';
      }
      if (modalCategory) {
        const colorValue = card.dataset.currentColorDisplay || card.dataset.currentColor || '';
        const color = colorValue ? ' / ' + colorValue : '';
        modalCategory.textContent = (card.dataset.categoryLabel || '') + color;
      }
      if (modalTitle) modalTitle.textContent = card.dataset.title || '';
      if (modalPrice) modalPrice.textContent = card.dataset.price || '';
      if (modalDescription) modalDescription.textContent = card.dataset.description || '';
      if (modalLink) modalLink.href = card.dataset.url || '#';

      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }

    section.querySelectorAll('[data-quick-view]').forEach(function (button) {
      button.addEventListener('click', function () {
        openModal(button.closest('[data-product-card]'));
      });
    });

    section.querySelectorAll('[data-color-swatch]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        setCardColor(button.closest('[data-product-card]'), button);
      });
    });

    section.querySelectorAll('[data-card-cart-link]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        addCardToCart(button);
      });
    });

    if (modalLink) {
      modalLink.addEventListener('click', function (event) {
        if (!modalLink.getAttribute('href') || modalLink.getAttribute('href') === '#') {
          event.preventDefault();
        }
      });
    }

    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('[data-close-modal]')) {
        closeModal();
      }
    });

    window.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) closeModal();
    });
  }
})();
