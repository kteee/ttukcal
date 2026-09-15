import { useMemo, useState } from "react";
import Card from "../components/Card";
import Field, { selectClass } from "../components/Field";
import MoneyInput from "../components/MoneyInput";
import PageHead from "../components/PageHead";
import QuickAmount from "../components/QuickAmount";
import Row from "../components/Row";
import { readableAmount } from "../lib/money";
import {
  calcSalary,
  RATE_LABELS,
  TABLE_ANNUALS,
  type SalaryBreakdown,
} from "../lib/salary";

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;
const num = (n: number) => Math.round(n).toLocaleString("ko-KR");

const DEPENDENTS = Array.from({ length: 11 }, (_, i) => i + 1);

const COLUMNS: { key: keyof SalaryBreakdown; label: string }[] = [
  { key: "gross", label: "월 급여" },
  { key: "pension", label: "국민연금" },
  { key: "health", label: "건강보험" },
  { key: "care", label: "장기요양" },
  { key: "employment", label: "고용보험" },
  { key: "incomeTax", label: "소득세" },
  { key: "localTax", label: "지방소득세" },
];

const SalaryCalculator = () => {
  const [annual, setAnnual] = useState("");
  const [nonTaxable, setNonTaxable] = useState("200000");
  const [dependents, setDependents] = useState(1);
  const [children, setChildren] = useState(0);

  // 자녀는 본인을 뺀 부양가족 안에서만 셀 수 있다.
  const maxChildren = dependents - 1;
  const childCount = Math.min(children, maxChildren);

  const options = useMemo(
    () => ({
      nonTaxableMonthly: Number(nonTaxable || 0),
      dependents,
      children: childCount,
    }),
    [nonTaxable, dependents, childCount]
  );

  const result = useMemo(() => {
    if (annual === "") return null;
    const value = Number(annual);
    if (!Number.isFinite(value) || value <= 0) return null;
    return calcSalary({ annual: value, ...options });
  }, [annual, options]);

  const table = useMemo(
    () => TABLE_ANNUALS.map((a) => calcSalary({ annual: a, ...options })),
    [options]
  );

  return (
    // 그리드 자식은 기본 min-width 가 내용 폭이라, 넓은 표가 카드를 화면 밖으로
    // 밀어낸다. min-w-0 을 줘야 표가 카드 안에서 가로 스크롤된다.
    <div className="grid min-w-0 gap-[18px] [&>*]:min-w-0">
      <PageHead title="실수령 계산기" />

      <Card label="연봉 입력">
        <Field label="연봉 (원)" htmlFor="annual">
          <MoneyInput
            id="annual"
            value={annual}
            onChange={setAnnual}
            placeholder="40,000,000"
          />
        </Field>
        <QuickAmount
          value={annual}
          onChange={setAnnual}
          hint={readableAmount(Number(annual))}
        />

        <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
          <Field label="비과세액 (월, 원)" htmlFor="non-taxable">
            <MoneyInput
              id="non-taxable"
              value={nonTaxable}
              onChange={setNonTaxable}
              placeholder="200,000"
            />
          </Field>
          <Field label="부양가족 수 (본인 포함)" htmlFor="dependents">
            <select
              id="dependents"
              className={selectClass}
              value={dependents}
              onChange={(e) => setDependents(Number(e.target.value))}
            >
              {DEPENDENTS.map((n) => (
                <option key={n} value={n}>
                  {n}명
                </option>
              ))}
            </select>
          </Field>
          <Field label="8~20세 자녀 수" htmlFor="children">
            <select
              id="children"
              className={selectClass}
              value={childCount}
              onChange={(e) => setChildren(Number(e.target.value))}
            >
              {Array.from({ length: maxChildren + 1 }, (_, i) => i).map((n) => (
                <option key={n} value={n}>
                  {n}명
                </option>
              ))}
            </select>
          </Field>
        </div>

        {result && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row label="월 실수령액" value={won(result.net)} emphasis />
            <Row label="월 급여 (세전)" value={won(result.gross)} />
            <Row
              label="국민연금"
              note={RATE_LABELS.pension}
              value={won(result.pension)}
            />
            <Row
              label="건강보험"
              note={RATE_LABELS.health}
              value={won(result.health)}
            />
            <Row
              label="장기요양"
              note={RATE_LABELS.care}
              value={won(result.care)}
            />
            <Row
              label="고용보험"
              note={RATE_LABELS.employment}
              value={won(result.employment)}
            />
            <Row label="소득세" note="간이세액표" value={won(result.incomeTax)} />
            <Row
              label="지방소득세"
              note="소득세의 10%"
              value={won(result.localTax)}
            />
            <Row label="공제액 합계" value={won(result.totalDeduction)} />
            <Row label="연 실수령액" value={won(result.net * 12)} last />
          </div>
        )}
      </Card>

      <Card label="연봉별 월 실수령액">
        <div className="mb-2 flex flex-wrap justify-between gap-x-3 text-[12px] text-muted">
          <span>
            비과세 월 {num(options.nonTaxableMonthly)}원 · 부양가족 {dependents}명
            {childCount > 0 && ` · 자녀 ${childCount}명`} 기준
          </span>
          <span>단위: 원</span>
        </div>

        {/* 폰에서는 표를 가로로 밀어 보고, 연봉 열은 고정한다 */}
        <div className="-mx-5 overflow-x-auto px-5 lg:-mx-6 lg:px-6">
          <table className="w-full border-collapse text-[13.5px] tabular-nums whitespace-nowrap">
            <thead>
              <tr className="border-y-[1.5px] border-line text-[12.5px] text-muted">
                <th className="sticky left-0 bg-surface py-2.5 pr-4 text-left font-medium">
                  연봉
                </th>
                {COLUMNS.map((col) => (
                  <th key={col.key} className="px-3 py-2.5 text-right font-medium">
                    {col.label}
                  </th>
                ))}
                <th className="py-2.5 pl-3 text-right font-semibold text-ink">
                  실수령액
                </th>
              </tr>
            </thead>
            <tbody>
              {table.map((row) => (
                <tr key={row.annual} className="border-b border-line-soft">
                  <td className="sticky left-0 bg-surface py-2.5 pr-4 text-left font-medium text-ink">
                    {num(row.annual / 10000)}만
                  </td>
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-3 py-2.5 text-right text-ink-soft">
                      {num(row[col.key])}
                    </td>
                  ))}
                  <td className="py-2.5 pl-3 text-right font-semibold text-accent">
                    {num(row.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-1 text-[12.5px] text-muted">
        <p>
          연봉을 12로 나눈 월 급여에서 비과세액을 뺀 금액으로 4대보험과 소득세를
          계산합니다.
        </p>
        <p>
          소득세는 국세청 근로소득 간이세액표(100%) 기준이며, 실제 원천징수액은
          회사 설정에 따라 다를 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default SalaryCalculator;
