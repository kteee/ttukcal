type RowProps = {
  label: string;
  value: string;
  /** 값 아래 보조 설명 */
  note?: string;
  /** 강조 행 (포인트 컬러 + 큰 글자) */
  emphasis?: boolean;
  last?: boolean;
};

const Row = ({ label, value, note, emphasis, last }: RowProps) => {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-[11px] ${
        last ? "" : "border-b border-line-soft"
      }`}
    >
      <span className="text-[13.5px] text-ink-soft">
        {label}
        {note && <span className="ml-1.5 text-[12px] text-muted">{note}</span>}
      </span>
      <span
        className={`shrink-0 tabular-nums font-medium ${
          emphasis ? "text-[19px] text-accent" : "text-[15px] text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

export default Row;
