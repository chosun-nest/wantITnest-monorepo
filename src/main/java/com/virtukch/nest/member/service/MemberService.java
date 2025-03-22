package com.virtukch.nest.member.service;

import com.virtukch.nest.member.dto.MemberResponseDto;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberResponseDto getMemberInfo(String email) {
        Member member = memberRepository.findByMemberEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new MemberResponseDto(member.getMemberId(), member.getMemberEmail());
    }
}
