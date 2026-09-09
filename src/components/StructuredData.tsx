import { useLocation } from "react-router-dom";
import { buildJsonLd } from "../lib/structured-data";

/**
 * 검색엔진용 구조화 데이터(JSON-LD).
 *
 * <script> 는 React 19 의 head 승격 대상이 아니라 body 에 그대로 남는데,
 * 구글은 문서 어디에 있든 JSON-LD 를 읽으므로 문제되지 않는다.
 * 문자열 이스케이프 사고를 피하려고 dangerouslySetInnerHTML 로 넣는다.
 */
const StructuredData = () => {
  const { pathname } = useLocation();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(pathname)) }}
    />
  );
};

export default StructuredData;
