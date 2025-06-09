package com.virtukch.nest.notice.controller;

import com.virtukch.nest.notice.dto.ApiResponseDto;
import com.virtukch.nest.notice.dto.NoticeListResponseDto;
import com.virtukch.nest.notice.dto.NoticeRequestDto;
import com.virtukch.nest.notice.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/v1/notices")
@RequiredArgsConstructor
@Tag(name = "공지사항 API", description = "학교 공지사항 관련 API - 크롤링 데이터 수신 및 조회")
public class NoticeController {

    private final NoticeService noticeService;

    @Operation(
            summary = "공지사항 크롤링 데이터 수신",
            description = """
                    크롤링 서버로부터 수집된 공지사항 데이터를 수신합니다.
                    
                    ## 공지사항 유형
                    - `noticeType`: 공지사항 유형 (경로 변수)
                      - 일반공지
                      - 학사공지
                      - 장학공지
                      - IT융합대학 공지
                      - 컴퓨터공학과 공지
                    
                    ## 요청 데이터 형식 (회의 필요, 전부 String으로 던지면 됨)
                    ```json
                    {
                      "notices": [
                        {
                          "number": "공지사항 번호",
                          "title": "공지사항 제목",
                          "writer": "작성자",
                          "date": "작성일(yyyy.MM.dd)",
                          "link": "원본 공지사항 링크",
                          "views": "조회수"
                        }
                      ]
                    }
                    ```
                    
                    ## 응답 형식
                    ```json
                    {
                      "status": "success",
                      "message": "공지사항 처리 결과 메시지",
                      "processedCount": 처리된 공지사항 수,
                      "noticeType": "처리된 공지사항 유형"
                    }
                    ```
                    """
    )
    @PostMapping("/{noticeType}")
    public ResponseEntity<ApiResponseDto> receiveNotices(
            @PathVariable String noticeType,
            @RequestBody NoticeRequestDto requestDto) {

        log.info("공지사항 데이터 수신. noticeType: {}, 데이터 수: {}",
                noticeType, requestDto.getNotices() != null ? requestDto.getNotices().size() : 0);

        int savedCount = noticeService.saveNotices(requestDto, noticeType);
        return ResponseEntity.ok(ApiResponseDto.success(noticeType, savedCount));
    }


    @Operation(
            summary = "공지사항 전체 조회",
            description = """
                    전체 공지사항 목록을 조회합니다.
                    
                    ## 페이지네이션
                    - 페이지 번호: `?page=0` (기본값: 0, 첫 페이지)
                    - 페이지 크기: `?size=10` (기본값: 10, 페이지당 10개 항목)
                    
                    ## 정렬
                    - 기본 정렬: 게시일 내림차순(최신순)
                    - 정렬 필드 변경: `?sort={필드명}`
                    - 정렬 방향 변경: `?sort={필드명},{정렬방향}`
                      - 예: `?sort=postDate,desc`
                    
                    ## 응답 형식
                    응답은 다음 정보를 포함합니다:
                    - 공지사항 목록
                    - 전체 공지사항 수
                    - 페이지 정보 (현재 페이지, 전체 페이지, 다음/이전 페이지 존재 여부 등)
                    
                    ## 사용 예시
                    - `/api/v1/notices/일반공지?page=0&size=10&sort=postDate,desc`
                    """
    )
    @GetMapping
    public ResponseEntity<NoticeListResponseDto> getNotices(
            @PageableDefault(size = 10, sort = "postDate", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("공지사항 전체 조회");

        NoticeListResponseDto responseDto = noticeService.getNotices(pageable);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
            summary = "공지사항 목록 조회",
            description = """
                    공지 유형별 공지사항 목록을 조회합니다.
                    
                    ## 공지사항 유형
                    - `noticeType`: 공지사항 유형 (경로 변수)
                      - 일반공지
                      - 학사공지
                      - 장학공지
                      - IT융합대학 공지
                      - 컴퓨터공학과 공지
                    
                    ## 페이지네이션
                    - 페이지 번호: `?page=0` (기본값: 0, 첫 페이지)
                    - 페이지 크기: `?size=10` (기본값: 10, 페이지당 10개 항목)
                    
                    ## 정렬
                    - 기본 정렬: 게시일 내림차순(최신순)
                    - 정렬 필드 변경: `?sort={필드명}`
                    - 정렬 방향 변경: `?sort={필드명},{정렬방향}`
                      - 예: `?sort=postDate,desc`
                    
                    ## 응답 형식
                    응답은 다음 정보를 포함합니다:
                    - 공지사항 목록
                    - 전체 공지사항 수
                    - 페이지 정보 (현재 페이지, 전체 페이지, 다음/이전 페이지 존재 여부 등)
                    
                    ## 사용 예시
                    - `/api/v1/notices/일반공지?page=0&size=10&sort=postDate,desc`
                    """
    )
    @GetMapping("/{noticeType}")
    public ResponseEntity<NoticeListResponseDto> getNoticesByType(
            @PathVariable String noticeType,
            @PageableDefault(size = 10, sort = "postDate", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("공지사항 목록 조회. noticeType: {}", noticeType);

        NoticeListResponseDto responseDto = noticeService.getNoticesByType(noticeType, pageable);
        return ResponseEntity.ok(responseDto);
    }

    @Operation(
            summary = "공지사항 검색",
            description = """
                    공지사항을 키워드로 검색합니다.
                    
                    ## 필수 매개변수
                    - `noticeType`: 공지사항 유형 (경로 변수)
                      - 일반공지
                      - 학사공지
                      - 장학공지
                      - IT융합대학 공지
                      - 컴퓨터공학과 공지
                    - `keyword`: 검색할 키워드 (쿼리 파라미터)
                    
                    ## 페이지네이션
                    - 페이지 번호: `?page=0` (기본값: 0, 첫 페이지)
                    - 페이지 크기: `?size=10` (기본값: 10, 페이지당 10개 항목)
                    
                    ## 정렬
                    - 기본 정렬: 게시일 내림차순(최신순)
                    - 정렬 변경: `?sort=postDate,desc`
                    
                    ## 응답 형식
                    응답은 다음 정보를 포함합니다:
                    - 검색된 공지사항 목록
                    - 검색 결과 총 개수
                    - 페이지 정보 (현재 페이지, 전체 페이지, 다음/이전 페이지 존재 여부 등)
                    
                    ## 사용 예시
                    - `/api/v1/notices/일반공지/search?keyword=수강신청&page=0&size=10`
                    """
    )
    @GetMapping("/{noticeType}/search")
    public ResponseEntity<NoticeListResponseDto> searchNotices(
            @PathVariable String noticeType,
            @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "postDate", direction = Sort.Direction.DESC) Pageable pageable) {

        log.info("공지사항 검색. noticeType: {}, keyword: {}", noticeType, keyword);

        NoticeListResponseDto responseDto = noticeService.searchNotices(noticeType, keyword, pageable);
        return ResponseEntity.ok(responseDto);
    }
}