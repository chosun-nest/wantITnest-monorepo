package com.virtukch.nest.auth.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j  // ✅ 로깅 추가
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService; // ✅ 사용자 정보 로드

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/v3/api-docs") ||
            path.startsWith("/swagger-ui") ||
            path.startsWith("/swagger-resources") ||
            path.startsWith("/webjars");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        log.info("Incoming request URI: {}", requestURI);  // ✅ 요청이 들어올 때마다 로깅

        try {
            // 1️⃣ 요청 헤더에서 JWT 토큰 추출
            String token = getTokenFromRequest(request);

            // 2️⃣ 토큰 검증 & 유효하면 SecurityContext에 저장
            if (token != null && jwtTokenProvider.validateToken(token)) {
                Long memberId = jwtTokenProvider.getMemberIdFromToken(token);

                // 3️⃣ 사용자 정보 로드
                UserDetails userDetails = customUserDetailsService.loadUserByUserId(memberId);
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("JWT 인증 성공: 사용자 ID {}", memberId);
            }
        } catch (ExpiredJwtException e) {
            log.warn("JWT 인증 실패: 토큰 만료됨");
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException e) {
            log.warn("JWT 인증 실패: 잘못된 토큰");
        } catch (UsernameNotFoundException e) {
            log.warn("JWT 인증 실패: 사용자 정보 없음");
        } catch (Exception e) {
            log.error("JWT 인증 중 알 수 없는 오류 발생", e);
        }

        // ✅ 필터 체인 계속 진행
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
