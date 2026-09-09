import { useMemo, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import Card from "../components/Card";
import Field, { inputClass, selectClass } from "../components/Field";
import PageHead from "../components/PageHead";
import Row from "../components/Row";
import {
  formatLunar,
  ganjiOf,
  isYearSupported,
  leapMonthOf,
  LUNAR_MAX_YEAR,
  LUNAR_MIN_YEAR,
  lunarToSolar,
  solarToLunar,
} from "../lib/lunar";

type Mode = "solarToLunar" | "lunarToSolar";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

const LunarConverter = () => {
  const [mode, setMode] = useState<Mode>("solarToLunar");

  const [solarInput, setSolarInput] = useState(format(new Date(), "yyyy-MM-dd"));
  const [lunarYear, setLunarYear] = useState(String(new Date().getFullYear()));
  const [lunarMonth, setLunarMonth] = useState("1");
  const [lunarDay, setLunarDay] = useState("1");
  const [isLeap, setIsLeap] = useState(false);

  const solarResult = useMemo(() => {
    if (mode !== "solarToLunar") return null;
    const date = solarInput ? parseISO(solarInput) : null;
    if (!date || !isValid(date)) return null;

    const lunar = solarToLunar({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
    if (!lunar) {
      return {
        error: `${LUNAR_MIN_YEAR}년 ~ ${LUNAR_MAX_YEAR}년 범위만 변환할 수 있습니다.`,
      } as const;
    }
    return { error: null, date, lunar, ganji: ganjiOf(lunar.year) };
  }, [mode, solarInput]);

  const yearNumber = Number(lunarYear);
  const yearInRange = isYearSupported(yearNumber);

  const leapMonth = useMemo(
    () => (yearInRange ? leapMonthOf(yearNumber) : null),
    [yearInRange, yearNumber]
  );
  const leapAvailable = leapMonth !== null && leapMonth === Number(lunarMonth);

  const lunarResult = useMemo(() => {
    if (mode !== "lunarToSolar") return null;
    if (!yearInRange) {
      return {
        error: `${LUNAR_MIN_YEAR}년 ~ ${LUNAR_MAX_YEAR}년 사이로 입력해 주세요.`,
      } as const;
    }

    const solar = lunarToSolar({
      year: yearNumber,
      month: Number(lunarMonth),
      day: Number(lunarDay),
      isLeapMonth: leapAvailable && isLeap,
    });

    if (!solar) {
      return {
        error: "그 음력 날짜는 없습니다. 29일까지만 있는 달입니다.",
      } as const;
    }

    return {
      error: null,
      date: new Date(solar.year, solar.month - 1, solar.day),
      ganji: ganjiOf(yearNumber),
    };
  }, [
    mode,
    yearInRange,
    yearNumber,
    lunarMonth,
    lunarDay,
    isLeap,
    leapAvailable,
  ]);

  const tabClass = (active: boolean) =>
    `flex-1 border-[1.5px] px-3 py-2.5 text-[13.5px] ${
      active
        ? "border-accent bg-surface font-semibold text-accent"
        : "border-line bg-surface text-muted hover:border-accent-line"
    }`;

  return (
    <div className="grid gap-[18px]">
      <PageHead title="양음력 변환기" />

      <Card label="변환 선택">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("solarToLunar")}
            className={tabClass(mode === "solarToLunar")}
          >
            양력 → 음력
          </button>
          <button
            type="button"
            onClick={() => setMode("lunarToSolar")}
            className={tabClass(mode === "lunarToSolar")}
          >
            음력 → 양력
          </button>
        </div>

        {mode === "solarToLunar" ? (
          <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
            <Field label="양력 날짜" htmlFor="solar">
              <input
                id="solar"
                type="date"
                className={inputClass}
                value={solarInput}
                onChange={(e) => setSolarInput(e.target.value)}
              />
            </Field>
          </div>
        ) : (
          <div className="mt-[18px] grid gap-3.5">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(110px,1fr))]">
              <Field label="음력 연도" htmlFor="lunar-year">
                <input
                  id="lunar-year"
                  type="number"
                  min={LUNAR_MIN_YEAR}
                  max={LUNAR_MAX_YEAR}
                  className={inputClass}
                  value={lunarYear}
                  onChange={(e) => setLunarYear(e.target.value)}
                />
              </Field>
              <Field label="월" htmlFor="lunar-month">
                <select
                  id="lunar-month"
                  className={selectClass}
                  value={lunarMonth}
                  onChange={(e) => setLunarMonth(e.target.value)}
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}월
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="일" htmlFor="lunar-day">
                <select
                  id="lunar-day"
                  className={selectClass}
                  value={lunarDay}
                  onChange={(e) => setLunarDay(e.target.value)}
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}일
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <label
              className={`flex flex-wrap items-center gap-2 text-[13px] ${
                leapAvailable ? "text-ink-soft" : "text-muted"
              }`}
            >
              <input
                type="checkbox"
                className="accent-accent"
                disabled={!leapAvailable}
                checked={leapAvailable && isLeap}
                onChange={(e) => setIsLeap(e.target.checked)}
              />
              윤달
              {yearInRange && leapMonth !== null && (
                <span className="text-[12px] text-muted">
                  {yearNumber}년 윤달은 음력 {leapMonth}월
                </span>
              )}
              {yearInRange && leapMonth === null && (
                <span className="text-[12px] text-muted">
                  {yearNumber}년에는 윤달이 없습니다
                </span>
              )}
            </label>
          </div>
        )}

        {lunarResult?.error && (
          <p className="mt-4 border-[1.5px] border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">
            {lunarResult.error}
          </p>
        )}

        {solarResult?.error && (
          <p className="mt-4 border-[1.5px] border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">
            {solarResult.error}
          </p>
        )}

        {solarResult && !solarResult.error && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row
              label={`양력 ${format(solarResult.date, "yyyy.MM.dd")}`}
              value={`음력 ${formatLunar(solarResult.lunar)}`}
              emphasis
            />
            <Row label="간지" value={solarResult.ganji.name} />
            <Row label="띠" value={`${solarResult.ganji.zodiac}띠`} />
            <Row
              label="요일"
              value={format(solarResult.date, "EEEE", { locale: ko })}
              last
            />
          </div>
        )}

        {lunarResult && !lunarResult.error && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row
              label={`음력 ${yearNumber}.${lunarMonth}.${lunarDay}${
                leapAvailable && isLeap ? " (윤달)" : ""
              }`}
              value={`양력 ${format(lunarResult.date, "yyyy.MM.dd")}`}
              emphasis
            />
            <Row label="간지" value={lunarResult.ganji.name} />
            <Row label="띠" value={`${lunarResult.ganji.zodiac}띠`} />
            <Row
              label="요일"
              value={format(lunarResult.date, "EEEE", { locale: ko })}
              last
            />
          </div>
        )}
      </Card>

      <p className="text-[12.5px] text-muted">
        한국천문연구원(KASI) 발표 자료를 기준으로 계산합니다. 변환 가능 범위는
        {" "}
        {LUNAR_MIN_YEAR}년 ~ {LUNAR_MAX_YEAR}년입니다.
      </p>
    </div>
  );
};

export default LunarConverter;
