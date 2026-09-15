import { Link, NavLink } from "react-router-dom";
import MenuDropdown from "./MenuDropdown";
import { topMenuClass } from "./topMenuClass";
import { SALARY_MENU } from "../lib/menu";
import { hrefFor } from "../lib/path";

const Header = () => {
  return (
    <header className="border-b-[1.5px] border-line bg-surface">
      {/* 드롭다운 패널이 이 안에서 절대배치되도록 relative */}
      <div className="relative mx-auto flex h-[56px] w-[90%] max-w-[900px] items-center justify-between">
        <Link
          to="/"
          className="text-[16px] font-semibold tracking-[-0.01em] hover:text-accent"
        >
          뚝딱계산기
        </Link>
        <nav className="-mr-2.5 flex items-center">
          <NavLink
            to={hrefFor(SALARY_MENU.to)}
            className={({ isActive }) => topMenuClass(isActive)}
          >
            {SALARY_MENU.label}
          </NavLink>
          <MenuDropdown />
        </nav>
      </div>
    </header>
  );
};

export default Header;
