import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MENU, menuLabelFor } from "../lib/menu";

/**
 * 헤더 메뉴 드롭다운.
 *
 * 사이드바를 두면 모바일에서 메뉴 9줄이 화면을 채워 계산기가 스크롤 아래로
 * 밀린다. PC 에서도 사이드바가 본문 폭을 줄이기만 해서, 화면 크기와 무관하게
 * 헤더 드롭다운 하나로 통일했다.
 */
const MenuDropdown = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // 메뉴를 고르면 경로가 바뀌므로 그때 닫는다.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 border-[1.5px] border-line px-3 py-1.5 text-[13px] text-ink-soft"
      >
        {menuLabelFor(pathname)}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <polyline points="5 9 12 16 19 9" />
        </svg>
      </button>

      {open && (
        <>
          {/* 바깥을 누르면 닫힌다 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav className="absolute right-0 top-full z-20 w-56 border-[1.5px] border-line bg-surface">
            {MENU.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-4 py-[11px] text-[14px] ${
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
        </>
      )}
    </div>
  );
};

export default MenuDropdown;
