package com.virtukch.nest.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ProjectAuthorDto {
    private Long id;
    private String name;
}
