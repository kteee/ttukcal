import { useMemo, useState } from "react";
import Card from "../components/Card";
import Field, { inputClass } from "../components/Field";
import PageHead from "../components/PageHead";
import Row from "../components/Row";

type Unit = {
  id: string;
  label: string;
  /** 이 단위 1 이 기준 단위로 몇인지. 온도는 별도 처리. */
  toBase: number;
};

type Category = {
  id: string;
  label: string;
  units: Unit[];
  /** 기본 선택 단위 */
  defaultUnit: string;
};

// 평은 400/121 ㎡ 로 딱 떨어진다. (3.3058...)
const CATEGORIES: Category[] = [
  {
    id: "area",
    label: "면적",
    defaultUnit: "pyeong",
    units: [
      { id: "pyeong", label: "평", toBase: 400 / 121 },
      { id: "m2", label: "㎡", toBase: 1 },
      { id: "ft2", label: "ft²", toBase: 0.09290304 },
    ],
  },
  {
    id: "length",
    label: "길이",
    defaultUnit: "cm",
    units: [
      { id: "cm", label: "cm", toBase: 0.01 },
      { id: "m", label: "m", toBase: 1 },
      { id: "inch", label: "inch", toBase: 0.0254 },
      { id: "ft", label: "ft", toBase: 0.3048 },
      { id: "km", label: "km", toBase: 1000 },
      { id: "mile", label: "mile", toBase: 1609.344 },
    ],
  },
  {
    id: "weight",
    label: "무게",
    defaultUnit: "kg",
    units: [
      { id: "g", label: "g", toBase: 0.001 },
      { id: "kg", label: "kg", toBase: 1 },
      { id: "lb", label: "lb (파운드)", toBase: 0.45359237 },
      { id: "oz", label: "oz (온스)", toBase: 0.028349523125 },
      { id: "geun", label: "근 (600g)", toBase: 0.6 },
      { id: "don", label: "돈 (3.75g)", toBase: 0.00375 },
    ],
  },
];

const TEMPERATURE = [
  { id: "c", label: "℃ (섭씨)" },
  { id: "f", label: "℉ (화씨)" },
  { id: "k", label: "K (켈빈)" },
];

/** 자릿수에 따라 소수점을 적당히 잘라 준다. */
function fmt(n: number): string {
  if (!Number.isFinite(n)) return "-";
  const abs = Math.abs(n);
  const digits = abs >= 1000 ? 2 : abs >= 1 ? 4 : 6;
  return n.toLocaleString("ko-KR", { maximumFractionDigits: digits });
}

function toCelsius(value: number, from: string): number {
  if (from === "f") return ((value - 32) * 5) / 9;
  if (from === "k") return value - 273.15;
  return value;
}

function fromCelsius(celsius: number, to: string): number {
  if (to === "f") return (celsius * 9) / 5 + 32;
  if (to === "k") return celsius + 273.15;
  return celsius;
}

const UnitConverter = () => {
  const [categoryId, setCategoryId] = useState("area");
  const [unitId, setUnitId] = useState("pyeong");
  const [value, setValue] = useState("");

  const category = CATEGORIES.find((c) => c.id === categoryId) ?? null;

  const rows = useMemo(() => {
    const n = Number(value);
    if (value === "" || !Number.isFinite(n)) return null;

    if (!category) {
      const celsius = toCelsius(n, unitId);
      return TEMPERATURE.filter((u) => u.id !== unitId).map((u) => ({
        label: u.label,
        value: fmt(fromCelsius(celsius, u.id)),
      }));
    }

    const source = category.units.find((u) => u.id === unitId);
    if (!source) return null;
    const base = n * source.toBase;

    return category.units
      .filter((u) => u.id !== unitId)
      .map((u) => ({ label: u.label, value: fmt(base / u.toBase) }));
  }, [category, unitId, value]);

  const selectCategory = (id: string) => {
    setCategoryId(id);
    const next = CATEGORIES.find((c) => c.id === id);
    setUnitId(next ? next.defaultUnit : "c");
  };

  const tabClass = (active: boolean) =>
    `flex-1 border-[1.5px] px-3 py-2.5 text-[13.5px] ${
      active
        ? "border-accent bg-surface font-semibold text-accent"
        : "border-line bg-surface text-muted hover:border-accent-line"
    }`;

  const unitOptions = category ? category.units : TEMPERATURE;

  return (
    <div className="grid gap-[18px]">
      <PageHead title="단위 변환기" />

      <Card label="변환 선택">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectCategory(c.id)}
              className={tabClass(categoryId === c.id)}
            >
              {c.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => selectCategory("temperature")}
            className={tabClass(categoryId === "temperature")}
          >
            온도
          </button>
        </div>

        <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
          <Field label="값" htmlFor="unit-value">
            <input
              id="unit-value"
              type="number"
              inputMode="decimal"
              placeholder="10"
              className={inputClass}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Field>
          <Field label="단위" htmlFor="unit-id">
            <select
              id="unit-id"
              className={inputClass}
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
            >
              {unitOptions.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {rows && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            {rows.map((row, i) => (
              <Row
                key={row.label}
                label={row.label}
                value={row.value}
                emphasis={i === 0}
                last={i === rows.length - 1}
              />
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-1 text-[12.5px] text-muted">
        <p>1평은 정확히 400/121㎡(약 3.3058㎡)입니다.</p>
        <p>고기 1근은 600g, 금 1돈은 3.75g 기준입니다.</p>
      </div>
    </div>
  );
};

export default UnitConverter;
