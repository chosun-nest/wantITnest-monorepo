package com.virtukch.nest.auth.service;

import com.virtukch.nest.auth.exception.EmailCodeExpiredException;
import com.virtukch.nest.auth.model.EmailVerificationCode;
import com.virtukch.nest.auth.repository.EmailVerificationCodeRepository;
import java.security.SecureRandom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final EmailVerificationCodeRepository codeRepository;
    private final EmailService emailService; // 실제 이메일 발송 책임
    private static final SecureRandom secureRandom = new SecureRandom();

    public void sendVerificationCode(String email) {
        String code = generateCode();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);

        EmailVerificationCode entity = EmailVerificationCode.builder()
            .email(email)
            .code(code)
            .expiresAt(expiresAt)
            .used(false)
            .build();

        codeRepository.save(entity);

        emailService.send(email, "Your verification code", "Your code is: " + code);
    }

    public boolean verifyCode(String email, String code) {
        EmailVerificationCode entity = codeRepository
            .findTopByEmailAndCodeAndUsedFalseOrderByExpiresAtDesc(email, code)
            .orElseThrow(() -> new RuntimeException("Invalid code"));

        if (entity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new EmailCodeExpiredException();
        }

        entity.setUsed(true);
        codeRepository.save(entity);

        return true;
    }

    private String generateCode() {
        return String.format("%06d", secureRandom.nextInt(1_000_000));
    }
}
