package com.virtukch.nest.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberResponseDto {
    private Long memberId;
    private String memberEmail;
}
