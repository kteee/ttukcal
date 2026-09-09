/** 사이드바(데스크톱), 헤더 드롭다운(모바일), 홈 카드가 함께 쓰는 메뉴 정의. */
export type MenuItem = {
  to: string;
  label: string;
  /** 홈 카드에 쓰는 한 줄 설명 */
  desc: string;
};

export const MENU: MenuItem[] = [
  {
    to: "/date",
    label: "날짜 계산기",
    desc: "두 날짜 사이 일수, 날짜 더하기·빼기",
  },
  { to: "/age", label: "만나이 계산기", desc: "만 나이·세는 나이·연 나이" },
  { to: "/lunar", label: "양음력 변환기", desc: "양력↔음력, 윤달·간지·띠" },
  { to: "/unit", label: "단위 변환기", desc: "평↔㎡, 길이·무게·온도" },
  { to: "/percent", label: "퍼센트 계산기", desc: "할인가, 증감률, 비율" },
  { to: "/vat", label: "부가세 계산기", desc: "공급가액↔합계금액" },
  { to: "/interest", label: "이자 계산기", desc: "예금·적금·대출 이자" },
  { to: "/bmi", label: "BMI 계산기", desc: "체질량지수와 정상 체중 범위" },
  {
    to: "/text",
    label: "글자수 계산기",
    desc: "공백 포함·제외, 바이트, 원고지",
  },
];

/** 현재 경로의 메뉴 이름. 모바일 드롭다운 버튼에 표시한다. */
export function menuLabelFor(pathname: string): string {
  return MENU.find((item) => item.to === pathname)?.label ?? "계산기";
}
