package com.virtukch.nest.notice.controller;

import com.virtukch.nest.notice.dto.ApiResponseDto;
import com.virtukch.nest.notice.dto.NoticeRequestDto;
import com.virtukch.nest.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/v1/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    /**
     * 공지사항 크롤링용 FastAPI 서버로부터 크롤링된 공지사항 데이터를 수신합니다.
     * @param noticeType 공지사항 유형 (경로 변수)
     * @param requestDto 크롤링 요청 DTO
     * @return 응답 DTO
     */
    @PostMapping("/{noticeType}")
    public ResponseEntity<ApiResponseDto> receiveNotices(
            @PathVariable String noticeType,
            @RequestBody NoticeRequestDto requestDto) {

        log.info("공지사항 데이터 수신. noticeType: {}, 데이터 수: {}",
                noticeType, requestDto.getNotices() != null ? requestDto.getNotices().size() : 0);

        int savedCount = noticeService.saveNotices(requestDto, noticeType);
        return ResponseEntity.ok(ApiResponseDto.success(noticeType, savedCount));
    }
}
