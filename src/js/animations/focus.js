import gsap from 'gsap';

let isFocusActive = false;
let isClosing = false;
let focusData = null;

const CONFIG = {
  durationEnter: 0.8,
  durationExit: 0.6,
  easeEnter: 'expo.out',
  easeExit: 'power2.inOut',
  pad: 32,
  panelW: 332,
  gap: 32,
  mobileBreak: 769,
};

const productDataMap = {
  'image 3': { name: 'Oxford Overshirt', price: 18500, desc: 'A heavyweight oxford cloth overshirt built for layering. Garment-dyed for depth of color and softened from the first wear.', collection: 'Fall 2025', colors: [{ name: 'Slate', hex: '#5B5B5B' }, { name: 'Clay', hex: '#A4674C' }], inStock: true },
  'image 4': { name: 'Relaxed Denim Jean', price: 22000, desc: 'A straight-leg denim jean with a relaxed top block and gentle taper from the knee. Cut from 13.75oz Japanese selvedge denim.', collection: 'Fall 2025', colors: [{ name: 'Indigo', hex: '#1A2847' }, { name: 'Black', hex: '#1C1917' }], inStock: true },
  'image 5': { name: 'Pique Polo', price: 14000, desc: 'A refined take on the classic polo. Cut from organic cotton pique with a ribbed collar and two-button placket.', collection: 'Summer 2025', colors: [{ name: 'Cream', hex: '#F5F0E8' }, { name: 'Olive', hex: '#5C6B4F' }], inStock: true },
  'image 9': { name: 'Wool Blend Crew', price: 19500, desc: 'A heavyweight knit crewneck in a merino-cotton blend. Ribbed cuffs and hem, reinforced shoulder seams. Everyday warmth with an elevated hand feel.', collection: 'Fall 2025', colors: [{ name: 'Charcoal', hex: '#44403C' }, { name: 'Oat', hex: '#D6D3D1' }], inStock: true },
  'image 10': { name: 'Canvas Field Jacket', price: 28500, desc: 'A rugged field jacket cut from waxed cotton canvas. Unlined for year-round versatility, with a full snap front and two patch pockets.', collection: 'Fall 2025', colors: [{ name: 'Tan', hex: '#C4A882' }, { name: 'Olive', hex: '#5C6B4F' }], inStock: true },
  'image 11': { name: 'Linen Relaxed Shirt', price: 16000, desc: 'A relaxed-fit linen shirt crafted from pre-washed European flax. Mother-of-pearl buttons, curved hem, and a camp collar.', collection: 'Summer 2025', colors: [{ name: 'Natural', hex: '#E8E0D5' }, { name: 'Slate', hex: '#5B5B5B' }], inStock: true },
  'image 14': { name: 'Organic Cotton Tee', price: 8000, desc: 'A heavy-weight organic cotton t-shirt with a relaxed fit. Rib-knit collar, taped shoulder seams, and a chest pocket.', collection: 'Summer 2025', colors: [{ name: 'White', hex: '#FAFAF9' }, { name: 'Black', hex: '#1C1917' }], inStock: true },
  'image 15': { name: 'Structured Bomber', price: 32000, desc: 'A structured bomber jacket in waxed cotton shell. Ribbed cuffs and hem, two-way zip, and a quilted satin interior.', collection: 'Fall 2025', colors: [{ name: 'Olive', hex: '#5C6B4F' }, { name: 'Black', hex: '#1C1917' }], inStock: false },
  'image 16': { name: 'Cashmere Blend Scarf', price: 8500, desc: 'A lightweight cashmere-merino blend scarf with hand-fringed edges. Generous proportions for versatile styling.', collection: 'Fall 2025', colors: [{ name: 'Charcoal', hex: '#44403C' }, { name: 'Oat', hex: '#D6D3D1' }], inStock: true },
  'image 18': { name: 'Italian Leather Belt', price: 6500, desc: 'A full-grain Italian leather belt with a solid brass buckle. Tapered design with Chicago screw construction.', collection: 'Summer 2025', colors: [{ name: 'Tan', hex: '#C4A882' }, { name: 'Black', hex: '#1C1917' }], inStock: true },
  'image 20': { name: 'Raw Denim Jacket', price: 26000, desc: 'A classic type-III denim jacket in unsanforized raw selvedge denim. Button front, chest pockets, and adjustable waist tabs.', collection: 'Fall 2025', colors: [{ name: 'Indigo', hex: '#1A2847' }], inStock: true },
  'image 25': { name: 'Woven Silk Tie', price: 4500, desc: 'A hand-finished woven silk tie in a classic seven-fold construction. 8cm blade width with a subtle matte finish.', collection: 'Summer 2025', colors: [{ name: 'Slate', hex: '#5B5B5B' }, { name: 'Clay', hex: '#A4674C' }], inStock: true },
  'image 26': { name: 'Cotton Twill Cap', price: 5500, desc: 'A structured six-panel cap in garment-washed cotton twill. Adjustable brass buckle closure and pre-curved peak.', collection: 'Summer 2025', colors: [{ name: 'Oat', hex: '#D6D3D1' }, { name: 'Olive', hex: '#5C6B4F' }], inStock: true },
  'image 27': { name: 'Lambswool Scarf', price: 7500, desc: 'A pure lambswool scarf in a classic herringbone weave. Generous length with self-tipped fringed ends.', collection: 'Fall 2025', colors: [{ name: 'Charcoal', hex: '#44403C' }, { name: 'Cream', hex: '#F5F0E8' }], inStock: true },
};

function getProductData(src) {
  const m = src.match(/image%20(\d+)/) || src.match(/image (\d+)/);
  const key = m ? 'image ' + m[1] : null;
  return key ? productDataMap[key] || null : null;
}

function formatPrice(num) {
  return '\u20A6' + num.toLocaleString();
}

function isMobile() {
  return window.innerWidth < CONFIG.mobileBreak;
}

function calculateTargetRect(rect, product) {
  var hasPanel = !!product;
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var p = Math.min(vw, vh) * 0.06;
  var mw = vw - p * 2;
  var mh = vh - p * 2;

  if (isMobile() && hasPanel) {
    mw = vw - CONFIG.pad * 2;
    mh = vh * 0.4;
  }

  var a = rect.width / rect.height;
  var w, h;
  if (a > mw / mh) { w = mw; h = mw / a; } else { h = mh; w = mh * a; }
  return { left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h };
}

function createOverlay() {
  const el = document.createElement('div');
  el.className = 'hero__focus-overlay';
  return el;
}

function createClone(img, rect, alt) {
  var el = img.cloneNode(true);
  el.className = 'hero__focus-image';
  if (alt) el.setAttribute('alt', alt);
  el.style.cssText = [
    'position: fixed',
    'left:' + rect.left + 'px',
    'top:' + rect.top + 'px',
    'width:' + rect.width + 'px',
    'height:' + rect.height + 'px',
    'z-index:101',
    'object-fit:cover',
    'pointer-events:none',
    'will-change:transform,opacity',
  ].join(';');
  return el;
}

function createPanel(product) {
  var el = document.createElement('div');
  el.className = 'hero__focus-panel';

  el.innerHTML = [
    '<p class="hero__focus-panel-collection">' + product.collection + '</p>',
    '<h2 class="hero__focus-panel-title">' + product.name + '</h2>',
    '<p class="hero__focus-panel-price">' + formatPrice(product.price) + '</p>',
    '<p class="hero__focus-panel-desc">' + product.desc + '</p>',
    '<div class="hero__focus-panel-meta">',
      '<div class="hero__focus-panel-row"><span class="hero__focus-panel-label">Delivery</span><span class="hero__focus-panel-value">Ships within 2\u20133 business days.</span></div>',
    '</div>',
  ].join('');

  return el;
}

function createPanelBtn() {
  var el = document.createElement('button');
  el.className = 'hero__focus-panel-btn';
  el.textContent = 'Add to Cart';
  return el;
}

function createIndicator(src) {
  var el = document.createElement('div');
  el.className = 'hero__focus-indicator';

  var label = document.createElement('span');
  label.className = 'hero__focus-indicator-label';
  label.textContent = 'Scroll';

  var counter = document.createElement('span');
  counter.className = 'hero__focus-indicator-counter';
  counter.textContent = '01/04';

  var thumbs = document.createElement('div');
  thumbs.className = 'hero__focus-indicator-thumbs';
  for (var i = 0; i < 4; i++) {
    var t = document.createElement('div');
    t.className = 'hero__focus-indicator-thumb' + (i === 0 ? ' active' : '');
    t.style.cssText = 'background-image:url(' + src + ');background-size:cover;background-position:center;';
    thumbs.appendChild(t);
  }

  el.appendChild(label);
  el.appendChild(counter);
  el.appendChild(thumbs);
  return el;
}

function createGallery(img, alt, targetRect) {
  var el = document.createElement('div');
  el.className = 'hero__focus-gallery';
  el.setAttribute('data-lenis-prevent', '');
  var count = 4;
  var mob = isMobile();

  if (mob) {
    el.style.cssText = 'position:fixed;left:0;right:0;top:' + CONFIG.pad + 'px;height:' + targetRect.height + 'px;z-index:101;display:flex;flex-direction:row;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;opacity:0;';
    for (var i = 0; i < count; i++) {
      var im = document.createElement('img');
      im.setAttribute('src', img.getAttribute('src'));
      if (alt) im.setAttribute('alt', alt);
      im.style.cssText = 'flex:0 0 100vw;height:100%;width:auto;object-fit:cover;scroll-snap-align:center;';
      el.appendChild(im);
    }
  } else {
    var maxH = window.innerHeight - CONFIG.pad * 2;
    el.style.cssText = 'position:fixed;left:' + targetRect.left + 'px;top:' + targetRect.top + 'px;width:' + targetRect.width + 'px;max-height:' + maxH + 'px;z-index:101;display:flex;flex-direction:column;gap:24px;overflow-y:auto;opacity:0;';
    for (var i = 0; i < count; i++) {
      var im = document.createElement('img');
      im.setAttribute('src', img.getAttribute('src'));
      if (alt) im.setAttribute('alt', alt);
      im.style.cssText = 'width:' + targetRect.width + 'px;height:' + targetRect.height + 'px;object-fit:cover;flex-shrink:0;display:block;';
      el.appendChild(im);
    }
  }

  // Dim non-visible images on scroll
  var images = el.querySelectorAll('img');
  function onGalleryScroll() {
    var gRect = el.getBoundingClientRect();
    var activeIdx = 0;
    images.forEach(function (im, i) {
      var iRect = im.getBoundingClientRect();
      var overlap = Math.min(iRect.bottom, gRect.bottom) - Math.max(iRect.top, gRect.top);
      var visible = overlap > gRect.height * 0.4;
      if (visible) {
        gsap.to(im, { opacity: 1, duration: 0.25, overwrite: 'auto' });
        im.style.filter = 'blur(0px)';
        activeIdx = i;
      } else {
        gsap.to(im, { opacity: 0.4, duration: 0.25, overwrite: 'auto' });
        im.style.filter = 'blur(8px)';
      }
    });

    var fd = focusData;
    if (fd && fd.indicator) {
      var thumbs = fd.indicator.querySelectorAll('.hero__focus-indicator-thumb');
      thumbs.forEach(function (t, i) {
        t.classList.toggle('active', i === activeIdx);
      });
      var ctr = fd.indicator.querySelector('.hero__focus-indicator-counter');
      if (ctr) ctr.textContent = String(activeIdx + 1).padStart(2, '0') + '/04';
    }
  }
  el.addEventListener('scroll', onGalleryScroll);

  // Set initial blur state
  requestAnimationFrame(onGalleryScroll);

  return el;
}

function createPanelGroup(product, imgTarget) {
  var panel = createPanel(product);
  var btn = createPanelBtn();

  if (isMobile()) {
    var maxH = window.innerHeight - imgTarget.top - imgTarget.height - CONFIG.gap / 2 - CONFIG.pad;
    panel.style.cssText = 'position:fixed;left:' + CONFIG.pad + 'px;right:' + CONFIG.pad + 'px;top:' + (imgTarget.top + imgTarget.height + CONFIG.gap / 2) + 'px;max-height:' + maxH + 'px;z-index:102;background:#fff;padding:16px;overflow-y:auto;opacity:0;transform:translateY(16px);';
    btn.style.cssText = 'position:fixed;left:' + CONFIG.pad + 'px;right:' + CONFIG.pad + 'px;z-index:102;height:40px;background:#292524;color:#fff;border:none;font-family:Roboto,system-ui,sans-serif;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:-0.02em;opacity:0;transform:translateY(10px);';
    return { wrapper: panel, panel: panel, btn: btn };
  }

  var wrapper = document.createElement('div');
  wrapper.className = 'hero__focus-panel-wrapper';
  wrapper.style.cssText = 'position:fixed;right:' + CONFIG.pad + 'px;bottom:' + CONFIG.pad + 'px;width:' + CONFIG.panelW + 'px;z-index:102;display:flex;flex-direction:column;gap:16px;transform:translateX(24px);opacity:0;';

  panel.style.cssText = 'background:#fff;padding:16px;';
  btn.style.cssText = 'width:100%;height:40px;background:#292524;color:#fff;border:none;font-family:Roboto,system-ui,sans-serif;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:-0.02em;';

  wrapper.appendChild(panel);
  wrapper.appendChild(btn);

  return { wrapper: wrapper, panel: panel, btn: btn };
}

function lockScroll() {
  document.body.classList.add('focus-active');
}

function unlockScroll() {
  document.body.classList.remove('focus-active');
}

function cleanup() {
  if (!focusData) return;

  var d = focusData;
  d.clone.remove();
  d.gallery.remove();
  if (d.indicator) d.indicator.remove();
  d.overlay.remove();
  if (d.panelGroup) {
    if (isMobile()) {
      d.panelGroup.panel.remove();
      d.panelGroup.btn.remove();
    } else {
      d.panelGroup.wrapper.remove();
    }
  }

  d.allImages.forEach(function (other) {
    gsap.killTweensOf(other);
    gsap.set(other, { opacity: 1, clearProps: 'pointerEvents' });
  });

  unlockScroll();
  isFocusActive = false;
  isClosing = false;
  focusData = null;
}

function closeFocus() {
  if (!focusData || isClosing) return;
  isClosing = true;

  var d = focusData;

  gsap.killTweensOf(d.clone);
  gsap.killTweensOf(d.gallery);
  gsap.killTweensOf(d.overlay);
  if (d.panelGroup) {
    if (isMobile()) {
      gsap.killTweensOf(d.panelGroup.panel);
      gsap.killTweensOf(d.panelGroup.btn);
    } else {
      gsap.killTweensOf(d.panelGroup.wrapper);
    }
  }

  // Fade gallery out, show clone at rest position
  gsap.to(d.gallery, {
    opacity: 0, duration: 0.2, overwrite: 'auto',
  });

  gsap.set(d.clone, { opacity: 1 });

  gsap.to(d.clone, {
    x: 0, y: 0, scaleX: 1, scaleY: 1,
    duration: CONFIG.durationExit,
    ease: CONFIG.easeExit,
    transformOrigin: '0 0',
    overwrite: 'auto',
    onComplete: cleanup,
  });

  gsap.to(d.overlay, {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.out',
    overwrite: 'auto',
  });

  if (d.panelGroup) {
    if (isMobile()) {
      gsap.to(d.panelGroup.panel, {
        y: 16, opacity: 0,
        duration: 0.25, ease: 'power2.out', overwrite: 'auto',
      });
      gsap.to(d.panelGroup.btn, {
        y: 10, opacity: 0,
        duration: 0.25, ease: 'power2.out', overwrite: 'auto',
      });
    } else {
      gsap.to(d.panelGroup.wrapper, {
        transform: 'translateX(24px)',
        opacity: 0,
        duration: 0.25, ease: 'power2.out', overwrite: 'auto',
      });
    }
  }

  d.allImages.forEach(function (other) {
    if (other !== d.img) {
      gsap.killTweensOf(other);
      gsap.to(other, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  });
}

function openFocus(img) {
  if (isFocusActive) return;
  isFocusActive = true;

  gsap.killTweensOf(img);
  gsap.set(img, { clearProps: 'zIndex' });

  var product = getProductData(img.getAttribute('src'));
  var firstRect = img.getBoundingClientRect();
  var lastRect = calculateTargetRect(firstRect, product);

  var sx = lastRect.width / firstRect.width;
  var sy = lastRect.height / firstRect.height;
  var dx = lastRect.left - firstRect.left;
  var dy = lastRect.top - firstRect.top;

  var overlay = createOverlay();
  document.body.appendChild(overlay);

  var gallery = createGallery(img, product ? product.name : '', lastRect);
  document.body.appendChild(gallery);

  var indicator = isMobile() ? null : createIndicator(img.getAttribute('src'));
  if (indicator) document.body.appendChild(indicator);

  // Clone for FLIP animation (above gallery)
  var clone = createClone(img, firstRect, product ? product.name : '');
  clone.style.zIndex = '102';
  document.body.appendChild(clone);

  var panelGroup = product ? createPanelGroup(product, isMobile() ? {
    top: CONFIG.pad + lastRect.height,
    left: 0, width: 0, height: 0,
  } : lastRect) : null;
  if (panelGroup) {
    if (isMobile()) {
      document.body.appendChild(panelGroup.panel);
      document.body.appendChild(panelGroup.btn);
      var pr = panelGroup.panel.getBoundingClientRect();
      panelGroup.btn.style.top = (pr.bottom + 16) + 'px';
    } else {
      document.body.appendChild(panelGroup.wrapper);
    }
  }

  var allImages = Array.from(document.querySelectorAll('.hero__img'));
  allImages.forEach(function (other) {
    if (other !== img) {
      gsap.killTweensOf(other);
      gsap.to(other, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  });

  gsap.set(img, { scale: 1, opacity: 0 });

  focusData = { img: img, clone: clone, gallery: gallery, indicator: indicator, overlay: overlay, panelGroup: panelGroup, allImages: allImages };

  gsap.fromTo(overlay, { opacity: 0 }, {
    opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto',
  });

  gsap.set(clone, { transformOrigin: '0 0' });

  // FLIP the clone to gallery position
  gsap.to(clone, {
    x: dx, y: dy, scaleX: sx, scaleY: sy,
    duration: CONFIG.durationEnter,
    ease: CONFIG.easeEnter,
    overwrite: 'auto',
    onComplete: function () {
      // Reveal gallery, hide clone
      gsap.to(clone, { opacity: 0, duration: 0.2, overwrite: 'auto' });
      gsap.to(gallery, { opacity: 1, duration: 0.3, overwrite: 'auto' });
    },
  });

  if (panelGroup) {
    if (isMobile()) {
      gsap.to(panelGroup.panel, {
        y: 0, opacity: 1,
        duration: 0.5, ease: 'power2.out', delay: 0.15, overwrite: 'auto',
      });
      gsap.to(panelGroup.btn, {
        y: 0, opacity: 1,
        duration: 0.5, ease: 'power2.out', delay: 0.2, overwrite: 'auto',
      });
    } else {
      gsap.to(panelGroup.wrapper, {
        transform: 'translateX(0)',
        opacity: 1,
        duration: 0.5, ease: 'power2.out', delay: 0.15, overwrite: 'auto',
      });
    }
  }

  lockScroll();

  overlay.addEventListener('click', closeFocus);
}

export function initFocus() {
  document.addEventListener('click', function (e) {
    var img = e.target.closest('.hero__img');
    if (img && !isFocusActive) {
      openFocus(img);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isFocusActive) {
      closeFocus();
    }
  });
}
