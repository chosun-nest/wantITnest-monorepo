package com.virtukch.nest.member.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL) // null 이면 아예 JSON 에서 빠짐
public class MemberUpdateRequestDto {

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

    private List<MemberDepartmentResponseDto> memberDepartmentResponseDtoList;
    private List<MemberInterestResponseDto> memberInterestResponseDtoList;
    private List<MemberTechStackResponseDto> memberTechStackResponseDtoList;
}