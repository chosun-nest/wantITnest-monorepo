// 게시글 본문 부분

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostDetailContentProps {
  content: string;
}

export default function PostDetailContent({ content }: PostDetailContentProps) {
  return (
    <div className="mb-6 prose max-w-none prose-headings:font-bold prose-img:rounded-lg prose-pre:bg-gray-100 prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}