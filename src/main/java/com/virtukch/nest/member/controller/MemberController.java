package com.virtukch.nest.member.controller;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.member.dto.MemberResponseDto;
import com.virtukch.nest.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
        @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        return ResponseEntity.ok(memberService.getCurrentMemberByCustomUserDetails(customUserDetails));
    }
}
