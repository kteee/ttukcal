import { useMemo, useState } from "react";
import Card from "../components/Card";
import PageHead from "../components/PageHead";
import Row from "../components/Row";

/** 이모지·조합형 한글을 사람이 세는 방식대로 1글자로 센다. */
function countCharacters(text: string): number {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("ko", { granularity: "grapheme" });
    return [...segmenter.segment(text)].length;
  }
  return Array.from(text).length;
}

/** 한글·한자 등 ASCII를 벗어나는 문자를 2바이트로 세는 방식(EUC-KR 기준). */
function countLegacyBytes(text: string): number {
  let bytes = 0;
  for (const char of text) {
    bytes += char.charCodeAt(0) > 127 ? 2 : 1;
  }
  return bytes;
}

const buttonClass =
  "border-[1.5px] border-line bg-surface px-3 py-2 text-[13px] hover:border-accent hover:text-accent-strong disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink";

const TextCounter = () => {
  const [text, setText] = useState("");
  const [goal, setGoal] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    return {
      chars: countCharacters(text),
      charsNoSpace: countCharacters(text.replace(/\s/g, "")),
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      lines: text ? text.split(/\r\n|\r|\n/).length : 0,
      paragraphs: trimmed
        ? trimmed.split(/(?:\r\n|\r|\n)\s*(?:\r\n|\r|\n)/).filter(Boolean).length
        : 0,
      utf8Bytes: new TextEncoder().encode(text).length,
      legacyBytes: countLegacyBytes(text),
      manuscript: Math.ceil(countCharacters(text) / 200),
    };
  }, [text]);

  const goalNumber = Number(goal);
  const hasGoal = goal !== "" && Number.isFinite(goalNumber) && goalNumber > 0;
  const progress = hasGoal
    ? Math.min(100, Math.round((stats.chars / goalNumber) * 100))
    : 0;
  const overGoal = hasGoal && stats.chars > goalNumber;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-[18px]">
      <PageHead title="글자수 계산기" />

      <Card label="본문 입력">
        <textarea
          className="min-h-80 w-full resize-y border-[1.5px] border-line bg-surface px-3.5 py-3 text-[14.5px] leading-relaxed outline-none focus:border-accent"
          placeholder="여기에 글을 붙여넣으면 실시간으로 세어 줍니다."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <label htmlFor="goal" className="text-[12.5px] text-muted">
            목표 글자수
          </label>
          <input
            id="goal"
            type="number"
            min={1}
            placeholder="1000"
            className="w-24 border-[1.5px] border-line bg-surface px-2.5 py-2 tabular-nums text-[13px] outline-none focus:border-accent"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className={buttonClass}
            >
              {copied ? "복사됨" : "복사"}
            </button>
            <button
              type="button"
              onClick={() => setText("")}
              disabled={!text}
              className={buttonClass}
            >
              지우기
            </button>
          </div>
        </div>

        {hasGoal && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between tabular-nums text-[12px] text-muted">
              <span>
                {stats.chars.toLocaleString()} / {goalNumber.toLocaleString()}
              </span>
              <span className={overGoal ? "text-red-600" : "text-accent"}>
                {progress}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-line-soft">
              <div
                className={`h-full ${overGoal ? "bg-red-500" : "bg-accent"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </Card>

      <Card label="집계">
        <div className="grid gap-x-8 sm:grid-cols-2">
          <div>
            <Row label="글자수 (공백 포함)" value={stats.chars.toLocaleString()} />
            <Row
              label="글자수 (공백 제외)"
              value={stats.charsNoSpace.toLocaleString()}
            />
            <Row label="단어" value={stats.words.toLocaleString()} />
            <Row label="줄" value={stats.lines.toLocaleString()} last />
          </div>
          <div>
            <Row label="문단" value={stats.paragraphs.toLocaleString()} />
            <Row
              label="바이트"
              value={stats.utf8Bytes.toLocaleString()}
              note="UTF-8"
            />
            <Row
              label="바이트"
              value={stats.legacyBytes.toLocaleString()}
              note="한글 2바이트"
            />
            <Row
              label="원고지"
              value={`${stats.manuscript.toLocaleString()}매`}
              note="200자"
              last
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TextCounter;
