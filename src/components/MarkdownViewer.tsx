import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useStore } from "~/stores";
import "~/styles/markdown.css";

const Highlighter = (dark: boolean): any => {
  return {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark ? dracula : prism}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };
};

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const dark = useStore((state) => state.dark);

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No content available
      </div>
    );
  }

  return (
    <div className="markdown px-10 py-12 bg-white dark:bg-[#1a1a1b] text-gray-800 dark:text-gray-200 min-h-full">
      <div className="markdown-body max-w-4xl mx-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[
            rehypeKatex,
            [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
          ]}
          components={Highlighter(dark as boolean)}
        >
          {String(content)}
        </ReactMarkdown>
      </div>
    </div>
  );
}
