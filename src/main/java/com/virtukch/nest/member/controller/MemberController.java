package com.virtukch.nest.member.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.member.dto.MemberPasswordChangeRequestDto;
import com.virtukch.nest.member.dto.MemberResponseDto;
import com.virtukch.nest.member.dto.MemberUpdateRequestDto;
import com.virtukch.nest.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
@Tag(name = "Member API", description = "회원 정보 관련 API")
public class MemberController {

    private final MemberService memberService;

    @Operation(
        summary = "회원 정보 조회",
        description = """
                현재 로그인한 사용자의 정보를 DB 에서 조회하여 상세하게 반환합니다.
                이 API 는 `/auth/me` 와는 달리 데이터베이스에 접근하며,
                이메일, 권한, 식별자 등 보다 풍부한 회원 정보를 제공합니다.
            """
    )
    @GetMapping("/me")
    public ResponseEntity<MemberResponseDto> getMemberInfo(
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        return ResponseEntity.ok(
            memberService.getCurrentMemberByCustomUserDetails(customUserDetails));
    }

    @PatchMapping("/me")
    @Operation(summary = "회원 정보 수정", description = "변경하고자 하는 필드만 포함하여 전송하세요. 미포함된 필드는 기존 값을 유지합니다.")
    public ResponseEntity<MemberResponseDto> updateMemberInfo(
        @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @RequestBody MemberUpdateRequestDto memberUpdateRequestDto) {
        return ResponseEntity.ok(
            memberService.updateMemberInfo(customUserDetails, memberUpdateRequestDto));
    }

    @PatchMapping("/me/password")
    @Operation(summary = "비밀번호 변경", description = "현재 비밀번호 확인 후 새 비밀번호로 변경합니다.")
    public ResponseEntity<Void> changePassword(
        @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @RequestBody MemberPasswordChangeRequestDto memberPasswordChangeRequestDto
    ) {
        memberService.changePassword(customUserDetails, memberPasswordChangeRequestDto);
        return ResponseEntity.noContent().build(); // 성공 시 응답 바디 없음
    }
}
