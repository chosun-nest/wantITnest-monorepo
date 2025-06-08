// [공지사항 API] - 학교 공지사항 연동용
import { API } from "..";
import { getAccessToken } from "../../utils/auth";
import { NoticeItem, NoticeListResponse } from "../../types/api/notice-board";

// =======================
// 공지사항 목록 조회 (GET)
// =======================
// GET /api/v1/notices/{noticeType}
// noticeType: "장학공지", "학사공지", "일반공지", ...

export const fetchNotices = async (
  noticeType: string
): Promise<NoticeListResponse> => {
  const response = await API.get<NoticeListResponse>(
    `/api/v1/notices/${noticeType}`,
    {
      headers: { skipAuth: true }, // 인증 없이 호출
    }
  );
  return response.data;
};

// ==========================
// 크롤링 공지사항 저장 (POST)
// ==========================
// POST /api/v1/notices/{noticeType}
// payload: NoticeItem[]

export const postCrawledNotices = async (
  noticeType: string,
  payload: NoticeItem[]
): Promise<{ message: string }> => {
  const token = getAccessToken();
  const response = await API.post<{ message: string }>(
    `/api/v1/notices/${noticeType}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
