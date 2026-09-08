/**
 * 음력 변환 유틸.
 *
 * 한국천문연구원(KASI) 발표 자료를 표로 담은 `korean-lunar-calendar` 를 쓴다.
 * 브라우저 내장 ICU 단기력(`-u-ca-dangi`)도 같은 일을 하지만, 1900~2050 을
 * 전수 비교한 결과 2017-02-26 ~ 2017-03-27 구간(30일)에서 ICU 가 KASI 보다
 * 하루씩 밀린다. 그 구간을 맞추기 위해 표 기반으로 바꿨다.
 */

import KoreanLunarCalendar from "korean-lunar-calendar";

export type LunarDate = {
  /** 음력 연도 (설을 기준으로 넘어간다) */
  year: number;
  /** 1 ~ 12 */
  month: number;
  /** 1 ~ 30 */
  day: number;
  isLeapMonth: boolean;
};

export type SolarDate = {
  year: number;
  month: number;
  day: number;
};

/** 원본 표가 담고 있는 범위. */
export const LUNAR_MIN_YEAR = 1900;
export const LUNAR_MAX_YEAR = 2050;

export function isYearSupported(year: number): boolean {
  return (
    Number.isInteger(year) && year >= LUNAR_MIN_YEAR && year <= LUNAR_MAX_YEAR
  );
}

/** 양력 → 음력. 표 범위를 벗어나면 null. */
export function solarToLunar(solar: SolarDate): LunarDate | null {
  const calendar = new KoreanLunarCalendar();
  if (!calendar.setSolarDate(solar.year, solar.month, solar.day)) return null;

  const lunar = calendar.getLunarCalendar();
  return {
    year: lunar.year,
    month: lunar.month,
    day: lunar.day,
    isLeapMonth: Boolean(lunar.intercalation),
  };
}

/** 음력 → 양력. 존재하지 않는 날짜거나 범위를 벗어나면 null. */
export function lunarToSolar(lunar: LunarDate): SolarDate | null {
  const calendar = new KoreanLunarCalendar();
  const ok = calendar.setLunarDate(
    lunar.year,
    lunar.month,
    lunar.day,
    lunar.isLeapMonth
  );
  if (!ok) return null;

  const solar = calendar.getSolarCalendar();
  return { year: solar.year, month: solar.month, day: solar.day };
}

const leapCache = new Map<number, number | null>();

/** 해당 음력 연도의 윤달이 몇 월인지. 윤달이 없으면 null. */
export function leapMonthOf(lunarYear: number): number | null {
  const cached = leapCache.get(lunarYear);
  if (cached !== undefined) return cached;

  let result: number | null = null;
  for (let month = 1; month <= 12; month++) {
    // 윤달 1일이 실재하는 달이 곧 그 해의 윤달이다.
    const calendar = new KoreanLunarCalendar();
    if (calendar.setLunarDate(lunarYear, month, 1, true)) {
      result = month;
      break;
    }
  }

  leapCache.set(lunarYear, result);
  return result;
}

const HEAVENLY_STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const EARTHLY_BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const ZODIAC = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];

/** 음력 연도의 간지와 띠. */
export function ganjiOf(lunarYear: number): { name: string; zodiac: string } {
  const index = (((lunarYear - 4) % 60) + 60) % 60;
  return {
    name: `${HEAVENLY_STEMS[index % 10]}${EARTHLY_BRANCHES[index % 12]}년`,
    zodiac: ZODIAC[index % 12],
  };
}

/** 음력 날짜를 "2026년 7월 27일 (윤달)" 형태로. */
export function formatLunar(lunar: LunarDate): string {
  const leap = lunar.isLeapMonth ? " (윤달)" : "";
  return `${lunar.year}년 ${lunar.month}월 ${lunar.day}일${leap}`;
}
