import { useState } from "react";
import Card from "../components/Card";
import Field, { inputClass } from "../components/Field";
import PageHead from "../components/PageHead";
import Row from "../components/Row";

const num = (v: string) => (v === "" ? null : Number(v));
const ok = (n: number | null): n is number => n !== null && Number.isFinite(n);

/** 소수점이 지저분해지지 않게 잘라 준다. */
const fmt = (n: number, digits = 2) =>
  n.toLocaleString("ko-KR", { maximumFractionDigits: digits });

const PercentCalculator = () => {
  // X 의 P%
  const [baseA, setBaseA] = useState("");
  const [rateA, setRateA] = useState("");

  // X 는 Y 의 몇 %
  const [partB, setPartB] = useState("");
  const [wholeB, setWholeB] = useState("");

  // X → Y 증감률
  const [beforeC, setBeforeC] = useState("");
  const [afterC, setAfterC] = useState("");

  // 할인가
  const [priceD, setPriceD] = useState("");
  const [discountD, setDiscountD] = useState("");

  const a = { base: num(baseA), rate: num(rateA) };
  const b = { part: num(partB), whole: num(wholeB) };
  const c = { before: num(beforeC), after: num(afterC) };
  const d = { price: num(priceD), discount: num(discountD) };

  return (
    <div className="grid gap-[18px]">
      <PageHead title="퍼센트 계산기" />

      <Card label="A의 B%는 얼마?">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
          <Field label="기준값 (A)" htmlFor="pa-base">
            <input
              id="pa-base"
              type="number"
              inputMode="decimal"
              placeholder="50,000"
              className={inputClass}
              value={baseA}
              onChange={(e) => setBaseA(e.target.value)}
            />
          </Field>
          <Field label="비율 (B %)" htmlFor="pa-rate">
            <input
              id="pa-rate"
              type="number"
              inputMode="decimal"
              placeholder="15"
              className={inputClass}
              value={rateA}
              onChange={(e) => setRateA(e.target.value)}
            />
          </Field>
        </div>
        {ok(a.base) && ok(a.rate) && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row
              label={`${fmt(a.base)}의 ${fmt(a.rate)}%`}
              value={fmt((a.base * a.rate) / 100)}
              emphasis
              last
            />
          </div>
        )}
      </Card>

      <Card label="A는 B의 몇 %?">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
          <Field label="부분값 (A)" htmlFor="pb-part">
            <input
              id="pb-part"
              type="number"
              inputMode="decimal"
              placeholder="30"
              className={inputClass}
              value={partB}
              onChange={(e) => setPartB(e.target.value)}
            />
          </Field>
          <Field label="전체값 (B)" htmlFor="pb-whole">
            <input
              id="pb-whole"
              type="number"
              inputMode="decimal"
              placeholder="120"
              className={inputClass}
              value={wholeB}
              onChange={(e) => setWholeB(e.target.value)}
            />
          </Field>
        </div>
        {ok(b.part) && ok(b.whole) && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            {b.whole === 0 ? (
              <Row label="비율" value="전체값이 0입니다" last />
            ) : (
              <Row
                label={`${fmt(b.part)} / ${fmt(b.whole)}`}
                value={`${fmt((b.part / b.whole) * 100)}%`}
                emphasis
                last
              />
            )}
          </div>
        )}
      </Card>

      <Card label="A에서 B로, 몇 % 증감?">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
          <Field label="이전값 (A)" htmlFor="pc-before">
            <input
              id="pc-before"
              type="number"
              inputMode="decimal"
              placeholder="100"
              className={inputClass}
              value={beforeC}
              onChange={(e) => setBeforeC(e.target.value)}
            />
          </Field>
          <Field label="이후값 (B)" htmlFor="pc-after">
            <input
              id="pc-after"
              type="number"
              inputMode="decimal"
              placeholder="135"
              className={inputClass}
              value={afterC}
              onChange={(e) => setAfterC(e.target.value)}
            />
          </Field>
        </div>
        {ok(c.before) && ok(c.after) && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            {c.before === 0 ? (
              <Row label="증감률" value="이전값이 0입니다" last />
            ) : (
              <>
                <Row
                  label="증감률"
                  value={`${c.after >= c.before ? "+" : ""}${fmt(
                    ((c.after - c.before) / c.before) * 100
                  )}%`}
                  emphasis
                />
                <Row
                  label="차이"
                  value={`${c.after >= c.before ? "+" : ""}${fmt(
                    c.after - c.before
                  )}`}
                  last
                />
              </>
            )}
          </div>
        )}
      </Card>

      <Card label="할인가">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
          <Field label="정가" htmlFor="pd-price">
            <input
              id="pd-price"
              type="number"
              inputMode="decimal"
              placeholder="89,000"
              className={inputClass}
              value={priceD}
              onChange={(e) => setPriceD(e.target.value)}
            />
          </Field>
          <Field label="할인율 (%)" htmlFor="pd-discount">
            <input
              id="pd-discount"
              type="number"
              inputMode="decimal"
              placeholder="30"
              className={inputClass}
              value={discountD}
              onChange={(e) => setDiscountD(e.target.value)}
            />
          </Field>
        </div>
        {ok(d.price) && ok(d.discount) && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row
              label="할인가"
              value={fmt(d.price * (1 - d.discount / 100), 0)}
              emphasis
            />
            <Row
              label="할인액"
              value={fmt((d.price * d.discount) / 100, 0)}
              last
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default PercentCalculator;
