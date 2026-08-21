import { CopyButton } from "./CopyButton";

export function CodeBlock({ code, label = "TypeScript" }: { code: string; label?: string }) {
  const displayCode = code.replaceAll("\n+", "\n");
  return <div className="codeBlock"><div className="codeTop"><span>{label}</span><CopyButton text={displayCode} compact/></div><pre><code>{displayCode}</code></pre></div>;
}
