package com.virtukch.nest.tag.controller;

import com.virtukch.nest.tag.dto.TagListResponseDto;
import com.virtukch.nest.tag.dto.TagResponseDto;
import com.virtukch.nest.tag.model.Category;
import com.virtukch.nest.tag.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/tags")
@Tag(name = "태그 API")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @Operation(
            summary = "태그 리스트 반환",
            description = "현재까지 생성된 모든 태그 목록을 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @GetMapping
    public ResponseEntity<TagListResponseDto> getTags() {
        log.info("[TagController] GET /api/v1/tags 요청 들어옴");
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @Operation(
            summary = "카테고리별 태그 리스트 반환",
            description = "특정 카테고리에 속한 태그 목록을 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "카테고리를 찾을 수 없음")
    })
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<TagListResponseDto> getTagsByCategory(@PathVariable String categoryName) {
        log.info("[TagController] GET /api/v1/tags/category/{} 요청 들어옴", categoryName);
        
        try {
            Category category = Category.valueOf(categoryName.toUpperCase());
            TagListResponseDto response = tagService.getTagsByCategory(category);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("[TagController] 존재하지 않는 카테고리: {}", categoryName);
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
            summary = "특정 태그 정보 반환",
            description = "태그 이름을 통해 특정 태그의 정보를 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "태그를 찾을 수 없음")
    })
    @GetMapping("/{tagName}")
    public ResponseEntity<TagResponseDto> getTagByName(@PathVariable String tagName) {
        log.info("[TagController] GET /api/v1/tags/{} 요청 들어옴", tagName);
        
        TagResponseDto response = tagService.getTagByName(tagName);
        return ResponseEntity.ok(response);
    }
}
