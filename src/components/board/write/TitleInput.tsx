// 게시글 제목 입력란
interface Props {
  title: string;
  setTitle: (val: string) => void;
  boardType: "interests" | "projects";
}

export default function TitleInput({ title, setTitle, boardType }: Props) {
  return (
    <div className="mt-10 mb-4">
      <label className="block mb-2 text-lg font-bold text-gray-500">
        제목을 입력해 주세요.
      </label>
      <input
        className="w-full p-3 border rounded"
        placeholder={
          boardType === "projects"
            ? "제목에 핵심 내용을 요약해보세요."
            : "제목을 입력하세요"
        }
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
}
