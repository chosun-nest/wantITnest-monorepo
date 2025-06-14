import { useEffect, useState } from "react";
import { getTopProjects } from "../../../utils/getTopProjects";

type Project = {
  id: number;
  title: string;
  content: string;
  date: string;
  author: { id: number; name: string };
  views: number;
  participants: string;
  hasAttachment: boolean;
  status: string;
  tags: string[];
};

export default function HomeProject() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const top = getTopProjects({
      selectedTags: ["React", "AI"], // 관심 태그
      filter: "모집중",
      size: 5,
    });
    setProjects(top);
  }, []);

  return (
    <div
      className="overflow-x-auto scrollbar-instagram -mx-2 px-2"
      style={{
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
      }}
    >
      <div className="flex gap-4 py-2 touch-pan-x">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="min-w-[280px] max-w-[320px] shrink-0 border rounded-lg p-4 bg-white hover:shadow cursor-pointer transition"
            >
              <h2 className="font-bold text-base mb-2">{project.title}</h2>
              <p className="text-sm text-gray-700">
                {project.content.length > 100
                  ? project.content.slice(0, 100) + "..."
                  : project.content}
              </p>
              <div className="flex flex-wrap gap-2 mt-2 mb-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                {project.author.name} · {project.date} · 조회수 {project.views}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm">
            모집 중인 프로젝트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
