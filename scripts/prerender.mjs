/**
 * 빌드 후 라우트마다 정적 HTML 을 만든다.
 *
 * GitHub Pages 는 정적 파일만 서빙하므로 /vat 같은 경로에 실제 파일이 없으면
 * 404 가 난다. 라우트별로 index.html 을 미리 만들어 두면 라우팅과 SEO 가
 * 한 번에 해결된다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrEntry = pathToFileURL(
  path.join(root, "dist-ssr", "entry-server.js")
).href;

const { render, PAGE_SEO, DEFAULT_SEO, SITE_URL, SITE_NAME } =
  await import(ssrEntry);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf-8");
const routes = ["/", ...Object.keys(PAGE_SEO)];

const escape = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function headFor(route) {
  const seo = route === "/" ? DEFAULT_SEO : (PAGE_SEO[route] ?? DEFAULT_SEO);
  const url = route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
  return [
    `<title>${escape(seo.title)}</title>`,
    `<meta name="description" content="${escape(seo.description)}">`,
    `<link rel="canonical" href="${escape(url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${escape(SITE_NAME)}">`,
    `<meta property="og:title" content="${escape(seo.title)}">`,
    `<meta property="og:description" content="${escape(seo.description)}">`,
    `<meta property="og:url" content="${escape(url)}">`,
    `<meta property="og:locale" content="ko_KR">`,
    `<meta name="twitter:card" content="summary">`,
  ].join("\n    ");
}

/**
 * <Seo> 가 렌더한 메타 태그를 본문에서 걷어낸다.
 *
 * React 19 는 브라우저에서 title/meta 를 <head> 로 끌어올리지만, 서버
 * 렌더링 결과에서는 컴포넌트가 있던 자리(=body 안)에 그대로 남는다.
 * head 에는 headFor() 로 이미 넣으므로 그대로 두면 문서에 title 이 두 개가
 * 된다.
 */
function stripHoistedMeta(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(
      /<meta[^>]*(?:name="description"|name="twitter:[^"]*"|property="og:[^"]*")[^>]*>/g,
      ""
    )
    .replace(/<link[^>]*rel="canonical"[^>]*>/g, "");
}

let count = 0;
for (const route of routes) {
  // "/" 는 <Navigate> 라 StaticRouter 에서 아무것도 렌더되지 않는다.
  // 실제로 보여줄 첫 화면(/date) 마크업을 넣어 크롤러가 빈 페이지를 보지 않게 한다.
  const appHtml = stripHoistedMeta(render(route));

  const html = template
    // 템플릿의 기본 <title> 을 라우트별 메타 묶음으로 교체
    .replace(/<title>[\s\S]*?<\/title>/, headFor(route))
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  const outDir = route === "/" ? dist : path.join(dist, route.slice(1));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  count += 1;
  console.log(
    `  ${route.padEnd(10)} -> ${path.relative(root, path.join(outDir, "index.html"))}`
  );
}

// 없는 경로로 들어와도 SPA 가 뜨도록 404 도 같이 둔다.
fs.copyFileSync(path.join(dist, "index.html"), path.join(dist, "404.html"));

console.log(`\n프리렌더 완료: ${count}개 라우트 + 404.html`);
