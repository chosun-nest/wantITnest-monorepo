import { useContext, useState } from "react";
import { NavbarHeightContext } from "../context/NavbarHeightContext";
import { mockProjects } from "../constants/mock-projects";

const ITEMS_PER_PAGE = 7;

export default function ProjectBoard() {
  const { navbarHeight } = useContext(NavbarHeightContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = mockProjects.filter((project) =>
    project.title.includes(searchTerm) || project.author.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div
      style={{
        padding: `${navbarHeight + 20}px 20px`,
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "80vh",
        lineHeight: "1.8",
        wordBreak: "keep-all",
        whiteSpace: "pre-wrap",
      }}
    >
      {/* 📢 헤더 제목 */}
      <h2 style={{ color: "#00256C", fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>
        프로젝트 모집 게시판
      </h2>

      {/* 📌 총 개수 + 🔍 검색창 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <p>
          총 <strong>{filteredProjects.length}</strong>개의 게시물이 있습니다.
        </p>
        <input
          type="text"
          placeholder="제목 또는 작성자 검색"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "260px",
            fontSize: "14px",
          }}
        />
      </div>

      {/* 📋 테이블 */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th>No</th>
            <th>제목</th>
            <th>작성일</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>참여인원/정원</th>
            <th>첨부</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project) => (
            <tr key={project.id} style={{ textAlign: "center", borderBottom: "1px solid #eee" }}>
              <td>{project.id}</td>
              <td style={{ textAlign: "left" }}>{project.title}</td>
              <td>{project.date}</td>
              <td>{project.author}</td>
              <td>{project.views}</td>
              <td>{project.participants}</td>
              <td>{project.hasAttachment ? "📎" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📄 페이지네이션 */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: "0 4px",
              padding: "6px 12px",
              backgroundColor: currentPage === i + 1 ? "#00256C" : "#eee",
              color: currentPage === i + 1 ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}