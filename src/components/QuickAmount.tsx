const STEPS = [
  { label: "+10만", amount: 100_000 },
  { label: "+100만", amount: 1_000_000 },
  { label: "+1000만", amount: 10_000_000 },
  { label: "+1억", amount: 100_000_000 },
];

const chipClass =
  "border-[1.5px] border-line bg-surface px-2.5 py-1.5 text-[12.5px] hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink";

type QuickAmountProps = {
  /** 숫자만 담긴 문자열 (MoneyInput 과 같은 형식) */
  value: string;
  onChange: (digits: string) => void;
  /** 버튼 옆에 붙는 안내 문구. 버튼 줄 안에 두어 레이아웃이 흔들리지 않게 한다. */
  hint?: string;
};

/** 금액 입력칸 아래에 붙는 빠른 입력 버튼. 누를 때마다 더해진다. */
const QuickAmount = ({ value, onChange, hint }: QuickAmountProps) => {
  const add = (amount: number) => {
    const current = value === "" ? 0 : Number(value);
    onChange(String(current + amount));
  };

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
      {STEPS.map((step) => (
        <button
          key={step.label}
          type="button"
          onClick={() => add(step.amount)}
          className={chipClass}
        >
          {step.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange("")}
        disabled={value === ""}
        className={chipClass}
      >
        지우기
      </button>
      {hint && <span className="ml-1.5 text-[12px] text-muted">{hint}</span>}
    </div>
  );
};

export default QuickAmount;
