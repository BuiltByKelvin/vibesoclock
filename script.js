// ========== CART & FAVORITES ==========
let cart = JSON.parse(localStorage.getItem("vibeCart")) || [];
let favorites = JSON.parse(localStorage.getItem("vibeFavorites")) || [];

function saveCart() {
  localStorage.setItem("vibeCart", JSON.stringify(cart));
  updateCartUI();
}
function addToCart(item) {
  let existing = cart.find((i) => i.name === item.name);
  if (existing) existing.quantity++;
  else cart.push({ ...item, quantity: 1 });
  saveCart();
}

function updateCartUI() {
  const container = document.getElementById("cartItemsList");
  const countSpan = document.getElementById("cartCount");
  let total = 0,
    count = 0;
  if (cart.length === 0) {
    container.innerHTML =
      '<div style="text-align:center;padding:20px;">Your cart is empty</div>';
    countSpan.innerText = "0";
    document.getElementById("subtotal").innerText = "₦0";
    document.getElementById("totalWithDelivery").innerText = "₦1,000";
    return;
  }
  let html = "";
  cart.forEach((item, idx) => {
    total += item.price * item.quantity;
    count += item.quantity;
    html += `<div style="background:#1A1A1A; padding:12px; border-radius:12px; margin-bottom:12px;">
            <div><h4>${item.name}</h4><span>₦${item.price} x ${item.quantity}</span></div>
            <div><button class="qty-down" data-idx="${idx}">-</button><span style="margin:0 8px;">${item.quantity}</span><button class="qty-up" data-idx="${idx}">+</button><button class="remove-item" data-idx="${idx}" style="margin-left:10px;">🗑️</button></div>
        </div>`;
  });
  container.innerHTML = html;
  countSpan.innerText = count;
  document.getElementById("subtotal").innerText = `₦${total}`;
  document.getElementById("totalWithDelivery").innerText = `₦${total + 1000}`;

  document.querySelectorAll(".qty-down").forEach((btn) =>
    btn.addEventListener("click", () => {
      let i = btn.dataset.idx;
      if (cart[i].quantity > 1) cart[i].quantity--;
      else cart.splice(i, 1);
      saveCart();
    }),
  );
  document.querySelectorAll(".qty-up").forEach((btn) =>
    btn.addEventListener("click", () => {
      let i = btn.dataset.idx;
      cart[i].quantity++;
      saveCart();
    }),
  );
  document.querySelectorAll(".remove-item").forEach((btn) =>
    btn.addEventListener("click", () => {
      let i = btn.dataset.idx;
      cart.splice(i, 1);
      saveCart();
    }),
  );
}

function updateFavoriteIcons() {
  document.querySelectorAll(".fav-icon").forEach((icon) => {
    const name = icon.getAttribute("data-name");
    if (favorites.includes(name)) icon.classList.add("active");
    else icon.classList.remove("active");
  });
}

function attachEvents() {
  document.querySelectorAll(".add-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const card = this.closest(".card");
      const name = card.querySelector("h3").innerText;
      const priceText = card.querySelector(".price").innerText.replace("₦", "");
      const price = parseInt(priceText);
      addToCart({ name, price });
    });
  });
  document.querySelectorAll(".fav-icon").forEach((icon) => {
    icon.addEventListener("click", function (e) {
      e.preventDefault();
      const name = this.getAttribute("data-name");
      if (favorites.includes(name))
        favorites = favorites.filter((n) => n !== name);
      else favorites.push(name);
      localStorage.setItem("vibeFavorites", JSON.stringify(favorites));
      updateFavoriteIcons();
      this.classList.toggle("active");
    });
  });
}

// Hero slider
let heroSlides = document.querySelectorAll(".hero-slide");
let heroIndex = 0;
setInterval(() => {
  heroSlides[heroIndex].classList.remove("active");
  heroIndex = (heroIndex + 1) % heroSlides.length;
  heroSlides[heroIndex].classList.add("active");
}, 5000);

window.addEventListener("scroll", () => {
  document
    .getElementById("header")
    .classList.toggle("scrolled", window.scrollY > 50);
});

// Mobile menu
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navLinks");
const hamIcon = hamburger.querySelector("i");

function closeMenuAndScroll(targetId) {
  navMenu.classList.remove("active");
  hamIcon.classList.replace("fa-times", "fa-bars");
  const element = document.querySelector(targetId);
  if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
}

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  if (navMenu.classList.contains("active"))
    hamIcon.classList.replace("fa-bars", "fa-times");
  else hamIcon.classList.replace("fa-times", "fa-bars");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      closeMenuAndScroll(href);
    }
  });
});
document.querySelector(".mobile-menu-btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  closeMenuAndScroll("#contact-faq");
  window.open("https://www.homeandawayfoods.com/", "_blank");
});

// FAQ accordion
document.querySelectorAll(".faq-question").forEach((q) => {
  q.addEventListener("click", () => q.parentElement.classList.toggle("active"));
});

// Testimonials and comments
let testimonials = JSON.parse(localStorage.getItem("vibeTestimonials")) || [
  { name: "Chidi O.", comment: "Best jollof in Lagos! The vibe is unmatched." },
  { name: "Amara E.", comment: "Loved the grilled fish and live DJ." },
  { name: "Oluwaseun K.", comment: "Suya platter is legendary." },
  { name: "Fatima B.", comment: "Mocktails refreshing, staff royal." },
];

function renderTestimonials() {
  const container = document.getElementById("testimonialScroll");
  if (container)
    container.innerHTML = testimonials
      .map(
        (t) =>
          `<div class="testimonial-card"><div class="testimonial-text">“${t.comment}”</div><div class="testimonial-name">— ${t.name}</div></div>`,
      )
      .join("");
}
renderTestimonials();

document.getElementById("commentForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("commentName").value.trim();
  const comment = document.getElementById("commentText").value.trim();
  if (!name || !comment) {
    alert("Please enter name and comment.");
    return;
  }
  testimonials.unshift({ name, comment });
  localStorage.setItem("vibeTestimonials", JSON.stringify(testimonials));
  renderTestimonials();
  document.getElementById("commentForm").reset();
  alert("Thank you! Your review has been added.");
});

const testScroll = document.getElementById("testimonialScroll");
let autoInterval;
function startAutoScroll() {
  autoInterval = setInterval(() => {
    if (testScroll) testScroll.scrollBy({ top: 1, behavior: "smooth" });
  }, 50);
}
function stopAutoScroll() {
  clearInterval(autoInterval);
}
if (testScroll) {
  testScroll.addEventListener("mouseenter", stopAutoScroll);
  testScroll.addEventListener("mouseleave", startAutoScroll);
  startAutoScroll();
}

// Rotating about image


let imgIdx = 0;
const abImg = document.getElementById("aboutImage");
if (abImg) {
  setInterval(() => {
    imgIdx = (imgIdx + 1) % aboutImgs.length;
    abImg.style.opacity = "0";
    setTimeout(() => {
      abImg.src = aboutImgs[imgIdx];
      abImg.style.opacity = "1";
    }, 200);
  }, 5000);
}

// Cart panel controls
const cartIcon = document.getElementById("cartIcon");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
function openCart() {
  cartPanel.style.right = "0";
  cartOverlay.style.visibility = "visible";
  cartOverlay.style.opacity = "1";
}
function closeCart() {
  cartPanel.style.right = "-500px";
  cartOverlay.style.visibility = "hidden";
  cartOverlay.style.opacity = "0";
}
cartIcon.addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("clearCartBtn")?.addEventListener("click", () => {
  cart = [];
  saveCart();
  closeCart();
});

// Order buttons
document.getElementById("orderWhatsAppBtn")?.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let orderItems = cart
    .map(
      (item) =>
        `🍽️ ${item.name} x ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`,
    )
    .join("\n");

  let subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  let deliveryFee = 1000;
  let total = subtotal + deliveryFee;

  let message =
    `*🧾 NEW ORDER FROM VIBE'S O'CLOCK* 🧾\n\n` +
    `*Customer Order Details:*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `${orderItems}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `*Subtotal:* ₦${subtotal.toLocaleString()}\n` +
    `*Delivery Fee:* ₦${deliveryFee.toLocaleString()}\n` +
    `*TOTAL:* ₦${total.toLocaleString()}\n\n` +
    `*Delivery Estimate:* 45-60 minutes\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `*Vibe's O'clock Restaurant* 🍽️✨\n` +
    `Please confirm availability and provide ETA.`;

  window.open(
    `https://wa.me/2348137472859?text=${encodeURIComponent(message)}`,
    "_blank",
  );
});

document.getElementById("orderAdminBtn")?.addEventListener("click", () => {
  alert("Coming soon! Please order via WhatsApp for now.");
});

// Initialize
attachEvents();
updateFavoriteIcons();
updateCartUI();
