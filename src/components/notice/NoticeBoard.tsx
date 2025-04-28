//React 화면에 크롤링한 공지사항 리스트가 실시간으로 표시됨.
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Notice {
  number: string;
  title: string;
  writer: string;
  date: string;
  views: string;
  link: string;
}

function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    async function fetchNotices() {
      const res = await axios.get('http://localhost:8000/crawl');
      setNotices(res.data.notices);
    }
    fetchNotices();
  }, []);

  return (
    <div style={{ paddingTop: "120px" }}>
      {/* 메뉴바 높이 만큼 띄워주기 (예: 120px) */}
      <h2 style={{ 
        color: "#00256C",   // 네이비색
      fontWeight: "bold", // 굵게
      fontSize: "2.2rem"  // h2보다 더 크게
      }}>
      IT융합대학 공지사항 목록</h2>

      <h3>총 {notices.length}개의 공지사항이 등록되었습니다.</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid black" }}>
            <th style={{ padding: "10px" }}>번호</th>
            <th style={{ padding: "10px" }}>제목</th>
            <th style={{ padding: "10px" }}>작성자</th>
            <th style={{ padding: "10px" }}>작성일</th>
            <th style={{ padding: "10px" }}>조회수</th>
            <th style={{ padding: "10px" }}>첨부파일</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px", textAlign: "center" }}>{notice.number}</td>
              <td style={{ padding: "8px" }}>
                <a href={notice.link} target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
                  {notice.title}
                </a>
              </td>
              <td style={{ padding: "8px", textAlign: "center" }}>{notice.writer}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{notice.date}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>{notice.views}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>
                {notice.link ? "📎" : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NoticeBoard;
