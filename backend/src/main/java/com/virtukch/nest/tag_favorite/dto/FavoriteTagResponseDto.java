package com.virtukch.nest.tag_favorite.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class FavoriteTagResponseDto {
    Long tagId;
    String tagName;
}
