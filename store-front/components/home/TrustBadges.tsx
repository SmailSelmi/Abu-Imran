import {
  ShieldCheck,
  Egg,
  Thermometer,
  Truck,
  Phone,
  Award,
} from "lucide-react";

const features = [
  {
    icon: Award,
    title: "سلالات أصيلة 100%",
    desc: "نضمن نقاء السلالة وخلوها من الأمراض، لتأسيس قطيع قوي ومنتج.",
  },
  {
    icon: Egg,
    title: "بيض مخصب طازج",
    desc: "يتم جمع البيض يومياً وتخزينه في ظروف مثالية لضمان أعلى نسب فقس.",
  },
  {
    icon: Thermometer,
    title: "فقاسات مضمونة",
    desc: "صناعة جزائرية يدوية مع ضبط دقيق للحرارة والرطوبة.",
  },
  {
    icon: Truck,
    title: "توصيل 58 ولاية",
    desc: "نصل إليكم أينما كنتم في الجزائر مع ضمان سلامة المنتجات.",
  },
  {
    icon: ShieldCheck,
    title: "الدفع عند الاستلام",
    desc: "عاين طلبيتك قبل الدفع. ثقتكم هي رأس مالنا.",
  },
  {
    icon: Phone,
    title: "دعم فني مستمر",
    desc: "نرافقكم بالنصائح والإرشادات لنجاح تجربة التربية والفقس.",
  },
];

export default function TrustBadges() {
  return (
    <section className="py-20 bg-background" dir="rtl">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex gap-4 p-8 rounded-xl bg-muted/30 border border-transparent hover:border-green-500/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="shrink-0 w-16 h-16 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                <feature.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
