export type Locale = 'ar';

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
      api: "واجهة البرمجة",
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
  }
};

export type TranslationKeys = typeof translations.ar;
