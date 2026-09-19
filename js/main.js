/* =========================================================
   HETQ — Fashion E-commerce
   Script: js/main.js
   All vanilla JS functionality shared across pages.
   ========================================================= */

/* ---------------------------------------------------------
   1. PRODUCT DATA
   --------------------------------------------------------- */
const HETQ_PRODUCTS = [
  {
    id: 1,
    name: "HETQ Essential Tee",
    category: "T-Shirts",
    price: 49,
    colors: ["Burgundy", "Cream", "Black"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "images/products/tshirt-01.jpg",
    isNew: true,
    bestSeller: true,
    description: "The foundation of the HETQ wardrobe. Cut from heavyweight combed cotton for a clean drape and lasting shape."
  },
  {
    id: 2,
    name: "HETQ Heavy Tee",
    category: "T-Shirts",
    price: 58,
    colors: ["Black", "Cream", "Brown"],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "images/products/tshirt-02.jpg",
    isNew: true,
    bestSeller: false,
    description: "A dense, structured tee with a boxy silhouette. Built for everyday wear that only gets better with age."
  },
  {
    id: 3,
    name: "HETQ Core Long Sleeve",
    category: "Long Sleeves",
    price: 68,
    colors: ["Burgundy", "Black", "Cream"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "images/products/longsleeve-01.jpg",
    isNew: true,
    bestSeller: true,
    description: "A refined long sleeve designed for layering or wearing alone. Ribbed cuffs, clean lines, no distractions."
  },
  {
    id: 4,
    name: "HETQ Oversized Long Sleeve",
    category: "Long Sleeves",
    price: 74,
    colors: ["Brown", "Black", "Burgundy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "images/products/longsleeve-02.jpg",
    isNew: true,
    bestSeller: false,
    description: "Relaxed through the body with a dropped shoulder. A quiet statement piece for cooler days."
  },
  {
    id: 5,
    name: "HETQ Everyday Tee",
    category: "T-Shirts",
    price: 45,
    colors: ["Cream", "Burgundy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "images/products/tshirt-03.jpg",
    isNew: false,
    bestSeller: true,
    description: "Soft-washed jersey with a slightly tapered fit. The tee you reach for without thinking."
  },
  {
    id: 6,
    name: "HETQ Boxy Tee",
    category: "T-Shirts",
    price: 52,
    colors: ["Black", "Brown"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "images/products/tshirt-04.jpg",
    isNew: false,
    bestSeller: true,
    description: "A wider, cropped-shoulder cut for a modern silhouette. Pairs cleanly with anything in your rotation."
  },
  {
    id: 7,
    name: "HETQ Ribbed Long Sleeve",
    category: "Long Sleeves",
    price: 64,
    colors: ["Cream", "Black", "Burgundy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "images/products/longsleeve-03.jpg",
    isNew: false,
    bestSeller: true,
    description: "Fine ribbed construction for a closer, more elevated fit. Wear it solo or under an open shirt."
  },
  {
    id: 8,
    name: "HETQ Mock Neck Long Sleeve",
    category: "Long Sleeves",
    price: 72,
    colors: ["Brown", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "images/products/longsleeve-04.jpg",
    isNew: false,
    bestSeller: false,
    description: "A subtle mock neckline elevates this staple long sleeve. Structured, warm, and understated."
  }
];

const COLOR_HEX = {
  Burgundy: "#6D1F2B",
  Cream: "#F3EBDD",
  Black: "#211A17",
  Brown: "#6B4A38"
};

/* ---------------------------------------------------------
   2. STORAGE HELPERS (cart + wishlist)
   --------------------------------------------------------- */
const Store = {
  getCart() {
    try { return JSON.parse(localStorage.getItem("hetq_cart")) || []; }
    catch (e) { return []; }
  },
  setCart(cart) {
    localStorage.setItem("hetq_cart", JSON.stringify(cart));
    updateHeaderCounts();
  },
  addToCart(item) {
    const cart = Store.getCart();
    const existing = cart.find(
      (c) => c.id === item.id && c.color === item.color && c.size === item.size
    );
    if (existing) {
      existing.qty += item.qty;
    } else {
      cart.push(item);
    }
    Store.setCart(cart);
  },
  removeFromCart(index) {
    const cart = Store.getCart();
    cart.splice(index, 1);
    Store.setCart(cart);
  },
  updateCartQty(index, qty) {
    const cart = Store.getCart();
    if (cart[index]) {
      cart[index].qty = Math.max(1, qty);
      Store.setCart(cart);
    }
  },
  clearCart() { Store.setCart([]); },

  getWishlist() {
    try { return JSON.parse(localStorage.getItem("hetq_wishlist")) || []; }
    catch (e) { return []; }
  },
  setWishlist(list) {
    localStorage.setItem("hetq_wishlist", JSON.stringify(list));
    updateHeaderCounts();
  },
  toggleWishlist(productId) {
    const list = Store.getWishlist();
    const idx = list.indexOf(productId);
    if (idx > -1) { list.splice(idx, 1); }
    else { list.push(productId); }
    Store.setWishlist(list);
    return list.includes(productId);
  },
  isWishlisted(productId) { return Store.getWishlist().includes(productId); }
};

function updateHeaderCounts() {
  const cartCount = Store.getCart().reduce((sum, i) => sum + i.qty, 0);
  const wishCount = Store.getWishlist().length;

  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = cartCount;
    el.classList.toggle("show", cartCount > 0);
  });
  document.querySelectorAll("[data-wishlist-count]").forEach((el) => {
    el.textContent = wishCount;
    el.classList.toggle("show", wishCount > 0);
  });
}

/* ---------------------------------------------------------
   3. PRODUCT CARD RENDERING (reusable across pages)
   --------------------------------------------------------- */
function productCardHTML(product) {
  const wishlisted = Store.isWishlisted(product.id);
  const badge = product.isNew
    ? '<span class="product-badge">New</span>'
    : product.bestSeller
    ? '<span class="product-badge">Best Seller</span>'
    : "";

  const dots = product.colors
    .map(
      (c) =>
        `<span class="color-dot" style="background:${COLOR_HEX[c] || "#ccc"}" title="${c}"></span>`
    )
    .join("");

  return `
  <article class="product-card" data-id="${product.id}">
    <div class="product-media">
      <a href="product.html?id=${product.id}" aria-label="View ${product.name}">
        <!-- Replace with your own HETQ product image -->
        <div class="placeholder ratio-portrait">
          <img src="${product.image}" alt="${product.name}" onerror="this.remove()">
          <span>${product.name.toUpperCase()}</span>
        </div>
      </a>
      ${badge}
      <button class="product-wishlist-btn ${wishlisted ? "active" : ""}" data-wishlist-toggle="${product.id}" aria-label="Add to wishlist">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4 6 4c2.2 0 3.7 1.2 6 3.6C14.3 5.2 15.8 4 18 4c4 0 5.5 4 4 7.7C19.5 16.4 12 21 12 21z"/></svg>
      </button>
      <div class="quick-add">
        <button class="btn btn-primary btn-block btn-sm" data-quick-add="${product.id}">Quick Add</button>
      </div>
    </div>
    <a href="product.html?id=${product.id}" class="product-info">
      <div class="cat">${product.category}</div>
      <div class="name">${product.name}</div>
      <div class="price">$${product.price}</div>
      <div class="color-dots">${dots}</div>
    </a>
  </article>`;
}

function renderProductGrid(container, products) {
  if (!container) return;
  if (!products.length) {
    container.innerHTML = '<div class="no-results">No products match your filters.</div>';
    return;
  }
  container.innerHTML = products.map(productCardHTML).join("");
}

/* Delegate quick-add + wishlist clicks from any rendered grid */
document.addEventListener("click", (e) => {
  const wishBtn = e.target.closest("[data-wishlist-toggle]");
  if (wishBtn) {
    e.preventDefault();
    const id = Number(wishBtn.dataset.wishlistToggle);
    const active = Store.toggleWishlist(id);
    wishBtn.classList.toggle("active", active);
    document.querySelectorAll(`[data-wishlist-toggle="${id}"]`).forEach((b) => b.classList.toggle("active", active));
    if (document.body.dataset.page === "wishlist") renderWishlistPage();
    return;
  }

  const quickAddBtn = e.target.closest("[data-quick-add]");
  if (quickAddBtn) {
    e.preventDefault();
    const id = Number(quickAddBtn.dataset.quickAdd);
    const product = HETQ_PRODUCTS.find((p) => p.id === id);
    if (product) {
      Store.addToCart({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        color: product.colors[0],
        size: product.sizes[Math.floor(product.sizes.length / 2)],
        qty: 1,
        image: product.image
      });
      flashButton(quickAddBtn, "Added");
    }
  }
});

function flashButton(btn, text) {
  const original = btn.textContent;
  btn.textContent = text;
  btn.disabled = true;
  setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1200);
}

/* ---------------------------------------------------------
   4. HEADER / NAV: sticky, mobile menu, search overlay
   --------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const hamburger = document.querySelector("[data-hamburger]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const backdrop = document.querySelector("[data-overlay-backdrop]");

  function closeMobileNav() {
    hamburger?.classList.remove("active");
    mobileNav?.classList.remove("open");
    backdrop?.classList.remove("show");
    document.body.classList.remove("no-scroll");
  }

  function openMobileNav() {
    hamburger?.classList.add("active");
    mobileNav?.classList.add("open");
    backdrop?.classList.add("show");
    document.body.classList.add("no-scroll");
  }

  hamburger?.addEventListener("click", () => {
    const isOpen = mobileNav?.classList.contains("open");
    isOpen ? closeMobileNav() : openMobileNav();
  });

  document.querySelector("[data-mobile-nav-close]")?.addEventListener("click", closeMobileNav);
  mobileNav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileNav));
  backdrop?.addEventListener("click", () => { closeMobileNav(); closeSearch(); closeFilterDrawer(); });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeMobileNav(); closeSearch(); closeFilterDrawer(); closeModal(); }
  });

  /* Search overlay */
  const searchTrigger = document.querySelectorAll("[data-search-trigger]");
  const searchOverlay = document.querySelector("[data-search-overlay]");
  const searchInput = document.querySelector("[data-search-input]");
  const searchResults = document.querySelector("[data-search-results]");

  function openSearch() {
    searchOverlay?.classList.add("open");
    document.body.classList.add("no-scroll");
    setTimeout(() => searchInput?.focus(), 300);
  }

  searchTrigger.forEach((btn) => btn.addEventListener("click", openSearch));
  document.querySelector("[data-search-close]")?.addEventListener("click", closeSearch);

  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = '<p class="search-hint">Try "tee", "long sleeve", or a color.</p>'; return; }
    const matches = HETQ_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.colors.some((c) => c.toLowerCase().includes(q))
    );
    if (!matches.length) {
      searchResults.innerHTML = '<p class="search-empty">No results found for &ldquo;' + escapeHTML(searchInput.value) + '&rdquo;</p>';
      return;
    }
    searchResults.innerHTML = matches.map((p) => `
      <a class="search-result-item" href="product.html?id=${p.id}">
        <div class="placeholder ratio-portrait"><span>${p.name.toUpperCase()}</span></div>
        <div class="search-result-info">
          <div class="name">${p.name}</div>
          <div class="cat">${p.category}</div>
        </div>
        <div class="search-result-price">$${p.price}</div>
      </a>`).join("");
  });
}

function closeSearch() {
  document.querySelector("[data-search-overlay]")?.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------------------------------------------------------
   5. FILTER DRAWER (mobile, shop page)
   --------------------------------------------------------- */
function closeFilterDrawer() {
  document.querySelector("[data-filter-drawer]")?.classList.remove("open");
  document.querySelector("[data-filter-drawer-backdrop]")?.classList.remove("show");
  document.body.classList.remove("no-scroll");
}

function initFilterDrawer() {
  const openBtn = document.querySelector("[data-filter-open]");
  const drawer = document.querySelector("[data-filter-drawer]");
  const backdrop = document.querySelector("[data-filter-drawer-backdrop]");
  const closeBtn = document.querySelector("[data-filter-drawer-close]");

  openBtn?.addEventListener("click", () => {
    drawer?.classList.add("open");
    backdrop?.classList.add("show");
    document.body.classList.add("no-scroll");
  });
  closeBtn?.addEventListener("click", closeFilterDrawer);
  backdrop?.addEventListener("click", closeFilterDrawer);
}

/* ---------------------------------------------------------
   6. MODAL (Size Guide)
   --------------------------------------------------------- */
function closeModal() {
  document.querySelectorAll(".modal-backdrop").forEach((m) => m.classList.remove("show"));
  document.body.classList.remove("no-scroll");
}

function initModals() {
  document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = document.querySelector(trigger.dataset.modalOpen);
      target?.classList.add("show");
      document.body.classList.add("no-scroll");
    });
  });
  document.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
  });
}

/* ---------------------------------------------------------
   7. ACCORDION
   --------------------------------------------------------- */
function initAccordion() {
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const panel = item.querySelector(".accordion-panel");
    header?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".accordion-item").forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".accordion-panel").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
}

/* ---------------------------------------------------------
   8. SCROLL REVEAL
   --------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!targets.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
  );
  targets.forEach((t) => observer.observe(t));
}

/* ---------------------------------------------------------
   9. NEWSLETTER VALIDATION
   --------------------------------------------------------- */
function initNewsletterForms() {
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    const input = form.querySelector("input[type='email']");
    const msg = form.querySelector("[data-form-message]") || form.parentElement.querySelector("[data-form-message]");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!msg) return;
      if (!isValid) {
        msg.textContent = "Please enter a valid email address.";
        msg.className = "form-message error";
        return;
      }
      msg.textContent = "You're on the list. Welcome to HETQ.";
      msg.className = "form-message success";
      input.value = "";
    });
  });
}

/* ---------------------------------------------------------
   10. ACTIVE NAV LINK
   --------------------------------------------------------- */
function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a, .mobile-nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
}

/* ---------------------------------------------------------
   11. INIT (runs on every page)
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initFilterDrawer();
  initModals();
  initAccordion();
  initScrollReveal();
  initNewsletterForms();
  setActiveNav();
  updateHeaderCounts();

  // Page-specific initializers — each checks for its own DOM hooks.
  if (document.body.dataset.page === "home") initHome();
  if (document.body.dataset.page === "shop") initShopPage();
  if (document.body.dataset.page === "product") initProductPage();
  if (document.body.dataset.page === "cart") renderCartPage();
  if (document.body.dataset.page === "wishlist") renderWishlistPage();
  if (document.body.dataset.page === "checkout") initCheckoutPage();
});

/* ---------------------------------------------------------
   12. HOMEPAGE
   --------------------------------------------------------- */
function initHome() {
  const newArrivals = HETQ_PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = HETQ_PRODUCTS.filter((p) => p.bestSeller).slice(0, 4);
  renderProductGrid(document.querySelector("[data-new-arrivals]"), newArrivals);
  renderProductGrid(document.querySelector("[data-best-sellers]"), bestSellers);
}

/* ---------------------------------------------------------
   13. SHOP PAGE — filtering & sorting
   --------------------------------------------------------- */
function initShopPage() {
  const grid = document.querySelector("[data-shop-grid]");
  const countEl = document.querySelector("[data-shop-count]");
  const sortSelect = document.querySelector("[data-sort-select]");

  const state = {
    category: "All",
    sizes: [],
    colors: [],
    maxPrice: 100,
    inStockOnly: false,
    sort: "featured"
  };

  function applyFilters() {
    let results = HETQ_PRODUCTS.filter((p) => {
      if (state.category !== "All" && p.category !== state.category) return false;
      if (state.sizes.length && !state.sizes.some((s) => p.sizes.includes(s))) return false;
      if (state.colors.length && !state.colors.some((c) => p.colors.includes(c))) return false;
      if (p.price > state.maxPrice) return false;
      return true;
    });

    switch (state.sort) {
      case "newest":
        results = results.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
        break;
      case "price-asc":
        results = results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results = results.sort((a, b) => b.price - a.price);
        break;
      default:
        break; // featured = default order
    }

    renderProductGrid(grid, results);
    if (countEl) countEl.textContent = `${results.length} PRODUCT${results.length === 1 ? "" : "S"}`;
  }

  // Category filters (radio-like)
  document.querySelectorAll("[data-filter-category]").forEach((input) => {
    input.addEventListener("change", () => {
      state.category = input.value;
      applyFilters();
    });
  });

  // Size filters (checkbox, multi)
  document.querySelectorAll("[data-filter-size]").forEach((pill) => {
    pill.addEventListener("click", () => {
      const size = pill.dataset.filterSize;
      pill.classList.toggle("active");
      if (state.sizes.includes(size)) {
        state.sizes = state.sizes.filter((s) => s !== size);
      } else {
        state.sizes.push(size);
      }
      applyFilters();
    });
  });

  // Color filters
  document.querySelectorAll("[data-filter-color]").forEach((swatch) => {
    swatch.addEventListener("click", () => {
      const color = swatch.dataset.filterColor;
      swatch.classList.toggle("active");
      if (state.colors.includes(color)) {
        state.colors = state.colors.filter((c) => c !== color);
      } else {
        state.colors.push(color);
      }
      applyFilters();
    });
  });

  // Price range
  const priceRange = document.querySelector("[data-filter-price]");
  const priceValueEl = document.querySelector("[data-price-value]");
  priceRange?.addEventListener("input", () => {
    state.maxPrice = Number(priceRange.value);
    if (priceValueEl) priceValueEl.textContent = `Up to $${state.maxPrice}`;
    applyFilters();
  });

  // Sort
  sortSelect?.addEventListener("change", () => {
    state.sort = sortSelect.value;
    applyFilters();
  });

  // Clear filters
  document.querySelectorAll("[data-clear-filters]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = "All";
      state.sizes = [];
      state.colors = [];
      state.maxPrice = 100;
      state.sort = "featured";
      document.querySelectorAll("[data-filter-category]").forEach((i) => (i.checked = i.value === "All"));
      document.querySelectorAll("[data-filter-size]").forEach((p) => p.classList.remove("active"));
      document.querySelectorAll("[data-filter-color]").forEach((s) => s.classList.remove("active"));
      if (priceRange) priceRange.value = 100;
      if (priceValueEl) priceValueEl.textContent = "Up to $100";
      if (sortSelect) sortSelect.value = "featured";
      applyFilters();
    });
  });

  // Handle preset category from URL (?category=T-Shirts)
  const params = new URLSearchParams(window.location.search);
  const presetCategory = params.get("category");
  if (presetCategory) {
    state.category = presetCategory;
    const radio = document.querySelector(`[data-filter-category][value="${presetCategory}"]`);
    if (radio) radio.checked = true;
  }

  applyFilters();
}

/* ---------------------------------------------------------
   14. PRODUCT DETAIL PAGE
   --------------------------------------------------------- */
function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id")) || HETQ_PRODUCTS[0].id;
  const product = HETQ_PRODUCTS.find((p) => p.id === id) || HETQ_PRODUCTS[0];

  const state = { color: product.colors[0], size: null, qty: 1 };

  // Basic info
  document.querySelectorAll("[data-product-name]").forEach((el) => (el.textContent = product.name));
  document.querySelectorAll("[data-product-category]").forEach((el) => (el.textContent = product.category));
  document.querySelectorAll("[data-product-price]").forEach((el) => (el.textContent = `$${product.price}`));
  document.querySelectorAll("[data-product-desc]").forEach((el) => (el.textContent = product.description));
  document.title = `${product.name} — HETQ`;

  // Gallery placeholders (main + 4 thumbs, all placeholder based on same product)
  const galleryMain = document.querySelector("[data-gallery-main]");
  const galleryThumbs = document.querySelector("[data-gallery-thumbs]");
  if (galleryMain) {
    galleryMain.innerHTML = `<!-- Replace with your own HETQ product image -->
      <div class="placeholder ratio-portrait"><img src="${product.image}" alt="${product.name}" onerror="this.remove()"><span>${product.name.toUpperCase()}</span></div>`;
  }
  if (galleryThumbs) {
    galleryThumbs.innerHTML = [1, 2, 3, 4].map((n, i) => `
      <!-- Replace with your own HETQ product image -->
      <div class="placeholder ratio-portrait ${i === 0 ? "active" : ""}" data-thumb="${n}"><span>VIEW ${n}</span></div>
    `).join("");
    galleryThumbs.querySelectorAll("[data-thumb]").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        galleryThumbs.querySelectorAll(".placeholder").forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        const label = thumb.querySelector("span").textContent;
        galleryMain.querySelector("span").textContent = `${product.name.toUpperCase()} — ${label}`;
      });
    });
  }

  // Color swatches
  const colorContainer = document.querySelector("[data-color-swatches]");
  const selectedColorLabel = document.querySelector("[data-selected-color]");
  if (colorContainer) {
    colorContainer.innerHTML = product.colors.map((c, i) => `
      <button class="color-swatch ${i === 0 ? "active" : ""}" style="background:${COLOR_HEX[c]}" data-color="${c}" aria-label="${c}" title="${c}"></button>
    `).join("");
    colorContainer.querySelectorAll(".color-swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        colorContainer.querySelectorAll(".color-swatch").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.color = btn.dataset.color;
        if (selectedColorLabel) selectedColorLabel.textContent = state.color;
      });
    });
  }
  if (selectedColorLabel) selectedColorLabel.textContent = state.color;

  // Size selector
  const sizeContainer = document.querySelector("[data-size-grid]");
  const selectedSizeLabel = document.querySelector("[data-selected-size]");
  const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
  if (sizeContainer) {
    sizeContainer.innerHTML = ALL_SIZES.map((s) => {
      const available = product.sizes.includes(s);
      return `<button class="size-box ${available ? "" : "disabled"}" data-size="${s}" ${available ? "" : "disabled"}>${s}</button>`;
    }).join("");
    sizeContainer.querySelectorAll(".size-box:not(.disabled)").forEach((btn) => {
      btn.addEventListener("click", () => {
        sizeContainer.querySelectorAll(".size-box").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.size = btn.dataset.size;
        if (selectedSizeLabel) selectedSizeLabel.textContent = state.size;
        const validationMsg = document.querySelector("[data-size-validation]");
        if (validationMsg) validationMsg.textContent = "";
      });
    });
  }

  // Quantity selector
  const qtyValue = document.querySelector("[data-qty-value]");
  document.querySelector("[data-qty-decrease]")?.addEventListener("click", () => {
    state.qty = Math.max(1, state.qty - 1);
    if (qtyValue) qtyValue.textContent = state.qty;
  });
  document.querySelector("[data-qty-increase]")?.addEventListener("click", () => {
    state.qty = Math.min(10, state.qty + 1);
    if (qtyValue) qtyValue.textContent = state.qty;
  });

  // Add to cart / wishlist / buy now
  const validationMsg = document.querySelector("[data-size-validation]");

  document.querySelector("[data-add-to-cart]")?.addEventListener("click", (e) => {
    if (!state.size) {
      if (validationMsg) validationMsg.textContent = "Please select a size before adding to cart.";
      return;
    }
    Store.addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      color: state.color,
      size: state.size,
      qty: state.qty,
      image: product.image
    });
    flashButton(e.currentTarget, "Added to Cart");
  });

  document.querySelector("[data-buy-now]")?.addEventListener("click", () => {
    if (!state.size) {
      if (validationMsg) validationMsg.textContent = "Please select a size before continuing.";
      return;
    }
    Store.addToCart({
      id: product.id, name: product.name, category: product.category, price: product.price,
      color: state.color, size: state.size, qty: state.qty, image: product.image
    });
    window.location.href = "checkout.html";
  });

  const wishBtn = document.querySelector("[data-wishlist-add]");
  if (wishBtn) {
    wishBtn.classList.toggle("active", Store.isWishlisted(product.id));
    wishBtn.addEventListener("click", () => {
      const active = Store.toggleWishlist(product.id);
      wishBtn.classList.toggle("active", active);
      wishBtn.textContent = active ? "Added to Wishlist" : "Add to Wishlist";
      setTimeout(() => { wishBtn.textContent = "Add to Wishlist"; }, 1500);
    });
  }

  // Related products
  const related = HETQ_PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const fallback = HETQ_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  renderProductGrid(document.querySelector("[data-related-products]"), related.length ? related : fallback);
}

/* ---------------------------------------------------------
   15. CART PAGE
   --------------------------------------------------------- */
const SHIPPING_FLAT = 8;
const FREE_SHIPPING_THRESHOLD = 100;

function renderCartPage() {
  const cart = Store.getCart();
  const listEl = document.querySelector("[data-cart-list]");
  const emptyEl = document.querySelector("[data-cart-empty]");
  const filledEl = document.querySelector("[data-cart-filled]");

  if (!cart.length) {
    if (emptyEl) emptyEl.style.display = "block";
    if (filledEl) filledEl.style.display = "none";
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";
  if (filledEl) filledEl.style.display = "";

  if (listEl) {
    listEl.innerHTML = cart.map((item, index) => `
      <div class="cart-item" data-index="${index}">
        <!-- Replace with your own HETQ product image -->
        <div class="placeholder ratio-portrait"><span>${item.name.toUpperCase()}</span></div>
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">${item.color} / ${item.size}</div>
          <div class="cart-item-price">$${item.price}</div>
        </div>
        <div class="cart-item-controls">
          <button class="remove-btn" data-remove-item="${index}">Remove</button>
          <div class="qty-selector">
            <button data-cart-decrease="${index}" aria-label="Decrease quantity">−</button>
            <span class="qty-value">${item.qty}</span>
            <button data-cart-increase="${index}" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  updateCartSummary(cart);

  listEl?.querySelectorAll("[data-remove-item]").forEach((btn) => {
    btn.addEventListener("click", () => { Store.removeFromCart(Number(btn.dataset.removeItem)); renderCartPage(); });
  });
  listEl?.querySelectorAll("[data-cart-decrease]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.cartDecrease);
      const c = Store.getCart();
      Store.updateCartQty(i, c[i].qty - 1);
      renderCartPage();
    });
  });
  listEl?.querySelectorAll("[data-cart-increase]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.cartIncrease);
      const c = Store.getCart();
      Store.updateCartQty(i, c[i].qty + 1);
      renderCartPage();
    });
  });
}

function updateCartSummary(cart) {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  document.querySelectorAll("[data-subtotal]").forEach((el) => (el.textContent = `$${subtotal.toFixed(2)}`));
  document.querySelectorAll("[data-shipping]").forEach((el) => (el.textContent = shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`));
  document.querySelectorAll("[data-total]").forEach((el) => (el.textContent = `$${total.toFixed(2)}`));
}

/* ---------------------------------------------------------
   16. WISHLIST PAGE
   --------------------------------------------------------- */
function renderWishlistPage() {
  const ids = Store.getWishlist();
  const products = HETQ_PRODUCTS.filter((p) => ids.includes(p.id));
  const grid = document.querySelector("[data-wishlist-grid]");
  const emptyEl = document.querySelector("[data-wishlist-empty]");
  const filledEl = document.querySelector("[data-wishlist-filled]");

  if (!products.length) {
    if (emptyEl) emptyEl.style.display = "block";
    if (filledEl) filledEl.style.display = "none";
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";
  if (filledEl) filledEl.style.display = "";

  if (grid) {
    grid.innerHTML = products.map((p) => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-media">
          <a href="product.html?id=${p.id}">
            <!-- Replace with your own HETQ product image -->
            <div class="placeholder ratio-portrait"><span>${p.name.toUpperCase()}</span></div>
          </a>
        </div>
        <a href="product.html?id=${p.id}" class="product-info">
          <div class="cat">${p.category}</div>
          <div class="name">${p.name}</div>
          <div class="price">$${p.price}</div>
        </a>
        <div class="wishlist-card-actions">
          <button class="btn btn-primary btn-sm" data-move-to-cart="${p.id}">Add to Cart</button>
          <button class="btn btn-secondary btn-sm" data-wishlist-toggle="${p.id}">Remove</button>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll("[data-move-to-cart]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = HETQ_PRODUCTS.find((p) => p.id === Number(btn.dataset.moveToCart));
        Store.addToCart({
          id: product.id, name: product.name, category: product.category, price: product.price,
          color: product.colors[0], size: product.sizes[0], qty: 1, image: product.image
        });
        flashButton(btn, "Added");
      });
    });
  }
}

/* ---------------------------------------------------------
   17. CHECKOUT PAGE
   --------------------------------------------------------- */
function initCheckoutPage() {
  const cart = Store.getCart();
  const itemsEl = document.querySelector("[data-checkout-items]");

  if (itemsEl) {
    if (!cart.length) {
      itemsEl.innerHTML = `<p style="color:var(--text-secondary); font-size:0.9rem;">Your cart is empty. <a href="shop.html" class="text-link" style="margin-left:6px;">Shop now</a></p>`;
    } else {
      itemsEl.innerHTML = cart.map((item) => `
        <div class="checkout-item">
          <!-- Replace with your own HETQ product image -->
          <div class="placeholder ratio-portrait"><span>${item.name.toUpperCase()}</span></div>
          <div class="checkout-item-info">
            <div class="name">${item.name}</div>
            <div class="meta">${item.color} / ${item.size} · Qty ${item.qty}</div>
            <div class="price">$${(item.price * item.qty).toFixed(2)}</div>
          </div>
        </div>
      `).join("");
    }
  }
  updateCartSummary(cart);

  // Delivery option selection
  document.querySelectorAll("[data-delivery-option]").forEach((opt) => {
    opt.addEventListener("click", () => {
      document.querySelectorAll("[data-delivery-option]").forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      opt.querySelector("input[type='radio']").checked = true;
    });
  });

  // Form validation
  const form = document.querySelector("[data-checkout-form]");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cart.length) return;

    let valid = true;
    form.querySelectorAll("[required]").forEach((input) => {
      const field = input.closest(".field");
      const errorEl = field?.querySelector(".field-error");
      const isEmpty = !input.value.trim();
      const isEmailInvalid = input.type === "email" && input.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());

      if (isEmpty || isEmailInvalid) {
        valid = false;
        field?.classList.add("error");
        if (errorEl) errorEl.textContent = isEmpty ? "This field is required." : "Enter a valid email address.";
      } else {
        field?.classList.remove("error");
        if (errorEl) errorEl.textContent = "";
      }
    });

    if (!valid) {
      form.querySelector(".field.error input")?.focus();
      return;
    }

    // Fake order success
    const orderNumber = "HETQ-" + Math.floor(10000 + Math.random() * 89999);
    sessionStorage.setItem("hetq_last_order", orderNumber);
    Store.clearCart();
    window.location.href = `checkout.html?success=1&order=${orderNumber}`;
  });

  // Show success screen if redirected with success flag
  const params = new URLSearchParams(window.location.search);
  if (params.get("success") === "1") {
    const orderNumber = params.get("order") || sessionStorage.getItem("hetq_last_order") || "HETQ-00000";
    const checkoutView = document.querySelector("[data-checkout-view]");
    const successView = document.querySelector("[data-success-view]");
    if (checkoutView) checkoutView.style.display = "none";
    if (successView) {
      successView.style.display = "flex";
      const orderEl = successView.querySelector("[data-order-number]");
      if (orderEl) orderEl.textContent = orderNumber;
    }
  }
}
