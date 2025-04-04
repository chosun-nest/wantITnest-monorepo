package com.virtukch.nest.auth.controller;

import com.virtukch.nest.auth.service.EmailVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @Operation(summary = "이메일 인증 코드 전송", description = "입력된 이메일 주소로 6자리 인증 코드를 전송합니다.")
    @PostMapping("/send-code")
    public ResponseEntity<String> sendCode(@RequestParam String email) {
        emailVerificationService.sendVerificationCode(email);
        return ResponseEntity.ok("Verification code sent");
    }

    @Operation(summary = "인증 코드 검증", description = "이메일과 인증 코드를 검증합니다.")
    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestParam String email, @RequestParam String code) {
        emailVerificationService.verifyCode(email, code);
        return ResponseEntity.ok("Email verified successfully");
    }
}
