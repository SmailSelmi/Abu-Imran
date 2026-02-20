export type Locale = 'ar' | 'fr' | 'en';

export const translations = {
  ar: {
    sidebar: {
      overview: "نظرة عامة",
      orders: "الطلبيات",
      hatching: "خدمة الحضانة",
      inventory: "المخزون",
      customers: "الزبائن",
      settings: "الإعدادات",
      mainControl: "التحكم الرئيسي",
      adminUser: "المشرف",
      role: "مدير النظام",
      logout: "تسجيل الخروج",
      menu: "القائمة",
      managementPortal: "بوابة الإدارة",
      brand: "أبو عمران"
    },
    header: {
      searchPlaceholder: "ابحث عن الطلبيات، الزبائن، المنتجات، أو الحركات المالية..."
    },
    systemHealth: {
      health: "حالة النظام",
      database: "قاعدة البيانات",
      connected: "متصل",
      api: "واجهة برمجة التطبيقات",
      storage: "التخزين",
      normal: "النظام سليم",
      errorTables: "خطأ في قاعدة البيانات: جداول مفقودة",
      errorConnection: "اتصال غير مستقر",
      fail: "فشل الاتصال",
      diagnostic: "تشخيص النظام",
      realtimeStatus: "حالة وحدة الأعمال في الوقت الفعلي.",
      reRun: "إعادة تشغيل التشخيص",
      missingTableText: "جدول 'المنتجات' غير موجود. يرجى تشغيل نص الهجرة.",
      activeProducts: "منتجات نشطة."
    }
  },
  fr: {
    sidebar: {
      overview: "Aperçu",
      orders: "Commandes",
      hatching: "Couveuse",
      inventory: "Inventaire",
      customers: "Clients",
      settings: "Paramètres",
      mainControl: "Contrôle Principal",
      adminUser: "Admin",
      role: "Directeur",
      logout: "Déconnexion",
      menu: "Menu",
      managementPortal: "Portail de Gestion",
      brand: "Abu Imran"
    },
    header: {
      searchPlaceholder: "Rechercher des commandes, clients, produits, ou transactions..."
    },
    systemHealth: {
      health: "État du Système",
      database: "Base de Données",
      connected: "Connecté",
      api: "API",
      storage: "Stockage",
      normal: "Système Normal",
      errorTables: "Erreur BDD: tables manquantes",
      errorConnection: "Connexion instable",
      fail: "Échec de connexion",
      diagnostic: "Diagnostic Système",
      realtimeStatus: "État de l'unité en temps réel.",
      reRun: "Relancer le diagnostic",
      missingTableText: "Table 'products' introuvable. Exécutez la migration.",
      activeProducts: "produits actifs."
    }
  },
  en: {
    sidebar: {
      overview: "Overview",
      orders: "Orders",
      hatching: "Hatching Service",
      inventory: "Inventory",
      customers: "Customers",
      settings: "Settings",
      mainControl: "Main Control",
      adminUser: "Admin User",
      role: "Senior Manager",
      logout: "Logout",
      menu: "Menu",
      managementPortal: "Management Portal",
      brand: "Abu Imran"
    },
    header: {
      searchPlaceholder: "Search for orders, customers, products, or financial transactions..."
    },
    systemHealth: {
      health: "System Health",
      database: "Database",
      connected: "Connected",
      api: "API",
      storage: "Storage",
      normal: "System Healthy",
      errorTables: "DB Error: missing tables",
      errorConnection: "Unstable connection",
      fail: "Connection failed",
      diagnostic: "System Diagnostic",
      realtimeStatus: "Real-time business unit status.",
      reRun: "Re-run Diagnostic",
      missingTableText: "Table 'products' missing. Please run migration.",
      activeProducts: "active products."
    }
  }
};

export type TranslationKeys = typeof translations.en;
