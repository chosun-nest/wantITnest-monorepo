package com.virtukch.nest.member.dto;

import com.virtukch.nest.member.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class MemberResponseDto {

    private Long memberId;
    private String memberEmail;
    private Role memberRole;
}