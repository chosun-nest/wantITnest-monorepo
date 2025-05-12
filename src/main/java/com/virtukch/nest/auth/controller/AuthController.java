package com.virtukch.nest.auth.controller;

import com.virtukch.nest.auth.dto.LoginRequestDto;
import com.virtukch.nest.auth.dto.LoginResponseDto;
import com.virtukch.nest.auth.dto.PasswordResetRequestDto;
import com.virtukch.nest.auth.dto.SignupRequestDto;
import com.virtukch.nest.auth.dto.SignupResponseDto;
import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.auth.service.AuthService;
import com.virtukch.nest.common.dto.CommonResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth API", description = "인증 관련 API")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입", description = "회원가입을 위한 API 입니다. 이메일은 Unique 하게 관리됩니다.")
    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(
        @RequestBody SignupRequestDto signupRequestDto) {
        return ResponseEntity.ok(authService.signup(signupRequestDto));
    }

    @Operation(summary = "로그인", description = "로그인을 위한 API 입니다.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(authService.login(loginRequestDto));
    }

    @Operation(summary = "토큰 재발급", description = "Refresh Token 을 제공하면 Access Token 과 Refresh Token 을 return 합니다.")
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDto> refresh(
        @RequestHeader("Authorization") @Parameter(description = "Bearer {refresh_token}") String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @Operation(
        summary = "토큰 유효성 검사",
        description = """
            토큰이 유효한지 확인할 수 있는 API 입니다.
            유효하다면 token 에 담긴 memberId 를 반환합니다.
            이 API 는 간단한 유효성 검사용이며,
            `/members/me` 와는 달리 DB 접근 없이 토큰 기반으로 동작합니다.
        """
    )
    @GetMapping("/me")
    public ResponseEntity<Long> getMemberIdFromJWT(
        @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        log.info("customUserDetails: {}", customUserDetails);
        return ResponseEntity.ok(customUserDetails.getMember().getMemberId());
    }

    // 로그인하지 않은 회원에게 이메일을 입력 받아 비밀번호 재설정 링크를 보내는 메서드
    @PostMapping("/password-reset-request")
    public ResponseEntity<CommonResponseDto> sendPasswordResetLink(@RequestBody PasswordResetRequestDto passwordResetRequestDto) {
        return ResponseEntity.ok(authService.sendPasswordResetLink(passwordResetRequestDto.getEmail()));
    }

    // 비밀번호를 받아 새로운 비밀번호로 업데이트 하는 메서드
}
