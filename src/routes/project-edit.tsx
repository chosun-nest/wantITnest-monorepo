import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById, updateProject } from "../api/project/ProjectAPI";
import { ProjectDetail, UpdateProjectPayload } from "../types/project-board";

export default function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectDetail | null>(null);

  // 수정할 필드 상태값
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxMember, setMaxMember] = useState(1); // ⚠️ 서버 응답에는 없지만 UI에선 필요
  const [startDate, setStartDate] = useState(""); // ⚠️ 서버 응답에는 없지만 UI에선 필요
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const data = await getProjectById(Number(id));
        setProject(data);
        setTitle(data.projectTitle);
        setDescription(data.projectDescription);

        // 서버에서 날짜 정보가 없으므로 비워두거나 필요 시 수동 설정
        setStartDate(data.createdAt.split("T")[0]); // createdAt → YYYY-MM-DD 추출용
        setEndDate(data.updatedAt.split("T")[0]);
      } catch (err) {
        alert("프로젝트 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;
    if (!title || !description) {
      alert("제목과 설명은 필수입니다.");
      return;
    }

    const payload: UpdateProjectPayload = {
      projectTitle: title,
      projectDescription: description,
      maxMember,
      projectStartDate: startDate,
      projectEndDate: endDate,
    };

    try {
      await updateProject(Number(id), payload);
      alert("수정이 완료되었습니다.");
      navigate(`/project/${id}`);
    } catch (err) {
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) return <div className="pt-36 text-center">⏳ 로딩 중...</div>;

  if (!project) return <div className="pt-36 text-center">존재하지 않는 프로젝트입니다.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-36 pb-10">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">프로젝트 수정</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">제목</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">설명</label>
          <textarea
            className="w-full border px-3 py-2 rounded h-32"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">최대 인원 수</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={maxMember}
            onChange={(e) => setMaxMember(Number(e.target.value))}
            min={1}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">시작일</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">마감일</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          수정 완료
        </button>
      </div>
    </div>
  );
}
