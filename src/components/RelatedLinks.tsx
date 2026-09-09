import { Link, useLocation } from "react-router-dom";
import { MENU } from "../lib/menu";

/** 성격이 가까운 계산기끼리 묶는다. */
const RELATED: Record<string, string[]> = {
  "/date": ["/age", "/lunar", "/unit"],
  "/age": ["/date", "/lunar", "/bmi"],
  "/lunar": ["/date", "/age", "/unit"],
  "/unit": ["/percent", "/date", "/bmi"],
  "/percent": ["/vat", "/interest", "/unit"],
  "/vat": ["/percent", "/interest", "/unit"],
  "/interest": ["/vat", "/percent", "/date"],
  "/bmi": ["/unit", "/age", "/percent"],
  "/text": ["/percent", "/unit", "/date"],
};

/**
 * 하단 관련 계산기 링크.
 *
 * 지금은 사이드바 메뉴 말고는 페이지끼리 이어지는 길이 없다. 본문 안에
 * 링크가 있어야 크롤러가 페이지 관계를 파악하고, 사용자도 다음 도구로
 * 자연스럽게 넘어간다.
 */
const RelatedLinks = () => {
  const { pathname } = useLocation();
  const related = RELATED[pathname];
  if (!related) return null;

  const items = related
    .map((to) => MENU.find((item) => item.to === to))
    .filter((item) => item !== undefined);

  return (
    <nav className="text-[12.5px] text-muted">
      <div>이런 계산기도 있어요</div>
      <div className="mt-1">
        {items.map((item, i) => (
          <span key={item.to}>
            {i > 0 && <span className="mx-1 text-line">·</span>}
            <Link to={item.to} className="text-ink-soft hover:text-accent">
              {item.label}
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
};

export default RelatedLinks;
