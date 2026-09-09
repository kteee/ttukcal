import { useMemo, useState } from "react";
import {
  addDays,
  differenceInCalendarDays,
  format,
  intervalToDuration,
  isValid,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";
import { ko } from "date-fns/locale";
import Card from "../components/Card";
import Field, { inputClass, selectClass } from "../components/Field";
import PageHead from "../components/PageHead";
import Row from "../components/Row";

const today = () => format(new Date(), "yyyy-MM-dd");

const DateCalculator = () => {
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());

  const [base, setBase] = useState(today());
  const [amount, setAmount] = useState("100");
  const [direction, setDirection] = useState<"add" | "sub">("add");

  const between = useMemo(() => {
    const start = from ? startOfDay(parseISO(from)) : null;
    const end = to ? startOfDay(parseISO(to)) : null;
    if (!start || !isValid(start) || !end || !isValid(end)) return null;

    // 순서가 뒤바뀌어도 계산되도록 정렬해서 쓴다.
    const [early, late] = start <= end ? [start, end] : [end, start];

    const days = differenceInCalendarDays(late, early);
    const duration = intervalToDuration({ start: early, end: late });

    return {
      days,
      weeks: Math.floor(days / 7),
      restDays: days % 7,
      years: duration.years ?? 0,
      months: duration.months ?? 0,
      restOfDays: duration.days ?? 0,
      reversed: start > end,
    };
  }, [from, to]);

  const shifted = useMemo(() => {
    const baseDate = base ? startOfDay(parseISO(base)) : null;
    const n = Number(amount);
    if (!baseDate || !isValid(baseDate)) return null;
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      return { error: "일수는 정수로 입력해 주세요." } as const;
    }

    const result = direction === "add" ? addDays(baseDate, n) : subDays(baseDate, n);
    return { error: null, result };
  }, [base, amount, direction]);

  return (
    <div className="grid gap-[18px]">
      <PageHead title="날짜 계산기" />

      <Card label="두 날짜 사이">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
          <Field label="시작일" htmlFor="from">
            <input
              id="from"
              type="date"
              className={inputClass}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </Field>
          <Field label="종료일" htmlFor="to">
            <input
              id="to"
              type="date"
              className={inputClass}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </Field>
        </div>

        {between && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row
              label="사이 일수"
              value={`${between.days.toLocaleString()}일`}
              note={between.reversed ? "순서 반대로 계산" : undefined}
              emphasis
            />
            <Row
              label="양 끝 포함"
              value={`${(between.days + 1).toLocaleString()}일`}
              note="시작일도 하루로 셀 때"
            />
            <Row
              label="주 단위"
              value={`${between.weeks}주 ${between.restDays}일`}
            />
            <Row
              label="년·월·일"
              value={`${between.years}년 ${between.months}개월 ${between.restOfDays}일`}
              last
            />
          </div>
        )}
      </Card>

      <Card label="날짜 더하기 · 빼기">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3.5">
          <Field label="기준일" htmlFor="base">
            <input
              id="base"
              type="date"
              className={inputClass}
              value={base}
              onChange={(e) => setBase(e.target.value)}
            />
          </Field>
          <Field label="일수" htmlFor="amount">
            <input
              id="amount"
              type="number"
              className={inputClass}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>
          <Field label="방향" htmlFor="direction">
            <select
              id="direction"
              className={selectClass}
              value={direction}
              onChange={(e) => setDirection(e.target.value as "add" | "sub")}
            >
              <option value="add">더하기 (이후)</option>
              <option value="sub">빼기 (이전)</option>
            </select>
          </Field>
        </div>

        {shifted?.error && (
          <p className="mt-4 border-[1.5px] border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700">
            {shifted.error}
          </p>
        )}

        {shifted && !shifted.error && (
          <div className="mt-[18px] border-t-[1.5px] border-line-soft pt-1">
            <Row
              label={`${base.replaceAll("-", ".")} 기준 ${amount}일 ${
                direction === "add" ? "뒤" : "앞"
              }`}
              value={format(shifted.result, "yyyy.MM.dd (E)", { locale: ko })}
              emphasis
              last
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default DateCalculator;
