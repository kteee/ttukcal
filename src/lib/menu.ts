/** 사이드바(데스크톱)와 헤더 드롭다운(모바일)이 함께 쓰는 메뉴 정의. */
export type MenuItem = { to: string; label: string };

export const MENU: MenuItem[] = [
  { to: "/date", label: "날짜 계산기" },
  { to: "/age", label: "나이 계산기" },
  { to: "/lunar", label: "양음력 변환기" },
  { to: "/unit", label: "단위 변환기" },
  { to: "/percent", label: "퍼센트 계산기" },
  { to: "/vat", label: "부가세 계산기" },
  { to: "/interest", label: "이자 계산기" },
  { to: "/bmi", label: "BMI 계산기" },
  { to: "/text", label: "글자수 계산기" },
];

/** 현재 경로의 메뉴 이름. 모바일 드롭다운 버튼에 표시한다. */
export function menuLabelFor(pathname: string): string {
  return MENU.find((item) => item.to === pathname)?.label ?? "계산기";
}
