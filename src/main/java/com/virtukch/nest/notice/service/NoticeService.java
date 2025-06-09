package com.virtukch.nest.notice.service;

import com.virtukch.nest.common.dto.PageInfoDto;
import com.virtukch.nest.notice.dto.NoticeListResponseDto;
import com.virtukch.nest.notice.dto.NoticeRequestDto;
import com.virtukch.nest.notice.dto.NoticeResponseDto;
import com.virtukch.nest.notice.exception.InvalidDateFormatException;
import com.virtukch.nest.notice.exception.InvalidNoticeDataException;
import com.virtukch.nest.notice.exception.InvalidNoticeTypeException;
import com.virtukch.nest.notice.model.Notice;
import com.virtukch.nest.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
     * @throws InvalidNoticeDataException 유효하지 않은 데이터가 있을 경우
     * @throws InvalidNoticeTypeException 유효하지 않은 공지사항 유형이 있을 경우
     */
    @Transactional
    public int saveNotices(NoticeRequestDto requestDto, String noticeType) {
        List<Map<String, Object>> notices = requestDto.getNotices();

        // 데이터 유효성 검사
        if (notices == null || notices.isEmpty()) {
            throw new InvalidNoticeDataException("공지사항 데이터가 비어있습니다.");
        }

        if (noticeType == null || noticeType.isBlank()) {
            throw new InvalidNoticeTypeException("공지사항 유형이 지정되지 않았습니다.");
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

                // 모든 공백 문자를 일반 공백으로 변환하고 연속된 것들을 하나로 줄임
                String title = ((String) noticeData.get("title")).replaceAll("\\s+", " ");
                noticeData.put("title", title);

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

    @Transactional(readOnly = true)
    public NoticeListResponseDto getNotices(Pageable pageable) {
        Page<Notice> noticePage = noticeRepository.findAll(pageable);
        return buildListResponseDto(noticePage);
    }

    @Transactional(readOnly = true)
    public NoticeListResponseDto getNoticesByType(String noticeType, Pageable pageable) {
        Page<Notice> noticePage = noticeRepository.findByNoticeTypeOrderByPostDateDesc(noticeType, pageable);
        return buildListResponseDto(noticePage);
    }

    /**
     * 공지사항을 검색합니다.
     *
     * @param noticeType 공지사항 유형
     * @param keyword    검색 키워드
     * @return 검색 결과 DTO 목록
     * @throws InvalidNoticeTypeException 유효하지 않은 공지사항 유형이 있을 경우
     * @throws InvalidNoticeDataException 유효하지 않은 공지 유형이나 키워드일 경우
     */
    @Transactional(readOnly = true)
    public NoticeListResponseDto searchNotices(String noticeType, String keyword, Pageable pageable) {
        if (noticeType == null || noticeType.isBlank()) {
            throw new InvalidNoticeTypeException("공지사항 유형이 지정되지 않았습니다.");
        }

        if (keyword == null || keyword.isBlank()) {
            throw new InvalidNoticeDataException("검색 키워드가 지정되지 않았습니다.");
        }

        Page<Notice> noticePage = noticeRepository.findByNoticeTypeAndTitleContainingOrderByPostDateDesc(noticeType, keyword, pageable);
        return buildListResponseDto(noticePage);
    }



    private NoticeListResponseDto buildListResponseDto(Page<Notice> noticePage) {
        List<Notice> notices = noticePage.getContent();

        List<NoticeResponseDto> responseDtos = notices.stream()
                .map(NoticeResponseDto::create)
                .toList();

        return NoticeListResponseDto.builder()
                .notices(responseDtos)
                .totalCount((int) noticePage.getTotalElements())
                .pageInfo(PageInfoDto.create(noticePage))
                .build();
    }

    private Notice buildNotice(String noticeType, Map<String, Object> noticeData) {
        // Notice 객체 생성 및 저장
        Notice notice = Notice.builder()
                .noticeType(noticeType)
                .number(Long.parseLong(getString(noticeData, "number")))
                .title(getString(noticeData, "title"))
                .writer(getString(noticeData, "writer"))
                .postDate(stringToLocalDate(getString(noticeData, "date")))
                .link(getString(noticeData, "link"))
                .views(Long.parseLong(getString(noticeData, "views").strip()))
                .build();
        return notice;
    }

    private String getString(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? value.toString() : "";
    }

    private LocalDate stringToLocalDate(String dateString) {
        if (dateString == null || dateString.isEmpty()) {
            return null;
        }
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
            return LocalDate.parse(dateString, formatter);
        } catch (DateTimeParseException e) {
            throw new InvalidDateFormatException(dateString, e);
        }
    }
}
