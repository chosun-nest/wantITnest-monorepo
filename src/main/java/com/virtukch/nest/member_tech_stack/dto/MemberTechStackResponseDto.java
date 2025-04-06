package com.virtukch.nest.member_tech_stack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MemberTechStackResponseDto {

    private Long memberId;

    private Long techStackId;
}
