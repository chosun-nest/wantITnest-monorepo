package com.virtukch.nest.member_tech_stack.service;

import com.virtukch.nest.member_tech_stack.dto.MemberTechStackResponseDto;
import com.virtukch.nest.member_tech_stack.model.MemberTechStack;
import com.virtukch.nest.member_tech_stack.repostitory.MemberTechStackRepository;
import com.virtukch.nest.tech_stack.service.TechStackService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberTechStackService {

    private final MemberTechStackRepository memberTechStackRepository;
    private final TechStackService techStackService;

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
                .memberTechStackId(memberTechStack.getMemberTechStackId())
                .memberId(memberTechStack.getMemberId())
                .techStackId(memberTechStack.getTechStackId())
                .techStackName(
                    techStackService.findById(memberTechStack.getTechStackId()).getTechStackName())
                .build())
            .toList();
    }

    public void deleteByMemberId(Long memberId) {
        memberTechStackRepository.deleteByMemberId(memberId);
    }
}
