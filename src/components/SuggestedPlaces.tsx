import { useState } from 'react';
import { Check, ExternalLink, MapPin, Plus } from 'lucide-react';
import {
  ITINERARY_DAYS,
  SUGGESTED_PLACES,
  type PlaceCategory,
  type SuggestedPlace,
} from '../data/itinerary';

interface SuggestedPlacesProps {
  customPlacesByDay: Record<string, SuggestedPlace[]>;
  onAddPlaceToDay: (dayNumber: string, place: SuggestedPlace) => void;
  onRemovePlaceFromDay: (dayNumber: string, placeId: string) => void;
}

const CATEGORIES: { id: PlaceCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'praias', label: 'Praias & Mirantes' },
  { id: 'gastronomia', label: 'Gastronomia & Bares' },
  { id: 'cultura', label: 'Cultura & História' },
];

export function SuggestedPlaces({
  customPlacesByDay,
  onAddPlaceToDay,
  onRemovePlaceFromDay,
}: SuggestedPlacesProps) {
  const [category, setCategory] = useState<PlaceCategory>('all');
  const [selectedDays, setSelectedDays] = useState<Record<string, string>>({});

  const visiblePlaces =
    category === 'all'
      ? SUGGESTED_PLACES
      : SUGGESTED_PLACES.filter((p) => p.category === category);

  const findAssignedDays = (placeId: string): string[] => {
    return Object.entries(customPlacesByDay)
      .filter(([, list]) => list.some((p) => p.id === placeId))
      .map(([dayNumber]) => dayNumber);
  };

  return (
    <section
      id="sugestoes"
      className="border-t border-[#DDD9D0] bg-[#F8F7F4] py-12 sm:py-14"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#DDD9D0]">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1A1917]">
              Sugestões para Encaixar no Roteiro
            </h2>
            <p className="text-sm text-[#5A564F] mt-1">
              Escolha o dia e clique para adicionar qualquer local direto ao planejamento.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filtrar sugestões por tipo"
            className="no-print flex flex-wrap items-center gap-1 p-1 bg-[#E7E4DC] rounded-lg self-start md:self-auto"
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white text-[#1A1917] shadow-xs'
                      : 'text-[#5A564F] hover:text-[#1A1917]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visiblePlaces.map((place) => {
            const targetDay = selectedDays[place.id] ?? place.suggestedDay;
            const assignedDays = findAssignedDays(place.id);
            const isAddedToSelected = assignedDays.includes(targetDay);

            return (
              <div
                key={place.id}
                className="bg-white border border-[#DDD9D0] rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#6B6760]">
                    <span>{place.categoryLabel}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#0F3D56]" />
                      {place.neighborhood}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-[#1A1917] mt-1.5">
                    {place.name}
                  </h3>
                  <p className="text-sm text-[#4A4742] mt-1 leading-snug">
                    {place.note}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#ECE9E2] flex items-center justify-between gap-2">
                  <div className="no-print flex items-center gap-2 flex-1 min-w-0">
                    <select
                      aria-label={`Escolher dia para ${place.name}`}
                      value={targetDay}
                      onChange={(e) =>
                        setSelectedDays((prev) => ({ ...prev, [place.id]: e.target.value }))
                      }
                      className="rounded-lg border border-[#D4CFC5] bg-[#F8F7F4] px-2.5 py-1.5 text-xs font-mono text-[#1A1917] focus:outline-none focus:ring-2 focus:ring-[#0F3D56]"
                    >
                      {ITINERARY_DAYS.map((d) => (
                        <option key={d.dayNumber} value={d.dayNumber}>
                          {d.date} ({d.weekday.slice(0, 3)})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        if (isAddedToSelected) {
                          onRemovePlaceFromDay(targetDay, place.id);
                        } else {
                          onAddPlaceToDay(targetDay, place);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        isAddedToSelected
                          ? 'bg-[#1A4D3E] text-white hover:bg-[#143D31]'
                          : 'bg-[#0F3D56] text-white hover:bg-[#0B2E42]'
                      }`}
                    >
                      {isAddedToSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Adicionado</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adicionar</span>
                        </>
                      )}
                    </button>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver ${place.name} no Google Maps`}
                    className="no-print p-1.5 text-[#0F3D56] hover:bg-[#F1F5F7] rounded-md transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
