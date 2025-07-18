package com.virtukch.nest.auth.security;

import com.virtukch.nest.auth.dto.TokenValidationErrorType;
import com.virtukch.nest.auth.dto.TokenValidationResult;
import com.virtukch.nest.auth.service.TokenBlacklistService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * JWT 토큰 검증과 관련된 예외 처리를 담당하는 헬퍼 클래스
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationHelper {

    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklistService tokenBlacklistService;

    /**
     * 토큰 검증을 수행하고 결과를 반환
     *
     * @param token 검증할 JWT 토큰
     * @return 검증 결과
     */
    public TokenValidationResult validateToken(String token) {
        try {
            // 1. 토큰 유효성 검증 (jjwt 라이브러리 예외 발생 가능)
            Claims claims = jwtTokenProvider.getClaims(token);

            // 2. 블랙리스트 확인
            if (tokenBlacklistService.isTokenBlacklisted(token)) {
                log.warn("블랙리스트된 토큰 사용 시도");
                return TokenValidationResult.failure(TokenValidationErrorType.BLACKLISTED);
            }

            // 3. 모든 검증 통과 -> memberId 추출
            Long memberId = Long.parseLong(claims.getSubject());
            return TokenValidationResult.success(memberId);

        } catch (ExpiredJwtException e) {
            log.warn("JWT 인증 실패: 토큰 만료됨", e);
            return TokenValidationResult.failure(TokenValidationErrorType.EXPIRED);

        } catch (UnsupportedJwtException | MalformedJwtException | SecurityException e) {
            log.warn("JWT 인증 실패: 잘못된 토큰", e);
            return TokenValidationResult.failure(TokenValidationErrorType.INVALID);

        } catch (UsernameNotFoundException e) {
            log.warn("JWT 인증 실패: 사용자 정보 없음", e);
            return TokenValidationResult.failure(TokenValidationErrorType.USER_NOT_FOUND);

        } catch (Exception e) {
            log.error("JWT 인증 중 알 수 없는 오류 발생", e);
            return TokenValidationResult.failure(TokenValidationErrorType.UNKNOWN);
        }
    }
}