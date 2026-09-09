import type { ReactNode } from "react";

type CardProps = {
  /** 카드 좌상단 소제목 */
  label: string;
  children: ReactNode;
};

const Card = ({ label, children }: CardProps) => {
  return (
    <div className="border-[1.5px] border-line bg-surface px-5 py-5 lg:px-6 lg:py-6">
      <div className="mb-3 text-[13px] font-semibold text-ink-soft lg:mb-4">{label}</div>
      {children}
    </div>
  );
};

export default Card;
