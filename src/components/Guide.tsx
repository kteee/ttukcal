import { useLocation } from "react-router-dom";
import { guideFor } from "../lib/guides";

const Chevron = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 transition-transform group-open:rotate-90"
    aria-hidden="true"
  >
    <polyline points="9 5 16 12 9 19" />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="shrink-0"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="7" x2="12" y2="13" strokeLinecap="round" />
    <circle cx="12" cy="16.6" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * 계산기 아래에 붙는 설명 콘텐츠.
 *
 * 검색 유입은 "만나이 계산기" 같은 도구명뿐 아니라 "만나이 계산법",
 * "빠른년생 만나이" 같은 질문형 검색어에서도 들어온다. 그 질문에 답하는
 * 본문이 있어야 색인이 잡힌다.
 *
 * 접는 방식은 반드시 <details> 여야 한다. React 조건부 렌더링으로 숨기면
 * 닫힌 상태의 프리렌더 HTML 에 본문이 아예 들어가지 않아 색인할 내용이
 * 사라진다. <details> 는 접혀 있어도 HTML 소스에 그대로 남는다.
 */
const Guide = () => {
  const { pathname } = useLocation();
  const guide = guideFor(pathname);
  if (!guide) return null;

  return (
    <details className="group text-[12.5px] leading-relaxed text-muted">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 font-medium text-ink-soft hover:text-accent">
        <InfoIcon />
        <span className="group-open:hidden">설명 보기</span>
        <span className="hidden group-open:inline">설명 접기</span>
        <Chevron />
      </summary>

      <div className="mt-2.5 border-[1.5px] border-line px-5 py-4">
        {guide.sections.map((section) => (
          <div key={section.heading} className="mb-4 last:mb-0">
            <h2 className="mb-1 font-semibold text-ink-soft">
              {section.heading}
            </h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mb-1.5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </details>
  );
};

export default Guide;
