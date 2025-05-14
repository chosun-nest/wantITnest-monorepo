package com.virtukch.nest.notice.service;

import com.virtukch.nest.notice.dto.NoticeRequestDto;
import com.virtukch.nest.notice.exception.InvalidNoticeDataException;
import com.virtukch.nest.notice.model.Notice;
import com.virtukch.nest.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    /**
     * 크롤링된 공지사항 데이터를 저장합니다.
     *
     * @param requestDto 크롤링 요청 DTO
     * @param noticeType 공지사항 유형
     * @return 저장된 공지사항 수
     */
    @Transactional
    public int saveNotices(NoticeRequestDto requestDto, String noticeType) {
        List<Map<String, Object>> notices = requestDto.getNotices();

        // 데이터 유효성 검사
        if (notices == null || notices.isEmpty()) {
            throw new InvalidNoticeDataException("공지사항 데이터가 비어있습니다.");
        }

        if (noticeType == null || noticeType.isBlank()) {
            throw new InvalidNoticeDataException("공지사항 유형이 지정되지 않았습니다.");
        }

        int savedCount = 0;

        for (Map<String, Object> noticeData : notices) {
            try {
                String number = (String) noticeData.get("number");

                // 데이터의 공지사항 번호가 숫자가 아닐 경우 이상한 데이터이므로 무시
                if (number == null || number.isEmpty() || !number.matches("\\d+")) {
                    log.warn("유효하지 않은 number입니다. noticeData: {}", noticeData);
                    continue;
                }

                // 이미 존재하는 공지사항인지 확인
                if (noticeRepository.existsByNoticeTypeAndNumber(noticeType, Long.parseLong(number))) {
                    log.warn("이미 존재하는 공지사항입니다. noticeType: {}, noticeId: {}", noticeType, number);
                    continue;
                }

                Notice notice = buildNotice(noticeType, noticeData);

                noticeRepository.save(notice);
                savedCount++;

                log.debug("공지사항이 저장되었습니다. noticeType: {}, title: {}", noticeType, notice.getTitle());

            } catch (Exception e) {
                log.error("공지사항 저장 중 오류 발생: {}", e.getMessage(), e);
            }
        }

        log.info("공지사항 저장이 완료되었습니다. noticeType: {}, 총 {}개 중 {}개 저장됨", noticeType, notices.size(), savedCount);

        return savedCount;
    }

    private static Notice buildNotice(String noticeType, Map<String, Object> noticeData) {
        // Notice 객체 생성 및 저장
        Notice notice = Notice.builder()
                .noticeType(noticeType)
                .number(Long.parseLong(getString(noticeData, "number")))
                .title(getString(noticeData, "title"))
                .writer(getString(noticeData, "writer"))
                .postDate(getString(noticeData, "postDate"))
                .link(getString(noticeData, "link"))
                .views(getString(noticeData, "views"))
                .build();
        return notice;
    }

    private static String getString(java.util.Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? value.toString() : "";
    }
}
