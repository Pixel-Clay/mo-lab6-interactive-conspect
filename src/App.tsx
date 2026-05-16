import React, { useState } from 'react';
import { TheorySection } from './components/TheorySection';
import { GA_Visualization } from './components/GA_Visualization';
import { ACO_Visualization } from './components/ACO_Visualization';
import { SA_Visualization } from './components/SA_Visualization';
import { Brain, Waypoints, GraduationCap, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

type Tab = 'ga' | 'aco' | 'theory' | 'sa';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('theory');

  const tabs = [
    { id: 'theory', label: 'I. ТЕОРИЯ (СПРАВКА)', icon: GraduationCap },
    { id: 'sa', label: 'II. ИМИТАЦИЯ ОТЖИГА', icon: Flame },
    { id: 'ga', label: 'III. ГЕНЕТИЧЕСКИЙ АЛГОРИТМ', icon: Brain },
    { id: 'aco', label: 'IV. МУРАВЬИНЫЙ АЛГОРИТМ', icon: Waypoints },
  ];

  return (
    <div className="min-h-screen bg-canvas font-sans text-accent flex flex-col items-center py-0 sm:py-8">
      <div className="w-full max-w-6xl min-h-[800px] bg-canvas border border-accent flex flex-col shadow-[12px_12px_0px_0px_rgba(26,26,26,0.05)]">
        {/* Header */}
        <header className="h-20 border-b border-accent flex items-center justify-between px-6 sm:px-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-accent rounded-[2px]"></div>
            <span className="font-bold uppercase tracking-[0.15em] text-xs sm:text-sm">Academic Lab / CS-402</span>
          </div>
          <div className="text-right hidden sm:block">
            <h1 className="text-xl italic font-serif leading-tight">Лабораторная работа: Метаэвристики</h1>
            <p className="text-[9px] uppercase tracking-widest opacity-60">Исследование глобального экстремума и популяционной динамики</p>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Aside / Navigation */}
          <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-accent p-6 sm:p-10 flex flex-col justify-between bg-secondary">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.2em] mb-8 opacity-50 font-sans not-italic">Navigation Index</h2>
              <nav className="flex flex-col gap-4">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={cn(
                        "text-left py-3 px-4 transition-all border-l-2",
                        isActive 
                          ? "border-accent opacity-100 translate-x-2" 
                          : "border-transparent opacity-40 hover:opacity-70"
                      )}
                    >
                      <p className="text-sm font-bold tracking-tight">{tab.label}</p>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="mt-12 bg-accent text-canvas p-5 rounded-[2px] hidden md:block">
              <p className="text-[9px] uppercase tracking-widest mb-3 opacity-80">Computational Physics</p>
              <div className="font-mono text-[11px] leading-relaxed opacity-90">
                [SYSTEM] Ready<br />
                [METRIC] Stability: 98.2%<br />
                [ARCH] MetaH-2024-GA
              </div>
            </div>
          </aside>

          {/* Main Stage */}
          <section className="flex-1 overflow-y-auto bg-canvas p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="h-full"
              >
                {activeTab === 'theory' && <TheorySection />}
                {activeTab === 'sa' && (
                  <div className="space-y-10">
                    <div className="border-b border-border-subtle pb-6">
                      <h3 className="text-4xl italic mb-4">Метод имитации отжига</h3>
                      <p className="text-sm leading-relaxed max-w-2xl text-accent/70">
                        Физическая аналогия процесса охлаждения металла. Алгоритм с некоторой вероятностью принимает 
                        худшие решения (ход «в гору»), что позволяет ему выбираться из локальных оптимумов.
                      </p>
                    </div>
                    <SA_Visualization />
                  </div>
                )}
                {activeTab === 'ga' && (
                  <div className="space-y-10">
                    <div className="border-b border-border-subtle pb-6">
                      <h3 className="text-4xl italic mb-4">Генетическая модель</h3>
                      <p className="text-sm leading-relaxed max-w-2xl text-accent/70">
                        Популяционный поиск, основанный на механизмах естественного отбора. Использование 
                        скрещивания (наследования) и мутации для параллельного исследования пространства.
                      </p>
                    </div>
                    <GA_Visualization />
                  </div>
                )}
                {activeTab === 'aco' && (
                  <div className="space-y-10">
                    <div className="border-b border-border-subtle pb-6">
                      <h3 className="text-4xl italic mb-4">Муравьиная оптимизация</h3>
                      <p className="text-sm leading-relaxed max-w-2xl text-accent/70">
                        Моделирование роевого интеллекта, где химическая стигмергия (отложение феромонов) 
                        эволюционирует в сторону глобальной эффективности при поиске на графе.
                      </p>
                    </div>
                    <ACO_Visualization />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

        {/* Footer */}
        <footer className="h-14 border-t border-accent bg-secondary flex items-center justify-between px-6 sm:px-10 shrink-0 text-[9px] uppercase tracking-[0.2em] opacity-60">
          <div>Laboratory Reference: METAH-2024-GA</div>
          <div className="flex gap-8 hidden sm:flex">
            <span>Revision: 1.0.4</span>
            <span>Auth: Academic_Systems</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
