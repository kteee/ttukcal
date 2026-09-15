import { useLocation } from "react-router-dom";
import { normalizePath } from "./path";

/**
 * 조회 키로 쓸 현재 경로. 끝 슬래시를 뗀 형태("/age")를 돌려준다.
 *
 * useLocation().pathname 을 그대로 키로 쓰면 GitHub Pages 가 붙여 보낸 끝
 * 슬래시("/age/") 때문에 조회가 전부 빗나가, 제목·설명이 홈 기본값으로 떨어진다.
 */
export function usePagePath(): string {
  return normalizePath(useLocation().pathname);
}
