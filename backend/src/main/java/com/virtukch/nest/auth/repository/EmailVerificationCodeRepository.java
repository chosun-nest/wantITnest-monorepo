package com.virtukch.nest.auth.repository;

import com.virtukch.nest.auth.model.EmailVerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationCodeRepository extends JpaRepository<EmailVerificationCode, Long> {
    Optional<EmailVerificationCode> findTopByEmailAndCodeAndUsedFalseOrderByExpiresAtDesc(String email, String code);
}
