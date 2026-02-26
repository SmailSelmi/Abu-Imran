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
    image:
      "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619701/Australorp_Chicks_n30igr.webp",
    breeds: ["أسترالورب محسن أسود", "أسترالورب محسن رمادي"],
    slugs: ["australorp-black", "australorp-grey"],
  },
  {
    id: "new-hampshire",
    name_ar: "نيوهامبشير",
    name_en: "New Hampshire",
    image:
      "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771339479/03-fertilized-eggs_kbgqer.jpg",
    breeds: ["نيوهامبشير الطوق الأسود"],
    slugs: ["new-hampshire-black-collar"],
  },
  {
    id: "plymouth-rock",
    name_ar: "بلايموث روك",
    name_en: "Plymouth Rock",
    image:
      "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg",
    breeds: ["بليموث روك باري", "بليموث روك سيلفر"],
    slugs: ["plymouth-rock-barred", "plymouth-rock-silver"],
  },
  {
    id: "sussex-rhode-island",
    name_ar: "سيساكس / رود آيلاند",
    name_en: "Sussex & Rhode Island",
    image:
      "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg",
    breeds: ["سيساكس أرميني", "رود آيلاند أكاجو"],
    slugs: ["sussex-armenian", "rhode-island-akaju"],
  },
  {
    id: "sprite",
    name_ar: "سبرايت أنيق",
    name_en: "Sprite",
    image:
      "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619701/Australorp_Chicks_n30igr.webp",
    breeds: ["سبرايت أنيق ذهبي", "سبرايت أنيق ليموني", "سبرايت أنيق فضي"],
    slugs: ["sprite-gold", "sprite-lemon", "sprite-silver"],
  },
  {
    id: "brahma",
    name_ar: "براهما",
    name_en: "Brahma",
    image:
      "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg",
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
  { id: "01", name: "01-أدرار" },
  { id: "02", name: "02-الشلف" },
  { id: "03", name: "03-الأغواط" },
  { id: "04", name: "04-أم البواقي" },
  { id: "05", name: "05-باتنة" },
  { id: "06", name: "06-بجاية" },
  { id: "07", name: "07-بسكرة" },
  { id: "08", name: "08-بشار" },
  { id: "09", name: "09-البليدة" },
  { id: "10", name: "10-البويرة" },
  { id: "11", name: "11-تمنراست" },
  { id: "12", name: "12-تبسة" },
  { id: "13", name: "13-تلمسان" },
  { id: "14", name: "14-تيارت" },
  { id: "15", name: "15-تيزي وزو" },
  { id: "16", name: "16-الجزائر" },
  { id: "17", name: "17-الجلفة" },
  { id: "18", name: "18-جيجل" },
  { id: "19", name: "19-سطيف" },
  { id: "20", name: "20-سعيدة" },
  { id: "21", name: "21-سكيكدة" },
  { id: "22", name: "22-سيدي بلعباس" },
  { id: "23", name: "23-عنابة" },
  { id: "24", name: "24-قالمة" },
  { id: "25", name: "25-قسنطينة" },
  { id: "26", name: "26-المدية" },
  { id: "27", name: "27-مستغانم" },
  { id: "28", name: "28-المسيلة" },
  { id: "29", name: "29-معسكر" },
  { id: "30", name: "30-ورقلة" },
  { id: "31", name: "31-وهران" },
  { id: "32", name: "32-البيض" },
  { id: "33", name: "33-إليزي" },
  { id: "34", name: "34-برج بوعريريج" },
  { id: "35", name: "35-بومرداس" },
  { id: "36", name: "36-الطارف" },
  { id: "37", name: "37-تندوف" },
  { id: "38", name: "38-تيسمسيلت" },
  { id: "39", name: "39-الوادي" },
  { id: "40", name: "40-خنشلة" },
  { id: "41", name: "41-سوق أهراس" },
  { id: "42", name: "42-تيبازة" },
  { id: "43", name: "43-ميلة" },
  { id: "44", name: "44-عين الدفلى" },
  { id: "45", name: "45-النعامة" },
  { id: "46", name: "46-عين تموشنت" },
  { id: "47", name: "47-غرداية" },
  { id: "48", name: "48-غليزان" },
  { id: "49", name: "49-تيميمون" },
  { id: "50", name: "50-برج باجي مختار" },
  { id: "51", name: "51-أولاد جلال" },
  { id: "52", name: "52-بني عباس" },
  { id: "53", name: "53-عين صالح" },
  { id: "54", name: "54-عين قزام" },
  { id: "55", name: "55-تقرت" },
  { id: "56", name: "56-جانت" },
  { id: "57", name: "57-المغير" },
  { id: "58", name: "58-المنيعة" },
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
    href: "/order/eggs",
    label: t.common.hatchingEggs,
    icon: "https://cdn.lordicon.com/lpddubrl.json",
  },
  {
    href: "/order/chicks",
    label: t.common.chicks,
    icon: "https://cdn.lordicon.com/yxyampkf.json",
  },
  {
    href: "/order/chickens",
    label: t.common.adultChickens,
    icon: "https://cdn.lordicon.com/ggidpqrj.json",
  },
  {
    href: "/order/machine",
    label: t.common.equipment,
    icon: "https://cdn.lordicon.com/mfmkufkr.json",
  },
  {
    href: "/hatching",
    label: t.common.hatchingService,
    icon: "https://cdn.lordicon.com/lpddubrl.json",
  },
];
