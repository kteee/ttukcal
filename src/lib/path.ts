import { SITE_URL } from "./seo";

/**
 * 경로 표기 규칙.
 *
 * GitHub Pages 는 /age 요청을 /age/ 로 301 리다이렉트한다(age/index.html 이
 * 실제 파일이므로). 그래서 브라우저의 pathname 은 끝 슬래시가 붙은 채로 온다.
 *
 * - 조회 키(seo·guides·menu 등)는 슬래시 없는 형태로 통일한다: normalizePath
 * - 밖으로 내보내는 주소(링크·canonical·사이트맵)는 서버가 곧바로 200 을 주는
 *   끝 슬래시 형태로 통일한다: hrefFor / pageUrl
 */

/** "/age/" → "/age". 루트 "/" 는 그대로 둔다. */
export function normalizePath(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

/** 사이트 내부 링크용. "/age" → "/age/" */
export function hrefFor(path: string): string {
  const key = normalizePath(path);
  return key === "/" ? "/" : `${key}/`;
}

/** canonical·og:url·구조화 데이터·사이트맵용 절대 주소. */
export function pageUrl(path: string): string {
  return `${SITE_URL}${hrefFor(path)}`;
}
