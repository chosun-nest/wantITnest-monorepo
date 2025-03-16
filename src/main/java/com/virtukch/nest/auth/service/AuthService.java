package com.virtukch.nest.auth.service;

import com.virtukch.nest.auth.dto.LoginRequestDto;
import com.virtukch.nest.auth.dto.LoginResponseDto;
import com.virtukch.nest.auth.dto.SignupRequestDto;
import com.virtukch.nest.auth.dto.SignupResponseDto;
import com.virtukch.nest.auth.exception.EmailAlreadyExistException;
import com.virtukch.nest.auth.exception.InvalidTokenException;
import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.auth.security.JwtTokenProvider;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.model.Role;
import com.virtukch.nest.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.context.annotation.Lazy;

@Slf4j
@Service
public class AuthService {
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    public AuthService(
        MemberRepository memberRepository,
        JwtTokenProvider jwtTokenProvider,
        @Lazy AuthenticationManager authenticationManager,
        @Lazy PasswordEncoder passwordEncoder
    ) {
        this.memberRepository = memberRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    public SignupResponseDto signup(SignupRequestDto signupRequestDto) {
        // 이메일 중복 확인
        if (memberRepository.findByMemberEmail(signupRequestDto.getEmail()).isPresent()) {
            log.error("Signup failed: Email '{}' is already in use", signupRequestDto.getEmail());
            throw new EmailAlreadyExistException("Email already in use");
        }

        // 회원 저장
        Member member = Member.builder()
            .memberEmail(signupRequestDto.getEmail())
            .memberPassword(passwordEncoder.encode(signupRequestDto.getPassword()))
            .memberRole(Role.ROLE_USER) // ✅ 기본적으로 일반 유저
            .build();
        memberRepository.save(member);

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.createToken(member.getMemberId());
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getMemberId());

        return SignupResponseDto.builder()
            .memberId(member.getMemberId())
            .email(member.getMemberEmail())
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
    }

    public LoginResponseDto login(LoginRequestDto request) {
        // ✅ Spring Security의 인증 매니저 사용 (비밀번호 체크 포함)
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // ✅ 인증된 사용자 정보 가져오기
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long memberId = userDetails.getMember().getMemberId();

        // ✅ JWT 토큰 생성
        String accessToken = jwtTokenProvider.createToken(memberId);
        String refreshToken = jwtTokenProvider.createRefreshToken(memberId);

        return new LoginResponseDto(accessToken, refreshToken);
    }

    public LoginResponseDto refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            log.error("Token refresh failed: Invalid refresh token");
            throw new InvalidTokenException("Invalid refresh token");
        }

        Long memberId = jwtTokenProvider.getMemberIdFromToken(refreshToken);
        String newAccessToken = jwtTokenProvider.createToken(memberId);
        String newRefreshToken = jwtTokenProvider.createRefreshToken(memberId);

        return new LoginResponseDto(newAccessToken, newRefreshToken);
    }
}
