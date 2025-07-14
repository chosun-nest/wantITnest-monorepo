package com.virtukch.nest.auth.controller;

import com.virtukch.nest.auth.dto.*;
import com.virtukch.nest.auth.service.AuthService;
import com.virtukch.nest.common.dto.CommonResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth API", description = "사용자 회원가입, 로그인, 로그아웃, 토큰 관리 등 인증 및 권한 부여 관련 기능을 제공하는 API 입니다.")
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "회원가입",
            description = """
                새로운 사용자를 시스템에 등록합니다. 사용자 정보를 받아 계정을 생성합니다.
                이메일은 시스템 내에서 고유해야 합니다.
                """)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원가입 성공",
                    content = @Content(schema = @Schema(implementation = SignupResponseDto.class)))
    })
    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(
        @RequestBody SignupRequestDto signupRequestDto) {
        return ResponseEntity.ok(authService.signup(signupRequestDto));
    }

    @Operation(
            summary = "로그인",
            description = """
                사용자 이메일과 비밀번호를 사용하여 로그인합니다.
                인증에 성공하면, API 접근에 필요한 Access Token과 Refresh Token을 발급합니다.
                """)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공",
                    content = @Content(schema = @Schema(implementation = LoginResponseDto.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(authService.login(loginRequestDto));
    }

    @Operation(
            summary = "로그아웃",
            description = """
                사용자를 시스템에서 로그아웃 처리합니다.
                요청에 포함된 Access Token과 Refresh Token을 모두 만료시켜 더 이상 사용할 수 없도록 합니다.
                """)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그아웃 성공",
                    content = @Content(schema = @Schema(implementation = CommonResponseDto.class)))
    })
    @PostMapping("/logout")
    public ResponseEntity<CommonResponseDto> logout(@RequestBody LogoutRequestDto request) {

        authService.logout(request.getAccessToken(), request.getRefreshToken());

        return ResponseEntity.ok(
                CommonResponseDto.builder()
                        .message("로그아웃되었습니다.")
                        .build()
        );
    }

    @Operation(
            summary = "토큰 재발급",
            description = """
                만료된 Access Token을 갱신합니다.
                유효한 Refresh Token을 'Authorization' 헤더에 담아 요청하면, 새로운 Access Token과 Refresh Token을 발급합니다.
                """)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "토큰 재발급 성공",
                    content = @Content(schema = @Schema(implementation = LoginResponseDto.class)))
    })
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDto> refresh(
        @RequestHeader("Authorization") @Parameter(description = "Bearer {refresh_token}") String refreshToken) {
        String token = refreshToken.replace("Bearer ", "");
        return ResponseEntity.ok(authService.refreshToken(token));
    }

    @Operation(
        summary = "토큰 유효성 검사",
        description = """
            'Authorization' 헤더의 Access Token을 검증하고, 토큰이 유효할 경우 토큰에 포함된 사용자 ID(memberId)를 반환합니다.
            이 API는 데이터베이스 조회 없이 JWT의 유효성만 빠르게 검사하는 용도로 사용됩니다.
            전체 사용자 정보가 필요한 경우 `/api/v1/members/me` 엔드포인트를 사용하세요.
            """
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "토큰 유효성 검사 성공",
                    content = @Content(schema = @Schema(implementation = Long.class)))
    })
    @GetMapping("/me")
    public ResponseEntity<Long> getMemberIdFromJWT(
            @RequestHeader("Authorization") String accessToken) {
        String token = accessToken.replace("Bearer ", "");
        Long memberId = authService.getMemberIdFromToken(token);
        return ResponseEntity.ok(memberId);
    }

    @Operation(
        summary = "비밀번호 재설정 링크 전송",
        description = """
                비밀번호 분실 시, 사용자 이메일 주소로 비밀번호 재설정 링크를 전송합니다.
                사용자는 이 링크를 통해 비밀번호를 새로 설정할 수 있습니다."""
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "비밀번호 재설정 링크 전송 성공",
                    content = @Content(schema = @Schema(implementation = CommonResponseDto.class)))
    })
    @PostMapping("/password-reset-link-request")
    public ResponseEntity<CommonResponseDto> sendPasswordResetLink(@RequestBody SendPasswordResetLinkRequestDto passwordResetRequestDto) {
        return ResponseEntity.ok(authService.sendPasswordResetLink(passwordResetRequestDto.getEmail()));
    }

    @Operation(
        summary = "비밀번호 재설정",
        description = """
                비밀번호 재설정 링크를 통해 발급받은 토큰을 이용해 사용자의 비밀번호를 업데이트합니다.
                """
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "비밀번호 재설정 성공",
                    content = @Content(schema = @Schema(implementation = CommonResponseDto.class)))
    })
    @PostMapping("/password-reset")
    public ResponseEntity<CommonResponseDto> resetPassword(@RequestBody PasswordResetRequestDto passwordResetRequestDto) {
        return ResponseEntity.ok(authService.resetPassword(passwordResetRequestDto));
    }
}
