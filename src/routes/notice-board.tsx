// src/routes/notice-board.tsx
import * as S from "../assets/styles/notice.styles"
import NoticeRow from "../components/notice/NoticeRow";


const mockNotices = [
  {
    id: 213,
    title: "2025학년도 학생증 체크카드 발급 안내",
    date: "2025.01.02",
    author: "IT 융합대학 관리자",
    views: 436,
    hasAttachment: true,
  },
  {
    id: 212,
    title: "IT융합대학 M.space 사용안내",
    date: "2025.01.02",
    author: "IT 융합대학 관리자",
    views: 255,
    hasAttachment: false,
  },
  {
    id: 211,
    title: "2025 산업 채용 트렌드 취업특강",
    date: "2025.01.02",
    author: "IT 융합대학 관리자",
    views: 503,
    hasAttachment: true,
  },
];

export default function NoticeBoard() {
  return (
    <S.Container>
      <S.TitleSection>
        <S.PageTitle>학사공지</S.PageTitle>
        <S.SubText>총 <strong>{mockNotices.length}</strong>개의 게시물이 있습니다.</S.SubText>
      </S.TitleSection>

      <S.TableHeader>
        <span>No</span>
        <span>제목</span>
        <span>작성일</span>
        <span>작성자</span>
        <span>조회수</span>
        <span>첨부</span>
      </S.TableHeader>

      <S.TableBody>
        {mockNotices.map((notice) => (
          <NoticeRow key={notice.id} notice={notice} />
        ))}
      </S.TableBody>

      <S.Pagination>
        <button>{"<<"}</button>
        <button>{"<"}</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>{">"}</button>
        <button>{">>"}</button>
      </S.Pagination>
    </S.Container>
  );
}
