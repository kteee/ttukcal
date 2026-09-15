/** 헤더 대메뉴 공통 모양. 링크(실수령 계산기)와 드롭다운 버튼(생활 계산기)이 같이 쓴다. */
export const topMenuClass = (active: boolean) =>
  `flex items-center gap-1 px-2.5 py-1.5 text-[14px] ${
    active ? "font-semibold text-accent" : "text-ink-soft hover:text-accent"
  }`;
