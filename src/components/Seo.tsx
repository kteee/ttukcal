import { pageUrl } from "../lib/path";
import { SITE_NAME, seoFor } from "../lib/seo";
import { usePagePath } from "../lib/usePagePath";

/**
 * 라우트가 바뀔 때마다 검색 메타데이터를 갈아 끼운다.
 *
 * React 19 는 컴포넌트 어디에서 렌더하든 title/meta/link 를 <head> 로 끌어올려
 * 주므로 별도 라이브러리(react-helmet 등)가 필요 없다.
 */
const Seo = () => {
  const path = usePagePath();
  const { title, description } = seoFor(path);
  const url = pageUrl(path);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ko_KR" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
};

export default Seo;
