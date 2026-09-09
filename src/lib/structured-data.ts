import { MENU, menuLabelFor } from "./menu";
import { SITE_NAME, SITE_URL, seoFor } from "./seo";

/**
 * 경로별 JSON-LD 그래프.
 *
 * 컴포넌트가 아니라 순수 함수로 둔다. 프리렌더 스크립트는 "/" 자리에
 * "/date" 마크업을 채우기 때문에, 그 안에 박힌 JSON-LD 를 홈용으로
 * 갈아끼우려면 경로만 주면 결과가 나오는 형태여야 한다.
 */
export function buildJsonLd(pathname: string): object {
  const { description } = seoFor(pathname);
  const isHome = pathname === "/";
  const url = isHome ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;

  const graph: unknown[] = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: "ko-KR",
    },
  ];

  if (isHome) {
    // 홈에서는 어떤 도구들이 있는지 목록으로 알려 준다.
    graph.push({
      "@type": "ItemList",
      "@id": `${SITE_URL}/#tools`,
      name: `${SITE_NAME} 계산기 목록`,
      itemListElement: MENU.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
        url: `${SITE_URL}${item.to}`,
      })),
    });
  } else {
    graph.push({
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: menuLabelFor(pathname),
      url,
      description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "All",
      inLanguage: "ko-KR",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      // 무료임을 명시하면 검색결과에 그대로 표시되기도 한다.
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    });
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: SITE_NAME,
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: menuLabelFor(pathname),
          item: url,
        },
      ],
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** 프리렌더에서 통째로 갈아끼울 수 있도록 <script> 태그까지 만들어 준다. */
export function jsonLdScript(pathname: string): string {
  return `<script type="application/ld+json">${JSON.stringify(
    buildJsonLd(pathname)
  )}</script>`;
}
