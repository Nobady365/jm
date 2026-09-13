/* =========================================================================
   BLUSH & BLOOM — PRODUCT CATALOG
   -------------------------------------------------------------------------
   Yahan par aap products add/remove/edit kar sakte hain.
   Har product ka structure:
   {
     id:       unique code (kabhi na badlein agar order history rakhni ho)
     name:     product ka naam (customer ko yahi dikhega)
     category: "flowers" | "bouquets" | "bags" | "hairclips" | "bracelets" | "keychains"
     price:    Rs. mein price (number, bina comma)
     img:      images folder ke andar file ka path
     desc:     chota sa description (ek line)
   }

   ASLI PHOTO LAGANI HO TO:
   1) Apni photo ko images/ folder mein isi naam se (jpg/png) daal dein
      jo neeche README.txt mein diya gaya hai (e.g. rose-red.jpg)
   2) Neeche is file mein us product ki "img" line mein ".svg" ko
      ".jpg" (ya jo bhi extension ho) se replace kar dein.
   Bas — poori site apne aap us nayi photo ko use karne lagegi.
   ========================================================================= */

const PRODUCTS = [
  // ---------------- FLOWERS — Rs. 499 ----------------
  { id:"flw-rose-red",   name:"Red Rose",         category:"flowers", price:499,  img:"images/rose-red.jpg",     desc:"Single crochet red rose on a wrapped stem." },
  { id:"flw-rose-white", name:"Blush Rose",       category:"flowers", price:499,  img:"images/rose-white.jpg",   desc:"Soft white & pink layered rose bloom." },
  { id:"flw-sunflower",  name:"Sunflower",        category:"flowers", price:499,  img:"images/sunflower.jpg",    desc:"Sunny crochet sunflower with green leaves." },
  { id:"flw-tulip",      name:"Tulip",            category:"flowers", price:499,  img:"images/tulip.svg",        desc:"Delicate crochet tulip in soft pink." },
  { id:"flw-lily",       name:"Lily",             category:"flowers", price:499,  img:"images/lily.svg",         desc:"Elegant white lily, handmade with care." },

  // ---------------- BOUQUETS ----------------
  { id:"bqt-mini",  name:"Mini Bouquet",  category:"bouquets", price:799,  img:"images/bouquet-mini.jpg", desc:"A cosy little bunch, perfect for a small gift." },
  { id:"bqt-big",   name:"Grand Bouquet", category:"bouquets", price:1499, img:"images/bouquet-big.jpg",  desc:"A full, generous bouquet for someone special." },

  // ---------------- BAGS ----------------
  { id:"bag-sunflower", name:"Sunflower Bag", category:"bags", price:2999, img:"images/bag-sunflower.jpg", desc:"Handmade crochet bag with a sunflower applique." },
  { id:"bag-blue",      name:"Ocean Bloom Bag", category:"bags", price:3499, img:"images/bag-blue.jpg",    desc:"Granny-square crossbody bag in ocean blues." },

  // ---------------- HAIR CLIPS — Rs. 149 ----------------
  { id:"hc-rose",      name:"Rose Hair Clip",      category:"hairclips", price:149, img:"images/hairclip-rose.svg",      desc:"Tiny rose bloom on a snap hair clip." },
  { id:"hc-sunflower", name:"Sunflower Hair Clip", category:"hairclips", price:149, img:"images/hairclip-sunflower.svg", desc:"Cheerful sunflower snap clip." },
  { id:"hc-tulip",     name:"Tulip Hair Clip",     category:"hairclips", price:149, img:"images/hairclip-tulip.svg",     desc:"Sweet pink tulip snap clip." },
  { id:"hc-daisy",     name:"Daisy Hair Clip",     category:"hairclips", price:149, img:"images/hairclip-daisy.svg",     desc:"Classic little daisy snap clip." },

  // ---------------- BRACELETS — Rs. 399 / pair ----------------
  { id:"br-bloom", name:"Bloom Charm Bracelet", category:"bracelets", price:399, img:"images/bracelet.svg", desc:"Beaded crochet bracelet with a flower charm — sold per pair." },

  // ---------------- KEYCHAINS — Rs. 399 ----------------
  { id:"kc-sunflower", name:"Sunflower Keychain", category:"keychains", price:399, img:"images/keychain-sunflower.svg", desc:"A little sunflower to hang on your keys." },
  { id:"kc-tulip",     name:"Tulip Keychain",     category:"keychains", price:399, img:"images/keychain-tulip.svg",     desc:"Sweet tulip charm keychain." },
  { id:"kc-rose",      name:"Rose Keychain",      category:"keychains", price:399, img:"images/keychain-rose.svg",      desc:"Little rose charm keychain." },
];

const CATEGORIES = [
  { key:"flowers",   label:"Single Flowers" },
  { key:"bouquets",  label:"Bouquets" },
  { key:"bags",      label:"Bags" },
  { key:"hairclips", label:"Hair Clips" },
  { key:"bracelets", label:"Bracelets" },
  { key:"keychains", label:"Keychains" },
];

/* ---- Store contact settings ---- */
const STORE = {
  whatsappNumber: "923265477451",       // country code 92 + number without leading 0
  instagramHandle: "blushandbloomcreations.co",
  instagramUrl: "https://instagram.com/blushandbloomcreations.co",
};
