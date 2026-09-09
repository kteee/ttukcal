import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor?: string;
  children: ReactNode;
};

/** 라벨 + 입력 한 쌍. 입력 요소는 inputClass 를 그대로 쓰면 된다. */
const Field = ({ label, htmlFor, children }: FieldProps) => {
  return (
    <label htmlFor={htmlFor} className="grid gap-1.5">
      <span className="text-[12.5px] text-muted">{label}</span>
      {children}
    </label>
  );
};

export const inputClass =
  "w-full border-[1.5px] border-line bg-surface px-3 py-2.5 tabular-nums text-[14px] outline-none focus:border-accent";

/** select 전용. 오른쪽 화살표 자리만큼 여백을 더 준다. */
export const selectClass =
  "select-field w-full border-[1.5px] border-line bg-surface py-2.5 pr-9 pl-3 text-[14px] outline-none focus:border-accent";

export default Field;
