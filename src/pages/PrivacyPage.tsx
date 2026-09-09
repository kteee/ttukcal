import type { ReactNode } from "react";
import PageHead from "../components/PageHead";
import {
  CONTACT_EMAIL,
  POLICY_EFFECTIVE_DATE,
  PRIVACY_OFFICER,
} from "../lib/site";

/**
 * 개인정보처리방침.
 *
 * 개인정보보호위원회 「개인정보 처리방침 작성지침」(2026.4.) 의 기재 사항 중
 * 이 사이트에 해당하는 항목만 담았다. 사이트가 개인정보를 직접 수집하지
 * 않으므로 '해당시' 항목 대부분은 "처리하지 않는다" 는 사실을 명시하는
 * 방식으로 갈음했다(지침이 허용하는 방식).
 */

const Section = ({
  no,
  title,
  children,
}: {
  no: number;
  title: string;
  children: ReactNode;
}) => (
  <section className="mb-6 last:mb-0">
    <h2 className="mb-1.5 text-[14px] font-semibold text-ink">
      {no}. {title}
    </h2>
    <div className="space-y-2 text-[13px] leading-relaxed text-ink-soft">
      {children}
    </div>
  </section>
);

const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    className="text-accent hover:underline"
  >
    {children}
  </a>
);

const PrivacyPage = () => {
  return (
    <div className="grid gap-[18px]">
      <PageHead title="개인정보처리방침" />

      <div className="border-[1.5px] border-line bg-surface px-5 py-5 lg:px-6 lg:py-6">
        <p className="mb-6 text-[13px] leading-relaxed text-ink-soft">
          뚝딱계산기(ttukcal.com, 이하 &lsquo;사이트&rsquo;)는 「개인정보
          보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한
          고충을 신속하게 처리할 수 있도록 다음과 같이 개인정보처리방침을
          수립·공개합니다.
        </p>

        <Section no={1} title="개인정보의 처리 목적과 처리하는 항목">
          <p>
            사이트는 회원가입 절차가 없으며, 이름·연락처·주민등록번호 등 개인을
            식별할 수 있는 정보를 수집하거나 처리하지 않습니다.
          </p>
          <p>
            계산기에 입력하는 생년월일, 금액, 키와 몸무게, 글 내용 등은 이용자의
            브라우저 안에서만 계산에 쓰이며 서버로 전송되거나 저장되지 않습니다.
            페이지를 닫으면 사라집니다.
          </p>
        </Section>

        <Section no={2} title="개인정보의 처리 및 보유 기간">
          <p>수집하는 개인정보가 없으므로 보유하는 개인정보도 없습니다.</p>
        </Section>

        <Section no={3} title="개인정보의 파기 절차 및 방법">
          <p>보유하는 개인정보가 없어 별도의 파기 절차를 두지 않습니다.</p>
        </Section>

        <Section no={4} title="개인정보의 안전성 확보 조치">
          <ul className="list-inside list-disc space-y-0.5">
            <li>
              사이트는 정적 웹페이지로 운영되며 이용자 정보를 담는 데이터베이스를
              두지 않습니다.
            </li>
            <li>모든 통신은 HTTPS로 암호화됩니다.</li>
            <li>
              계산은 전부 이용자의 브라우저에서 수행되어 입력값이 외부로 나가지
              않습니다.
            </li>
          </ul>
        </Section>

        <Section
          no={5}
          title="개인정보 자동 수집 장치의 설치·운영 및 그 거부에 관한 사항"
        >
          <p>
            사이트는 자체적으로 쿠키를 설치하거나 이용자를 식별하지 않습니다.
            다만 광고 게재를 위해 제3자 광고 서비스를 이용하는 경우, 해당 광고
            사업자가 이용자의 브라우저에 쿠키를 저장할 수 있습니다.
          </p>
          <p>
            이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다. 크롬은
            설정 → 개인정보 보호 및 보안 → 서드파티 쿠키에서, 엣지는 설정 →
            개인 정보, 검색 및 서비스 → 쿠키에서 변경할 수 있습니다. 시크릿
            모드(InPrivate 창)를 이용하면 쿠키가 기기에 저장되지 않습니다.
          </p>
          <p>쿠키를 차단해도 사이트의 계산 기능은 정상적으로 동작합니다.</p>
        </Section>

        <Section
          no={6}
          title="제3자의 행태정보 수집·이용 및 그 거부에 관한 사항"
        >
          <p>
            사이트는 운영 비용 충당을 위해 구글 애드센스 등 제3자 광고 서비스를
            이용할 수 있습니다. 이 경우 광고 사업자가 자동 수집 장치를 통해
            이용자의 웹사이트 방문·이용 이력(행태정보)을 수집하여 관심사에 기반한
            맞춤형 광고를 제공할 수 있습니다.
          </p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>수집 주체: 구글 등 제3자 광고 사업자</li>
            <li>수집 항목: 웹사이트 방문 이력, 광고 조회·클릭 이력 등</li>
            <li>수집 방법: 이용자가 사이트를 방문할 때 자동으로 수집</li>
            <li>수집 목적: 관심사에 기반한 맞춤형 광고 제공</li>
            <li>보유·이용 기간: 해당 광고 사업자의 정책에 따름</li>
          </ul>
          <p>
            사이트는 이 과정에 관여하지 않으며 이용자를 식별하지 않습니다. 사상,
            신념, 병력 등 사생활을 침해할 우려가 있는 민감한 행태정보는 수집하지
            않으며, 아동을 대상으로 한 맞춤형 광고도 제공하지 않습니다.
          </p>
          <p>
            맞춤형 광고는{" "}
            <Ext href="https://myadcenter.google.com">myadcenter.google.com</Ext>
            에서 거부할 수 있으며, 구글의 광고 쿠키 정책은{" "}
            <Ext href="https://policies.google.com/technologies/ads">
              policies.google.com/technologies/ads
            </Ext>
            에서 확인할 수 있습니다.
          </p>
        </Section>

        <Section
          no={7}
          title="정보주체와 법정대리인의 권리·의무 및 행사 방법"
        >
          <p>
            정보주체는 「개인정보 보호법」 제35조부터 제37조에 따라 개인정보의
            열람, 정정·삭제, 처리정지를 요구할 수 있습니다. 다만 사이트는 개인을
            식별할 수 있는 정보를 보유하고 있지 않아 실제로 열람하거나 정정할
            대상이 없습니다.
          </p>
          <p>
            권리 행사나 그 밖의 문의는 아래 개인정보 보호책임자에게 전자우편으로
            요청하실 수 있으며, 사이트는 지체 없이 답변하겠습니다.
          </p>
        </Section>

        <Section no={8} title="해당 사항이 없는 항목">
          <p>
            사이트는 개인정보를 수집하지 않으므로 다음 항목은 해당 사항이
            없습니다.
          </p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>개인정보의 제3자 제공</li>
            <li>개인정보 처리업무의 위탁</li>
            <li>개인정보의 국외 수집 및 이전</li>
            <li>14세 미만 아동의 개인정보 처리</li>
            <li>민감정보 및 가명정보의 처리</li>
            <li>자동화된 결정</li>
            <li>고정형·이동형 영상정보처리기기의 운영</li>
          </ul>
        </Section>

        <Section no={9} title="개인정보 보호책임자">
          <p>
            사이트는 개인정보 처리에 관한 업무를 총괄하여 책임지고 관련 고충을
            처리하기 위하여 다음과 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>개인정보 보호책임자: {PRIVACY_OFFICER}</li>
            <li>
              연락처:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-accent hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </Section>

        <Section no={10} title="권익침해 구제 방법">
          <p>
            정보주체는 개인정보 침해로 인한 분쟁 해결이나 상담 등 피해 구제를
            받고자 하는 경우 아래 기관에 신고·상담을 신청할 수 있습니다.
          </p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>
              개인정보 분쟁조정위원회: (국번없이) 1833-6972{" "}
              <Ext href="https://www.kopico.go.kr">kopico.go.kr</Ext>
            </li>
            <li>
              개인정보침해 신고센터: (국번없이) 118{" "}
              <Ext href="https://privacy.kisa.or.kr">privacy.kisa.or.kr</Ext>
            </li>
            <li>
              경찰청: (국번없이) 182{" "}
              <Ext href="https://ecrm.police.go.kr">ecrm.police.go.kr</Ext>
            </li>
          </ul>
        </Section>

        <Section no={11} title="개인정보처리방침의 변경">
          <p>
            이 개인정보처리방침은 {POLICY_EFFECTIVE_DATE}부터 적용됩니다. 내용의
            추가·삭제 및 수정이 있을 경우 변경된 방침을 이 페이지에 게시하여
            알려 드립니다.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default PrivacyPage;
