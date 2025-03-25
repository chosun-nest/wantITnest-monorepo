package com.virtukch.nest.tag.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TagListResponseDto {
    Long tagId;
    String tagName;
    int postCount;
}
