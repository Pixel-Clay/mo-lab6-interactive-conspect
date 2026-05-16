import React from 'react';

export const TheorySection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-0 text-accent">
      <header className="mb-16 border-b border-accent pb-8">
        <h2 className="text-[10px] uppercase tracking-[0.2em] mb-4 opacity-50 font-sans not-italic">Theoretical Reference</h2>
        <h1 className="text-5xl font-bold tracking-tight mb-4 lowercase first-letter:uppercase">Метаэвристические методы</h1>
        <p className="text-xl opacity-70 italic font-serif leading-relaxed">Поиск глобального экстремума в NP-трудных задачах</p>
      </header>

      <div className="space-y-16">
        <section className="bg-secondary p-8 border border-accent relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-accent"></div>
          <p className="leading-relaxed text-lg mb-6">
            Локальные методы (градиентный спуск и пр.) требуют унимодальности функции и «застревают» в ближайшем локальном минимуме. Глобальные методы вносят элемент случайности не только в начало, но и в каждую итерацию.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <span className="block font-bold text-xl">Стохастичность</span>
              <span className="text-[9px] uppercase opacity-50">Случайность на каждом шаге</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-xl">Дискретность</span>
              <span className="text-[9px] uppercase opacity-50">Нативная работа с множествами</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-xl">Эволюция</span>
              <span className="text-[9px] uppercase opacity-50">Популяционный подход</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-xl">NP-Hard</span>
              <span className="text-[9px] uppercase opacity-50">Борьба с комбинаторикой</span>
            </div>
          </div>
        </section>

        <article className="space-y-10">
          <h2 className="text-3xl italic border-b border-border-subtle pb-2">Раздел 1. Метод имитации отжига (Simulated Annealing)</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4 text-sm leading-relaxed text-accent/80">
              <p>Основан на физической аналогии: при нагреве металла молекулы обретают высокую кинетическую энергию. По мере медленного остывания (отжига) решетка стабилизируется в энергетическом минимуме.</p>
              <div className="bg-secondary p-4 border-l-2 border-accent italic">
                «Температура» регулирует вероятность принятия худшего решения — чем она выше, тем охотнее мы идем «в гору», чтобы выйти из ямы.
              </div>
            </div>
            <div className="bg-accent text-canvas p-8 flex flex-col justify-center border-2 border-accent">
              <span className="text-[10px] uppercase tracking-widest mb-4 opacity-70 font-sans">Вероятность перехода (Переход Гиббса)</span>
              <div className="font-mono text-2xl font-bold italic">p = exp( -(f(y) - f(x)) / t_k )</div>
              <p className="text-[9px] mt-4 opacity-50 font-sans">Если путь y хуже x, мы переходим с вероятностью p, зависящей от текущего t.</p>
            </div>
          </div>
        </article>

        <article className="space-y-10 border-t border-accent pt-12">
          <h2 className="text-3xl italic border-b border-border-subtle pb-2">Раздел 2. Генетический алгоритм (GA)</h2>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-4">
                <h3 className="font-bold text-accent uppercase tracking-wider text-xs">Основные операторы</h3>
                <div className="space-y-3">
                   <div className="border border-accent/20 p-3 bg-secondary">
                     <span className="block font-bold text-[10px] uppercase">Скрещивание</span>
                     <p className="text-[10px] opacity-70 leading-tight">Обмен генами между родителями для перемещения между окрестностями.</p>
                   </div>
                   <div className="border border-accent/20 p-3">
                     <span className="block font-bold text-[10px] uppercase">Мутация</span>
                     <p className="text-[10px] opacity-70 leading-tight">Случайное изменение гена для выхода из локального минимума.</p>
                   </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-bold text-accent uppercase tracking-wider text-xs">Биологическая модель</h3>
                <p className="text-sm">Идея: иметь популяцию из многих приближений одновременно, что позволяет исследовать разные области пространства решений параллельно — главное преимущество перед имитацией отжига.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-[11px] p-4 bg-secondary border border-accent/10">
                    <span className="font-bold uppercase block mb-1">Хромосома</span>
                    Вектор приближения (одно решение)
                  </div>
                  <div className="text-[11px] p-4 bg-secondary border border-accent/10">
                    <span className="font-bold uppercase block mb-1">Популяция</span>
                    Множество решений (облако поиска)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="space-y-10 border-t border-accent pt-12">
          <h2 className="text-3xl italic border-b border-border-subtle pb-2">Раздел 3. Муравьиный алгоритм (ACO) и UFSACO</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <h3 className="font-bold text-accent uppercase tracking-wider text-xs">Принципы UFSACO</h3>
              <p className="text-sm leading-relaxed text-accent/80">
                Применяет ACO к задаче <b>Feature Selection (отбор признаков)</b>. Цель: отобрать признаки, наименее похожие друг на друга, используя косинусную меру сходства $sim(A,B)$.
              </p>
              
              <div className="bg-secondary border border-accent p-8 space-y-4">
                <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-50">Обновление феромона (UFSACO)</h4>
                <div className="font-mono text-lg py-2 italic">
                  τᵢ(t+1) = (1−ρ)·τᵢ(t) + FC(i) / Σ FC(j)
                </div>
                <p className="text-[9px] opacity-60">Где FC(i) — число раз, когда признак был выбран агентом.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-bold text-accent uppercase tracking-wider text-xs">Адаптация и Шпаргалка</h3>
              <ul className="space-y-3 text-[11px] list-none p-0">
                <li className="border-b border-accent/10 pb-2">
                  <b>Стигмергия:</b> непрямая коммуникация через среду.
                </li>
                <li className="border-b border-accent/10 pb-2">
                  <b>Параллелизм:</b> агенты независимы, легко параллелятся.
                </li>
                <li className="border-b border-accent/10 pb-2">
                  <b>Обучение:</b> связь с Reinforcement Learning (награды за путь).
                </li>
              </ul>
            </div>
          </div>
        </article>

        <article className="border-t-2 border-accent pt-12">
          <h2 className="text-3xl italic mb-8 border-b border-border-subtle pb-2">Срaвнение методов: ACO vs Генетический алгоритм</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-secondary border-y border-accent">
                  <th className="p-3 uppercase tracking-wider font-bold">Критерий</th>
                  <th className="p-3 uppercase tracking-wider font-bold">ACO (Муравьиная колония)</th>
                  <th className="p-3 uppercase tracking-wider font-bold">Генетический алгоритм</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10">
                <tr>
                  <td className="p-3 font-bold opacity-60">Агенты / особи</td>
                  <td className="p-3">Муравьи путешествуют по графу</td>
                  <td className="p-3">Хромосомы (векторы решений)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold opacity-60">Память</td>
                  <td className="p-3 italic">Долгосрочная на ребрах (Феромон)</td>
                  <td className="p-3 italic">Марковская (только текущее поколение)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold opacity-60">Коммуникация</td>
                  <td className="p-3">Феромонный след (непрямая)</td>
                  <td className="p-3">Скрещивание пар хромосом</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold opacity-60">ML аналог</td>
                  <td className="p-3">Обучение с подкреплением (RL)</td>
                  <td className="p-3">Эволюционные стратегии</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <footer className="mt-20 pt-8 border-t border-accent/20 text-center opacity-40 text-[10px] uppercase tracking-[0.3em]">
        Academic Reference Lab © 2026
      </footer>
    </div>
  );
};
