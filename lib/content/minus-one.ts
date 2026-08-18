export type DrinkCategory = "Coffee" | "Matcha" | "Chocolate" | "Seasonal";

export type MenuItem = {
  name: string;
  category: DrinkCategory;
  price: string;
  status: "from-menu-reference" | "owner-confirmation-needed";
  note: string;
};

export const instagramUrl = "https://www.instagram.com/minus.onecoffee/";

export const menuItems: MenuItem[] = [
  { name: "Americano", category: "Coffee", price: "RM8", status: "from-menu-reference", note: "Clean coffee base. Final tasting note pending owner approval." },
  { name: "White", category: "Coffee", price: "RM10", status: "from-menu-reference", note: "Milk coffee option. Recipe details to confirm." },
  { name: "Spanish Latte", category: "Coffee", price: "RM12", status: "from-menu-reference", note: "Suggested signature candidate. Owner to confirm priority." },
  { name: "Nutella Latte", category: "Coffee", price: "RM15", status: "from-menu-reference", note: "Dessert-style coffee. Ingredient claim pending approval." },
  { name: "Yuzu Black", category: "Coffee", price: "RM15", status: "from-menu-reference", note: "Bright black coffee idea. Availability to confirm." },
  { name: "Matcha Latte", category: "Matcha", price: "RM13", status: "from-menu-reference", note: "Core matcha drink. Matcha origin not stated." },
  { name: "Earl Grey Matcha", category: "Matcha", price: "RM14", status: "from-menu-reference", note: "Tea-forward matcha. Final description pending." },
  { name: "Oreo Matcha", category: "Matcha", price: "RM14", status: "from-menu-reference", note: "Crunch add-on direction. Owner to confirm copy." },
  { name: "Oreo Earl Grey Matcha", category: "Matcha", price: "RM15", status: "from-menu-reference", note: "Layered matcha option. Availability to confirm." },
  { name: "Chocolate Mousse", category: "Chocolate", price: "RM14", status: "from-menu-reference", note: "Creamy chocolate direction. Recipe details pending." },
  { name: "Earl Grey Chocolate", category: "Chocolate", price: "RM15", status: "from-menu-reference", note: "Tea and cocoa pairing. Owner to approve." },
  { name: "Oreo Chocolate", category: "Chocolate", price: "RM15", status: "from-menu-reference", note: "Dessert chocolate option. Final copy pending." },
  { name: "Strawberry Matcha", category: "Seasonal", price: "RM18", status: "from-menu-reference", note: "Seasonal-drop candidate only. Do not present as current until confirmed." },
  { name: "Hojicha Latte", category: "Seasonal", price: "RM15", status: "from-menu-reference", note: "Seasonal or menu status needs owner confirmation." }
];

export const signatureItems = [
  "Spanish Latte",
  "Strawberry Matcha",
  "Earl Grey Matcha",
  "Chocolate Mousse"
];

export const placeholders = {
  logo: "PLACEHOLDER: exact MOC logo and bear mark needed from owner.",
  founder: "PLACEHOLDER: founder name, preferred privacy level, approved portrait/Reel still, and story pending owner approval.",
  kitchen: "PLACEHOLDER: real kitchen/process photos or short Reel clips needed.",
  instagram: "PLACEHOLDER: approved Instagram posts/Reels and usage rights needed.",
  ordering: "PLACEHOLDER: DM wording, pickup/delivery, payment, minimum order, and notice time pending owner confirmation."
};

export const faqItems = [
  { q: "How do I order?", a: "Via Instagram DM. Exact order template and handle confirmation pending owner approval." },
  { q: "Is there a physical shop?", a: "Current brief positions Minus One as home-based and Instagram-only. Do not add a storefront address unless confirmed." },
  { q: "Are prices final?", a: "Menu examples are from the planning reference and should be checked before launch." },
  { q: "Can I use photos from Instagram?", a: "Only approved owner-provided or rights-cleared posts should replace the placeholders." }
];
