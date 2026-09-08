import { useMemo, useState } from "react";
import Card from "../components/Card";
import Field, { inputClass } from "../components/Field";
import MoneyInput from "../components/MoneyInput";
import PageHead from "../components/PageHead";
import QuickAmount from "../components/QuickAmount";
import Row from "../components/Row";

type Mode = "deposit" | "saving" | "loan";

/** 이자소득세 15.4% = 소득세 14% + 지방소득세 1.4% */
const TAX_RATE = 0.154;

const won = (n: number) => `${Math.round(n).toLocaleString()}원`;

/** 1234500000 → "12억 3,450만원". 자릿수 세는 실수를 막으려고 같이 보여준다. */
function readableAmount(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  const rest = Math.round(n % 10_000);
  const parts: string[] = [];
  if (eok) parts.push(`${eok.toLocaleString()}억`);
  if (man) parts.push(`${man.toLocaleString()}만`);
  if (rest) parts.push(rest.toLocaleString());
  return `${parts.join(" ")}원`;
}

const InterestCalculator = () => {
  const [mode, setMode] = useState<Mode>("deposit");

  const [principal, setPrincipal] = useState("");
  const [monthly, setMonthly] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [compound, setCompound] = useState<"simple" | "monthly">("simple");

  const result = useMemo(() => {
    const amountValue =
      mode === "deposit" ? principal : mode === "saving" ? monthly : loanAmount;
    // 아직 입력 전이면 에러 대신 아무것도 보여주지 않는다.
    if (amountValue === "" || rate === "" || months === "") return null;

    const r = Number(rate) / 100;
    const n = Number(months);
    if (!Number.isFinite(r) || r < 0) return { error: "이율을 확인해 주세요." } as const;
    if (!Number.isInteger(n) || n <= 0) {
      return { error: "기간은 1개월 이상 정수로 입력해 주세요." } as const;
    }

    if (mode === "deposit") {
      const p = Number(principal);
      if (!Number.isFinite(p) || p <= 0) {
        return { error: "원금을 확인해 주세요." } as const;
      }
      // 단리: 원금 × 연이율 × 기간, 월복리: 원금 × (1+r/12)^n
      const gross =
        compound === "simple"
          ? p * r * (n / 12)
          : p * Math.pow(1 + r / 12, n) - p;
      const tax = gross * TAX_RATE;
      return {
        error: null,
        kind: "deposit" as const,
        paid: p,
        gross,
        tax,
        net: gross - tax,
        total: p + gross - tax,
      };
    }

    if (mode === "saving") {
      const m = Number(monthly);
      if (!Number.isFinite(m) || m <= 0) {
        return { error: "월 납입액을 확인해 주세요." } as const;
      }
      // 정기적금 단리: 각 회차가 남은 개월 수만큼만 이자를 받는다.
      // 이자 = M × (r/12) × (n(n+1)/2)
      const paid = m * n;
      const gross = m * (r / 12) * ((n * (n + 1)) / 2);
      const tax = gross * TAX_RATE;
      return {
        error: null,
        kind: "saving" as const,
        paid,
        gross,
        tax,
        net: gross - tax,
        total: paid + gross - tax,
      };
    }

    const p = Number(loanAmount);
    if (!Number.isFinite(p) || p <= 0) {
      return { error: "대출 금액을 확인해 주세요." } as const;
    }
    // 원리금균등상환
    const i = r / 12;
    const payment =
      i === 0 ? p / n : (p * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const totalPaid = payment * n;
    return {
      error: null,
      kind: "loan" as const,
      payment,
      totalPaid,
      totalInterest: totalPaid - p,
      principal: p,
    };
  }, [mode, principal, monthly, loanAmount, rate, months, compound]);

  const tabClass = (active: boolean) =>
    `flex-1 border-[1.5px] px-3 py-2.5 text-[13.5px] ${
      active
        ? "border-accent bg-surface font-semibold text-accent"
        : "border-line bg-surface text-muted hover:border-accent-line"
    }`;

  const amountField =
    mode === "deposit"
      ? {
          id: "principal",
          label: "예치 원금 (원)",
          value: principal,
          set: setPrincipal,
          placeholder: "10,000,000",
        }
      : mode === "saving"
        ? {
            id: "monthly",
            label: "월 납입액 (원)",
            value: monthly,
            set: setMonthly,
            placeholder: "500,000",
          }
        : {
            id: "loan",
            label: "대출 금액 (원)",
            value: loanAmount,
            set: setLoanAmount,
            placeholder: "100,000,000",
          };

  return (
    <div className="grid gap-[18px]">
      <PageHead title="이자 계산기" />

      <Card label="계산 선택">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("deposit")}
            className={tabClass(mode === "deposit")}
          >
            예금
          </button>
          <button
            type="button"
            onClick={() => setMode("saving")}
            className={tabClass(mode === "saving")}
          >
            적금
          </button>
          <button
            type="button"
            onClick={() => setMode("loan")}
            className={tabClass(mode === "loan")}
          >
            대출
          </button>
        </div>

        <div className="mt-[18px]">
          <Field label={amountField.label} htmlFor={amountField.id}>
            <MoneyInput
              id={amountField.id}
              value={amountField.value}
              onChange={amountField.set}
              placeholder={amountField.placeholder}
            />
          </Field>
          <QuickAmount
            value={amountField.value}
            onChange={amountField.set}
            hint={readableAmount(Number(amountField.value))}
          />
        </div>

        <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
          <Field label="연이율 (%)" htmlFor="rate">
            <input
              id="rate"
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder="3.5"
              className={inputClass}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </Field>
          <Field label="기간 (개월)" htmlFor="months">
            <input
              id="months"
              type="number"
              inputMode="numeric"
              placeholder="12"
              className={inputClass}
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
          </Field>
          {mode === "deposit" && (
            <Field label="이자 방식" htmlFor="compound">
              <select
                id="compound"
                className={inputClass}
                value={compound}
                onChange={(e) =>
                  setCompound(e.target.value as "simple" | "monthly")
                }
              >
                <option value="simple">단리</option>
                <option value="monthly">월복리</option>
              </select>
            </Field>
          )}
        </div>

        {result?.error && (
          <p className="mt-4 border-[1.5px] border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">
            {result.error}
          </p>
        )}

        {result && !result.error && result.kind !== "loan" && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row label="만기 수령액" value={won(result.total)} emphasis />
            <Row
              label={result.kind === "saving" ? "총 납입액" : "원금"}
              value={won(result.paid)}
            />
            <Row label="세전 이자" value={won(result.gross)} />
            <Row label="이자소득세 (15.4%)" value={won(result.tax)} />
            <Row label="세후 이자" value={won(result.net)} last />
          </div>
        )}

        {result && !result.error && result.kind === "loan" && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row label="월 상환액" value={won(result.payment)} emphasis />
            <Row label="대출 원금" value={won(result.principal)} />
            <Row label="총 이자" value={won(result.totalInterest)} />
            <Row label="총 상환액" value={won(result.totalPaid)} last />
          </div>
        )}
      </Card>

      <div className="grid gap-1 text-[12.5px] text-muted">
        <p>
          예금·적금 세후 이자는 이자소득세 15.4%(소득세 14% + 지방소득세 1.4%)를
          뺀 금액입니다.
        </p>
        <p>
          적금은 회차마다 예치 기간이 달라지는 일반 정기적금(단리) 방식으로, 대출은
          원리금균등상환으로 계산합니다.
        </p>
        <p>
          실제 상품은 우대금리·중도상환수수료 등이 붙으므로 참고용으로만
          사용하세요.
        </p>
      </div>
    </div>
  );
};

export default InterestCalculator;
