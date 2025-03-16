package com.virtukch.nest.auth.security;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j  // ✅ 로깅 추가
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Authenticating user with email: {}", email);  // ✅ 로그인 시도 로깅
        return memberRepository.findByMemberEmail(email)
            .map(CustomUserDetails::new)
            .orElseThrow(() -> {
                log.warn("User not found with email: {}", email);  // ✅ 사용자 못 찾았을 때 경고 로그
                return new UsernameNotFoundException("User not found with email: " + email);
            });
    }

    // ✅ JWT 인증에서 사용할 사용자 ID 기반 조회 메서드 추가
    public UserDetails loadUserByUserId(Long memberId) throws UsernameNotFoundException {
        log.info("Authenticating user with ID: {}", memberId);
        return memberRepository.findById(memberId)
            .map(CustomUserDetails::new)
            .orElseThrow(() -> {
                log.warn("User not found with ID: {}", memberId);
                return new UsernameNotFoundException("User not found with ID: " + memberId);
            });
    }
}
