let observer = null;

export function observeImages() {
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px 0px',
    threshold: 0.01
  });

  document.querySelectorAll('[data-lazy]').forEach(img => {
    observer.observe(img);
  });
}

export function observeNewImages(container) {
  if (!observer) {
    observeImages();
    return;
  }

  container.querySelectorAll('[data-lazy]').forEach(img => {
    observer.observe(img);
  });
}

function loadImage(img) {
  const src = img.getAttribute('src');

  if (!src) {
    img.classList.remove('product-card__image--loading');
    img.classList.add('product-card__image--loaded');
    return;
  }

  const temp = new Image();
  temp.onload = () => {
    img.classList.remove('product-card__image--loading');
    img.classList.add('product-card__image--loaded');
  };
  temp.onerror = () => {
    img.classList.remove('product-card__image--loading');
    img.classList.add('product-card__image--loaded');
    img.style.display = 'none';
    const placeholder = img.closest('.product-card__image-wrap')
      ?.querySelector('.product-card__image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  if (img.complete && img.naturalWidth) {
    img.classList.remove('product-card__image--loading');
    img.classList.add('product-card__image--loaded');
    return;
  }

  temp.src = src;
}

export function disconnectObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}
