import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ProductImageSlider } from "../components/ProductImageSlider";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../hooks/useLanguage";
import { useWishlist } from "../hooks/useWishlist";
import type {
  CustomizationOptions,
  GarmentCategory,
  ProductListing,
} from "../types/catalog";

// ─── Mock Data ───────────────────────────────────────────────────────────────

interface MockProduct {
  id: string;
  name: string;
  nameHi: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  category: GarmentCategory;
  isHoli?: boolean;
}

const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "1",
    name: "Holi Special Kurta",
    nameHi: "होली स्पेशल कुर्ता",
    price: 1299,
    originalPrice: 1800,
    rating: 4.8,
    reviews: 234,
    image: "/assets/uploads/product-jpeg-500x500-1.jpg",
    category: "Kurtas",
    isHoli: true,
  },
  {
    id: "2",
    name: "White Floral Anarkali Gown",
    nameHi: "सफेद फ्लोरल अनारकली गाउन",
    price: 3200,
    originalPrice: 4200,
    rating: 4.8,
    reviews: 187,
    image: "/assets/uploads/DSC3612_480x480-2.jpg",
    category: "Anarkalis",
  },
  {
    id: "3",
    name: "Tulip Print Kurti Set",
    nameHi: "ट्यूलिप प्रिंट कुर्ती सेट",
    price: 1699,
    originalPrice: 2200,
    rating: 4.7,
    reviews: 312,
    image: "/assets/uploads/BHKS411_5_480x480-3.jpg",
    category: "Kurtas",
  },
  {
    id: "4",
    name: "Yellow Embroidered Suit",
    nameHi: "पीली कढ़ाई वाली सूट",
    price: 2899,
    originalPrice: 3800,
    rating: 4.9,
    reviews: 156,
    image: "/assets/uploads/04-11-22-255_1-e1677751648409-1--4.png",
    category: "Suits",
  },
  {
    id: "5",
    name: "Cream Embroidered Salwar Set",
    nameHi: "क्रीम कढ़ाई सलवार सेट",
    price: 2499,
    originalPrice: 3200,
    rating: 4.6,
    reviews: 89,
    image: "/assets/uploads/Thumb-33-5.png",
    category: "Suits",
  },
  {
    id: "6",
    name: "Magenta Blazer Pant Set",
    nameHi: "मैजेंटा ब्लेज़र पैंट सेट",
    price: 3800,
    originalPrice: 5000,
    rating: 4.8,
    reviews: 203,
    image: "/assets/uploads/IMG-20240831-WA0271-6.jpg",
    category: "Suits",
  },
  {
    id: "7",
    name: "White Kurta with Rainbow Dupatta",
    nameHi: "सफेद कुर्ता रेनबो दुपट्टे के साथ",
    price: 1899,
    originalPrice: 2500,
    rating: 4.7,
    reviews: 142,
    image: "/assets/uploads/7373499a44f590596c58bde0def45fee-7.jpg",
    category: "Kurtas",
    isHoli: true,
  },
  {
    id: "8",
    name: "Yellow Chikankari Suit",
    nameHi: "पीली चिकनकारी सूट",
    price: 2800,
    originalPrice: 3600,
    rating: 4.7,
    reviews: 98,
    image: "/assets/uploads/04-11-22-255_1-e1677751648409-8.png",
    category: "Suits",
  },
  {
    id: "9",
    name: "Holi White Outfit",
    nameHi: "होली व्हाइट आउटफिट",
    price: 1599,
    originalPrice: 2100,
    rating: 4.8,
    reviews: 267,
    image:
      "/assets/uploads/white-holi-outfit-ideas-bewakoof-blog-6-1616348772-9.jpg",
    category: "Kurtas",
    isHoli: true,
  },
  {
    id: "10",
    name: "Beige Floral Straight Kurta",
    nameHi: "बेज फ्लोरल स्ट्रेट कुर्ता",
    price: 2200,
    originalPrice: 2900,
    rating: 4.5,
    reviews: 73,
    image: "/assets/uploads/1_279_483-10.jpg",
    category: "Kurtas",
  },
  {
    id: "11",
    name: "Floral Anarkali Set",
    nameHi: "फ्लोरल अनारकली सेट",
    price: 2499,
    originalPrice: 3200,
    rating: 4.8,
    reviews: 189,
    image: "/assets/uploads/IMG-20240831-WA0271-1-11.jpg",
    category: "Anarkalis",
  },
  {
    id: "12",
    name: "Designer Formal Shirt",
    nameHi: "डिज़ाइनर फॉर्मल शर्ट",
    price: 1800,
    originalPrice: 2400,
    rating: 4.7,
    reviews: 134,
    image: "/assets/uploads/w66_2048x-12.jpg",
    category: "Suits",
  },
  {
    id: "13",
    name: "White Floral Anarkali",
    nameHi: "व्हाइट फ्लोरल अनारकली",
    price: 2999,
    originalPrice: 3900,
    rating: 4.9,
    reviews: 211,
    image: "/assets/uploads/thumb1-2-1--13.png",
    category: "Anarkalis",
  },
  {
    id: "14",
    name: "Floral Straight Suit",
    nameHi: "फ्लोरल स्ट्रेट सूट",
    price: 2100,
    originalPrice: 2800,
    rating: 4.6,
    reviews: 65,
    image: "/assets/uploads/pht0080.1-e1676355837849-14.png",
    category: "Suits",
  },
  {
    id: "15",
    name: "White Anarkali with Dupatta",
    nameHi: "सफेद अनारकली दुपट्टे के साथ",
    price: 2400,
    originalPrice: 3200,
    rating: 4.7,
    reviews: 108,
    image: "/assets/uploads/thumb1-2-16.png",
    category: "Anarkalis",
  },
  {
    id: "16",
    name: "Floral Embroidered Anarkali",
    nameHi: "फ्लोरल कढ़ाई अनारकली",
    price: 3100,
    originalPrice: 4100,
    rating: 4.9,
    reviews: 322,
    image: "/assets/uploads/60-18.png",
    category: "Anarkalis",
  },
  {
    id: "17",
    name: "Designer Mens Sherwani",
    nameHi: "डिज़ाइनर मेन्स शेरवानी",
    price: 4200,
    originalPrice: 5500,
    rating: 4.8,
    reviews: 154,
    image:
      "/assets/uploads/Summer-African-Men-s-Traditional-Elegant-Suits-Outfit-Dashiki-2pcs-Shirt-Pants-Full-Set-Designer-Clothes-3-off-17.jpg",
    category: "Sherwanis",
  },
  {
    id: "18",
    name: "Magenta Party Blazer",
    nameHi: "मैजेंटा पार्टी ब्लेज़र",
    price: 3600,
    originalPrice: 4800,
    rating: 4.7,
    reviews: 176,
    image: "/assets/uploads/7373499a44f590596c58bde0def45fee-7.jpg",
    category: "Suits",
  },
  {
    id: "19",
    name: "Satin Embellished Shirt",
    nameHi: "साटिन एम्बेलिश्ड शर्ट",
    price: 2800,
    originalPrice: 3700,
    rating: 4.6,
    reviews: 91,
    image: "/assets/uploads/IMG-20240831-WA0271-6.jpg",
    category: "Suits",
  },
  {
    id: "20",
    name: "Holi Kurta Pyjama",
    nameHi: "होली कुर्ता पायजामा",
    price: 1750,
    originalPrice: 2300,
    rating: 4.8,
    reviews: 243,
    image: "/assets/uploads/product-jpeg-500x500-1.jpg",
    category: "Kurtas",
    isHoli: true,
  },
  {
    id: "21",
    name: "Black 3-Piece Men's Suit",
    nameHi: "ब्लैक 3-पीस मेन्स सूट",
    price: 6500,
    originalPrice: 8500,
    rating: 4.9,
    reviews: 312,
    image: "/assets/uploads/64ba00a676ac56d55c9eb0e00753d34d-1.jpg",
    category: "Suits",
  },
  {
    id: "22",
    name: "Brown Casual Shirt + White Pant Combo",
    nameHi: "ब्राउन कैजुअल शर्ट + व्हाइट पैंट कॉम्बो",
    price: 2200,
    originalPrice: 2900,
    rating: 4.7,
    reviews: 198,
    image: "/assets/uploads/b1a61a0c6ba53cf3b7bdbfff49f9a366-2.jpg",
    category: "Shirts",
  },
  {
    id: "23",
    name: "Grey Striped Mandarin Kurta Set",
    nameHi: "ग्रे स्ट्राइप्ड मंदारिन कुर्ता सेट",
    price: 2400,
    originalPrice: 3100,
    rating: 4.7,
    reviews: 143,
    image: "/assets/uploads/94ebd87a4d9ea257781f1b60ec0480cc-3.jpg",
    category: "Kurtas",
  },
  {
    id: "24",
    name: "Yellow Indo-Western Sherwani",
    nameHi: "येलो इंडो-वेस्टर्न शेरवानी",
    price: 7800,
    originalPrice: 10000,
    rating: 4.9,
    reviews: 267,
    image: "/assets/uploads/e117de0a390bbfa6d30a1b3f105954e9-4.jpg",
    category: "Sherwanis",
  },
  {
    id: "25",
    name: "Pink Ombre Crop Top + Palazzo Set",
    nameHi: "पिंक ओम्ब्रे क्रॉप टॉप + पलाज़ो सेट",
    price: 3200,
    originalPrice: 4200,
    rating: 4.8,
    reviews: 189,
    image: "/assets/uploads/c9ff3c69bdbd9915f730b97843ca99f3-5.jpg",
    category: "Lehengas",
  },
  {
    id: "26",
    name: "Sage Green Jacket + White Tee Outfit",
    nameHi: "सेज ग्रीन जैकेट + व्हाइट टी आउटफिट",
    price: 2800,
    originalPrice: 3600,
    rating: 4.6,
    reviews: 112,
    image: "/assets/uploads/7d92562c11c102068baf82a60bc892e8-6.jpg",
    category: "Suits",
  },
  {
    id: "27",
    name: "Holi Color Splash Kaftan Top",
    nameHi: "होली कलर स्प्लैश काफ्तान टॉप",
    price: 1800,
    originalPrice: 2400,
    rating: 4.8,
    reviews: 231,
    image: "/assets/uploads/763b50815ee566fd6bfed3a6db4a4a92-7.jpg",
    category: "Kurtas",
    isHoli: true,
  },
  {
    id: "28",
    name: "Blue Floral Embroidered Blazer Set",
    nameHi: "ब्लू फ्लोरल एम्ब्रॉयडर्ड ब्लेज़र सेट",
    price: 5200,
    originalPrice: 6800,
    rating: 4.8,
    reviews: 174,
    image: "/assets/uploads/5638a25b21c90f9d84ee7d15db1c432b-8.jpg",
    category: "Suits",
  },
  {
    id: "29",
    name: "Yellow Studded Denim Jacket",
    nameHi: "येलो स्टडेड डेनिम जैकेट",
    price: 1900,
    originalPrice: 2500,
    rating: 4.6,
    reviews: 98,
    image: "/assets/uploads/07ad2bbe06e2c5c14514e9c731a0f5c9-9.jpg",
    category: "Shirts",
  },
  {
    id: "30",
    name: "Silver Grey Sharara Set",
    nameHi: "सिल्वर ग्रे शरारा सेट",
    price: 4500,
    originalPrice: 5800,
    rating: 4.9,
    reviews: 256,
    image: "/assets/uploads/ac77432e9e6c46cd187682481a144dc8-10.jpg",
    category: "Lehengas",
  },
  {
    id: "31",
    name: "Pink Floral Halter Layered Palazzo",
    nameHi: "पिंक फ्लोरल हल्टर लेयर्ड पलाज़ो",
    price: 3800,
    originalPrice: 4900,
    rating: 4.8,
    reviews: 167,
    image: "/assets/uploads/9403db08bab44aa249b44bdb47866d70-11.jpg",
    category: "Lehengas",
  },
  {
    id: "32",
    name: "Navy Blue Printed Co-ord Set",
    nameHi: "नेवी ब्लू प्रिंटेड को-ऑर्ड सेट",
    price: 2900,
    originalPrice: 3800,
    rating: 4.7,
    reviews: 203,
    image: "/assets/uploads/16081b46bdd43d74dd6f6ca4b26afc96-12.jpg",
    category: "Suits",
  },
  {
    id: "33",
    name: "Yellow Embroidered Peplum + Palazzo",
    nameHi: "येलो एम्ब्रॉयडर्ड पेप्लम + पलाज़ो",
    price: 4200,
    originalPrice: 5500,
    rating: 4.9,
    reviews: 289,
    image: "/assets/uploads/1a8d07aec4c17aaafa7c08ff960176da-13.jpg",
    category: "Lehengas",
  },
  {
    id: "34",
    name: "Dark Green Embroidered Lehenga",
    nameHi: "डार्क ग्रीन एम्ब्रॉयडर्ड लहंगा",
    price: 6800,
    originalPrice: 8800,
    rating: 4.9,
    reviews: 312,
    image: "/assets/uploads/e808261334479a389e09d4da68d43d3a-14.jpg",
    category: "Lehengas",
  },
  {
    id: "35",
    name: "Red Gold Brocade Palazzo Suit",
    nameHi: "रेड गोल्ड ब्रोकेड पलाज़ो सूट",
    price: 5500,
    originalPrice: 7200,
    rating: 4.8,
    reviews: 198,
    image: "/assets/uploads/4cc2fafdd5cedb0ea060bbd9d91c67d2-15.jpg",
    category: "Lehengas",
  },
  {
    id: "36",
    name: "Multi-color Patched Palazzo Set",
    nameHi: "मल्टी-कलर पैच्ड पलाज़ो सेट",
    price: 3400,
    originalPrice: 4500,
    rating: 4.7,
    reviews: 143,
    image: "/assets/uploads/fd2af3d86fba2c2c88436469abe186fa-16.jpg",
    category: "Lehengas",
  },
  {
    id: "37",
    name: "Rust Orange Draped Saree-Style Set",
    nameHi: "रस्ट ऑरेंज ड्रेप्ड साड़ी-स्टाइल सेट",
    price: 4800,
    originalPrice: 6200,
    rating: 4.8,
    reviews: 187,
    image: "/assets/uploads/d3b7b1859552b88ede66c590078e4f9a-17.jpg",
    category: "Saree Blouses",
  },
  {
    id: "38",
    name: "Multi-color Rajasthani Lehenga",
    nameHi: "मल्टी-कलर राजस्थानी लहंगा",
    price: 7500,
    originalPrice: 9800,
    rating: 4.9,
    reviews: 423,
    image: "/assets/uploads/ce34ebc3b215a426ae5172e5529515a4-18.jpg",
    category: "Lehengas",
  },
  {
    id: "39",
    name: "Multi-color Patchwork Crop + Palazzo",
    nameHi: "मल्टी-कलर पैचवर्क क्रॉप + पलाज़ो",
    price: 3200,
    originalPrice: 4100,
    rating: 4.7,
    reviews: 156,
    image: "/assets/uploads/de7b802e56f7e8df72227edf2df37a68-19.jpg",
    category: "Lehengas",
  },
  {
    id: "40",
    name: "Green Embroidered Bridal Blouse",
    nameHi: "ग्रीन एम्ब्रॉयडर्ड ब्राइडल ब्लाउज",
    price: 2800,
    originalPrice: 3600,
    rating: 4.9,
    reviews: 234,
    image: "/assets/uploads/d7dbbb6f86417a410eaa5eb16166d09b-20.jpg",
    category: "Saree Blouses",
  },
  {
    id: "41",
    name: "Dark Green Floral Lehenga",
    nameHi: "डार्क ग्रीन फ्लोरल लहंगा",
    price: 8200,
    originalPrice: 10500,
    rating: 4.9,
    reviews: 367,
    image: "/assets/uploads/d42922b85ff0bf7cc8c1d415b105f493-21.jpg",
    category: "Lehengas",
  },
  {
    id: "42",
    name: "Multi-color Striped Lehenga Set",
    nameHi: "मल्टी-कलर स्ट्राइप्ड लहंगा सेट",
    price: 4200,
    originalPrice: 5500,
    rating: 4.8,
    reviews: 189,
    image: "/assets/uploads/245361151e2e85b0dd9a4e9960f6c98b-22.jpg",
    category: "Lehengas",
  },
  {
    id: "43",
    name: "Embroidered Patchwork Palazzo Co-ord",
    nameHi: "एम्ब्रॉयडर्ड पैचवर्क पलाज़ो को-ऑर्ड",
    price: 3600,
    originalPrice: 4700,
    rating: 4.8,
    reviews: 211,
    image: "/assets/uploads/21b73b58970133f307d57bc510b15cbc-23.jpg",
    category: "Lehengas",
  },
];

const BANNER_SLIDES_HI = [
  {
    id: "b0",
    bgGradient: "linear-gradient(135deg, #ff6b35, #f7c59f, #ef8c6f, #ff4e8a)",
    badge: "🎨 होली स्पेशल",
    title: "होली पर धमाकेदार छूट!",
    subtitle: "रंगों के त्योहार पर 40% तक की बचत करें",
    cta: "होली कलेक्शन देखें",
    image: "/assets/uploads/product-jpeg-500x500-1.jpg",
    discount: "40% OFF",
    isHoli: true,
  },
  {
    id: "b1",
    bgGradient: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
    badge: "🔥 सीमित ऑफर",
    title: "विशेष छूट: नई ड्रेस सिलाई!",
    subtitle: "कस्टम सिलाई पर ₹500 की बचत करें",
    cta: "अभी बुक करें",
    image: "/assets/uploads/DSC3612_480x480-2.jpg",
    discount: "25% OFF",
    isHoli: false,
  },
  {
    id: "b2",
    bgGradient: "linear-gradient(135deg, #2a2a2a, #404040)",
    badge: "✨ नया कलेक्शन",
    title: "अनारकली और सूट कलेक्शन",
    subtitle: "हस्त-निर्मित, प्रीमियम कपड़े",
    cta: "देखें",
    image: "/assets/uploads/BHKS411_5_480x480-3.jpg",
    discount: "NEW",
    isHoli: false,
  },
  {
    id: "b3",
    bgGradient: "linear-gradient(135deg, #1c1c1c, #383838)",
    badge: "👔 मेन्स स्पेशल",
    title: "शेरवानी और सूट सेल!",
    subtitle: "त्योहारों के लिए तैयार — ₹2999 से शुरू",
    cta: "शॉप करें",
    image:
      "/assets/uploads/Summer-African-Men-s-Traditional-Elegant-Suits-Outfit-Dashiki-2pcs-Shirt-Pants-Full-Set-Designer-Clothes-3-off-17.jpg",
    discount: "30% OFF",
    isHoli: false,
  },
  {
    id: "b4",
    bgGradient: "linear-gradient(135deg, #6b21a8, #9333ea, #c026d3)",
    badge: "💃 लेडीज़ स्पेशल",
    title: "लेडीज़ एक्सक्लूसिव कलेक्शन",
    subtitle: "पार्टी से लेकर वेडिंग तक — सब कुछ एक जगह",
    cta: "अभी देखें",
    image: "/assets/uploads/IMG-20240831-WA0271-6.jpg",
    discount: "35% OFF",
    isHoli: false,
  },
];

const BANNER_SLIDES_EN = [
  {
    id: "b0",
    bgGradient: "linear-gradient(135deg, #ff6b35, #f7c59f, #ef8c6f, #ff4e8a)",
    badge: "🎨 Holi Special",
    title: "Holi Mega Sale!",
    subtitle: "Save up to 40% this Festival of Colors",
    cta: "Shop Holi Collection",
    image: "/assets/uploads/product-jpeg-500x500-1.jpg",
    discount: "40% OFF",
    isHoli: true,
  },
  {
    id: "b1",
    bgGradient: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
    badge: "🔥 Limited Offer",
    title: "Special Discount: New Dress Stitching!",
    subtitle: "Save ₹500 on custom tailoring",
    cta: "Book Now",
    image: "/assets/uploads/DSC3612_480x480-2.jpg",
    discount: "25% OFF",
    isHoli: false,
  },
  {
    id: "b2",
    bgGradient: "linear-gradient(135deg, #2a2a2a, #404040)",
    badge: "✨ New Collection",
    title: "Anarkali & Suit Collection",
    subtitle: "Handcrafted, premium fabrics",
    cta: "View",
    image: "/assets/uploads/BHKS411_5_480x480-3.jpg",
    discount: "NEW",
    isHoli: false,
  },
  {
    id: "b3",
    bgGradient: "linear-gradient(135deg, #1c1c1c, #383838)",
    badge: "👔 Men's Special",
    title: "Sherwani & Suit Sale!",
    subtitle: "Festival-ready — starting ₹2999",
    cta: "Shop Now",
    image:
      "/assets/uploads/Summer-African-Men-s-Traditional-Elegant-Suits-Outfit-Dashiki-2pcs-Shirt-Pants-Full-Set-Designer-Clothes-3-off-17.jpg",
    discount: "30% OFF",
    isHoli: false,
  },
  {
    id: "b4",
    bgGradient: "linear-gradient(135deg, #6b21a8, #9333ea, #c026d3)",
    badge: "💃 Ladies Special",
    title: "Ladies Exclusive Collection",
    subtitle: "From party wear to bridal — all in one place",
    cta: "Shop Now",
    image: "/assets/uploads/IMG-20240831-WA0271-6.jpg",
    discount: "35% OFF",
    isHoli: false,
  },
];

const CATEGORIES_HI = [
  { name: "कुर्ता", emoji: "🧥", cat: "Kurtas" },
  { name: "अनारकली", emoji: "👗", cat: "Anarkalis" },
  { name: "लहंगा", emoji: "✨", cat: "Lehengas" },
  { name: "सूट", emoji: "🤵", cat: "Suits" },
  { name: "शेरवानी", emoji: "👘", cat: "Sherwanis" },
  { name: "साड़ी ब्लाउज", emoji: "🌸", cat: "Saree Blouses" },
  { name: "ट्राउजर", emoji: "👖", cat: "Trousers" },
];

const CATEGORIES_EN = [
  { name: "Kurta", emoji: "🧥", cat: "Kurtas" },
  { name: "Anarkali", emoji: "👗", cat: "Anarkalis" },
  { name: "Lehenga", emoji: "✨", cat: "Lehengas" },
  { name: "Suit", emoji: "🤵", cat: "Suits" },
  { name: "Sherwani", emoji: "👘", cat: "Sherwanis" },
  { name: "Saree Blouse", emoji: "🌸", cat: "Saree Blouses" },
  { name: "Trouser", emoji: "👖", cat: "Trousers" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold bg-green-600 text-white">
      {rating}
      <Star className="h-2.5 w-2.5 fill-white" />
    </span>
  );
}

function DiscountPercent({
  original,
  current,
}: { original: number; current: number }) {
  const { language } = useLanguage();
  const pct = Math.round(((original - current) / original) * 100);
  return (
    <span className="text-xs font-semibold text-green-600">
      {pct}
      {language === "hi" ? "% छूट" : "% OFF"}
    </span>
  );
}

function TrendingCard({ product }: { product: MockProduct }) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { language } = useLanguage();
  const wishlisted = isWishlisted(product.id);
  const displayName = language === "hi" ? product.nameHi : product.name;

  return (
    <button
      type="button"
      className="snap-item shrink-0 w-36 bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow cursor-pointer group text-left"
      onClick={() =>
        navigate({ to: "/listings/$id", params: { id: product.id } })
      }
      aria-label={`${displayName} view`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={displayName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-1.5 left-1.5">
          <span className="trending-badge text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
            <TrendingUp className="h-2.5 w-2.5" />
            {language === "hi" ? "ट्रेंडिंग" : "Trending"}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({
              id: product.id,
              title: displayName,
              price: product.price,
              category: product.category,
              imageUrl: product.image,
            });
            if (!wishlisted)
              toast.success(
                language === "hi"
                  ? `${product.nameHi} विश लिस्ट में जोड़ा! ❤️`
                  : `${product.name} added to wishlist! ❤️`,
              );
          }}
          className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
          aria-label={
            wishlisted
              ? language === "hi"
                ? "Wishlist से हटाएं"
                : "Remove from wishlist"
              : language === "hi"
                ? "Wishlist में जोड़ें"
                : "Add to wishlist"
          }
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              wishlisted ? "fill-red-500 text-red-500" : "text-gray-400",
            )}
          />
        </button>
      </div>
      {/* Info */}
      <div className="p-2">
        <p className="text-xs font-body font-medium text-foreground truncate">
          {displayName}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <StarRating rating={product.rating} />
          <span className="text-[10px] text-muted-foreground">
            ({product.reviews})
          </span>
        </div>
        <p className="text-sm font-display font-bold text-foreground mt-1">
          ₹{product.price.toLocaleString("hi-IN")}
        </p>
        <p className="text-[10px] text-muted-foreground line-through">
          ₹{product.originalPrice.toLocaleString("hi-IN")}
        </p>
      </div>
    </button>
  );
}

function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
}: {
  product: MockProduct;
  onAddToCart: (id: string) => void;
  onBuyNow: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { language } = useLanguage();
  const wishlisted = isWishlisted(product.id);

  const productImages = [product.image];

  return (
    <div className="bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-200 cursor-pointer group flex flex-col">
      {/* Image with slider */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted w-full">
        <ProductImageSlider
          images={productImages}
          productId={product.id}
          onTap={() =>
            navigate({ to: "/listings/$id", params: { id: product.id } })
          }
          className="w-full h-full"
        />
        {product.isHoli ? (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none z-10 flex items-center gap-0.5">
            🎨 {language === "hi" ? "होली" : "HOLI"}
          </span>
        ) : (
          <span className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-sm pointer-events-none z-10">
            {Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100,
            )}
            % OFF
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const displayName =
              language === "hi" ? product.nameHi : product.name;
            toggleWishlist({
              id: product.id,
              title: displayName,
              price: product.price,
              category: product.category,
              imageUrl: product.image,
            });
            if (!wishlisted)
              toast.success(
                language === "hi"
                  ? `${product.nameHi} विश लिस्ट में जोड़ा! ❤️`
                  : `${product.name} added to wishlist! ❤️`,
              );
          }}
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 dark:bg-card/90 flex items-center justify-center shadow-sm hover:bg-white dark:hover:bg-card transition-colors z-10"
          aria-label={
            wishlisted
              ? language === "hi"
                ? "Wishlist से हटाएं"
                : "Remove from wishlist"
              : language === "hi"
                ? "Wishlist में जोड़ें"
                : "Add to wishlist"
          }
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              wishlisted ? "fill-red-500 text-red-500" : "text-gray-400",
            )}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-body font-semibold text-foreground mt-0.5 truncate">
          {language === "hi" ? product.nameHi : product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price row */}
        <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-base font-display font-bold text-foreground">
            ₹{product.price.toLocaleString("hi-IN")}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.originalPrice.toLocaleString("hi-IN")}
          </span>
          <DiscountPercent
            original={product.originalPrice}
            current={product.price}
          />
        </div>

        {/* Buttons */}
        <div className="mt-2 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onAddToCart(product.id)}
            className="w-full py-1.5 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold font-body flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {language === "hi" ? "कार्ट में जोड़ें" : "Add to Cart"}
          </button>
          <button
            type="button"
            onClick={() => onBuyNow(product.id)}
            className="w-full py-1.5 px-3 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold font-body flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
          >
            <Zap className="h-3.5 w-3.5" />
            {language === "hi" ? "अभी खरीदें" : "Buy It Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Banner ──────────────────────────────────────────────────────────────────

function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const BANNER_SLIDES = language === "hi" ? BANNER_SLIDES_HI : BANNER_SLIDES_EN;
  const total = BANNER_SLIDES.length;
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDragging = useRef(false);

  const startAutoSlide = useCallback(() => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3000);
  }, [total]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [startAutoSlide]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % total) + total) % total);
      startAutoSlide();
    },
    [startAutoSlide, total],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > deltaY) {
      isDragging.current = true;
      if (deltaX > 0) {
        // swiped left → next slide
        setActiveIndex((prev) => (prev + 1) % total);
      } else {
        // swiped right → prev slide
        setActiveIndex((prev) => (prev - 1 + total) % total);
      }
    }
    startAutoSlide();
  };

  const handleSlideClick = () => {
    if (!isDragging.current) {
      navigate({ to: "/catalog" });
    }
    isDragging.current = false;
  };

  return (
    <section
      className="relative overflow-hidden select-none"
      aria-label="Promotional banners"
      data-ocid="home.hero_banner.section"
    >
      {/* Holi color splash particles for Holi slide */}
      {BANNER_SLIDES[activeIndex]?.isHoli && (
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
          {[
            "#ff5733",
            "#ffcc00",
            "#33cc66",
            "#3399ff",
            "#cc33ff",
            "#ff6699",
          ].map((color, i) => (
            <div
              key={color}
              className="absolute rounded-full opacity-50"
              style={{
                width: `${20 + i * 8}px`,
                height: `${20 + i * 8}px`,
                background: color,
                top: `${10 + i * 12}%`,
                left: `${5 + i * 14}%`,
                filter: "blur(2px)",
                animation: `float-${i} 3s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* Outer container — clips overflow, enables touch */}
      <div
        className="overflow-hidden"
        style={{ minHeight: "200px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding track — width = N × 100%, each slide = 1/N width */}
        <div
          className="flex"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(-${(activeIndex * 100) / total}%)`,
            transition: "transform 0.5s ease-in-out",
            willChange: "transform",
          }}
        >
          {BANNER_SLIDES.map((slide) => (
            /* biome-ignore lint/a11y/useKeyWithClickEvents: swipe slider handles keyboard via document */
            <div
              key={slide.id}
              className="relative flex items-center text-left cursor-pointer"
              style={{
                background: slide.bgGradient,
                width: `${100 / total}%`,
                minHeight: "200px",
                flexShrink: 0,
              }}
              onClick={handleSlideClick}
              aria-label={slide.title}
            >
              {/* Right side product image */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 pointer-events-none">
                <img
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover object-top opacity-55 sm:opacity-70"
                  loading="eager"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              </div>

              {/* Text Content */}
              <div className="relative z-10 px-4 sm:px-8 py-6 max-w-[62%] sm:max-w-[55%]">
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2.5 py-1 rounded-full border",
                      slide.isHoli
                        ? "bg-white/30 text-white border-white/40 backdrop-blur-sm"
                        : "bg-white/20 text-white/90 border-white/20 backdrop-blur-sm",
                    )}
                  >
                    {slide.badge}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-white text-xs font-bold px-2.5 py-1 rounded-full",
                      slide.isHoli ? "bg-orange-500" : "bg-secondary",
                    )}
                  >
                    <Zap className="h-3 w-3" />
                    {slide.discount}
                  </span>
                </div>
                <h2 className="font-display font-bold text-white text-lg sm:text-2xl leading-tight mb-2 drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-white/85 text-xs sm:text-sm font-body mb-4 drop-shadow-sm">
                  {slide.subtitle}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: "/catalog" });
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 font-semibold text-xs sm:text-sm px-4 py-2 rounded-full active:scale-95 transition-all shadow-md",
                    slide.isHoli
                      ? "bg-orange-500 text-white hover:bg-orange-400"
                      : "bg-white text-primary hover:bg-white/95",
                  )}
                >
                  {slide.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {BANNER_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            className={cn(
              "rounded-full transition-all duration-300",
              i === activeIndex ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50",
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Helpers (outside component to avoid re-creation) ────────────────────────

function buildListing(product: MockProduct): ProductListing {
  return {
    id: product.id,
    tailorId: "demo-tailor",
    tailorName: "Fit Also Studio",
    tailorCity: "Mumbai",
    category: product.category,
    title: product.name,
    description: product.nameHi,
    basePrice: product.price,
    estimatedDays: 14,
    availableNeckStyles: ["round", "vNeck", "mandarin"],
    availableSleeveStyles: ["full", "half", "sleeveless"],
    availableFabrics: ["cotton", "silk", "linen"],
    availableColors: ["ivory", "red", "navy"],
    availableWorkTypes: ["plain", "embroidery", "zari"],
    imageUrl: product.image,
    createdAt: Date.now(),
  };
}

const DEFAULT_CUSTOMIZATION: CustomizationOptions = {
  neckStyle: "round",
  sleeveStyle: "full",
  fabricType: "cotton",
  colorPattern: "ivory",
  workType: "plain",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { language } = useLanguage();
  const CATEGORIES = language === "hi" ? CATEGORIES_HI : CATEGORIES_EN;

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(8);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => {
            // Loop infinitely by cycling through products
            return prev + 6;
          });
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = useCallback(
    (productId: string) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === productId);
      if (!product) return;
      addItem(buildListing(product), DEFAULT_CUSTOMIZATION);
      toast.success(
        language === "hi"
          ? `${product.nameHi} कार्ट में जोड़ा गया! 🛒`
          : `${product.name} added to cart! 🛒`,
      );
    },
    [addItem, language],
  );

  const handleBuyNow = useCallback(
    (productId: string) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === productId);
      if (!product) return;
      const item = {
        listing: buildListing(product),
        customization: DEFAULT_CUSTOMIZATION,
      };
      try {
        sessionStorage.setItem("buyNowItem", JSON.stringify(item));
      } catch {}
      navigate({ to: "/checkout", search: { mode: "buynow" } as any });
    },
    [navigate],
  );

  return (
    <div className="pb-safe animate-fade-in bg-background">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Holi Special Section */}
      <section
        className="mx-3 mt-3 mb-1 rounded-2xl overflow-hidden relative"
        aria-label="Holi Special offers"
        style={{
          background:
            "linear-gradient(135deg, #ff6b35 0%, #ffd166 30%, #ef8c6f 55%, #ff4e8a 80%, #b848ff 100%)",
        }}
      >
        {/* Decorative color splashes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            "#ff3d3d",
            "#ffeb3b",
            "#4caf50",
            "#2196f3",
            "#9c27b0",
            "#ff9800",
          ].map((c, i) => (
            <div
              key={c}
              className="absolute rounded-full opacity-30"
              style={{
                width: `${30 + i * 10}px`,
                height: `${30 + i * 10}px`,
                background: c,
                top: `${-5 + i * 15}%`,
                right: `${2 + i * 8}%`,
                filter: "blur(3px)",
              }}
            />
          ))}
        </div>
        <div className="relative z-10 px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-white text-lg font-bold">🎨</span>
              <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                {language === "hi" ? "होली स्पेशल 2026" : "Holi Special 2026"}
              </span>
            </div>
            <h3 className="text-white font-display font-bold text-base leading-tight drop-shadow">
              {language === "hi" ? "रंगों का जश्न!" : "Celebrate Colors!"}
            </h3>
            <p className="text-white/90 text-xs mt-0.5 font-body">
              {language === "hi"
                ? "होली पर 40% तक छूट — सीमित समय के लिए"
                : "Up to 40% off for Holi — limited time"}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              {["#ff3d3d", "#ffeb3b", "#4caf50", "#2196f3", "#9c27b0"].map(
                (c) => (
                  <div
                    key={c}
                    className="w-4 h-4 rounded-full border-2 border-white/60"
                    style={{ background: c }}
                  />
                ),
              )}
              <span className="text-white/80 text-[10px] font-semibold ml-0.5">
                {language === "hi" ? "रंग-बिरंगे कपड़े" : "Colorful Outfits"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="shrink-0 bg-white text-orange-600 font-bold text-xs px-4 py-2.5 rounded-full shadow-lg hover:bg-orange-50 active:scale-95 transition-all"
          >
            {language === "hi" ? "देखें" : "Shop"}
          </button>
        </div>
      </section>

      {/* Category Row */}
      <section
        className="bg-background py-4 px-3 border-b border-border"
        aria-label="Product categories"
      >
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none snap-scroll pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.cat}
              type="button"
              onClick={() =>
                navigate({
                  to: "/catalog",
                  search: { category: cat.cat } as any,
                })
              }
              className="snap-item shrink-0 flex flex-col items-center gap-1.5 min-w-[56px]"
              aria-label={`${cat.name} देखें`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center text-2xl border border-primary/10">
                {cat.emoji}
              </div>
              <span className="text-[10px] font-body font-medium text-foreground text-center leading-tight whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section
        className="bg-background mt-2 py-4"
        aria-label="Trending products"
      >
        <div className="flex items-center justify-between px-3 mb-3">
          <div>
            <h2 className="font-display font-bold text-foreground text-base leading-tight">
              {language === "hi" ? "आज का ट्रेंडिंग" : "Today's Trending"}
            </h2>
            <p className="text-xs font-body text-muted-foreground mt-0.5">
              {language === "hi"
                ? "हाईएस्ट रेटेड डिज़ाइन्स"
                : "Highest Rated Designs"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="flex items-center gap-0.5 text-primary text-xs font-semibold"
          >
            {language === "hi" ? "सभी देखें" : "View All"}{" "}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto snap-scroll px-3 pb-2 scrollbar-none">
          {MOCK_PRODUCTS.map((product) => (
            <TrendingCard key={product.id} product={product} />
          ))}
          {/* View all card */}
          <button
            type="button"
            className="snap-item shrink-0 w-36 bg-primary/5 rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-2 border border-primary/20 hover:bg-primary/10 transition-colors"
            onClick={() => navigate({ to: "/catalog" })}
            aria-label="View all trending products"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-primary text-center px-2">
              {language === "hi" ? "और देखें" : "View More"}
            </p>
          </button>
        </div>
      </section>

      {/* Promo Strip */}
      <section className="mx-3 my-2" aria-label="Free delivery promotion">
        <div className="bg-primary rounded-xl p-4 flex items-center justify-between overflow-hidden relative">
          <div
            className="absolute right-0 inset-y-0 w-24 opacity-10 pointer-events-none"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              fill="white"
              role="presentation"
            >
              <circle cx="80" cy="20" r="40" />
              <circle cx="20" cy="80" r="30" />
            </svg>
          </div>
          <div className="relative">
            <p className="text-white font-display font-bold text-sm">
              {language === "hi" ? "फ्री डिलीवरी" : "Free Delivery"}
            </p>
            <p className="text-white/80 text-xs font-body mt-0.5">
              {language === "hi"
                ? "₹999+ के ऑर्डर पर फ्री डिलीवरी"
                : "Free delivery on orders ₹999+"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="relative shrink-0 bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/95 transition-colors"
          >
            {language === "hi" ? "शॉप करें" : "Shop Now"}
          </button>
        </div>
      </section>

      {/* Featured Designs — 2-column grid */}
      <section
        className="bg-background mt-2 py-4"
        aria-label="Featured designs"
      >
        <div className="flex items-center justify-between px-3 mb-3">
          <div>
            <h2 className="font-display font-bold text-foreground text-base leading-tight">
              {language === "hi" ? "हमारे चुनिंदा डिज़ाइन्स" : "Featured Designs"}
            </h2>
            <p className="text-xs font-body text-muted-foreground mt-0.5">
              {language === "hi" ? "बेस्ट सेलर्स" : "Best Sellers"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="flex items-center gap-0.5 text-primary text-xs font-semibold"
          >
            {language === "hi" ? "सभी देखें" : "View All"}{" "}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 px-3">
          {Array.from({ length: visibleCount }, (_, i) => {
            const product = MOCK_PRODUCTS[i % MOCK_PRODUCTS.length];
            return (
              <ProductCard
                key={`${product.id}-${i}`}
                product={{ ...product, id: `${product.id}-${i}` }}
                onAddToCart={() => handleAddToCart(product.id)}
                onBuyNow={() => handleBuyNow(product.id)}
              />
            );
          })}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4 mt-2" aria-hidden="true" />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-2 px-4 py-6">
        <div className="flex flex-col items-center gap-3">
          <span className="font-display font-extrabold text-xl tracking-widest text-white">
            FIT ALSO
          </span>
          <p className="text-white/60 text-xs font-body text-center max-w-xs">
            India's premier custom tailoring marketplace — crafted with love.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-body text-white/60">
            <button
              type="button"
              className="hover:text-white transition-colors"
            >
              About
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors"
            >
              Contact
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors"
            >
              Privacy
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors"
            >
              Terms
            </button>
          </div>
          <p className="text-white/40 text-[10px] font-body text-center mt-2">
            © {new Date().getFullYear()} Fit Also. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
