import PageHead from "../components/PageHead";
import { CONTACT_EMAIL, POLICY_EFFECTIVE_DATE } from "../lib/site";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-5 last:mb-0">
    <h2 className="mb-1.5 text-[14px] font-semibold text-ink">{title}</h2>
    <div className="text-[13px] leading-relaxed text-ink-soft">{children}</div>
  </section>
);

const PrivacyPage = () => {
  return (
    <div className="grid gap-[18px]">
      <PageHead title="개인정보처리방침" />

      <div className="border-[1.5px] border-line bg-surface px-5 py-5 lg:px-6 lg:py-6">
        <p className="mb-5 text-[13px] leading-relaxed text-ink-soft">
          뚝딱계산기(ttukcal.com, 이하 &lsquo;사이트&rsquo;)가 이용자의 정보를
          어떻게 취급하는지 설명합니다.
        </p>

        <Section title="1. 계산에 입력한 값">
          <p>
            사이트의 모든 계산은 이용자의 브라우저 안에서 실행됩니다. 생년월일,
            금액, 키와 몸무게, 글 내용 등 입력한 값은 서버로 전송되거나 저장되지
            않으며, 페이지를 닫으면 사라집니다.
          </p>
        </Section>

        <Section title="2. 회원가입과 개인정보 수집">
          <p>
            회원가입 절차가 없으며, 이름·연락처·이메일 등 개인을 식별할 수 있는
            정보를 수집하지 않습니다.
          </p>
        </Section>

        <Section title="3. 쿠키와 광고">
          <p className="mb-2">
            사이트는 운영을 위해 구글 애드센스 등 제3자 광고 서비스를 이용할 수
            있습니다. 이 경우 광고 사업자가 쿠키를 사용해 이용자의 방문 기록을
            수집하고 관심사에 기반한 광고를 제공할 수 있습니다. 이 처리는
            사이트가 아니라 해당 광고 사업자가 수행합니다.
          </p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>
              구글 광고 쿠키 정책:{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent hover:underline"
              >
                policies.google.com/technologies/ads
              </a>
            </li>
            <li>
              맞춤 광고 거부:{" "}
              <a
                href="https://myadcenter.google.com"
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent hover:underline"
              >
                myadcenter.google.com
              </a>
            </li>
          </ul>
        </Section>

        <Section title="4. 쿠키 거부 방법">
          <p>
            브라우저 설정에서 쿠키 저장을 거부할 수 있습니다. 크롬은 설정 →
            개인정보 보호 및 보안 → 서드파티 쿠키에서 변경할 수 있습니다. 다만
            쿠키를 차단해도 사이트의 계산 기능은 정상적으로 동작합니다.
          </p>
        </Section>

        <Section title="5. 제3자 제공">
          <p>
            사이트는 이용자의 개인정보를 수집하지 않으므로 제3자에게 제공하는
            정보도 없습니다.
          </p>
        </Section>

        <Section title="6. 보관 및 파기">
          <p>
            수집하는 개인정보가 없어 별도의 보관 및 파기 절차를 두지 않습니다.
          </p>
        </Section>

        <Section title="7. 문의">
          <p>
            개인정보 처리에 관한 문의는{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-accent hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            로 보내 주시기 바랍니다.
          </p>
        </Section>

        <Section title="8. 방침 변경">
          <p>
            본 방침이 변경될 경우 이 페이지를 통해 공지합니다. 시행일{" "}
            {POLICY_EFFECTIVE_DATE}.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default PrivacyPage;
