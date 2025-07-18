package com.virtukch.nest.auth.service;

import com.virtukch.nest.auth.dto.*;
import com.virtukch.nest.auth.exception.EmailAlreadyExistException;
import com.virtukch.nest.auth.exception.InvalidTokenException;
import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.auth.security.JwtAuthenticationHelper;
import com.virtukch.nest.auth.security.JwtTokenProvider;
import com.virtukch.nest.common.dto.CommonResponseDto;
import com.virtukch.nest.member.exception.MemberNotFoundException;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.model.Role;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.member_department.service.MemberDepartmentService;
import com.virtukch.nest.member_tech_stack.service.MemberTechStackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final MemberDepartmentService memberDepartmentService;
    private final MemberTechStackService memberTechStackService;
    private final EmailService emailService;
    private final TokenBlacklistService tokenBlacklistService;
    private final JwtAuthenticationHelper jwtAuthenticationHelper;

    public SignupResponseDto signup(SignupRequestDto signupRequestDto) {
        // 이메일 중복 확인
        if (memberRepository.findByMemberEmail(signupRequestDto.getEmail()).isPresent()) {
            log.error("Signup failed: Email '{}' is already in use", signupRequestDto.getEmail());
            throw new EmailAlreadyExistException("Email already in use");
        }

        // 1. member Table 저장
        // 이메일, 비밀번호, 이름, 하생 여부, ROLE
        Member member = Member.builder()
            .memberEmail(signupRequestDto.getEmail())
            .memberPassword(passwordEncoder.encode(signupRequestDto.getPassword()))
            .memberName(signupRequestDto.getMemberName())
            .memberIsStudent(signupRequestDto.getMemberIsStudent())
            .memberRole(Role.ROLE_USER) // ✅ 기본적으로 일반 유저
            .memberPasswordLength(signupRequestDto.getPassword().length())
            .build();
        memberRepository.save(member);

        // 2. JWT 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(member.getMemberId());
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getMemberId());

        // 3. Token 에서 memberId 추출
        Long memberId = jwtTokenProvider.getMemberIdFromToken(accessToken);

        // 4. memberDepartment 데이터 삽입 (다대다 테이블 고려)
        memberDepartmentService.create(memberId, signupRequestDto.getDepartmentIdList());

        // 5. memberTechStack 데이터 삽입 (다대다 테이블 고려)
        memberTechStackService.create(memberId, signupRequestDto.getTechStackIdList());

        return SignupResponseDto.builder()
            .memberId(member.getMemberId())
            .email(member.getMemberEmail())
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
    }

    public LoginResponseDto login(LoginRequestDto request) {
        // ✅ Spring Security 의 인증 매니저 사용 (비밀번호 체크 포함)
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // ✅ 인증된 사용자 정보 가져오기
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long memberId = userDetails.getMember().getMemberId();

        // ✅ JWT 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(memberId);
        String refreshToken = jwtTokenProvider.createRefreshToken(memberId);

        return new LoginResponseDto(accessToken, refreshToken);
    }

    public LoginResponseDto refreshToken(String refreshToken) {
        // 1. JWT 검증 + 블랙리스트 체크
        validateToken(refreshToken);
        
        // 2. 토큰 타입 검증 (refresh token인지 확인)
        String tokenType = jwtTokenProvider.getTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new InvalidTokenException("Refresh token이 아닙니다.");
        }
        
        Long memberId = jwtTokenProvider.getMemberIdFromToken(refreshToken);

        // 3. ✅ 기존 refresh token 블랙리스트 추가 (토큰 무효화)
        tokenBlacklistService.blacklistToken(refreshToken);

        // 4. ✅ 새로운 토큰들 생성
        String newAccessToken = jwtTokenProvider.createAccessToken(memberId);
        String newRefreshToken = jwtTokenProvider.createRefreshToken(memberId);

        log.info("토큰 재발급 완료: memberId {}", memberId);
        return new LoginResponseDto(newAccessToken, newRefreshToken);
    }

    public CommonResponseDto sendPasswordResetLink(String email) {
        Member member = memberRepository.findByMemberEmail(email)
            .orElseThrow(() -> new RuntimeException("존재하지 않는 이메일입니다."));

        String token = jwtTokenProvider.createPasswordResetToken(member.getMemberId());
        String resetLink = "http://wantitnest.co.kr/reset-password?token=" + token;
        String subject = "[NEST] 비밀번호 재설정 안내";
        String body = String.format(
            "안녕하세요.%n%n 비밀번호를 재설정하기 위해 아래 링크를 클릭해주세요:%n%n%s%n%n본 이메일은 10분간 유효합니다.", resetLink);

        emailService.send(email, subject, body);
        log.info("[비밀번호 재설정] 이메일 전송 완료: {}", email);

        return CommonResponseDto.builder()
            .message("비밀번호 재설정 링크가 전송되었습니다.")
            .build();
    }

    public CommonResponseDto resetPassword(PasswordResetRequestDto passwordResetRequestDto) {
        String token = passwordResetRequestDto.getToken();
        String newPassword = passwordResetRequestDto.getNewPassword();

        validateToken(token);

        // 2. 토큰 타입 검증 (refresh token인지 확인)
        String tokenType = jwtTokenProvider.getTokenType(token);
        if (!"password_reset".equals(tokenType)) {
            throw new InvalidTokenException("password_reset token이 아닙니다.");
        }

        tokenBlacklistService.blacklistToken(token);

        Long memberId = jwtTokenProvider.getMemberIdFromToken(token);
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new MemberNotFoundException("존재하지 않는 사용자입니다."));

        member.updatePassword(passwordEncoder.encode(newPassword));
        member.updatePasswordLength(newPassword.length());
        memberRepository.save(member);
        log.info("[비밀번호 재설정] 사용자 ID {}의 비밀번호가 변경되었습니다.", memberId);

        return CommonResponseDto.builder()
            .message("비밀번호가 성공적으로 변경되었습니다.")
            .build();
    }

    public void logout(String accessToken, String refreshToken) {
        try {
            // 1. ✅ Access Token 블랙리스트 추가
            tokenBlacklistService.blacklistToken(accessToken);
            log.info("Access Token 블랙리스트 추가 완료");

            // 2. ✅ Refresh Token도 블랙리스트 추가
            tokenBlacklistService.blacklistToken(refreshToken);
            log.info("Refresh Token 블랙리스트 추가 완료");

        } catch (Exception e) {
            log.error("로그아웃 처리 중 오류 발생", e);
        }

        log.info("완전한 로그아웃 처리 완료");
    }

    public Long getMemberIdFromToken(String token) {
        TokenValidationResult result = jwtAuthenticationHelper.validateToken(token);
        if (!result.isValid()) {
            throw new InvalidTokenException(result.getErrorType().getDefaultMessage());
        }
        return result.getMemberId();
    }

    private void validateToken(String token) {
        TokenValidationResult result = jwtAuthenticationHelper.validateToken(token);
        if (!result.isValid()) {
            throw new InvalidTokenException(result.getErrorType().getDefaultMessage());
        }
    }
}
