import React from "react";

interface Notice {
  number: string;
  title: string;
  writer: string;
  date: string;
  views: string;
  content: string;
}

const NoticeCard = ({ notice }: { notice: Notice }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    >


      {/* 제목 */}
      <div
        style={{
          fontSize: "1.1rem",
          fontWeight: "bold",
          marginBottom: "6px",
          color: "#00256C",
        }}
      >
        {notice.title}
      </div>

      {/* 내용 요약 */}
      <div
        style={{
          fontSize: "0.95rem",
          color: "#555",
          marginBottom: "12px",
          lineHeight: "1.4",
        }}
      >
        {notice.content.length > 80
          ? `${notice.content.slice(0, 80)}…`
          : notice.content}
      </div>

      {/* 하단 작성자 · 날짜 / 조회수 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.85rem",
          color: "#888",
        }}
      >
        <span>{notice.writer} · {notice.date}</span>
        <span>조회수 {notice.views}</span>
      </div>
    </div>
  );
};

export default NoticeCard;
