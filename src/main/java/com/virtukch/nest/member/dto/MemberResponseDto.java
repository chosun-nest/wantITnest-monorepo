package com.virtukch.nest.member.dto;

import com.virtukch.nest.member.model.Role;
import com.virtukch.nest.member_department.dto.MemberDepartmentResponseDto;
import com.virtukch.nest.member_interest.dto.MemberInterestResponseDto;
import com.virtukch.nest.member_tech_stack.dto.MemberTechStackResponseDto;
import java.util.List;
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
    private Boolean memberIsStudent;
    private String memberIntroduce;
    private String memberImageUrl;
    private Integer memberPasswordLength;
    private List<MemberDepartmentResponseDto> memberDepartmentResponseDtoList;
    private List<MemberInterestResponseDto> memberInterestResponseDtoList;
    private List<MemberTechStackResponseDto> memberTechStackResponseDtoList;
}