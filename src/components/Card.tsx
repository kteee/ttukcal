import type { ReactNode } from "react";

type CardProps = {
  /** 카드 좌상단 소제목 */
  label: string;
  children: ReactNode;
};

const Card = ({ label, children }: CardProps) => {
  return (
    <div className="border-[1.5px] border-line bg-surface px-6 py-6">
      <div className="mb-4 text-[13px] font-semibold text-ink-soft">{label}</div>
      {children}
    </div>
  );
};

export default Card;
