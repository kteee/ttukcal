import { useMemo, useState } from "react";
import {
  addMonths,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import Card from "../components/Card";
import DatePartsInput from "../components/DatePartsInput";
import PageHead from "../components/PageHead";
import Row from "../components/Row";
import {
  dateToParts,
  EMPTY_DATE_PARTS,
  partsToDate,
  type DateParts,
} from "../lib/dateParts";

const AgeCalculator = () => {
  const [birthParts, setBirthParts] = useState<DateParts>(EMPTY_DATE_PARTS);
  const [baseParts, setBaseParts] = useState<DateParts>(() =>
    dateToParts(new Date())
  );

  const result = useMemo(() => {
    const birth = partsToDate(birthParts);
    const base = partsToDate(baseParts);

    if (birth === "invalid") return { error: "생년월일이 없는 날짜입니다." } as const;
    if (base === "invalid") return { error: "기준일이 없는 날짜입니다." } as const;
    if (!birth || !base) return null;
    if (birth > base) return { error: "생년월일이 기준일보다 늦습니다." } as const;

    // 만나이: 생일이 지났으면 (기준연도 - 출생연도), 아니면 그보다 1살 적다.
    const years = differenceInYears(base, birth);
    const afterYears = addYears(birth, years);
    const months = differenceInMonths(base, afterYears);
    const days = differenceInDays(base, addMonths(afterYears, months));

    return {
      error: null,
      years,
      months,
      days,
      koreanAge: base.getFullYear() - birth.getFullYear() + 1,
      yearAge: base.getFullYear() - birth.getFullYear(),
    };
  }, [birthParts, baseParts]);

  return (
    <div className="grid gap-[18px]">
      <PageHead title="만나이 계산기" />

      <Card label="생년월일 입력">
        <div className="grid gap-3.5 sm:max-w-[420px]">
          <DatePartsInput
            id="birth"
            label="생년월일"
            value={birthParts}
            onChange={setBirthParts}
          />
          <DatePartsInput
            id="base"
            label="기준일"
            value={baseParts}
            onChange={setBaseParts}
          />
        </div>

        {result?.error && (
          <p className="mt-4 border-[1.5px] border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">
            {result.error}
          </p>
        )}

        {result && !result.error && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row
              label="만 나이"
              value={`${result.years}세`}
              note={`${result.years}년 ${result.months}개월 ${result.days}일`}
              emphasis
            />
            <Row label="세는 나이" value={`${result.koreanAge}세`} note="옛 한국식" />
            <Row
              label="연 나이"
              value={`${result.yearAge}세`}
              note="연도 차이"
              last
            />
          </div>
        )}
      </Card>

      <p className="text-[12.5px] text-muted">
        2023년 6월 28일부터 법적·행정적 나이는 모두 만 나이 기준입니다.
      </p>
    </div>
  );
};

export default AgeCalculator;
