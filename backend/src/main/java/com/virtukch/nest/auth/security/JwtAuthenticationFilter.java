package com.virtukch.nest.auth.security;

import com.virtukch.nest.auth.dto.TokenValidationResult;
import com.virtukch.nest.auth.exception.InvalidTokenException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j  // ✅ 로깅 추가
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService customUserDetailsService; // ✅ 사용자 정보 로드
    private final JwtAuthenticationHelper jwtAuthenticationHelper;

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
        log.info("Incoming request URI: {}", requestURI);

        String token = extractToken(request);

        // 비회원일 경우 인증하지 않고 넘어감
        if (token != null) {
            TokenValidationResult result = jwtAuthenticationHelper.validateToken(token);
            if (result.isValid()) {
                authenticate(result.getMemberId());
            } else {
                // 검증 실패시 예외 발생
                throw new InvalidTokenException(result.getErrorType().getDefaultMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private void authenticate(Long memberId) {
        UserDetails userDetails = customUserDetailsService.loadUserByUserId(memberId);
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.info("JWT 인증 성공: 사용자 ID {}", memberId);
    }
}
