import { memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

function Markdown({ children, ...props }: Options) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      {...props}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline ? (
            <SyntaxHighlighter
              {...props}
              style={a11yDark}
              language={match?.[1] ?? ""}
              PreTag="div"
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
export default memo(Markdown);
