'use client'
import { Egg, Bird, Thermometer, Truck, Phone, CheckCircle, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/I18nContext'

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function CategoryCards() {
  const categories = [
    { 
        id: 'eggs', 
        name: 'بيض مخصب', 
        desc: 'نسب خصب عالية لسلالات نقية', 
        icon: Egg, 
        color: 'yellow',
        link: '/shop?category=eggs'
    },
    { 
        id: 'chicks', 
        name: 'كتاكيت وفلاليس', 
        desc: 'محصنة وبصحة ممتازة (جميع الأعمار)', 
        icon: Bird, 
        color: 'orange',
        link: '/shop?category=chicks'
    },
    { 
        id: 'adults', 
        name: 'دجاج بالغ', 
        desc: 'أمهات وديكة جاهزة للإنتاج', 
        icon: Bird, 
        color: 'red',
        link: '/shop?category=chickens'
    },
    { 
        id: 'incubators', 
        name: 'فقاسات يدوية', 
        desc: 'سعات مختلفة (50-500 بيضة)', 
        icon: Thermometer, 
        color: 'blue',
        link: '/shop?category=machine'
    },
  ]

  return (
    <section className="py-24 bg-white dark:bg-zinc-950" dir="rtl">
        <div className="container px-4 mx-auto">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center mb-16 space-y-4"
            >
                <span className="text-emerald-600 font-bold tracking-wider text-[10px] uppercase bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/50 opacity-80">اكتشف منتجاتنا</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">تسوق حسب الفئة</h2>
            </motion.div>
            
            <motion.div 
               variants={containerVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
            >
                {categories.map((cat) => (
                    <motion.div key={cat.id} variants={itemVariants} className="h-full">
                        <Link href={cat.link} className="group relative block h-full">
                            <div className="absolute inset-0 bg-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                            <Card className="h-full relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-md rounded-xl">
                                <CardContent className="p-8 text-center space-y-6 flex flex-col items-center h-full">
                                    <div className={`w-24 h-24 rounded-full bg-${cat.color}-100/50 dark:bg-${cat.color}-900/20 flex items-center justify-center text-${cat.color}-600 dark:text-${cat.color}-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-inner`}>
                                        <cat.icon className="w-12 h-12" />
                                    </div>
                                    <div className="space-y-3 flex-grow">
                                        <h3 className="text-2xl font-black tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{cat.name}</h3>
                                        <p className="text-muted-foreground leading-relaxed font-bold text-sm opacity-60">{cat.desc}</p>
                                    </div>
                                    <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                        <span className="text-xs font-black text-emerald-600 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                                            تصفح الآن <ArrowLeft className="w-4 h-4" />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
  )
}

export function HowItWorks() {
    const { t, isRTL } = useI18n()
    return (
      <section className="py-24 relative overflow-hidden bg-black" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
              <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container relative z-10 px-4 mx-auto">
              <div className="max-w-4xl mx-auto text-center space-y-4 mb-20">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-block py-1 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest"
                  >
                    {t.howToOrder.badge}
                  </motion.span>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-white tracking-tighter"
                  >
                    {t.howToOrder.title}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-gray-400 font-medium italic"
                  >
                    {t.howToOrder.description}
                  </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  {[
                      { 
                        icon: CheckCircle, 
                        title: t.howToOrder.step1Title, 
                        desc: t.howToOrder.step1Desc,
                        color: "from-emerald-500 to-teal-500" 
                      },
                      { 
                        icon: Phone, 
                        title: t.howToOrder.step2Title, 
                        desc: t.howToOrder.step2Desc,
                        color: "from-amber-400 to-orange-500" 
                      },
                      { 
                        icon: Truck, 
                        title: t.howToOrder.step3Title, 
                        desc: t.howToOrder.step3Desc,
                        color: "from-blue-500 to-indigo-600" 
                      },
                  ].map((step, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        key={i} 
                        className="relative group h-full"
                      >
                          <div className="h-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 flex flex-col items-center text-center space-y-6">
                              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-white border border-border/40 flex items-center justify-center text-black font-black text-xl shadow-sm rotate-12 group-hover:rotate-0 transition-transform">
                                  {i + 1}
                              </div>

                              <div className={`w-24 h-24 rounded-3xl bg-neutral-800 p-0.5 shadow-sm border border-border/20 group-hover:scale-110 transition-transform duration-500`}>
                                  <div className="w-full h-full bg-black rounded-[inherit] flex items-center justify-center">
                                      <step.icon className="w-10 h-10 text-white" />
                                  </div>
                              </div>

                              <div className="space-y-3">
                                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{step.title}</h3>
                                  <p className="text-gray-400 font-bold text-sm leading-relaxed opacity-80">{step.desc}</p>
                              </div>
                          </div>
                      </motion.div>
                  ))}
              </div>
  
              <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="mt-20 text-center"
              >
                  <Link href="https://wa.me/213665243819" target="_blank" className="inline-block">
                      <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl px-12 h-20 rounded-2xl shadow-sm hover:shadow hover:-translate-y-2 transition-all duration-300 group">
                          <Phone className="w-6 h-6 me-3 animate-bounce" />
                          {t.howToOrder.cta}
                      </Button>
                  </Link>
                  <p className="mt-6 text-emerald-500/60 text-xs font-black uppercase tracking-[0.3em]">
                      {t.howToOrder.deliveryNote}
                  </p>
              </motion.div>
          </div>
      </section>
    )
  }



