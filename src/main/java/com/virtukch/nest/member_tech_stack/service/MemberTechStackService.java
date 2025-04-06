package com.virtukch.nest.member_tech_stack.service;

import com.virtukch.nest.member_tech_stack.dto.MemberTechStackResponseDto;
import com.virtukch.nest.member_tech_stack.model.MemberTechStack;
import com.virtukch.nest.member_tech_stack.repostitory.MemberTechStackRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberTechStackService {

    private final MemberTechStackRepository memberTechStackRepository;

    // 1. Create
    public void create(Long memberId, List<Long> techStackIdList) {

        List<MemberTechStack> memberTechStackList = techStackIdList.stream().
            map(techStackId -> MemberTechStack.builder()
                .memberId(memberId)
                .techStackId(techStackId)
                .build())
            .toList();

        memberTechStackRepository.saveAll(memberTechStackList);
    }

    public List<MemberTechStackResponseDto> findByMemberId(Long memberId) {
        List<MemberTechStack> memberTechStackList = memberTechStackRepository.findByMemberId(
            memberId);

        return memberTechStackList.stream()
            .map(memberTechStack -> MemberTechStackResponseDto.builder()
                .memberId(memberTechStack.getMemberId())
                .techStackId(memberTechStack.getTechStackId())
                .build())
            .toList();
    }
}
