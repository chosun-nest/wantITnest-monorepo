package com.virtukch.nest.auth.service;

import com.virtukch.nest.auth.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Date;

@Service
@Slf4j
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisTemplate<String, String> redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    // 토큰을 블랙리스트에 추가
    public void blacklistToken(String token) {
        try {
            // JWT에서 만료 시간 추출
            Claims claims = jwtTokenProvider.getClaims(token);
            Date expiration = claims.getExpiration();

            // 현재 시간부터 만료 시간까지의 TTL 계산
            long ttl = expiration.getTime() - System.currentTimeMillis();

            if (ttl > 0) {
                // Redis에 토큰 저장 (TTL 설정으로 자동 삭제)
                redisTemplate.opsForValue().set(
                        "blacklist:" + token,
                        "BLACKLISTED",
                        Duration.ofMillis(ttl)
                );
                log.info("토큰 블랙리스트 추가: {}", token.substring(0, 20) + "...");

                // 사용자 ID별 Access Token 목록에도 추가
                Long memberId = jwtTokenProvider.getMemberIdFromToken(token);
                redisTemplate.opsForSet().add("user_access_tokens:" + memberId, token);
            }
        } catch (Exception e) {
            log.error("토큰 블랙리스트 추가 실패", e);
        }
    }

    // 토큰이 블랙리스트에 있는지 확인
    public boolean isTokenBlacklisted(String token) {
        return redisTemplate.hasKey("blacklist:" + token);
    }
}