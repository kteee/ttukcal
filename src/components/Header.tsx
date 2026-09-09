import MobileMenu from "./MobileMenu";

const Header = () => {
  return (
    <header className="border-b-[1.5px] border-line bg-surface">
      {/* 드롭다운 패널이 이 안에서 절대배치되도록 relative */}
      <div className="relative mx-auto flex h-[56px] w-[90%] max-w-[1180px] items-center justify-between">
        <span className="text-[16px] font-semibold tracking-[-0.01em]">
          뚝딱계산기
        </span>
        <MobileMenu />
      </div>
    </header>
  );
};

export default Header;
