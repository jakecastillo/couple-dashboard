import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

export function Markdown({
  content,
  className
}: {
  content: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "prose prose-zinc max-w-none whitespace-pre-wrap dark:prose-invert prose-headings:tracking-tight prose-a:text-blush-700 dark:prose-a:text-blush-300",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
