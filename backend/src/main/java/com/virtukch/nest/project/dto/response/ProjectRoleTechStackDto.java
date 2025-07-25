package com.virtukch.nest.project.dto.response;

/**
 * 역할-기술스택 연결 정보
 */
public class ProjectRoleTechStackDto {
    private Long id;
    private Long roleId;
    private Long techStackId;
    private String techStackName;   // 조인해서 가져온 이름
    private Boolean isRequired;
    private Integer priority;
    private String proficiencyLevel;
}
