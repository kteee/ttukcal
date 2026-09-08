import { useEffect, useLayoutEffect, useRef } from "react";

// 프리렌더링(SSR) 시 useLayoutEffect 는 실행되지 않아 경고가 뜬다.
// 서버에서는 useEffect 로 대체한다.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
import { inputClass } from "./Field";

type MoneyInputProps = {
  id: string;
  /** 숫자만 담긴 문자열. 화면에는 3자리 콤마를 넣어 보여준다. */
  value: string;
  onChange: (digits: string) => void;
  placeholder?: string;
};

const format = (digits: string) =>
  digits === "" ? "" : Number(digits).toLocaleString("ko-KR");

/**
 * 금액 입력칸. type="number" 로는 콤마를 표시할 수 없어 text 로 두고
 * 직접 포맷한다. 포맷 때문에 캐럿이 끝으로 튀지 않도록 위치를 보정한다.
 */
const MoneyInput = ({ id, value, onChange, placeholder }: MoneyInputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const next = pendingCaret.current;
    if (next !== null && ref.current) {
      ref.current.setSelectionRange(next, next);
      pendingCaret.current = null;
    }
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const position = event.target.selectionStart ?? raw.length;

    // 캐럿 앞에 숫자가 몇 개 있었는지를 기준으로 새 위치를 찾는다.
    const digitsBeforeCaret = raw.slice(0, position).replace(/\D/g, "").length;
    const digits = raw.replace(/\D/g, "");
    onChange(digits);

    const formatted = format(digits);
    let seen = 0;
    let next = formatted.length;
    if (digitsBeforeCaret === 0) {
      next = 0;
    } else {
      for (let i = 0; i < formatted.length; i++) {
        if (formatted[i] >= "0" && formatted[i] <= "9") {
          seen += 1;
          if (seen === digitsBeforeCaret) {
            next = i + 1;
            break;
          }
        }
      }
    }
    pendingCaret.current = next;
  };

  return (
    <input
      id={id}
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      className={inputClass}
      value={format(value)}
      onChange={handleChange}
    />
  );
};

export default MoneyInput;
