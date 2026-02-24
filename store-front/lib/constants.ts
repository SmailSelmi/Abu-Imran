import { Egg, Bird, Drill, type LucideIcon } from "lucide-react";

export interface CategoryInfo {
  name: string;
  name_ar: string;
  icon: LucideIcon;
  image: string;
  variants: string[];
  variantLabel: string;
  basePrice: number;
}

export const BREED_FAMILIES = [
  {
    id: "australorp",
    name_ar: "أسترالورب",
    name_en: "Australorp",
    image: "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619701/Australorp_Chicks_n30igr.webp",
    breeds: ["أسترالورب محسن أسود", "أسترالورب محسن رمادي"],
    slugs: ["australorp-black", "australorp-grey"],
  },
  {
    id: "new-hampshire",
    name_ar: "نيوهامبشير",
    name_en: "New Hampshire",
    image: "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771339479/03-fertilized-eggs_kbgqer.jpg",
    breeds: ["نيوهامبشير الطوق الأسود"],
    slugs: ["new-hampshire-black-collar"],
  },
  {
    id: "plymouth-rock",
    name_ar: "بلايموث روك",
    name_en: "Plymouth Rock",
    image: "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg",
    breeds: ["بليموث روك باري", "بليموث روك سيلفر"],
    slugs: ["plymouth-rock-barred", "plymouth-rock-silver"],
  },
  {
    id: "sussex-rhode-island",
    name_ar: "سيساكس / رود آيلاند",
    name_en: "Sussex & Rhode Island",
    image: "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg",
    breeds: ["سيساكس أرميني", "رود آيلاند أكاجو"],
    slugs: ["sussex-armenian", "rhode-island-akaju"],
  },
  {
    id: "sprite",
    name_ar: "سبرايت أنيق",
    name_en: "Sprite",
    image: "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619701/Australorp_Chicks_n30igr.webp",
    breeds: ["سبرايت أنيق ذهبي", "سبرايت أنيق ليموني", "سبرايت أنيق فضي"],
    slugs: ["sprite-gold", "sprite-lemon", "sprite-silver"],
  },
  {
    id: "brahma",
    name_ar: "براهما",
    name_en: "Brahma",
    image: "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg",
    breeds: [
      "براهما أرميني",
      "براهما كولومبي",
      "براهما نوار كوربو",
      "براهما ميل فلور",
      "براهما أزرق",
      "براهما كايوتي",
    ],
    slugs: [
      "brahma-armenian",
      "brahma-columbian",
      "brahma-noir-corbeau",
      "brahma-mille-fleur",
      "brahma-blue",
      "brahma-coyote",
    ],
  },
];

export const SHARED_BREEDS = [
  "أسترالورب محسن أسود",
  "أسترالورب محسن رمادي",
  "نيوهامبشير الطوق الأسود",
  "بليموث روك باري",
  "بليموث روك سيلفر",
  "سيساكس أرميني",
  "رود آيلاند أكاجو",
  "سبرايت أنيق ذهبي",
  "سبرايت أنيق ليموني",
  "سبرايت أنيق فضي",
  "براهما أرميني",
  "براهما كولومبي",
  "براهما نوار كوربو",
  "براهما ميل فلور",
  "براهما أزرق",
  "براهما كايوتي",
];

export const CATEGORY_DATA: Record<string, CategoryInfo> = {
  eggs: {
    name: "بيض مخصب",
    name_ar: "بيض مخصب",
    icon: Egg,
    image:
      "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771339479/03-fertilized-eggs_kbgqer.jpg",
    variants: SHARED_BREEDS,
    variantLabel: "اختر السلالة",
    basePrice: 150,
  },
  chicks: {
    name: "كتاكيت",
    name_ar: "كتاكيت",
    icon: Bird,
    image:
      "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619701/Australorp_Chicks_n30igr.webp",
    variants: SHARED_BREEDS,
    variantLabel: "اختر السلالة",
    basePrice: 350,
  },
  chickens: {
    name: "دجاج بالغ",
    name_ar: "دجاج بالغ",
    icon: Bird,
    image:
      "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg",
    variants: SHARED_BREEDS,
    variantLabel: "اختر السلالة",
    basePrice: 2500,
  },
  machine: {
    name: "فقاسات يدوية",
    name_ar: "فقاسات يدوية",
    icon: Drill,
    image:
      "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771620999/633635719_122133448574999263_4497762700132453201_n_qizqv4.jpg",
    variants: ["56 بيضة", "96 بيضة", "120 بيضة", "240 بيضة", "500 بيضة"],
    variantLabel: "اختر السعة",
    basePrice: 12000,
  },
};

export const WILAYAS = [
  { id: "01", name: "أدرار" },
  { id: "02", name: "الشلف" },
  { id: "03", name: "الأغواط" },
  { id: "04", name: "أم البواقي" },
  { id: "05", name: "باتنة" },
  { id: "06", name: "بجاية" },
  { id: "07", name: "بسكرة" },
  { id: "08", name: "بشار" },
  { id: "09", name: "البليدة" },
  { id: "10", name: "البويرة" },
  { id: "11", name: "تمنراست" },
  { id: "12", name: "تبسة" },
  { id: "13", name: "تلمسان" },
  { id: "14", name: "تيارت" },
  { id: "15", name: "تيزي وزو" },
  { id: "16", name: "الجزائر" },
  { id: "17", name: "الجلفة" },
  { id: "18", name: "جيجل" },
  { id: "19", name: "سطيف" },
  { id: "20", name: "سعيدة" },
  { id: "21", name: "سكيكدة" },
  { id: "22", name: "سيدي بلعباس" },
  { id: "23", name: "عنابة" },
  { id: "24", name: "قالمة" },
  { id: "25", name: "قسنطينة" },
  { id: "26", name: "المدية" },
  { id: "27", name: "مستغانم" },
  { id: "28", name: "المسيلة" },
  { id: "29", name: "معسكر" },
  { id: "30", name: "ورقلة" },
  { id: "31", name: "وهران" },
  { id: "32", name: "البيض" },
  { id: "33", name: "إليزي" },
  { id: "34", name: "برج بوعريريج" },
  { id: "35", name: "بومرداس" },
  { id: "36", name: "الطارف" },
  { id: "37", name: "تندوف" },
  { id: "38", name: "تيسمسيلت" },
  { id: "39", name: "الوادي" },
  { id: "40", name: "خنشلة" },
  { id: "41", name: "سوق أهراس" },
  { id: "42", name: "تيبازة" },
  { id: "43", name: "ميلة" },
  { id: "44", name: "عين الدفلى" },
  { id: "45", name: "النعامة" },
  { id: "46", name: "عين تموشنت" },
  { id: "47", name: "غرداية" },
  { id: "48", name: "غليزان" },
  { id: "49", name: "تيميمون" },
  { id: "50", name: "برج باجي مختار" },
  { id: "51", name: "أولاد جلال" },
  { id: "52", name: "بني عباس" },
  { id: "53", name: "عين صالح" },
  { id: "54", name: "عين قزام" },
  { id: "55", name: "تقرت" },
  { id: "56", name: "جانت" },
  { id: "57", name: "المغير" },
  { id: "58", name: "المنيعة" },
];

export const NAV_LINKS = (t: {
  common: {
    home: string;
    hatchingEggs: string;
    chicks: string;
    adultChickens: string;
    equipment: string;
    hatchingService: string;
  };
}) => [
  {
    href: "/",
    label: t.common.home,
    icon: "https://cdn.lordicon.com/wmwqvixz.json",
  },
  {
    href: "/?category=eggs#shop",
    label: t.common.hatchingEggs,
    icon: "https://cdn.lordicon.com/lpddubrl.json",
  },
  {
    href: "/?category=chicks#shop",
    label: t.common.chicks,
    icon: "https://cdn.lordicon.com/yxyampkf.json",
  },
  {
    href: "/?category=chickens#shop",
    label: t.common.adultChickens,
    icon: "https://cdn.lordicon.com/ggidpqrj.json",
  },
  {
    href: "/?category=machine#shop",
    label: t.common.equipment,
    icon: "https://cdn.lordicon.com/mfmkufkr.json",
  },
  {
    href: "/hatching",
    label: t.common.hatchingService,
    icon: "https://cdn.lordicon.com/lpddubrl.json",
  },
];
