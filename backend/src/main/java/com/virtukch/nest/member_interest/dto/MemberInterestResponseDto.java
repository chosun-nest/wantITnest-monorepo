package com.virtukch.nest.member_interest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberInterestResponseDto {

    private Long memberInterestId;

    private Long memberId;

    private Long interestId;

    private String interestName;
}
