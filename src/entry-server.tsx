import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import "./index.css";

/** 프리렌더링용. 라우트 하나를 정적 HTML 문자열로 만든다. */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}

// 프리렌더 스크립트가 <head> 를 직접 만들 수 있도록 같이 내보낸다.
// (SSR 번들은 한 파일로 합쳐지므로 별도 import 경로가 생기지 않는다.)
export { PAGE_SEO, DEFAULT_SEO, SITE_URL, SITE_NAME } from "./lib/seo";
export { jsonLdScript } from "./lib/structured-data";
