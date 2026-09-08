import { NavLink } from "react-router-dom";

const MENU = [
  { to: "/date", label: "날짜 계산기" },
  { to: "/age", label: "만나이 계산기" },
  { to: "/lunar", label: "양음력 변환기" },
  { to: "/unit", label: "단위 변환기" },
  { to: "/percent", label: "퍼센트 계산기" },
  { to: "/vat", label: "부가세 계산기" },
  { to: "/interest", label: "이자 계산기" },
  { to: "/bmi", label: "BMI 계산기" },
  { to: "/text", label: "글자수 계산기" },
];

const Sidebar = () => {
  return (
    <aside className="order-first grid gap-[18px] lg:order-none lg:sticky lg:top-6">
      <nav className="border-[1.5px] border-line bg-surface">
        <div className="border-b-[1.5px] border-line px-4 py-[13px] text-[12px] font-semibold tracking-[0.04em] text-muted">
          계산기
        </div>
        {MENU.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block w-full px-4 py-[13px] text-left text-[14px] ${
                i === MENU.length - 1 ? "" : "border-b border-line-soft"
              } ${
                isActive
                  ? "bg-selected font-semibold text-accent"
                  : "hover:bg-selected"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
