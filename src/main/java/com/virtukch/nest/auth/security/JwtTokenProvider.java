package com.virtukch.nest.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenValidity;

    // 서명 키 생성
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // 액세스 토큰 생성 (memberId 기반)
    public String createToken(Long memberId) {
        Claims claims = Jwts.claims().setSubject(String.valueOf(memberId));
        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidity);

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(validity)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    // 리프레시 토큰 생성 (memberId 기반)
    public String createRefreshToken(Long memberId) {
        return Jwts.builder()
            .setSubject(String.valueOf(memberId))
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    // 토큰에서 memberId 추출
    public Long getMemberIdFromToken(String token) {
        return Long.parseLong(getClaims(token).getSubject());
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            return getClaims(token).getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // Claims 정보 가져오기
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
