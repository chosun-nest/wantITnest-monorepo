// 마크 다운 에디터
import MDEditor from "@uiw/react-md-editor";

interface Props {
  content: string | undefined;
  setContent: (val: string) => void;
}

export default function MarkdownEditor({ content, setContent }: Props) {
  return (
    <div className="mb-6 mt-7">
      <label className="block mb-2 text-lg font-bold text-gray-500">
        내용을 입력해주세요.
      </label>
      <MDEditor value={content} onChange={(value) => setContent(value || "")} height={600} />
    </div>
  );
}
