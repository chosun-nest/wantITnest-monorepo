package com.virtukch.nest.member_interest.service;

import com.virtukch.nest.member_interest.model.MemberInterest;
import com.virtukch.nest.member_interest.repository.MemberInterestRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberInterestService {

    private final MemberInterestRepository memberInterestRepository;

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
}
