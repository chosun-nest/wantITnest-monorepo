package com.virtukch.nest.history.controller;

import com.virtukch.nest.history.dto.HistoryUpdateRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.virtukch.nest.history.dto.HistoryRequestDto;
import com.virtukch.nest.history.dto.HistoryResponseDto;
import com.virtukch.nest.history.service.HistoryService;
import com.virtukch.nest.auth.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/histories")
@RequiredArgsConstructor
@Tag(name = "History", description = "타임라인 히스토리 API")
public class HistoryController {

    private final HistoryService historyService;

    // 1. 단일 생성
    @Operation(summary = "히스토리 생성", description = "사용자의 새로운 타임라인 히스토리를 생성합니다. 내용, 시작일, 종료일, 중요도를 포함한 정보를 JSON 형식으로 전달하세요.")
    @PostMapping
    public ResponseEntity<HistoryResponseDto> createHistory(
        @RequestBody HistoryRequestDto requestDto,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getMember().getMemberId();
        return ResponseEntity.ok(historyService.createHistory(memberId, requestDto));
    }

    // 2. 단일 조회
    @Operation(summary = "히스토리 단건 조회", description = "지정한 히스토리 ID에 해당하는 항목을 반환합니다. 사용자 인증이 필요하며, 본인의 히스토리만 조회할 수 있습니다.")
    @GetMapping("/{historyId}")
    public ResponseEntity<HistoryResponseDto> getHistory(@PathVariable Long historyId,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getMember().getMemberId();
        return ResponseEntity.ok(historyService.getHistoryById(memberId, historyId));
    }

    // 3. 리스트 조회
    @Operation(summary = "히스토리 전체 조회", description = "로그인한 사용자의 전체 히스토리 목록을 반환합니다. 최신순 정렬은 별도 파라미터 구현이 필요합니다.")
    @GetMapping
    public ResponseEntity<List<HistoryResponseDto>> getHistories(
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getMember().getMemberId();
        return ResponseEntity.ok(historyService.getHistoriesByMember(memberId));
    }

    // 4. 단일 수정
    @Operation(summary = "히스토리 수정", description = "지정한 ID의 히스토리 항목을 수정합니다. 수정할 필드를 포함한 JSON 요청 본문을 전달하세요. 인증된 사용자 본인의 히스토리만 수정할 수 있습니다.")
    @PutMapping("/{historyId}")
    public ResponseEntity<HistoryResponseDto> updateHistory(@PathVariable Long historyId,
        @RequestBody HistoryRequestDto requestDto,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getMember().getMemberId();
        return ResponseEntity.ok(historyService.updateHistory(memberId, historyId, requestDto));
    }

    // 5. 단일 삭제
    @Operation(summary = "히스토리 삭제", description = "지정한 ID의 히스토리를 삭제합니다. 사용자 인증이 필요하며, 본인의 히스토리만 삭제할 수 있습니다.")
    @DeleteMapping("/{historyId}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long historyId,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getMember().getMemberId();
        historyService.deleteHistory(memberId, historyId);
        return ResponseEntity.noContent().build();
    }
    // 6. 여러 개 생성
    @Operation(summary = "히스토리 여러 개 생성", description = "타임라인 항목 여러 개를 한 번에 생성합니다.")
    @PostMapping("/bulk")
    public ResponseEntity<List<HistoryResponseDto>> createHistories(
        @RequestBody List<HistoryRequestDto> requestList,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getMember().getMemberId();
        return ResponseEntity.ok(historyService.createHistories(memberId, requestList));
    }

    // 7. 여러 개 수정
    @Operation(summary = "히스토리 여러 개 수정", description = "타임라인 항목 여러 개를 한 번에 수정합니다. 각 항목에 ID가 포함되어 있어야 합니다.")
    @PutMapping("/bulk")
    public ResponseEntity<List<HistoryResponseDto>> updateHistories(
        @RequestBody List<HistoryUpdateRequestDto> requestList,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getMember().getMemberId();
        return ResponseEntity.ok(historyService.updateHistories(memberId, requestList));
    }

    // 8. 여러 개 삭제
    @Operation(summary = "히스토리 여러 개 삭제", description = "타임라인 항목 여러 개를 한 번에 삭제합니다. ID 목록을 JSON 배열로 전달하세요.")
    @DeleteMapping("/bulk")
    public ResponseEntity<Void> deleteHistories(
        @RequestBody List<Long> historyIds,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getMember().getMemberId();
        historyService.deleteHistories(memberId, historyIds);
        return ResponseEntity.noContent().build();
    }
}