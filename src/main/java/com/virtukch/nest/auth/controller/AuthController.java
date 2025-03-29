package com.virtukch.nest.auth.controller;

import com.virtukch.nest.auth.dto.LoginRequestDto;
import com.virtukch.nest.auth.dto.LoginResponseDto;
import com.virtukch.nest.auth.dto.SignupRequestDto;
import com.virtukch.nest.auth.dto.SignupResponseDto;
import com.virtukch.nest.auth.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth API", description = "인증 관련 API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(
        @RequestBody SignupRequestDto signupRequestDto) {
        return ResponseEntity.ok(authService.signup(signupRequestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(authService.login(loginRequestDto));
    }

    // Refresh Token 을 사용하여 Access Token 을 재발급 받는 메서드
    // Refresh Token 은 그냥 돌려주는 것임.
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDto> refresh(
        @RequestHeader("Authorization") String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }
}
