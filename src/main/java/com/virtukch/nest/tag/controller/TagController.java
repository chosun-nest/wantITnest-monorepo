package com.virtukch.nest.tag.controller;

import com.virtukch.nest.tag.dto.TagListResponseDto;
import com.virtukch.nest.tag.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @Operation(summary = "태그 리스트 반환", description = "현재까지 생성된 모든 태그 목록을 반환합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "작성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @GetMapping
    public ResponseEntity<List<TagListResponseDto>> getTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }
}
