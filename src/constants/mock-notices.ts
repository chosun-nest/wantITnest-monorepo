// src/constants/mock-notices.ts
// mock 데이터는 보통 기획 초기, UI 설계 단계에서 사용
// 백엔드 API가 완성되면 → mock 데이터 삭제하고 진짜 데이터로 교체!

export const mockNotices = [
  {
    id: 213,
    title: "2025학년도 학생증 체크카드 발급 안내",
    date: "2025.01.02",
    author: "IT 융합대학 관리자",
    views: 436,
    hasAttachment: true,
    content: "2025학년도 학생증 발급은 1월 10일까지 학생지원센터에서 신청 바랍니다.",
  },
  {
    id: 212,
    title: "IT융합대학 M.space 사용안내",
    date: "2025.01.02",
    author: "IT 융합대학 관리자",
    views: 255,
    hasAttachment: false,
    content: "M.space에서는 정숙 지켜주시고 열공해주세요~",
  },
  {
    id: 211,
    title: "2025 산업 채용 트렌드 취업특강",
    date: "2025.01.02",
    author: "IT 융합대학 관리자",
    views: 503,
    hasAttachment: true,
    content: "취업특강 많은 관심 바랍니다.",
  },
];