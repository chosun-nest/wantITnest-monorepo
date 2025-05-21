package com.virtukch.nest.tag_favorite.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.tag_favorite.dto.FavoriteTagListResponseDto;
import com.virtukch.nest.tag_favorite.service.TagFavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/favorites/tags")
@RequiredArgsConstructor
@Tag(name = "태그 즐겨찾기 API", description = "회원 관심태그 추가, 확인, 삭제, 조회 API")
public class TagFavoriteController {

    private final TagFavoriteService tagFavoriteService;

    @Operation(
            summary = "관심 태그 목록 조회",
            description = "현재 로그인한 사용자의 관심 태그 목록을 반환합니다.",
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @GetMapping
    public ResponseEntity<FavoriteTagListResponseDto> getFavoriteTags(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info("[TagFavoriteController] GET /api/v1/favorites/tags 요청 - 사용자 ID: {}",
                userDetails.getMember().getMemberId());
        return ResponseEntity.ok(
                tagFavoriteService.getFavoriteTagsByMemberId(userDetails.getMember().getMemberId())
        );
    }

    @Operation(
            summary = "관심 태그 추가",
            description = "사용자의 관심 태그를 추가합니다.",
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @PostMapping("/{tagName}")
    public ResponseEntity<Void> addFavoriteTag(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String tagName) {
        log.info("[TagFavoriteController] POST /api/v1/favorites/tags/{} 요청 - 사용자 ID: {}",
                tagName, userDetails.getMember().getMemberId());

        tagFavoriteService.addFavoriteTag(userDetails.getMember().getMemberId(), tagName);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "관심 태그 삭제",
            description = "사용자의 관심 태그를 삭제합니다.",
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @DeleteMapping("/{tagName}")
    public ResponseEntity<Void> removeFavoriteTag(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String tagName) {
        log.info("[TagFavoriteController] DELETE /api/v1/favorites/tags/{} 요청 - 사용자 ID: {}",
                tagName, userDetails.getMember().getMemberId());

        tagFavoriteService.removeFavoriteTag(userDetails.getMember().getMemberId(), tagName);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "관심 태그 확인",
            description = "특정 태그가 사용자의 관심 태그인지 확인합니다.",
            security = {@SecurityRequirement(name = "bearer-key")}
    )
    @GetMapping("/{tagName}")
    public ResponseEntity<Boolean> isFavoriteTag(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String tagName) {
        log.info("[TagFavoriteController] GET /api/v1/favorites/tags/{} 요청 - 사용자 ID: {}",
                tagName, userDetails.getMember().getMemberId());

        boolean isFavorite = tagFavoriteService.isFavoriteTag(userDetails.getMember().getMemberId(), tagName);

        return ResponseEntity.ok(isFavorite);
    }
}