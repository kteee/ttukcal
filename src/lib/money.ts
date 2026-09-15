/** 1234500000 → "12억 3,450만원". 자릿수 세는 실수를 막으려고 입력칸 옆에 같이 보여준다. */
export function readableAmount(n: number): string {
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
