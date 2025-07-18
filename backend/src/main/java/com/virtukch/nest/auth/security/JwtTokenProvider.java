package com.virtukch.nest.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenValidity;

    @Value("${jwt.password-reset-token-expiration}")
    private long passwordResetTokenValidity;

    // 서명 키 생성
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // 액세스 토큰 생성 (memberId 기반)
    public String createAccessToken(Long memberId) {
        Claims claims = Jwts.claims().setSubject(String.valueOf(memberId));
        claims.put("type", "access");
        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidity);

        return buildToken(claims, now, validity);
    }

    // 리프레시 토큰 생성 (memberId 기반)
    public String createRefreshToken(Long memberId) {
        Claims claims = Jwts.claims();
        claims.setSubject(String.valueOf(memberId));
        claims.put("type", "refresh");
        claims.setIssuer("wantitnest-auth");

        Date now = new Date();
        Date validity = new Date(now.getTime() + refreshTokenValidity);

        return buildToken(claims, now, validity);
    }

    public String createPasswordResetToken(Long memberId) {
        Claims claims = Jwts.claims();
        claims.setSubject(String.valueOf(memberId));
        claims.put("type", "password_reset");
        claims.setIssuer("wantitnest-auth");

        Date now = new Date();
        Date validity = new Date(now.getTime() + passwordResetTokenValidity);  // 10분

        return buildToken(claims, now, validity);
    }

    // 토큰에서 memberId 추출
    public Long getMemberIdFromToken(String token) {
        return Long.parseLong(getClaims(token).getSubject());
    }

    // Claims 정보 가져오기
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    // 토큰 타입 확인
    public String getTokenType(String token) {
        return (String) getClaims(token).get("type");
    }

    private String buildToken(Claims claims, Date now, Date validity) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
