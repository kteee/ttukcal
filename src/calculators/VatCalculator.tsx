import { useMemo, useState } from "react";
import Card from "../components/Card";
import Field, { inputClass } from "../components/Field";
import MoneyInput from "../components/MoneyInput";
import PageHead from "../components/PageHead";
import Row from "../components/Row";

type Mode = "fromSupply" | "fromTotal";

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

const VatCalculator = () => {
  const [mode, setMode] = useState<Mode>("fromTotal");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("10");

  const result = useMemo(() => {
    const value = Number(amount);
    const r = Number(rate) / 100;
    if (amount === "" || !Number.isFinite(value) || value <= 0) return null;
    if (!Number.isFinite(r) || r < 0) {
      return { error: "세율을 확인해 주세요." } as const;
    }

    // 합계 = 공급가액 × (1 + 세율)
    const supply = mode === "fromSupply" ? value : value / (1 + r);
    const vat = supply * r;

    return { error: null, supply, vat, total: supply + vat };
  }, [mode, amount, rate]);

  const tabClass = (active: boolean) =>
    `flex-1 border-[1.5px] px-3 py-2.5 text-[13.5px] ${
      active
        ? "border-accent bg-surface font-semibold text-accent"
        : "border-line bg-surface text-muted hover:border-accent-line"
    }`;

  return (
    <div className="grid gap-[18px]">
      <PageHead title="부가세 계산기" />

      <Card label="계산 선택">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("fromTotal")}
            className={tabClass(mode === "fromTotal")}
          >
            합계금액 → 공급가액
          </button>
          <button
            type="button"
            onClick={() => setMode("fromSupply")}
            className={tabClass(mode === "fromSupply")}
          >
            공급가액 → 합계금액
          </button>
        </div>

        <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3.5">
          <Field
            label={mode === "fromTotal" ? "합계금액 (원)" : "공급가액 (원)"}
            htmlFor="vat-amount"
          >
            <MoneyInput
              id="vat-amount"
              value={amount}
              onChange={setAmount}
              placeholder="110,000"
            />
          </Field>
          <Field label="세율 (%)" htmlFor="vat-rate">
            <input
              id="vat-rate"
              type="number"
              inputMode="decimal"
              step="0.1"
              className={inputClass}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
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
              label={mode === "fromTotal" ? "공급가액" : "합계금액"}
              value={won(mode === "fromTotal" ? result.supply : result.total)}
              emphasis
            />
            <Row label="부가세" value={won(result.vat)} />
            <Row
              label={mode === "fromTotal" ? "합계금액" : "공급가액"}
              value={won(mode === "fromTotal" ? result.total : result.supply)}
              last
            />
          </div>
        )}
      </Card>

      <div className="grid gap-1 text-[12.5px] text-muted">
        <p>부가가치세 기본 세율은 10%입니다.</p>
        <p>
          합계금액에서 공급가액을 뽑을 때는 1.1로 나눕니다. 원 단위 미만은
          반올림해서 표시합니다.
        </p>
      </div>
    </div>
  );
};

export default VatCalculator;
