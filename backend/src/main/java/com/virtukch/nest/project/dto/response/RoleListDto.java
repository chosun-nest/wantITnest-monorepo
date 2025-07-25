package com.virtukch.nest.project.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RoleListDto {
    List<RoleDetailDto> roleInfos;
    Integer totalNeededMembers;
    Integer currentMembers;
}
