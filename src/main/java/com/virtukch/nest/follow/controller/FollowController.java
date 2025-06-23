package com.virtukch.nest.follow.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.follow.dto.FollowRequestDto;
import com.virtukch.nest.follow.dto.FollowResponseDto;
import com.virtukch.nest.follow.dto.FollowListResponseDto;
import com.virtukch.nest.follow.service.FollowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/follow")
@RequiredArgsConstructor
@Tag(name = "Follow API", description = "팔로우 관련 API")
public class FollowController {

    private final FollowService followService;

    @Operation(
        summary = "팔로우하기",
        description = """
                특정 회원을 팔로우합니다.
                
                ✅ 주요 기능:
                - 인증된 사용자만 팔로우할 수 있습니다.
                - 자기 자신을 팔로우할 수 없습니다.
                - 이미 팔로우 중인 사용자를 다시 팔로우할 수 없습니다.
                
                ✅ 요청 방법:
                - HTTP Method: `POST`
                - 요청 URL: `/api/v1/follow`
                - 헤더: `Authorization: Bearer {access_token}`
                - 바디: `{"followingId": 팔로우할_회원_ID}`
                """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "팔로우 성공",
            content = @Content(schema = @Schema(implementation = FollowResponseDto.class))),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 (자기 자신 팔로우, 중복 팔로우 등)"),
        @ApiResponse(responseCode = "404", description = "팔로우할 회원을 찾을 수 없음")
    })
    @PostMapping
    public ResponseEntity<FollowResponseDto> followUser(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody FollowRequestDto requestDto) {
        
        FollowResponseDto response = followService.followUser(
            user.getMember().getMemberId(), 
            requestDto.getFollowingId()
        );
        
        URI location = URI.create("/api/v1/follow/" + response.getId());
        return ResponseEntity.created(location).body(response);
    }

    @Operation(
        summary = "언팔로우하기",
        description = """
                특정 회원을 언팔로우합니다.
                
                ✅ 주요 기능:
                - 현재 팔로우 중인 사용자만 언팔로우할 수 있습니다.
                - 팔로우 관계가 존재하지 않으면 에러가 발생합니다.
                
                ✅ 요청 방법:
                - HTTP Method: `DELETE`
                - 요청 URL: `/api/v1/follow/{followingId}`
                - 헤더: `Authorization: Bearer {access_token}`
                """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "언팔로우 성공"),
        @ApiResponse(responseCode = "404", description = "팔로우 관계를 찾을 수 없음")
    })
    @DeleteMapping("/{followingId}")
    public ResponseEntity<Void> unfollowUser(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long followingId) {
        
        followService.unfollowUser(user.getMember().getMemberId(), followingId);
        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "내가 팔로잉하는 사용자 목록 조회",
        description = """
                현재 로그인한 사용자가 팔로잉하고 있는 사용자들의 목록을 조회합니다.
                
                ✅ 응답 정보:
                - 팔로잉 중인 사용자들의 기본 정보 (ID, 이름, 프로필 이미지 등)
                - 팔로우 시작 날짜
                - 총 팔로잉 수
                
                ✅ 요청 방법:
                - HTTP Method: `GET`
                - 요청 URL: `/api/v1/follow/following`
                - 헤더: `Authorization: Bearer {access_token}`
                """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "팔로잉 목록 조회 성공",
            content = @Content(schema = @Schema(implementation = FollowListResponseDto.class)))
    })
    @GetMapping("/following")
    public ResponseEntity<FollowListResponseDto> getFollowingList(
            @AuthenticationPrincipal CustomUserDetails user) {
        
        FollowListResponseDto response = followService.getFollowingList(
            user.getMember().getMemberId()
        );
        
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "특정 사용자의 팔로잉 목록 조회",
        description = """
                특정 사용자가 팔로잉하고 있는 사용자들의 목록을 조회합니다.
                
                ✅ 응답 정보:
                - 해당 사용자가 팔로잉 중인 사용자들의 기본 정보
                - 팔로우 시작 날짜
                - 총 팔로잉 수
                
                ✅ 요청 방법:
                - HTTP Method: `GET`
                - 요청 URL: `/api/v1/follow/{memberId}/following`
                - 헤더: `Authorization: Bearer {access_token}`
                """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "팔로잉 목록 조회 성공",
            content = @Content(schema = @Schema(implementation = FollowListResponseDto.class))),
        @ApiResponse(responseCode = "404", description = "해당 회원을 찾을 수 없음")
    })
    @GetMapping("/{memberId}/following")
    public ResponseEntity<FollowListResponseDto> getFollowingListByMemberId(
            @PathVariable Long memberId) {
        
        FollowListResponseDto response = followService.getFollowingList(memberId);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "나를 팔로우하는 사용자 목록 조회 (팔로워 목록)",
        description = """
                현재 로그인한 사용자를 팔로우하고 있는 사용자들의 목록을 조회합니다.
                
                ✅ 응답 정보:
                - 나를 팔로우하는 사용자들의 기본 정보
                - 팔로우 시작 날짜
                - 총 팔로워 수
                
                ✅ 요청 방법:
                - HTTP Method: `GET`
                - 요청 URL: `/api/v1/follow/followers`
                - 헤더: `Authorization: Bearer {access_token}`
                """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "팔로워 목록 조회 성공",
            content = @Content(schema = @Schema(implementation = FollowListResponseDto.class)))
    })
    @GetMapping("/followers")
    public ResponseEntity<FollowListResponseDto> getFollowersList(
            @AuthenticationPrincipal CustomUserDetails user) {
        
        FollowListResponseDto response = followService.getFollowersList(
            user.getMember().getMemberId()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(
        summary = "특정 사용자를 팔로우하는 사용자 목록 조회 (팔로워 목록)",
        description = """
                특정 사용자를 팔로우하고 있는 사용자 목록 조회 사용자들의 목록을 조회합니다.
                
                ✅ 응답 정보:
                - 특정 사용자를 팔로우하는 사용자들의 기본 정보
                - 팔로우 시작 날짜
                - 총 팔로워 수
                
                ✅ 요청 방법:
                - HTTP Method: `GET`
                - 요청 URL: `/api/v1/follow/{memberId}/followers`
                - 헤더: `Authorization: Bearer {access_token}`
                """,
        security = {@SecurityRequirement(name = "bearer-key")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "팔로워 목록 조회 성공",
            content = @Content(schema = @Schema(implementation = FollowListResponseDto.class)))
    })
    @GetMapping("{memberId}/followers")
    public ResponseEntity<FollowListResponseDto> getFollowersListByMemberId(
            @AuthenticationPrincipal CustomUserDetails user, @PathVariable Long memberId) {
        
        FollowListResponseDto response = followService.getFollowersList(memberId);
        
        return ResponseEntity.ok(response);
    }
}
