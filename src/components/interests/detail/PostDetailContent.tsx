// 게시글 본문 부분

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostDetailContentProps {
  content: string;
}

export default function PostDetailContent({ content }: PostDetailContentProps) {
  return (
    <div className="mb-6 prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}