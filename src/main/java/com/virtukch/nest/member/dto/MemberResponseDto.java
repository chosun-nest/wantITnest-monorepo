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
    private String memberName;
    private String memberSnsUrl1;
    private String memberSnsUrl2;
    private String memberSnsUrl3;
    private String memberSnsUrl4;
    private boolean memberIsStudent;
}