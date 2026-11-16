import { useState } from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { ZONE_NODES, type ZoneNode, type RegionFilter } from '../data/itinerary';

interface RioZoneMapProps {
  onSelectRegion: (region: RegionFilter) => void;
}

export function RioZoneMap({ onSelectRegion }: RioZoneMapProps) {
  const [selectedNode, setSelectedNode] = useState<ZoneNode>(ZONE_NODES[2]); // Santa Teresa & Lapa default highlight

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <div className="lg:col-span-7 bg-[#F1EFEA] border border-[#DDD9D0] rounded-xl p-4 sm:p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#DDD9D0]">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[#6B6760]">
              Esquema Geográfico · Clique nos pontos
            </p>
            <h3 className="font-serif text-xl font-semibold text-[#1A1917] mt-1">
              Conexão entre Zonas do Roteiro
            </h3>
          </div>
          <span className="text-xs font-mono text-[#6B6760] tabular-nums whitespace-nowrap shrink-0">
            7 polos · 8 dias
          </span>
        </div>

        <div className="relative w-full my-4">
          <svg
            viewBox="0 0 560 400"
            className="w-full h-auto block select-none"
            role="img"
            aria-label="Mapa esquemático dos bairros do roteiro no Rio de Janeiro"
          >
            {/* Water: Baía de Guanabara & Oceano Atlântico */}
            <rect x="0" y="0" width="560" height="400" rx="8" fill="#E3ECEF" />

            {/* Landmass silhouette (simplified cartographic Rio coastline) */}
            <path
              d="M 0,0 L 420,0 C 415,45 398,92 405,135 C 412,168 386,185 385,212 C 384,238 430,240 434,258 C 438,274 390,278 372,302 C 355,326 364,344 336,356 C 288,376 198,370 118,382 C 62,390 25,392 0,395 Z"
              fill="#F8F7F4"
              stroke="#C9C4B8"
              strokeWidth="1.5"
            />

            {/* Lagoa Rodrigo de Freitas */}
            <path
              d="M 244,308 C 258,298 276,304 282,318 C 288,332 272,340 254,336 C 238,332 234,318 244,308 Z"
              fill="#D4E4EA"
              stroke="#A9C4CF"
              strokeWidth="1"
            />
            <text
              x="258"
              y="324"
              textAnchor="middle"
              className="fill-[#5A7582] text-[8px] font-sans"
            >
              Lagoa
            </text>

            {/* Water Labels */}
            <text
              x="476"
              y="148"
              textAnchor="middle"
              className="fill-[#557482] text-[10px] font-serif italic"
            >
              Baía de Guanabara
            </text>
            <text
              x="455"
              y="366"
              textAnchor="middle"
              className="fill-[#557482] text-[10px] font-serif italic"
            >
              Oceano Atlântico
            </text>

            {/* Geographic Route Connection Lines */}
            {/* Friday special connection: Selaron -> Santa Teresa -> Lapa */}
            <path
              d="M 365,122 L 342,175 L 245,230 L 215,295 L 318,344"
              fill="none"
              stroke="#0F3D56"
              strokeOpacity="0.2"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 245,88 L 365,122"
              fill="none"
              stroke="#0F3D56"
              strokeOpacity="0.2"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 342,175 L 410,252 L 318,344"
              fill="none"
              stroke="#0F3D56"
              strokeOpacity="0.2"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Interactive Zone Pins */}
            {ZONE_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(node)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Selecionar ${node.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedNode(node);
                    }
                  }}
                >
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="16"
                      fill="#0F3D56"
                      fillOpacity="0.14"
                    />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 7.5 : 5.5}
                    fill={isSelected ? '#0F3D56' : '#FFFFFF'}
                    stroke="#0F3D56"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x + (node.x > 340 ? -12 : 12)}
                    y={node.y + 4}
                    textAnchor={node.x > 340 ? 'end' : 'start'}
                    className={`text-[11px] font-sans transition-colors ${
                      isSelected
                        ? 'fill-[#0F3D56] font-semibold'
                        : 'fill-[#37342F] font-medium group-hover:fill-[#0F3D56]'
                    }`}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t border-[#DDD9D0] text-xs text-[#6B6760]">
          <span>Trajeto contínuo sugerido</span>
          <span aria-hidden="true">·</span>
          <span>Clique em qualquer polo para ver logística e dias correspondentes</span>
        </div>
      </div>

      {/* Selected Zone Detail Panel */}
      <div className="lg:col-span-5 bg-white border border-[#DDD9D0] rounded-xl p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6B6760] font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#0F3D56]" strokeWidth={1.75} />
            <span>{selectedNode.days.join(' · ')}</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1A1917] mt-3 text-balance">
            {selectedNode.name}
          </h3>
          <p className="text-sm font-medium text-[#0F3D56] mt-1">
            {selectedNode.subtitle}
          </p>

          <div className="my-6 border-t border-[#ECE9E2]" />

          <p className="text-[15px] leading-relaxed text-[#3F3C36]">
            {selectedNode.connectionNote}
          </p>

          <div className="mt-6 pt-5 border-t border-[#ECE9E2]">
            <p className="text-xs font-mono uppercase tracking-wider text-[#6B6760] mb-3">
              Explorar outros polos no mapa
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ZONE_NODES.map((node) => {
                const active = node.id === selectedNode.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors truncate ${
                      active
                        ? 'bg-[#0F3D56] text-white'
                        : 'bg-[#F8F7F4] text-[#37342F] hover:bg-[#ECE9E2]'
                    }`}
                  >
                    {node.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-[#ECE9E2] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              onSelectRegion(selectedNode.regionKey);
              document.getElementById('dia-a-dia')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F3D56] text-white text-xs font-semibold hover:bg-[#0B2E42] transition-colors whitespace-nowrap shrink-0"
          >
            Filtrar dias desta região
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedNode.name + ' Rio de Janeiro')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[#0F3D56] hover:underline whitespace-nowrap shrink-0"
          >
            Abrir no Maps
          </a>
        </div>
      </div>
    </div>
  );
}
