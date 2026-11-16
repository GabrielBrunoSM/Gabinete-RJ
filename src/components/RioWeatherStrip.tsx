import { useCallback, useEffect, useState } from 'react';
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  RefreshCw,
  Sun,
} from 'lucide-react';

interface DailyForecast {
  dateIso: string;
  dateShort: string;
  weekdayShort: string;
  maxTemp: number;
  minTemp: number;
  precipProb: number;
  weatherCode: number;
}

interface WeatherState {
  currentTemp: number | null;
  currentCode: number | null;
  days: DailyForecast[];
}

const WEEKDAY_SHORT_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function describeWmoCode(code: number): { label: string; Icon: typeof Sun } {
  if (code === 0) return { label: 'Céu limpo', Icon: Sun };
  if (code >= 1 && code <= 2) return { label: 'Poucas nuvens', Icon: CloudSun };
  if (code === 3 || code === 45 || code === 48) return { label: 'Nublado', Icon: Cloud };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return { label: 'Chuva', Icon: CloudRain };
  }
  if (code >= 95) return { label: 'Trovoada', Icon: CloudLightning };
  return { label: 'Parcialmente nublado', Icon: CloudSun };
}

function formatIsoToShort(isoDate: string): { dateShort: string; weekdayShort: string } {
  const [year, month, day] = isoDate.split('-').map(Number);
  const dt = new Date(year, month - 1, day);
  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  return {
    dateShort: `${dd}/${mm}`,
    weekdayShort: WEEKDAY_SHORT_PT[dt.getDay()] ?? '',
  };
}

export function RioWeatherStrip() {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=-22.9068&longitude=-43.1729&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FSao_Paulo&start_date=2026-11-16&end_date=2026-11-23';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Falha ao consultar previsão');
      const data = await res.json();

      const times: string[] = data?.daily?.time ?? [];
      const maxTemps: number[] = data?.daily?.temperature_2m_max ?? [];
      const minTemps: number[] = data?.daily?.temperature_2m_min ?? [];
      const precipProbs: number[] = data?.daily?.precipitation_probability_max ?? [];
      const codes: number[] = data?.daily?.weather_code ?? [];

      const days: DailyForecast[] = times.map((iso, i) => {
        const { dateShort, weekdayShort } = formatIsoToShort(iso);
        return {
          dateIso: iso,
          dateShort,
          weekdayShort,
          maxTemp: Math.round(maxTemps[i] ?? 0),
          minTemp: Math.round(minTemps[i] ?? 0),
          precipProb: Math.round(precipProbs[i] ?? 0),
          weatherCode: codes[i] ?? 1,
        };
      });

      setWeather({
        currentTemp:
          typeof data?.current?.temperature_2m === 'number'
            ? Math.round(data.current.temperature_2m)
            : null,
        currentCode:
          typeof data?.current?.weather_code === 'number'
            ? data.current.weather_code
            : null,
        days,
      });
    } catch {
      setError('Não foi possível carregar os dados climáticos agora.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const currentInfo =
    weather?.currentCode !== null && weather?.currentCode !== undefined
      ? describeWmoCode(weather.currentCode)
      : null;

  return (
    <section
      id="previsao"
      className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-10"
      aria-label="Previsão para o Rio"
    >
      <div className="bg-white border border-[#DDD9D0] rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ECE9E2]">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1917]">
              Previsão para o Rio
            </h2>
            <span className="text-xs font-mono text-[#6B6760] tabular-nums">
              16/11 – 23/11 · Open-Meteo
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#5A564F]">
            {weather && weather.currentTemp !== null && currentInfo && (
              <span className="inline-flex items-center gap-1.5 font-medium text-[#1A1917] tabular-nums">
                <currentInfo.Icon className="w-4 h-4 text-[#0F3D56]" strokeWidth={1.75} />
                Agora: {weather.currentTemp}°C · {currentInfo.label}
              </span>
            )}
            <button
              type="button"
              onClick={fetchWeather}
              disabled={loading}
              aria-label="Atualizar previsão do tempo"
              className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-[#0F3D56] hover:underline disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {loading && !weather ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-24 rounded-lg bg-[#F3F1EC] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#5A564F]">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchWeather}
              className="px-3 py-1.5 rounded-lg bg-[#0F3D56] text-white text-xs font-semibold hover:bg-[#0B2E42] transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-4">
            {weather?.days.map((day) => {
              const { label, Icon } = describeWmoCode(day.weatherCode);
              return (
                <div
                  key={day.dateIso}
                  className="rounded-lg bg-[#F8F7F4] border border-[#ECE9E2] p-3 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-[#6B6760] tabular-nums">
                    <span className="font-medium text-[#1A1917]">{day.dateShort}</span>
                    <span>{day.weekdayShort}</span>
                  </div>

                  <div className="my-2.5 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#0F3D56] shrink-0" strokeWidth={1.75} />
                    <span className="text-xs text-[#3F3C36] truncate" title={label}>
                      {label}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs tabular-nums">
                    <span className="font-semibold text-[#1A1917]">
                      {day.maxTemp}° <span className="font-normal text-[#6B6760]">/ {day.minTemp}°</span>
                    </span>
                    <span className="text-[#5A564F]" title="Probabilidade de chuva">
                      {day.precipProb}% chuva
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
