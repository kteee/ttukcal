import { useMemo, useState } from "react";
import Card from "../components/Card";
import Field, { inputClass } from "../components/Field";
import PageHead from "../components/PageHead";
import Row from "../components/Row";

/** 대한비만학회(아시아·태평양) 기준 구간. */
const RANGES = [
  { limit: 18.5, label: "저체중" },
  { limit: 23, label: "정상" },
  { limit: 25, label: "비만 전단계" },
  { limit: 30, label: "1단계 비만" },
  { limit: 35, label: "2단계 비만" },
  { limit: Infinity, label: "3단계 비만" },
];

function classify(bmi: number): string {
  return RANGES.find((r) => bmi < r.limit)!.label;
}

const BmiCalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const result = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    if (height === "" || weight === "") return null;
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) {
      return { error: "키와 몸무게를 0보다 큰 숫자로 입력해 주세요." } as const;
    }
    if (h < 50 || h > 250) {
      return { error: "키는 cm 단위로 입력해 주세요. (50 ~ 250)" } as const;
    }

    const meters = h / 100;
    const bmi = w / (meters * meters);

    return {
      error: null,
      bmi,
      label: classify(bmi),
      normalMin: 18.5 * meters * meters,
      normalMax: 22.9 * meters * meters,
    };
  }, [height, weight]);

  return (
    <div className="grid gap-[18px]">
      <PageHead title="BMI 계산기" />

      <Card label="키 · 몸무게 입력">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
          <Field label="키 (cm)" htmlFor="height">
            <input
              id="height"
              type="number"
              inputMode="decimal"
              placeholder="170"
              className={inputClass}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </Field>
          <Field label="몸무게 (kg)" htmlFor="weight">
            <input
              id="weight"
              type="number"
              inputMode="decimal"
              placeholder="65"
              className={inputClass}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </Field>
        </div>

        {result?.error && (
          <p className="mt-4 border-[1.5px] border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">
            {result.error}
          </p>
        )}

        {result && !result.error && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row
              label="BMI"
              value={result.bmi.toFixed(1)}
              note={result.label}
              emphasis
            />
            <Row
              label="정상 체중 범위"
              value={`${result.normalMin.toFixed(1)} ~ ${result.normalMax.toFixed(1)}kg`}
              note="BMI 18.5 ~ 22.9"
              last
            />
          </div>
        )}
      </Card>

      <Card label="판정 기준">
        <Row label="저체중" value="18.5 미만" />
        <Row label="정상" value="18.5 ~ 22.9" />
        <Row label="비만 전단계" value="23.0 ~ 24.9" />
        <Row label="1단계 비만" value="25.0 ~ 29.9" />
        <Row label="2단계 비만" value="30.0 ~ 34.9" />
        <Row label="3단계 비만" value="35.0 이상" last />
      </Card>

      <p className="text-[12.5px] text-muted">
        대한비만학회(아시아·태평양) 기준입니다. BMI는 근육량·체지방 분포를 반영하지
        못하므로 참고용으로만 사용하세요.
      </p>
    </div>
  );
};

export default BmiCalculator;
