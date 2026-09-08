# 뚝딱계산기 (ttukcal)

필요한 계산만 뚝딱 끝내는 생활 계산기 모음.

> **🤖 AI로 만든 프로젝트입니다.**
> 
> 기획·설계·구현 전반을 Claude Code(Anthropic)와 함께 작업했습니다.
> 
> 직접 작성한 프로젝트와 구분하기 위해 표시해 둡니다.

| 도구 | 경로 | 하는 일 |
| --- | --- | --- |
| 날짜 계산기 | `/date` | 두 날짜 사이(일·주·개월·평일), 날짜 더하기·빼기 |
| 만나이 계산기 | `/age` | 만 나이 · 세는 나이 · 연 나이, 다음 생일 D-day |
| 양음력 변환기 | `/lunar` | 양력↔음력 양방향 변환, 윤달·간지·띠 |
| 단위 변환기 | `/unit` | 면적(평↔㎡)·길이·무게(근/돈 포함)·온도 |
| 퍼센트 계산기 | `/percent` | A의 B%, A는 B의 몇%, 증감률, 할인가 |
| 부가세 계산기 | `/vat` | 공급가액↔합계금액 양방향, 세율 조정 가능 |
| 이자 계산기 | `/interest` | 예금(단리·월복리)·적금·대출 원리금균등, 이자소득세 15.4% 반영 |
| BMI 계산기 | `/bmi` | 대한비만학회 기준 BMI·판정·정상 체중 범위 |
| 글자수 계산기 | `/text` | 공백 포함/제외 글자수, 단어·줄·문단, 바이트, 원고지 매수 |

## 실행

```bash
npm install
npm run dev
```

- `npm run build` — 타입 체크 후 프로덕션 빌드
- `npm run lint` — ESLint

## 배포

GitHub Pages + GitHub Actions. `main` 에 push 하면
[.github/workflows/deploy.yml](.github/workflows/deploy.yml) 이 자동으로
lint → 타입체크 → 번들 → 프리렌더 → 배포까지 돈다.

최초 1회 설정:

1. 저장소를 **public** 으로 생성 (무료 플랜은 public 만 Pages 지원)
2. 저장소 Settings → Pages → Source 를 **GitHub Actions** 로 변경
3. 커스텀 도메인을 쓸 경우
   - 등록처 DNS: 루트는 A 레코드 4개(`185.199.108~111.153`), `www` 는 CNAME → `<계정>.github.io`
   - `public/CNAME` 에 도메인 기록 (현재 `ttukcal.com`)
   - [src/lib/seo.ts](src/lib/seo.ts) 의 `SITE_URL`, `public/robots.txt`,
     `public/sitemap.xml` 의 도메인도 함께 교체
   - 인증서 발급 후 Settings → Pages 에서 **Enforce HTTPS** 체크

## SEO

- **프리렌더링**: `npm run build` 가 라우트마다 정적 HTML 을 만든다
  ([scripts/prerender.mjs](scripts/prerender.mjs)). GitHub Pages 는 정적 파일만
  서빙하므로 `/vat` 같은 경로에 실제 파일이 없으면 404 가 난다. 프리렌더는
  라우팅 문제와 검색 색인 문제를 한 번에 해결한다.
- **페이지별 메타**: [src/lib/seo.ts](src/lib/seo.ts) 에 라우트별 title /
  description 을 두고, 프리렌더 시 `<head>` 에 직접 박아 넣는다. 클라이언트에서는
  [src/components/Seo.tsx](src/components/Seo.tsx) 가 갱신한다.
- **설명 콘텐츠**: [src/lib/guides.ts](src/lib/guides.ts). 접는 UI 는 반드시
  `<details>` 를 쓴다. React 조건부 렌더링으로 숨기면 프리렌더 HTML 에 본문이
  들어가지 않아 색인할 내용이 사라진다.

## 기술 스택

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · React Router 7 · date-fns 4

## 디자인 시스템

플랫한 에디토리얼 스타일 — 둥근 모서리와 그림자를 쓰지 않고, 1.5px 헤어라인
테두리와 여백으로만 구조를 만든다. 토큰은 [src/index.css](src/index.css)의
`@theme` 블록에 있다.

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `canvas` | `#f5f5f6` | 페이지 배경 (연회색) |
| `surface` | `#ffffff` | 카드·헤더 배경 |
| `ink` / `ink-soft` / `muted` | `#1a1a1c` / `#48484c` / `#78787e` | 본문 / 보조 / 흐린 텍스트 |
| `line` / `line-soft` | `#dadade` / `#ebebee` | 테두리 / 구분선 |
| `selected` | `#f6f6f8` | 활성 메뉴 배경 |
| `accent` | `#274dea` | 포인트 (블루) |

- 폰트는 **Noto Sans KR** (Google, OFL) 하나만 쓴다. 15px / 1.55.
- 숫자는 별도 모노 폰트 없이 `tabular-nums` 로 정렬한다. Noto Sans KR 은 숫자
  글리프 폭이 이미 균일해서(측정 확인) 자릿수가 어긋나지 않는다.
- 처음에는 숫자에 Roboto Mono 를 썼으나 **0 에 빗금(slashed zero)** 이 들어가
  가독성을 해쳐서 걷어냈다. 폰트가 하나로 줄면서 요청 수와 용량도 함께 줄었다.

## 폴더 구조

```
src/
  components/     # Header, Sidebar, Card, Row, Field, MoneyInput, PageHead
  calculators/    # 계산기 본체 (UI + 상태)
  pages/          # 라우트 진입점
  lib/            # 순수 계산 로직 (UI 의존성 없음)
```

계산 로직은 `lib/`에 두고 컴포넌트에서는 호출만 한다. 테스트를 붙이거나 다른 계산기를
추가할 때 UI를 건드리지 않아도 되게 하기 위함.

## 음력 변환에 대해

한국천문연구원(KASI) 발표 자료를 표로 담은 [`korean-lunar-calendar`](https://github.com/usingsky/korean_lunar_calendar_js)(MIT)
를 쓴다. 구현은 [src/lib/lunar.ts](src/lib/lunar.ts) 참고. 지원 범위는 **1900 ~ 2050년**.

처음에는 무의존성으로 가려고 브라우저 내장 ICU 단기력(`Intl.DateTimeFormat` 의
`-u-ca-dangi`)을 썼으나, 1900~2050 전체(55,119일)를 KASI 표와 전수 비교한 결과
**2017-02-26 ~ 2017-03-27 구간 30일에서 ICU 가 하루씩 밀렸다.**

```
2017-02-25   KASI 1.29  =  ICU 1.29
2017-02-26   KASI 2.1   ≠  ICU 1.30   ← 어긋나기 시작
2017-03-27   KASI 2.30  ≠  ICU 2.29
2017-03-28   KASI 3.1   =  ICU 3.1    ← 다시 일치
```

ICU 는 삭(신월) 시각을 천문 계산으로 구하는데, 그 달의 삭이 한국 표준시 자정
근처라 KASI 의 공식 확정값과 날짜가 갈렸다. 국내 사용자 기준으로는 KASI 가
정답이므로 표 기반으로 교체했다. 부수 효과:

- 정확도: 55,119일 전부 KASI 와 일치
- 성능: 음력→양력 역변환이 430일 순차 탐색에서 O(1) 표 조회로 바뀜
- 이식성: 브라우저 ICU 지원 여부를 따질 필요가 없어짐
- 비용: 번들 +5.1KB (gzip), 상한 연도 2100 → 2050
