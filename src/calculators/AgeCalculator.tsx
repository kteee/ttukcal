import { useMemo, useState } from "react";
import {
  addMonths,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  isValid,
  parseISO,
  setYear,
  startOfDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import Card from "../components/Card";
import Field, { inputClass } from "../components/Field";
import PageHead from "../components/PageHead";
import Row from "../components/Row";

const AgeCalculator = () => {
  const [birthInput, setBirthInput] = useState("");
  const [baseInput, setBaseInput] = useState(format(new Date(), "yyyy-MM-dd"));

  const result = useMemo(() => {
    const birth = birthInput ? startOfDay(parseISO(birthInput)) : null;
    const base = baseInput ? startOfDay(parseISO(baseInput)) : null;

    if (!birth || !isValid(birth) || !base || !isValid(base)) return null;
    if (birth > base) return { error: "생년월일이 기준일보다 늦습니다." } as const;

    // 만나이: 생일이 지났으면 (기준연도 - 출생연도), 아니면 그보다 1살 적다.
    const years = differenceInYears(base, birth);
    const afterYears = addYears(birth, years);
    const months = differenceInMonths(base, afterYears);
    const days = differenceInDays(base, addMonths(afterYears, months));

    const birthdayThisYear = setYear(birth, base.getFullYear());
    const nextBirthday =
      birthdayThisYear < base ? addYears(birthdayThisYear, 1) : birthdayThisYear;

    return {
      error: null,
      years,
      months,
      days,
      totalDays: differenceInDays(base, birth),
      koreanAge: base.getFullYear() - birth.getFullYear() + 1,
      yearAge: base.getFullYear() - birth.getFullYear(),
      nextBirthday,
      untilBirthday: differenceInDays(nextBirthday, base),
      weekday: format(birth, "EEEE", { locale: ko }),
    };
  }, [birthInput, baseInput]);

  return (
    <div className="grid gap-[18px]">
      <PageHead title="만나이 계산기" />

      <Card label="생년월일 입력">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
          <Field label="생년월일" htmlFor="birth">
            <input
              id="birth"
              type="date"
              className={inputClass}
              value={birthInput}
              max={baseInput}
              onChange={(e) => setBirthInput(e.target.value)}
            />
          </Field>
          <Field label="기준일" htmlFor="base">
            <input
              id="base"
              type="date"
              className={inputClass}
              value={baseInput}
              onChange={(e) => setBaseInput(e.target.value)}
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
              label="만 나이"
              value={`${result.years}세`}
              note={`${result.years}년 ${result.months}개월 ${result.days}일`}
              emphasis
            />
            <Row label="세는 나이" value={`${result.koreanAge}세`} note="옛 한국식" />
            <Row label="연 나이" value={`${result.yearAge}세`} note="연도 차이" />
            <Row
              label="태어난 지"
              value={`${result.totalDays.toLocaleString()}일`}
              note={`태어난 요일 ${result.weekday}`}
            />
            <Row
              label="다음 생일"
              value={
                result.untilBirthday === 0
                  ? "오늘"
                  : `D-${result.untilBirthday}`
              }
              note={format(result.nextBirthday, "yyyy.MM.dd")}
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
