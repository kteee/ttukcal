import { Link } from "react-router-dom";
import PageHead from "../components/PageHead";
import { MENU } from "../lib/menu";

/**
 * 홈. 계산기 목록을 카드로 깐다.
 *
 * 전에는 "/" 가 /date 로 리다이렉트만 해서 홈 고유의 내용이 없었다.
 * 브랜드 검색이나 "계산기 모음" 같은 넓은 검색어로 들어올 자리가 필요하다.
 */
const HomePage = () => {
  return (
    <div className="grid gap-[18px]">
      <PageHead title="생활 계산기 모음" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MENU.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="border-[1.5px] border-line bg-surface px-4 py-4 hover:border-accent"
          >
            <div className="text-[14.5px] font-semibold text-ink">
              {item.label}
            </div>
            <div className="mt-1 text-[12.5px] text-muted">{item.desc}</div>
          </Link>
        ))}
      </div>

      <div className="text-[12.5px] leading-relaxed text-muted">
        <p className="mb-1.5">
          자주 쓰는 생활 계산기를 한 곳에 모았습니다. 설치나 회원가입 없이 바로
          쓸 수 있고, 입력한 값은 브라우저 안에서만 계산되어 어디에도 전송되지
          않습니다.
        </p>
        <p>
          음력 변환은 한국천문연구원(KASI) 발표 자료를, BMI는 대한비만학회 기준을
          따릅니다. 이자와 부가세는 국내 세율(이자소득세 15.4%, 부가가치세 10%)을
          반영합니다.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
