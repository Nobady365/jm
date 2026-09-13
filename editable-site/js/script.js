/* =========================================================================
   BLUSH & BLOOM — SITE LOGIC
   Cart is stored in the browser (localStorage) — no server/database needed.
   Checkout does not process real payment; it builds an order message and
   sends the customer straight to WhatsApp (and/or Instagram) with the
   shop owner's number, exactly as requested.
   ========================================================================= */

const CART_KEY = "bb_cart_v1";

function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function addToCart(id, qty){
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
}
function setQty(id, qty){
  const cart = getCart();
  if(qty <= 0){ delete cart[id]; } else { cart[id] = qty; }
  saveCart(cart);
  renderCartDrawer();
}
function removeFromCart(id){
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCartDrawer();
}
function cartCount(){
  const cart = getCart();
  return Object.values(cart).reduce((a,b)=>a+b, 0);
}
function cartTotal(){
  const cart = getCart();
  let total = 0;
  Object.entries(cart).forEach(([id, qty])=>{
    const p = PRODUCTS.find(p=>p.id===id);
    if(p) total += p.price * qty;
  });
  return total;
}
function updateCartBadge(){
  const badge = document.getElementById("cartBadge");
  const count = cartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

/* ---------------- Rendering products ---------------- */
function moneyFmt(n){
  return "Rs. " + n.toLocaleString("en-PK");
}

function productCard(p){
  const cart = getCart();
  const qtyInCart = cart[p.id] || 0;
  return `
  <div class="card" data-id="${p.id}" data-category="${p.category}">
    <div class="card-media"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
    <div class="card-body">
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="card-foot">
        <span class="price">${moneyFmt(p.price)}</span>
        <div class="qty-add">
          <div class="stepper">
            <button type="button" class="step-minus" aria-label="Decrease quantity">−</button>
            <span class="step-val">1</span>
            <button type="button" class="step-plus" aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="add-btn">${qtyInCart>0 ? "Add More" : "Add to Cart"}</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderProducts(filterKey){
  const grid = document.getElementById("productGrid");
  const list = filterKey && filterKey !== "all"
    ? PRODUCTS.filter(p=>p.category===filterKey)
    : PRODUCTS;
  grid.innerHTML = list.map(productCard).join("");
  attachCardEvents();
}

function attachCardEvents(){
  document.querySelectorAll("#productGrid .card").forEach(card=>{
    const id = card.dataset.id;
    const stepVal = card.querySelector(".step-val");
    const minus = card.querySelector(".step-minus");
    const plus = card.querySelector(".step-plus");
    const addBtn = card.querySelector(".add-btn");

    minus.addEventListener("click", ()=>{
      let v = parseInt(stepVal.textContent, 10);
      if(v > 1) stepVal.textContent = v - 1;
    });
    plus.addEventListener("click", ()=>{
      let v = parseInt(stepVal.textContent, 10);
      stepVal.textContent = v + 1;
    });
    addBtn.addEventListener("click", ()=>{
      const qty = parseInt(stepVal.textContent, 10);
      addToCart(id, qty);
      addBtn.textContent = "Added ✓";
      addBtn.classList.add("added");
      showToast(`${PRODUCTS.find(p=>p.id===id).name} added to cart`);
      setTimeout(()=>{ addBtn.textContent = "Add More"; addBtn.classList.remove("added"); }, 1400);
    });
  });
}

/* ---------------- Category chips ---------------- */
function initChips(){
  const chipRow = document.getElementById("chipRow");
  const chips = ["all", ...CATEGORIES.map(c=>c.key)];
  chipRow.innerHTML = chips.map(key=>{
    const label = key === "all" ? "All Products" : CATEGORIES.find(c=>c.key===key).label;
    return `<button type="button" class="chip ${key==='all'?'active':''}" data-key="${key}">${label}</button>`;
  }).join("");
  chipRow.querySelectorAll(".chip").forEach(chip=>{
    chip.addEventListener("click", ()=>{
      chipRow.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      renderProducts(chip.dataset.key);
    });
  });
}

/* ---------------- Cart drawer ---------------- */
function renderCartDrawer(){
  const cart = getCart();
  const body = document.getElementById("drawerBody");
  const ids = Object.keys(cart);

  if(ids.length === 0){
    body.innerHTML = `<div class="empty-cart"><p>Your cart is empty.</p><p>Pick something lovely! 🌸</p></div>`;
  } else {
    body.innerHTML = ids.map(id=>{
      const p = PRODUCTS.find(p=>p.id===id);
      if(!p) return "";
      const qty = cart[id];
      return `
      <div class="cart-line" data-id="${id}">
        <img src="${p.img}" alt="${p.name}">
        <div class="cart-line-info">
          <span class="name">${p.name}</span>
          <div class="row">
            <div class="stepper">
              <button type="button" class="cart-minus">−</button>
              <span class="cart-qty">${qty}</span>
              <button type="button" class="cart-plus">+</button>
            </div>
            <span class="price">${moneyFmt(p.price * qty)}</span>
          </div>
          <button type="button" class="remove-line">Remove</button>
        </div>
      </div>`;
    }).join("");

    body.querySelectorAll(".cart-line").forEach(line=>{
      const id = line.dataset.id;
      line.querySelector(".cart-minus").addEventListener("click", ()=>{
        setQty(id, (getCart()[id]||1) - 1);
      });
      line.querySelector(".cart-plus").addEventListener("click", ()=>{
        setQty(id, (getCart()[id]||0) + 1);
      });
      line.querySelector(".remove-line").addEventListener("click", ()=>removeFromCart(id));
    });
  }

  document.getElementById("cartSubtotal").textContent = moneyFmt(cartTotal());
  const checkoutBtn = document.getElementById("openCheckoutBtn");
  checkoutBtn.disabled = ids.length === 0;
}

function openDrawer(){
  document.getElementById("cartOverlay").classList.add("open");
  document.getElementById("cartDrawer").classList.add("open");
  renderCartDrawer();
}
function closeDrawer(){
  document.getElementById("cartOverlay").classList.remove("open");
  document.getElementById("cartDrawer").classList.remove("open");
}

/* ---------------- Toast ---------------- */
let toastTimer;
function showToast(msg){
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"), 2400);
}

/* ---------------- Order message builder ---------------- */
function buildOrderMessage({name, phone, city, address, note}){
  const cart = getCart();
  const lines = [];
  lines.push("Hello Blush & Bloom!");
  lines.push("I'd like to place an order:");
  lines.push("");
  Object.entries(cart).forEach(([id, qty])=>{
    const p = PRODUCTS.find(p=>p.id===id);
    if(p) lines.push(`• ${p.name} x${qty} — ${moneyFmt(p.price*qty)}`);
  });
  lines.push("");
  lines.push(`Total: ${moneyFmt(cartTotal())}`);
  lines.push("");
  lines.push(`Name: ${name}`);
  lines.push(`Phone: ${phone}`);
  lines.push(`City: ${city}`);
  if(address) lines.push(`Address: ${address}`);
  if(note) lines.push(`Note: ${note}`);
  return lines.join("\n");
}

function buildCustomMessage({name, phone, city, details}){
  return [
    "Hello Blush & Bloom!",
    "I'd like to request a CUSTOM order:",
    "",
    details,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `City: ${city}`
  ].join("\n");
}

function openWhatsApp(message){
  const url = `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function openInstagramWithCopy(message){
  navigator.clipboard?.writeText(message).catch(()=>{});
  window.open(STORE.instagramUrl, "_blank");
  showToast("Order details copied — paste them into your Instagram DM 📋");
}

/* ---------------- Checkout modal ---------------- */
function openCheckoutModal(){
  document.getElementById("orderSummaryBox").textContent =
    buildOrderMessage({name:"—", phone:"—", city:"—"});
  document.getElementById("checkoutModal").classList.add("open");
}
function closeCheckoutModal(){
  document.getElementById("checkoutModal").classList.remove("open");
}

function handleCheckoutSubmit(channel){
  const name = document.getElementById("coName").value.trim();
  const phone = document.getElementById("coPhone").value.trim();
  const city = document.getElementById("coCity").value.trim();
  const address = document.getElementById("coAddress").value.trim();
  const note = document.getElementById("coNote").value.trim();

  if(!name || !phone || !city){
    showToast("Please fill in Name, Phone and City");
    return;
  }

  const message = buildOrderMessage({name, phone, city, address, note});

  if(channel === "whatsapp"){
    openWhatsApp(message);
  } else {
    openInstagramWithCopy(message);
  }

  // clear cart after handing off the order
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
  renderCartDrawer();
  closeCheckoutModal();
  closeDrawer();
  renderProducts(document.querySelector(".chip.active")?.dataset.key || "all");
}

/* ---------------- Custom order form ---------------- */
function handleCustomSubmit(channel){
  const name = document.getElementById("cuName").value.trim();
  const phone = document.getElementById("cuPhone").value.trim();
  const city = document.getElementById("cuCity").value.trim();
  const details = document.getElementById("cuDetails").value.trim();

  if(!name || !phone || !city || !details){
    showToast("Please fill in all the fields");
    return;
  }

  const message = buildCustomMessage({name, phone, city, details});
  if(channel === "whatsapp"){
    openWhatsApp(message);
  } else {
    openInstagramWithCopy(message);
  }
  document.getElementById("customForm").reset();
  showToast("Your custom request has been sent — Blush & Bloom will reply soon 🌿");
}

/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("year").textContent = new Date().getFullYear();

  initChips();
  renderProducts("all");
  updateCartBadge();

  document.getElementById("cartBtn").addEventListener("click", openDrawer);
  document.getElementById("drawerClose").addEventListener("click", closeDrawer);
  document.getElementById("cartOverlay").addEventListener("click", closeDrawer);

  document.getElementById("openCheckoutBtn").addEventListener("click", openCheckoutModal);
  document.getElementById("checkoutClose").addEventListener("click", closeCheckoutModal);
  document.getElementById("checkoutModal").querySelector(".modal-backdrop").addEventListener("click", closeCheckoutModal);

  document.getElementById("sendWhatsapp").addEventListener("click", ()=>handleCheckoutSubmit("whatsapp"));
  document.getElementById("sendInstagram").addEventListener("click", ()=>handleCheckoutSubmit("instagram"));

  document.getElementById("cuSendWhatsapp").addEventListener("click", ()=>handleCustomSubmit("whatsapp"));
  document.getElementById("cuSendInstagram").addEventListener("click", ()=>handleCustomSubmit("instagram"));

  document.getElementById("navToggle").addEventListener("click", ()=>{
    document.getElementById("mainNav").classList.toggle("open");
  });
  document.querySelectorAll("#mainNav a").forEach(a=>{
    a.addEventListener("click", ()=>document.getElementById("mainNav").classList.remove("open"));
  });
});
