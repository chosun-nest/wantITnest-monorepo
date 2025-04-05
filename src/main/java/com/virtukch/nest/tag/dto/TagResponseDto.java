package com.virtukch.nest.tag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class TagResponseDto {
    Long tagId;
    String tagName;
    int postCount;
}
