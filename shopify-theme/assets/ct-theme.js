(function () {
  const nav = document.getElementById('mainNav');
  const hero = document.querySelector('.hero') || document.querySelector('.pdp-gallery');
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.nav__hamburger');
  let menuOpen = false;

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
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && menuOpen) {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.classList.remove('is-open');
      updateNav();
    }
  });
  updateNav();

  const grid = document.querySelector('.collection-grid');
  const track = document.querySelector('.collection-grid__track');
  if (!grid || !track) return;

  const arrowL = grid.querySelector('.carousel-arrow--left');
  const arrowR = grid.querySelector('.carousel-arrow--right');
  let pos = 0;
  let dragging = false;
  let startX = 0;
  let dragStartPos = 0;
  let lastDragX = 0;
  let dragVelocity = 0;
  let didDrag = false;

  function maxPos() {
    return Math.max(0, track.scrollWidth - grid.clientWidth);
  }
  function clampPos() {
    pos = Math.max(0, Math.min(pos, maxPos()));
  }
  function updateArrows() {
    if (!arrowL || !arrowR) return;
    arrowL.style.opacity = pos <= 5 ? '0' : '';
    arrowL.style.pointerEvents = pos <= 5 ? 'none' : '';
    arrowR.style.opacity = pos >= maxPos() - 5 ? '0' : '';
    arrowR.style.pointerEvents = pos >= maxPos() - 5 ? 'none' : '';
  }
  function loop() {
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
    dragging = true;
    didDrag = false;
    startX = e.touches[0].clientX;
    dragStartPos = pos;
    lastDragX = e.touches[0].clientX;
    dragVelocity = 0;
  }, { passive: true });
  grid.addEventListener('touchmove', function (e) {
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
    if (Math.abs(e.deltaX) < 2) return;
    pos += e.deltaX;
    dragVelocity = 0;
    e.preventDefault();
  }, { passive: false });

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
  const productTitle = (document.querySelector('.pdp-info__title')?.textContent || '').trim();
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

  function updateVariant() {
    if (!variantInput || !variants.length) return;
    const match = variants.find(function (variant) {
      const colorMatches = !colorPosition || !selectedColor || optionValue(variant, colorPosition) === selectedColor;
      const sizeMatches = !sizePosition || !selectedSize || optionValue(variant, sizePosition) === selectedSize;
      return colorMatches && sizeMatches;
    });
    if (match) variantInput.value = match.id;
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
    track.scrollTo({ left: nextIndex * slideWidth(), behavior: behavior || 'smooth' });
    window.requestAnimationFrame(updateGallery);
  }

  if (track) track.addEventListener('scroll', updateGallery, { passive: true });
  if (prev) prev.addEventListener('click', function () { goToSlide(currentSlideIndex() - 1); });
  if (next) next.addEventListener('click', function () { goToSlide(currentSlideIndex() + 1); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goToSlide(Number(dot.dataset.pdpGalleryDot || 0));
    });
  });

  renderGallery(selectedColor);

  colorButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedColor = button.dataset.pdpColor || '';
      if (colorLabel) colorLabel.textContent = button.dataset.pdpColorDisplay || selectedColor;
      colorButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      renderGallery(selectedColor);
      updateVariant();
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
      if (sizeLabel) sizeLabel.textContent = 'Talla ' + selectedSize;
      if (sizeError) sizeError.classList.remove('show');
      if (sizeSelect) sizeSelect.classList.remove('open');
      if (sizeToggle) sizeToggle.setAttribute('aria-expanded', 'false');
      sizeButtons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });
      updateVariant();
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

  updateVariant();
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

  function setCardColor(card, button) {
    if (!card || !button) return;

    const imageUrl = button.dataset.colorImage || '';
    const modalImageUrl = button.dataset.colorModalImage || imageUrl;
    const colorUrl = button.dataset.colorUrl || card.dataset.url || '#';
    const colorName = button.dataset.colorName || '';
    const colorDisplay = button.dataset.colorDisplay || colorName;

    const primaryImage = card.querySelector('.catalog-card__img--primary');
    const secondaryImage = card.querySelector('.catalog-card__img--secondary');
    const imageLink = card.querySelector('.catalog-card__image-link');
    const textLink = card.querySelector('.catalog-card__text');

    if (imageUrl && primaryImage) primaryImage.src = imageUrl;
    if (imageUrl && secondaryImage) secondaryImage.src = imageUrl;
    if (imageLink) imageLink.href = colorUrl;
    if (textLink) textLink.href = colorUrl;

    card.dataset.image = modalImageUrl;
    card.dataset.url = colorUrl;
    card.dataset.currentColor = colorName;
    card.dataset.currentColorDisplay = colorDisplay;

    card.querySelectorAll('[data-color-swatch]').forEach(function (swatch) {
      swatch.classList.toggle('is-active', swatch === button);
    });
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
