export type DateParts = { year: string; month: string; day: string };

export const EMPTY_DATE_PARTS: DateParts = { year: "", month: "", day: "" };

/**
 * 칸 입력을 Date 로 바꾼다.
 * 아직 덜 쳤으면 null, 2월 30일처럼 없는 날짜면 "invalid".
 */
export function partsToDate(parts: DateParts): Date | null | "invalid" {
  const { year, month, day } = parts;
  if (year.length !== 4 || !month || !day) return null;

  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const date = new Date(y, m - 1, d);

  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return "invalid";
  }
  return date;
}

export function dateToParts(date: Date): DateParts {
  return {
    year: String(date.getFullYear()),
    month: String(date.getMonth() + 1),
    day: String(date.getDate()),
  };
}
