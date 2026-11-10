"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock, { type PlaygroundContext } from "./CodeBlock";

export default function Markdown({
  content,
  playground,
}: {
  content: string;
  playground?: PlaygroundContext;
}) {
  return (
    <div className="markdown" dir="rtl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
          code({ children, className }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            if (match) {
              return (
                <CodeBlock
                  code={codeString}
                  language={match[1]}
                  playground={playground}
                />
              );
            }
            return <code>{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
