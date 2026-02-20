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

export const CATEGORY_DATA: Record<string, CategoryInfo> = {
  eggs: {
    name: "Hatching Eggs",
    name_ar: "بيض مخصب",
    icon: Egg,
    image: "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771339479/03-fertilized-eggs_kbgqer.jpg",
    variants: ["Australorp (أسترالورب)", "Plymouth Rock (بليموث روك)", "Sasso (صاصو)", "Brahma (براهما)", "Leghorn (ليغهورن)", "Local/Bledi (بلدي)"],
    variantLabel: "Choose Breed / اختر السلالة",
    basePrice: 150
  },
  chicks: {
    name: "Baby Chicks",
    name_ar: "كتاكيت وفلاليس",
    icon: Bird,
    image: "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619701/Australorp_Chicks_n30igr.webp",
    variants: ["Australorp (أسترالورب)", "Plymouth Rock (بليموث روك)", "Sasso (صاصو)", "Brahma (براهما)", "Local/Bledi (بلدي)"],
    variantLabel: "Choose Breed / اختر السلالة",
    basePrice: 350
  },
  chickens: {
    name: "Livestock",
    name_ar: "دجاج بالغ",
    icon: Bird,
    image: "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg",
    variants: ["Australorp (أسترالورب)", "Plymouth Rock (بليموث روك)", "Sasso (صاصو)", "Brahma (براهما)"],
    variantLabel: "Choose Breed / اختر السلالة",
    basePrice: 2500
  },
  machine: {
    name: "Equipment",
    name_ar: "فقاسات يدوية",
    icon: Drill,
    image: "https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771620999/633635719_122133448574999263_4497762700132453201_n_qizqv4.jpg",
    variants: ["56 Eggs (56 بيضة)", "96 Eggs (96 بيضة)", "120 Eggs (120 بيضة)", "240 Eggs (240 بيضة)", "500 Eggs (500 بيضة)"],
    variantLabel: "Choose Capacity / اختر السعة",
    basePrice: 12000
  },
};

export const WILAYAS = [
  { id: "01", name: "Adrar (أدرار)" },
  { id: "02", name: "Chlef (الشلف)" },
  { id: "03", name: "Laghouat (الأغواط)" },
  { id: "04", name: "Oum El Bouaghi (أم البواقي)" },
  { id: "batna", name: "Batna (باتنة)", code: "05" }, // Existing code was 05, name Batna
  { id: "06", name: "Béjaïa (بجاية)" },
  { id: "07", name: "Biskra (بسكرة)" },
  { id: "08", name: "Béchar (بشار)" },
  { id: "09", name: "Blida (البليدة)" },
  { id: "10", name: "Bouira (البويرة)" },
  { id: "11", name: "Tamanrasset (تمنراست)" },
  { id: "12", name: "Tébessa (تبسة)" },
  { id: "13", name: "Tlemcen (تلمسان)" },
  { id: "14", name: "Tiaret (تيارت)" },
  { id: "15", name: "Tizi Ouzou (تيزي وزو)" },
  { id: "16", name: "Alger (الجزائر)" },
  { id: "17", name: "Djelfa (الجلفة)" },
  { id: "18", name: "Jijel (جيجل)" },
  { id: "19", name: "Sétif (سطيف)" },
  { id: "20", name: "Saïda (سعيدة)" },
  { id: "21", name: "Skikda (سكيكدة)" },
  { id: "22", name: "Sidi Bel Abbès (سيدي بلعباس)" },
  { id: "23", name: "Annaba (عنابة)" },
  { id: "24", name: "Guelma (قالمة)" },
  { id: "25", name: "Constantine (قسنطينة)" },
  { id: "26", name: "Médéa (المدية)" },
  { id: "27", name: "Mostaganem (مستغانم)" },
  { id: "28", name: "M'Sila (المسيلة)" },
  { id: "29", name: "Mascara (معسكر)" },
  { id: "30", name: "Ouargla (ورقلة)" },
  { id: "31", name: "Oran (وهران)" },
  { id: "32", name: "El Bayadh (البيض)" },
  { id: "33", name: "Illizi (إليزي)" },
  { id: "34", name: "Bordj Bou Arréridj (برج بوعريريج)" },
  { id: "35", name: "Boumerdès (بومرداس)" },
  { id: "36", name: "El Tarf (الطارف)" },
  { id: "37", name: "Tindouf (تندوف)" },
  { id: "38", name: "Tissemsilt (تيسمسيلت)" },
  { id: "39", name: "El Oued (الوادي)" },
  { id: "40", name: "Khenchela (خنشلة)" },
  { id: "41", name: "Souk Ahras (سوق أهراس)" },
  { id: "42", name: "Tipaza (تيبازة)" },
  { id: "43", name: "Mila (ميلة)" },
  { id: "44", name: "Aïn Defla (عين الدفلى)" },
  { id: "45", name: "Naâma (النعامة)" },
  { id: "46", name: "Aïn Témouchent (عين تموشنت)" },
  { id: "47", name: "Ghardaïa (غرداية)" },
  { id: "48", name: "Relizane (غليزان)" },
  { id: "49", name: "Timimoun (تيميمون)" },
  { id: "50", name: "Bordj Badji Mokhtar (برج باجي مختار)" },
  { id: "51", name: "Ouled Djellal (أولاد جلال)" },
  { id: "52", name: "Béni Abbès (بني عباس)" },
  { id: "53", name: "In Salah (عين صالح)" },
  { id: "54", name: "In Guezzam (عين قزام)" },
  { id: "55", name: "Touggourt (تقرت)" },
  { id: "56", name: "Djanet (جانت)" },
  { id: "57", name: "El M'Ghair (المغير)" },
  { id: "58", name: "El Meniaa (المنيعة)" },
];

export const NAV_LINKS = (t: any) => [
  { href: '/', label: t.common.home, icon: 'https://cdn.lordicon.com/wmwqvixz.json' },
  { href: '/shop?category=eggs', label: t.common.hatchingEggs, icon: 'https://cdn.lordicon.com/lpddubrl.json' },
  { href: '/shop?category=chicks', label: t.common.chicks, icon: 'https://cdn.lordicon.com/yxyampkf.json' },
  { href: '/shop?category=chickens', label: t.common.adultChickens, icon: 'https://cdn.lordicon.com/ggidpqrj.json' },
  { href: '/shop?category=machine', label: t.common.equipment, icon: 'https://cdn.lordicon.com/mfmkufkr.json' },
  { href: '/hatching', label: t.common.hatchingService, icon: 'https://cdn.lordicon.com/lpddubrl.json' },
];

export const LANGUAGES: { code: 'ar' | 'fr' | 'en'; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
];

