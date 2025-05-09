package com.virtukch.nest.tag.dto;

import com.virtukch.nest.tag.model.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class TagResponseDto {
    private Long tagId;
    private String tagName;
    private String tagPathName;
    private Category category;
    private String categoryDisplayName;
    private String categoryPathName;
}