package com.virtukch.nest.tag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class TagListResponseDto {
    private List<TagResponseDto> tags;
    private int tagCount;
}
