import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { inputClass } from "./Field";
import type { DateParts } from "../lib/dateParts";

type DatePartsInputProps = {
  label: string;
  id: string;
  value: DateParts;
  onChange: (value: DateParts) => void;
};

/**
 * 연·월·일을 칸으로 나눈 날짜 입력.
 *
 * type="date" 는 달력을 열어 연도부터 거슬러 올라가야 해서 생년월일처럼
 * 먼 날짜를 넣기 번거롭다. 숫자만 치면 다음 칸으로 넘어간다.
 */
const DatePartsInput = ({ label, id, value, onChange }: DatePartsInputProps) => {
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const digits = (raw: string, max: number) => raw.replace(/\D/g, "").slice(0, max);

  const setYear = (raw: string) => {
    const year = digits(raw, 4);
    onChange({ ...value, year });
    if (year.length === 4) monthRef.current?.focus();
  };

  const setMonth = (raw: string) => {
    const month = digits(raw, 2);
    onChange({ ...value, month });
    // 두 자리를 다 쳤거나, 첫 자리가 2 이상이면 더 올 숫자가 없다.
    if (month.length === 2 || Number(month) > 1) dayRef.current?.focus();
  };

  const setDay = (raw: string) => onChange({ ...value, day: digits(raw, 2) });

  // 빈 칸에서 지우기를 누르면 앞 칸으로 돌아간다.
  const backTo =
    (prevId: string, current: string) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && current === "") {
        document.getElementById(prevId)?.focus();
      }
    };

  const part = (partId: string, suffix: string, input: ReactNode) => (
    <div key={partId} className="relative">
      {input}
      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[13px] text-muted">
        {suffix}
      </span>
    </div>
  );

  const fieldClass = `${inputClass} pr-8`;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={`${id}-year`} className="text-[12.5px] text-muted">
        {label}
      </label>
      <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2">
        {part(
          "year",
          "년",
          <input
            id={`${id}-year`}
            inputMode="numeric"
            autoComplete="off"
            placeholder="1990"
            aria-label={`${label} 연도`}
            className={fieldClass}
            onFocus={(e) => e.target.select()}
            value={value.year}
            onChange={(e) => setYear(e.target.value)}
          />
        )}
        {part(
          "month",
          "월",
          <input
            id={`${id}-month`}
            ref={monthRef}
            inputMode="numeric"
            autoComplete="off"
            placeholder="1"
            aria-label={`${label} 월`}
            className={fieldClass}
            onFocus={(e) => e.target.select()}
            value={value.month}
            onChange={(e) => setMonth(e.target.value)}
            onKeyDown={backTo(`${id}-year`, value.month)}
          />
        )}
        {part(
          "day",
          "일",
          <input
            id={`${id}-day`}
            ref={dayRef}
            inputMode="numeric"
            autoComplete="off"
            placeholder="1"
            aria-label={`${label} 일`}
            className={fieldClass}
            onFocus={(e) => e.target.select()}
            value={value.day}
            onChange={(e) => setDay(e.target.value)}
            onKeyDown={backTo(`${id}-month`, value.day)}
          />
        )}
      </div>
    </div>
  );
};

export default DatePartsInput;
