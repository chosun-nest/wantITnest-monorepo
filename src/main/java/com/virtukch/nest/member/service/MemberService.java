package com.virtukch.nest.member.service;

import com.virtukch.nest.auth.security.CustomUserDetails;
import com.virtukch.nest.member.dto.MemberResponseDto;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    // CustomUserDetails 기반으로 현재 로그인한 회원 정보 반환
    public MemberResponseDto getCurrentMemberByCustomUserDetails(
        CustomUserDetails customUserDetails) {

        // Token 의 Claims 에는 memberId 만 들어 있습니다.
        Long memberId = customUserDetails.getMember().getMemberId();

        // DB 를 조회해야 하는데, customUserDetails 의 member 는 Spring Security 가 인증 시점에 생성한 일종의 스냅샷 객체에 불과하기 때문에, 꼭 최신 정보가 들어있다고 확신하기 어렵기 때문입니다.
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return MemberResponseDto.builder()
            .memberId(member.getMemberId())
            .memberEmail(member.getMemberEmail())
            .memberRole(member.getMemberRole())
            .memberName(member.getMemberName())
            .memberSnsUrl1(member.getMemberSnsUrl1())
            .memberSnsUrl2(member.getMemberSnsUrl2())
            .memberSnsUrl3(member.getMemberSnsUrl3())
            .memberSnsUrl4(member.getMemberSnsUrl4())
            .memberIsStudent(member.isMemberIsStudent())
            .build();
    }
}
