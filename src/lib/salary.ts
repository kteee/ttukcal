/**
 * 연봉 실수령액 계산 (2026년 9월 급여 기준).
 *
 * - 4대보험: 국민연금·국민건강보험공단·고용노동부 고시 요율
 * - 소득세: 근로소득 간이세액표(소득세법 시행령 [별표 2], 2026. 2. 27. 개정) 100%
 *
 * 공식 문서에 원 단위 처리가 명시되지 않은 곳(국민연금·고용보험 보험료,
 * 1,000만원 초과 소득세)은 실무 관행대로 10원 미만을 버린다.
 */
import { INCOME_TAX_TABLE, TABLE_MAX_THOUSAND } from "./income-tax-table";

/** 국민연금 근로자 부담 4.75% (2026년 총 9.5%) */
const PENSION_RATE = 0.0475;
/** 국민연금 기준소득월액 상·하한 (2026.7.1 ~ 2027.6.30, 매년 7월 조정) */
const PENSION_BASE_MIN = 410_000;
const PENSION_BASE_MAX = 6_590_000;
/** 건강보험 근로자 부담 3.595% (2026년 총 7.19%) */
const HEALTH_RATE = 0.03595;
/** 건강보험 근로자 부담 월 상한 (2026년) */
const HEALTH_MAX = 4_591_740;
/** 장기요양보험료 = 건강보험료 × (0.9448% ÷ 7.19%), 약 13.14% */
const CARE_RATIO = 0.9448 / 7.19;
/** 고용보험 근로자 부담 */
const EMPLOYMENT_RATE = 0.009;

export const RATE_LABELS = {
  pension: "4.75%",
  health: "3.595%",
  care: "건강보험의 13.14%",
  employment: "0.9%",
};

/** 아래 표에 깔 연봉 구간 */
export const TABLE_ANNUALS = [
  24_000_000, 28_000_000, 30_000_000, 35_000_000, 40_000_000, 45_000_000,
  50_000_000, 60_000_000, 70_000_000, 80_000_000, 90_000_000, 100_000_000,
];

export type SalaryInput = {
  annual: number;
  /** 월 비과세액 (식대 등) */
  nonTaxableMonthly: number;
  /** 공제대상 가족 수, 본인 포함 */
  dependents: number;
  /** 8세 이상 20세 이하 자녀 수 */
  children: number;
};

export type SalaryBreakdown = {
  annual: number;
  gross: number;
  taxable: number;
  pension: number;
  health: number;
  care: number;
  employment: number;
  incomeTax: number;
  localTax: number;
  totalDeduction: number;
  net: number;
};

/**
 * unit 미만 절사. 3,000,000 × 0.009 가 26,999.999… 로 나오는 부동소수점 오차 때문에
 * 10원이 덜 잘리지 않도록 아주 작은 값을 더한 뒤 버린다.
 */
const floorTo = (n: number, unit: number) =>
  Math.floor(n / unit + 1e-9) * unit;

/** 표 마지막 줄(월급여 1,000만원 정확히)의 가족 수별 세액 */
const TAX_AT_10M = [
  1_507_400, 1_431_570, 1_200_840, 1_170_840, 1_140_840, 1_110_840,
  1_080_840, 1_050_840, 1_020_840, 990_840, 960_840,
];

/** 간이세액표에서 월급여(원)·가족 수(1~11)의 세액을 찾는다. */
function lookupTable(pay: number, family: number): number {
  const rows = INCOME_TAX_TABLE;
  if (pay < rows[0][0] * 1000) return 0;

  // 행 하한이 오름차순이라 이진 탐색으로 "하한 ≤ pay" 인 마지막 행을 찾는다.
  let lo = 0;
  let hi = rows.length - 1;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (rows[mid][0] * 1000 <= pay) lo = mid;
    else hi = mid - 1;
  }
  return rows[lo][family];
}

/** 가족 수 1~11명 기준 간이세액표 세액 (자녀 공제 전) */
function baseTax(pay: number, family: number): number {
  if (pay < TABLE_MAX_THOUSAND * 1000) return lookupTable(pay, family);

  const b = TAX_AT_10M[family - 1];
  if (pay === 10_000_000) return b;

  // 별표 2 의 1,000만원 초과 구간 계산식
  let extra: number;
  if (pay <= 14_000_000) extra = (pay - 10_000_000) * 0.98 * 0.35 + 25_000;
  else if (pay <= 28_000_000) extra = 1_397_000 + (pay - 14_000_000) * 0.98 * 0.38;
  else if (pay <= 30_000_000) extra = 6_610_600 + (pay - 28_000_000) * 0.98 * 0.4;
  else if (pay <= 45_000_000) extra = 7_394_600 + (pay - 30_000_000) * 0.4;
  else if (pay <= 87_000_000) extra = 13_394_600 + (pay - 45_000_000) * 0.42;
  else extra = 31_034_600 + (pay - 87_000_000) * 0.45;

  return floorTo(b + extra, 10);
}

/**
 * 월 소득세 (간이세액표 100%).
 * @param pay 비과세를 뺀 월급여(원)
 */
export function monthlyIncomeTax(
  pay: number,
  dependents: number,
  children: number
): number {
  const family = Math.max(1, Math.floor(dependents));

  // 11명 초과: 11명 세액 - (10명 세액 - 11명 세액) × 초과 인원
  let tax =
    family <= 11
      ? baseTax(pay, family)
      : baseTax(pay, 11) -
        (baseTax(pay, 10) - baseTax(pay, 11)) * (family - 11);

  // 8세 이상 20세 이하 자녀 공제 (2026. 2. 27. 개정 금액)
  if (children === 1) tax -= 20_830;
  else if (children === 2) tax -= 45_830;
  else if (children > 2) tax -= 45_830 + (children - 2) * 33_330;

  return Math.max(0, tax);
}

export function calcSalary(input: SalaryInput): SalaryBreakdown {
  const { annual, nonTaxableMonthly, dependents, children } = input;

  const gross = Math.round(annual / 12);
  const taxable = Math.max(0, gross - nonTaxableMonthly);

  // 기준소득월액은 상·하한 안으로 맞춘 뒤 천원 미만을 버린다.
  const pensionBase = floorTo(
    Math.min(Math.max(taxable, PENSION_BASE_MIN), PENSION_BASE_MAX),
    1000
  );
  const pension = taxable > 0 ? floorTo(pensionBase * PENSION_RATE, 10) : 0;
  const health = Math.min(floorTo(taxable * HEALTH_RATE, 10), HEALTH_MAX);
  const care = floorTo(health * CARE_RATIO, 10);
  const employment = floorTo(taxable * EMPLOYMENT_RATE, 10);

  const incomeTax = monthlyIncomeTax(taxable, dependents, children);
  const localTax = floorTo(incomeTax * 0.1, 10);

  const totalDeduction =
    pension + health + care + employment + incomeTax + localTax;

  return {
    annual,
    gross,
    taxable,
    pension,
    health,
    care,
    employment,
    incomeTax,
    localTax,
    totalDeduction,
    net: gross - totalDeduction,
  };
}
