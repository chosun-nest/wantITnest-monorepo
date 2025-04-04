package com.virtukch.nest.auth.service;

import com.virtukch.nest.auth.exception.EmailCannotSendException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void send(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("glosori.help@gmail.com");

            mailSender.send(message);
            log.info("✅ 이메일 전송 완료 → {}", to);
        } catch (Exception e) {
            log.error("❌ 이메일 전송 실패", e);
            throw new EmailCannotSendException();
        }
    }
}
