import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Seo from "./components/Seo";
import Guide from "./components/Guide";
import Sidebar from "./components/Sidebar";
import AgePage from "./pages/AgePage";
import DatePage from "./pages/DatePage";
import TextPage from "./pages/TextPage";
import LunarPage from "./pages/LunarPage";
import UnitPage from "./pages/UnitPage";
import PercentPage from "./pages/PercentPage";
import VatPage from "./pages/VatPage";
import InterestPage from "./pages/InterestPage";
import BmiPage from "./pages/BmiPage";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Seo />
      <Header />

      <main className="mx-auto grid w-[90%] max-w-[1180px] flex-1 grid-cols-1 items-start gap-[30px] pt-9 pb-16 lg:grid-cols-[minmax(0,1fr)_236px]">
        <div className="grid min-w-0 gap-[18px]">
          <Routes>
            <Route path="/" element={<Navigate to="/date" replace />} />
            <Route path="/age" element={<AgePage />} />
            <Route path="/text" element={<TextPage />} />
            <Route path="/date" element={<DatePage />} />
            <Route path="/lunar" element={<LunarPage />} />
            <Route path="/unit" element={<UnitPage />} />
            <Route path="/percent" element={<PercentPage />} />
            <Route path="/vat" element={<VatPage />} />
            <Route path="/interest" element={<InterestPage />} />
            <Route path="/bmi" element={<BmiPage />} />
            <Route path="*" element={<Navigate to="/date" replace />} />
          </Routes>
          <Guide />
        </div>
        <Sidebar />
      </main>

      <footer className="border-t-[1.5px] border-line bg-surface">
        <div className="mx-auto w-[90%] max-w-[1180px] py-[22px] text-[12.5px] text-muted">
          뚝딱계산기는 브라우저에서 바로 계산합니다. 입력값은 어디에도 전송되지
          않습니다.
        </div>
      </footer>
    </div>
  );
}

export default App;
