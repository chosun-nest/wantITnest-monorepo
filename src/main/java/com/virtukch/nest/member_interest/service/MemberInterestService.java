package com.virtukch.nest.member_interest.service;

import com.virtukch.nest.interest.service.InterestService;
import com.virtukch.nest.member_interest.dto.MemberInterestResponseDto;
import com.virtukch.nest.member_interest.model.MemberInterest;
import com.virtukch.nest.member_interest.repository.MemberInterestRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberInterestService {

    private final MemberInterestRepository memberInterestRepository;
    private final InterestService interestService;

    // 1. Create
    public void create(Long memberId, List<Long> interestIdList) {
        List<MemberInterest> memberInterestList = interestIdList.stream()
            .map(interestId -> MemberInterest.builder()
                .memberId(memberId)
                .interestId(interestId)
                .build())
            .toList();

        memberInterestRepository.saveAll(memberInterestList);
    }

    // 2. findByMemberId
    public List<MemberInterestResponseDto> findByMemberId(Long memberId) {
        List<MemberInterest> memberInterestList = memberInterestRepository.findByMemberId(memberId);

        return memberInterestList.stream().map(memberInterest -> MemberInterestResponseDto.builder()
                .memberInterestId(memberInterest.getMemberInterestId())
                .memberId(memberInterest.getMemberId())
                .interestId(memberInterest.getInterestId())
                .interestName(interestService.findById(memberInterest.getMemberId()).getInterestName())
                .build())
            .toList();
    }
}
