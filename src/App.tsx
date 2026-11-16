import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Check, Plus, Printer, Trash2, X } from 'lucide-react';
import {
  DEFAULT_CHECKLIST,
  GALLERY_IMAGES,
  HERO_IMAGE,
  ITINERARY_DAYS,
  type ChecklistItem,
  type RegionFilter,
  type SuggestedPlace,
} from './data/itinerary';
import { ResilientImage } from './components/ResilientImage';
import { DayCard } from './components/DayCard';
import { RioZoneMap } from './components/RioZoneMap';
import { RioWeatherStrip } from './components/RioWeatherStrip';
import { SuggestedPlaces } from './components/SuggestedPlaces';

const STORAGE_KEYS = {
  completed: 'rio_itinerary_completed_v1',
  notes: 'rio_itinerary_notes_v1',
  wednesday: 'rio_itinerary_wednesday_v1',
  checklist: 'rio_itinerary_checklist_v1',
  customPlaces: 'rio_itinerary_custom_places_v1',
};

const REGION_FILTERS: { id: RegionFilter; label: string }[] = [
  { id: 'all', label: 'Todos os Dias' },
  { id: 'zona-sul', label: 'Zona Sul' },
  { id: 'centro-st', label: 'Centro & Santa Teresa' },
  { id: 'zona-norte', label: 'São Cristóvão & Retorno' },
];

export default function App() {
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.completed);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.notes);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [wednesdayChoice, setWednesdayChoice] = useState<'ipanema' | 'amanha'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.wednesday);
      return saved === 'amanha' ? 'amanha' : 'ipanema';
    } catch {
      return 'ipanema';
    }
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.checklist);
      return saved ? JSON.parse(saved) : DEFAULT_CHECKLIST;
    } catch {
      return DEFAULT_CHECKLIST;
    }
  });

  const [customPlacesByDay, setCustomPlacesByDay] = useState<Record<string, SuggestedPlace[]>>(
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.customPlaces);
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
  );

  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(completedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [completedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
    } catch {
      // Ignore storage quota errors
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.wednesday, wednesdayChoice);
    } catch {
      // Ignore storage quota errors
    }
  }, [wednesdayChoice]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.checklist, JSON.stringify(checklist));
    } catch {
      // Ignore storage quota errors
    }
  }, [checklist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.customPlaces, JSON.stringify(customPlacesByDay));
    } catch {
      // Ignore storage quota errors
    }
  }, [customPlacesByDay]);

  const filteredDays = useMemo(() => {
    if (regionFilter === 'all') return ITINERARY_DAYS;
    return ITINERARY_DAYS.filter((d) => d.regionKey === regionFilter);
  }, [regionFilter]);

  const totalActivities = useMemo(
    () => ITINERARY_DAYS.reduce((acc, day) => acc + (day.evening ? 2 : 1), 0),
    []
  );

  const completedActivitiesCount = useMemo(
    () =>
      ITINERARY_DAYS.reduce((acc, day) => {
        let count = completedIds[day.morning.id] ? 1 : 0;
        if (day.evening && completedIds[day.evening.id]) count += 1;
        return acc + count;
      }, 0),
    [completedIds]
  );

  const checklistDoneCount = useMemo(
    () => checklist.filter((item) => item.done).length,
    [checklist]
  );

  const toggleActivityComplete = (id: string) => {
    setCompletedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveNote = (dayNumber: string, text: string) => {
    setNotes((prev) => ({
      ...prev,
      [dayNumber]: text,
    }));
  };

  const handleAddPlaceToDay = (dayNumber: string, place: SuggestedPlace) => {
    setCustomPlacesByDay((prev) => {
      const existing = prev[dayNumber] ?? [];
      if (existing.some((p) => p.id === place.id)) return prev;
      return {
        ...prev,
        [dayNumber]: [...existing, place],
      };
    });
  };

  const handleRemovePlaceFromDay = (dayNumber: string, placeId: string) => {
    setCustomPlacesByDay((prev) => ({
      ...prev,
      [dayNumber]: (prev[dayNumber] ?? []).filter((p) => p.id !== placeId),
    }));
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const deleteChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddChecklistItem = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newTaskText.trim();
    if (!trimmed) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: `chk-${Date.now()}`,
        label: trimmed,
        category: 'Pessoal',
        done: false,
      },
    ]);
    setNewTaskText('');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1A1917] flex flex-col">
      {/* Top Bar Contract: Strict 3-zone single row */}
      <header className="no-print border-b border-[#DDD9D0] bg-[#F8F7F4]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#visao-geral"
            className="font-serif text-xl font-bold tracking-tight text-[#1A1917] whitespace-nowrap shrink-0"
          >
            Caderno Carioca
          </a>

          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A564F]"
          >
            <a
              href="#previsao"
              className="hover:text-[#1A1917] transition-colors whitespace-nowrap shrink-0"
            >
              Previsão
            </a>
            <a
              href="#dia-a-dia"
              className="hover:text-[#1A1917] transition-colors whitespace-nowrap shrink-0"
            >
              Dia a Dia
            </a>
            <a
              href="#sugestoes"
              className="hover:text-[#1A1917] transition-colors whitespace-nowrap shrink-0"
            >
              Sugestões
            </a>
            <a
              href="#preparativos"
              className="hover:text-[#1A1917] transition-colors whitespace-nowrap shrink-0"
            >
              Preparativos
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F3D56] text-white text-xs font-semibold hover:bg-[#0B2E42] transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Roteiro</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section & 4-Column Operational Summary Strip */}
        <section id="visao-geral" className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-10 pb-8 sm:pt-12 sm:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between py-2">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#6B6760]">
                  16 a 23 de Novembro · Rio de Janeiro
                </p>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-[52px] font-semibold tracking-tight text-[#1A1917] leading-[1.08] mt-3 text-balance">
                  Roteiro Rio de Janeiro
                </h1>

                <p className="mt-4 text-base leading-relaxed text-[#3F3C36] max-w-lg">
                  8 dias organizados por região: samba na Pedra do Sal na segunda, descida de
                  Santa Teresa direto para a Lapa na sexta e praias da Zona Sul no fim de semana.
                </p>
              </div>

              <div className="mt-7 pt-5 border-t border-[#DDD9D0] flex flex-wrap items-center gap-3">
                <a
                  href="#dia-a-dia"
                  className="no-print inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#0F3D56] text-white text-sm font-semibold hover:bg-[#0B2E42] transition-colors whitespace-nowrap shrink-0"
                >
                  Ver Programação
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('table');
                    document.getElementById('dia-a-dia')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="no-print inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-[#D4CFC5] bg-white text-[#1A1917] text-sm font-medium hover:bg-[#F1EFEA] transition-colors whitespace-nowrap shrink-0"
                >
                  Tabela Resumo
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col">
              <div className="relative flex-1 min-h-[240px] sm:min-h-[300px] rounded-xl overflow-hidden border border-[#DDD9D0] bg-[#E7E4DC]">
                <ResilientImage
                  src={HERO_IMAGE.src}
                  alt={HERO_IMAGE.alt}
                  fallbackTitle="Baía de Guanabara & Pão de Açúcar"
                  className="w-full h-full lg:h-full object-cover"
                />
              </div>
              <p className="mt-2 text-xs font-serif italic text-[#6B6760]">
                {HERO_IMAGE.caption}
              </p>
            </div>
          </div>

          {/* 4-Column Operational Utility Strip */}
          <div className="mt-8 bg-white border border-[#DDD9D0] rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#ECE9E2]">
            <div className="p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-[#6B6760]">
                Período
              </p>
              <p className="mt-1 text-lg font-semibold text-[#1A1917] tabular-nums">
                16/11 – 23/11
              </p>
              <p className="mt-0.5 text-xs text-[#6B6760]">Segunda a Segunda</p>
            </div>

            <div className="p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-[#6B6760]">
                Dias-Chave
              </p>
              <p className="mt-1 text-lg font-semibold text-[#1A1917]">
                Pedra do Sal · Lapa
              </p>
              <p className="mt-0.5 text-xs text-[#6B6760]">Segunda e Sexta à noite</p>
            </div>

            <div className="p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-[#6B6760]">
                Progresso
              </p>
              <p className="mt-1 text-lg font-semibold text-[#0F3D56] tabular-nums">
                {completedActivitiesCount} / {totalActivities} etapas
              </p>
              <p className="mt-0.5 text-xs text-[#6B6760]">Salvo no navegador</p>
            </div>

            <div className="p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-[#6B6760]">
                Quarta (18/11)
              </p>
              <p className="mt-1 text-lg font-semibold text-[#1A1917]">
                {wednesdayChoice === 'ipanema' ? 'Praia de Ipanema' : 'Museu do Amanhã'}
              </p>
              <p className="mt-0.5 text-xs text-[#6B6760]">Alternável no Dia 03</p>
            </div>
          </div>
        </section>

        {/* Live Weather Forecast Section */}
        <RioWeatherStrip />

        {/* Day-by-Day Itinerary Section */}
        <section id="dia-a-dia" className="border-t border-[#DDD9D0] bg-[#F3F1EC] py-12 sm:py-14">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#DDD9D0]">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1A1917] text-balance">
                  Itinerário Dia a Dia
                </h2>
              </div>

              <div className="no-print flex flex-wrap items-center gap-3">
                <div
                  role="group"
                  aria-label="Filtrar por região"
                  className="flex flex-wrap items-center gap-1 p-1 bg-[#E7E4DC] rounded-lg"
                >
                  {REGION_FILTERS.map((item) => {
                    const active = regionFilter === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRegionFilter(item.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-white text-[#1A1917] shadow-xs'
                            : 'text-[#5A564F] hover:text-[#1A1917]'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <div
                  role="group"
                  aria-label="Formato de exibição"
                  className="flex items-center gap-1 p-1 bg-[#E7E4DC] rounded-lg"
                >
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      viewMode === 'cards'
                        ? 'bg-white text-[#1A1917] shadow-xs'
                        : 'text-[#5A564F] hover:text-[#1A1917]'
                    }`}
                  >
                    Detalhado
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      viewMode === 'table'
                        ? 'bg-white text-[#1A1917] shadow-xs'
                        : 'text-[#5A564F] hover:text-[#1A1917]'
                    }`}
                  >
                    Tabela Geral
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'cards' ? (
              <div className="mt-8 space-y-6">
                {filteredDays.map((day) => (
                  <DayCard
                    key={day.dayNumber}
                    day={day}
                    completedIds={completedIds}
                    onToggleComplete={toggleActivityComplete}
                    wednesdayChoice={wednesdayChoice}
                    onChangeWednesdayChoice={setWednesdayChoice}
                    note={notes[day.dayNumber] || ''}
                    onSaveNote={handleSaveNote}
                    customPlaces={customPlacesByDay[day.dayNumber] ?? []}
                    onRemoveCustomPlace={handleRemovePlaceFromDay}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 bg-white border border-[#DDD9D0] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#DDD9D0] bg-[#F8F7F4] text-xs font-mono uppercase tracking-wider text-[#6B6760]">
                        <th className="py-3.5 px-5 font-medium whitespace-nowrap">Data</th>
                        <th className="py-3.5 px-5 font-medium whitespace-nowrap">Dia da Semana</th>
                        <th className="py-3.5 px-5 font-medium">Manhã / Tarde</th>
                        <th className="py-3.5 px-5 font-medium">Noite</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ECE9E2] text-sm">
                      {filteredDays.map((day) => {
                        const morningOption = day.morning.options?.find(
                          (o) => o.id === wednesdayChoice
                        );
                        const morningTitle = morningOption
                          ? morningOption.label
                          : day.morning.title;
                        const morningDesc = morningOption
                          ? morningOption.description
                          : day.morning.description;
                        const extras = customPlacesByDay[day.dayNumber] ?? [];

                        return (
                          <tr key={day.dayNumber} className="align-top hover:bg-[#FAF9F6]">
                            <td className="py-4 px-5 font-mono font-medium text-[#0F3D56] tabular-nums whitespace-nowrap">
                              {day.date}
                            </td>
                            <td className="py-4 px-5 font-medium text-[#1A1917] whitespace-nowrap">
                              {day.weekday}
                            </td>
                            <td className="py-4 px-5 text-[#3F3C36] max-w-md">
                              <div className="flex items-start gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => toggleActivityComplete(day.morning.id)}
                                  aria-label={`Marcar ${morningTitle} como concluído`}
                                  className={`no-print mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                    completedIds[day.morning.id]
                                      ? 'bg-[#1A4D3E] border-[#1A4D3E] text-white'
                                      : 'border-[#C9C4B8] bg-white hover:border-[#0F3D56]'
                                  }`}
                                >
                                  {completedIds[day.morning.id] && (
                                    <Check className="w-3 h-3" strokeWidth={2.5} />
                                  )}
                                </button>
                                <div>
                                  <span
                                    className={`font-semibold ${
                                      completedIds[day.morning.id]
                                        ? 'line-through text-[#8A857D]'
                                        : 'text-[#1A1917]'
                                    }`}
                                  >
                                    {morningTitle}:
                                  </span>{' '}
                                  <span>{morningDesc}</span>

                                  {extras.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {extras.map((ex) => (
                                        <div
                                          key={ex.id}
                                          className="flex items-center gap-1.5 text-xs text-[#0F3D56]"
                                        >
                                          <span>+ {ex.name}</span>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleRemovePlaceFromDay(day.dayNumber, ex.id)
                                            }
                                            aria-label={`Remover ${ex.name}`}
                                            className="no-print text-[#8A857D] hover:text-[#9A3412]"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-5 text-[#3F3C36] max-w-md">
                              {day.evening ? (
                                <div className="flex items-start gap-2.5">
                                  <button
                                    type="button"
                                    onClick={() => toggleActivityComplete(day.evening!.id)}
                                    aria-label={`Marcar ${day.evening.title} como concluído`}
                                    className={`no-print mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                      completedIds[day.evening.id]
                                        ? 'bg-[#1A4D3E] border-[#1A4D3E] text-white'
                                        : 'border-[#C9C4B8] bg-white hover:border-[#0F3D56]'
                                    }`}
                                  >
                                    {completedIds[day.evening.id] && (
                                      <Check className="w-3 h-3" strokeWidth={2.5} />
                                    )}
                                  </button>
                                  <div>
                                    <span
                                      className={`font-semibold ${
                                        completedIds[day.evening.id]
                                          ? 'line-through text-[#8A857D]'
                                          : 'text-[#1A1917]'
                                      }`}
                                    >
                                      {day.evening.title}:
                                    </span>{' '}
                                    <span>{day.evening.description}</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[#8A857D]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Suggested Places to Add */}
        <SuggestedPlaces
          customPlacesByDay={customPlacesByDay}
          onAddPlaceToDay={handleAddPlaceToDay}
          onRemovePlaceFromDay={handleRemovePlaceFromDay}
        />

        {/* Geographic Connections & Editorial Triptych */}
        <section id="conexoes" className="border-t border-[#DDD9D0] bg-[#F3F1EC] py-12 sm:py-14">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <div className="max-w-2xl mb-8">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1A1917] text-balance">
                Mapa de Zonas
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#3F3C36]">
                Passeios agrupados por proximidade para evitar deslocamentos longos.
              </p>
            </div>

            <RioZoneMap onSelectRegion={setRegionFilter} />

            {/* 3-Frame Editorial Gallery */}
            <div className="mt-12 pt-10 border-t border-[#DDD9D0]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {GALLERY_IMAGES.map((item) => (
                  <figure key={item.id} className="flex flex-col">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#DDD9D0] bg-[#E7E4DC]">
                      <ResilientImage
                        src={item.src}
                        alt={item.alt}
                        fallbackTitle={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-3">
                      <span className="text-xs font-mono text-[#6B6760]">{item.figure}</span>
                      <h3 className="font-serif text-lg font-semibold text-[#1A1917] mt-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#5A564F] mt-1">
                        {item.subtitle}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Checklist & Trip Readiness */}
        <section id="preparativos" className="border-t border-[#DDD9D0] bg-[#F8F7F4] py-12 sm:py-14">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1A1917] text-balance">
                  Preparativos
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#3F3C36]">
                  Ingressos, itens práticos e reservas antes do embarque.
                </p>

                <div className="mt-6 pt-5 border-t border-[#DDD9D0] flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-semibold text-[#0F3D56] tabular-nums">
                    {checklistDoneCount}/{checklist.length}
                  </span>
                  <span className="text-sm text-[#5A564F]">concluídos</span>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white border border-[#DDD9D0] rounded-xl p-6 sm:p-8">
                <ul className="divide-y divide-[#ECE9E2]">
                  {checklist.map((item) => (
                    <li
                      key={item.id}
                      className="py-3.5 first:pt-0 flex items-start justify-between gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => toggleChecklistItem(item.id)}
                        className="flex items-start gap-3 text-left group flex-1 min-h-[40px] py-1"
                      >
                        <span
                          className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            item.done
                              ? 'bg-[#1A4D3E] border-[#1A4D3E] text-white'
                              : 'border-[#C9C4B8] bg-white group-hover:border-[#0F3D56]'
                          }`}
                        >
                          {item.done && <Check className="w-3 h-3" strokeWidth={2.5} />}
                        </span>
                        <span className="flex-1">
                          <span
                            className={`block text-sm font-medium leading-snug ${
                              item.done ? 'line-through text-[#8A857D]' : 'text-[#1A1917]'
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="block text-xs text-[#6B6760] mt-0.5">
                            {item.category}
                          </span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteChecklistItem(item.id)}
                        aria-label={`Remover ${item.label}`}
                        className="no-print p-2 text-[#8A857D] hover:text-[#9A3412] transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                <form
                  onSubmit={handleAddChecklistItem}
                  className="no-print mt-6 pt-5 border-t border-[#ECE9E2] flex flex-col sm:flex-row gap-3"
                >
                  <label htmlFor="new-checklist-item" className="sr-only">
                    Novo item na lista de preparativos
                  </label>
                  <input
                    id="new-checklist-item"
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Adicionar item (ex.: Cartão Riocard)"
                    className="flex-1 rounded-lg border border-[#D4CFC5] bg-[#F8F7F4] px-3.5 py-2.5 text-sm text-[#1A1917] placeholder:text-[#8A857D] focus:outline-none focus:ring-2 focus:ring-[#0F3D56]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0F3D56] text-white text-xs font-semibold hover:bg-[#0B2E42] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#DDD9D0] bg-[#F8F7F4] py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6B6760]">
          <p className="font-serif text-sm text-[#1A1917]">
            Caderno Carioca · Rio de Janeiro (16 a 23 de Novembro)
          </p>
          <p>Zona Sul, Centro, Santa Teresa e São Cristóvão</p>
        </div>
      </footer>
    </div>
  );
}
