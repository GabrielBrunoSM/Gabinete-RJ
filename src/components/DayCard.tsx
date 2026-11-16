import { useState } from 'react';
import { Check, MapPin, MessageSquarePlus, ExternalLink, X } from 'lucide-react';
import type { ItineraryDay, ActivitySlot, SuggestedPlace } from '../data/itinerary';

interface DayCardProps {
  day: ItineraryDay;
  completedIds: Record<string, boolean>;
  onToggleComplete: (id: string) => void;
  wednesdayChoice: 'ipanema' | 'amanha';
  onChangeWednesdayChoice: (choice: 'ipanema' | 'amanha') => void;
  note: string;
  onSaveNote: (dayNumber: string, text: string) => void;
  customPlaces: SuggestedPlace[];
  onRemoveCustomPlace: (dayNumber: string, placeId: string) => void;
}

export function DayCard({
  day,
  completedIds,
  onToggleComplete,
  wednesdayChoice,
  onChangeWednesdayChoice,
  note,
  onSaveNote,
  customPlaces,
  onRemoveCustomPlace,
}: DayCardProps) {
  const [editingNote, setEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState(note);

  const slots: ActivitySlot[] = day.evening ? [day.morning, day.evening] : [day.morning];
  const allDone = slots.every((s) => Boolean(completedIds[s.id]));

  const handleSave = () => {
    onSaveNote(day.dayNumber, draftNote.trim());
    setEditingNote(false);
  };

  return (
    <article className="bg-white border border-[#DDD9D0] rounded-xl p-6 sm:p-8 transition-colors print-break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 pb-4 border-b border-[#ECE9E2]">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-[#6B6760] tabular-nums">
          <span className="font-medium text-[#0F3D56]">Dia {day.dayNumber}</span>
          <span aria-hidden="true">·</span>
          <span>{day.date}</span>
          <span aria-hidden="true">·</span>
          <span>{day.weekday}</span>
          <span aria-hidden="true">·</span>
          <span className="font-sans">{day.regionLabel}</span>
        </div>

        {allDone && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A4D3E]">
            <Check className="w-3.5 h-3.5" strokeWidth={2.2} />
            Concluído
          </span>
        )}
      </div>

      <h3 className="font-serif text-2xl sm:text-[26px] font-semibold text-[#1A1917] mt-4 text-balance leading-snug">
        {day.headline}
      </h3>

      {day.strategicNote && (
        <p className="mt-3 text-sm leading-relaxed text-[#0F3D56] bg-[#F1F5F7] rounded-lg px-4 py-2.5">
          {day.strategicNote}
        </p>
      )}

      <div className={`mt-5 grid grid-cols-1 ${day.evening ? 'md:grid-cols-2 md:gap-10' : ''} gap-6`}>
        {slots.map((slot, index) => {
          const isChecked = Boolean(completedIds[slot.id]);
          const activeOption =
            slot.options?.find((opt) => opt.id === wednesdayChoice) ?? slot.options?.[0];

          const displayTitle = activeOption ? activeOption.label : slot.title;
          const displayDescription = activeOption ? activeOption.description : slot.description;
          const displayNeighborhood = activeOption
            ? activeOption.neighborhood
            : slot.neighborhood;
          const displayMapsQuery = activeOption ? activeOption.mapsQuery : slot.mapsQuery;

          return (
            <div
              key={slot.id}
              className={`${
                index === 1 ? 'md:border-l md:border-[#ECE9E2] md:pl-10 pt-5 md:pt-0 border-t md:border-t-0 border-[#ECE9E2]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#6B6760]">
                    {slot.period}
                  </p>
                  <h4
                    className={`font-sans text-lg font-semibold mt-1 transition-colors ${
                      isChecked ? 'line-through text-[#8A857D]' : 'text-[#1A1917]'
                    }`}
                  >
                    {displayTitle}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleComplete(slot.id)}
                  aria-pressed={isChecked}
                  aria-label={`Marcar ${displayTitle} como concluído`}
                  className={`no-print min-w-[40px] min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 ${
                    isChecked
                      ? 'bg-[#1A4D3E] text-white'
                      : 'bg-[#F8F7F4] text-[#37342F] hover:bg-[#ECE9E2]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{isChecked ? 'Feito' : 'Marcar'}</span>
                </button>
              </div>

              {slot.options && (
                <div className="no-print mt-3 inline-flex items-center p-1 bg-[#F1EFEA] rounded-lg gap-1">
                  {slot.options.map((opt) => {
                    const active = opt.id === wednesdayChoice;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          onChangeWednesdayChoice(opt.id as 'ipanema' | 'amanha')
                        }
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-white text-[#1A1917] shadow-xs'
                            : 'text-[#6B6760] hover:text-[#1A1917]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <p className="mt-2.5 text-[15px] leading-relaxed text-[#3F3C36]">
                {displayDescription}
              </p>

              {slot.tip && (
                <p className="mt-2 text-xs leading-relaxed text-[#6B6760]">
                  {slot.tip}
                </p>
              )}

              <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#6B6760]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0F3D56]" strokeWidth={1.75} />
                  {displayNeighborhood}
                </span>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayMapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-print inline-flex items-center gap-1 text-[#0F3D56] font-medium hover:underline whitespace-nowrap shrink-0"
                >
                  Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Added Suggestions for this Day */}
      {customPlaces.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[#ECE9E2]">
          <p className="text-xs font-mono uppercase tracking-wider text-[#6B6760] mb-2.5">
            Adicionados ao dia
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {customPlaces.map((place) => (
              <div
                key={place.id}
                className="flex items-start justify-between gap-3 rounded-lg bg-[#F8F7F4] border border-[#ECE9E2] px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1A1917] truncate">
                      {place.name}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapsQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ${place.name} no Maps`}
                      className="no-print text-[#0F3D56] hover:underline shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-[#5A564F] mt-0.5">
                    {place.neighborhood} · {place.note}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveCustomPlace(day.dayNumber, place.id)}
                  aria-label={`Remover ${place.name} do dia ${day.date}`}
                  className="no-print p-1 text-[#8A857D] hover:text-[#9A3412] transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Note */}
      <div className="mt-5 pt-4 border-t border-[#ECE9E2]">
        {!editingNote ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            {note ? (
              <p className="text-sm text-[#37342F]">
                <span className="font-medium text-[#1A1917]">Nota:</span> {note}
              </p>
            ) : (
              <span className="text-xs text-[#8A857D]">Sem notas para este dia</span>
            )}
            <button
              type="button"
              onClick={() => {
                setDraftNote(note);
                setEditingNote(true);
              }}
              className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-[#0F3D56] hover:underline whitespace-nowrap shrink-0"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              {note ? 'Editar nota' : 'Adicionar nota'}
            </button>
          </div>
        ) : (
          <div className="no-print space-y-3">
            <label className="block text-xs font-medium text-[#37342F]" htmlFor={`note-${day.dayNumber}`}>
              Nota para {day.date}
            </label>
            <textarea
              id={`note-${day.dayNumber}`}
              rows={2}
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Horário de ingresso, reserva ou ponto de encontro..."
              className="w-full rounded-lg border border-[#D4CFC5] bg-[#F8F7F4] px-3 py-2 text-sm text-[#1A1917] focus:outline-none focus:ring-2 focus:ring-[#0F3D56]"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-[#0F3D56] text-white text-xs font-semibold hover:bg-[#0B2E42] transition-colors"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setEditingNote(false)}
                className="px-4 py-1.5 rounded-lg bg-[#F1EFEA] text-[#37342F] text-xs font-medium hover:bg-[#E4E0D8] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
