import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoticeDropdown from "./NoticeDropdown";
import "./NoticeBoard.css";

// Notice 인터페이스 정의
interface Notice {
  number: string;
  title: string;
  writer: string;
  date: string;
  deadline?: string; // 장학공지 전용 필드
  views: number;
  link: string;
}

function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [category, setCategory] = useState("일반공지");

  useEffect(() => {
      async function fetchNotices() {
          try {
              const res = await axios.get(`http://localhost:8000/crawl/${category}`);
              setNotices(res.data.notices);
          } catch (error) {
              console.error("Error fetching notices:", error);
          }
      }
      fetchNotices();
  }, [category]);

  return (
      <div className="notice-board-container">
          {/* 드롭다운 메뉴 */}
          <NoticeDropdown selectedCategory={category} setSelectedCategory={setCategory} />

          {/* 공지사항 개수 표시 */}
          <h3>총 {notices.length}개의 공지사항이 등록되었습니다.</h3>

          {/* 공지사항 테이블 */}
          <table className="notice-table">
              <thead>
                  <tr>
                      <th>번호</th>
                      <th>제목</th>
                      <th>작성자</th>
                      <th>작성일</th>
                      {category === "장학공지" && <th className="deadline">접수 마감일</th>}
                      <th>조회수</th>
                      <th>첨부파일</th>
                  </tr>
              </thead>
              <tbody>
                  {notices.map((notice, idx) => (
                      <tr key={idx}>
                          <td>{notice.number}</td>
                          <td>
                              <a href={notice.link} target="_blank" rel="noopener noreferrer">
                                  {notice.title}
                              </a>
                          </td>
                          <td>{notice.writer}</td>
                          <td>{notice.date}</td>
                          {category === "장학공지" && <td className="deadline">{notice.deadline || "-"}</td>}
                          <td>{notice.views}</td>
                          <td>
                              {notice.link ? (
                                  <img 
                                      src="/assets/images/clip_icon.png" 
                                      alt="첨부파일" 
                                      style={{ width: "20px", verticalAlign: "middle" }} 
                                  />
                              ) : "-"}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
}

export default NoticeBoard;
