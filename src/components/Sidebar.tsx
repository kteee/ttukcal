import { NavLink } from "react-router-dom";
import { MENU } from "../lib/menu";

/** 데스크톱 전용 사이드바. 좁은 화면에서는 헤더 드롭다운(MobileMenu)이 대신한다. */
const Sidebar = () => {
  return (
    <aside className="hidden lg:sticky lg:top-6 lg:grid lg:gap-[18px]">
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
