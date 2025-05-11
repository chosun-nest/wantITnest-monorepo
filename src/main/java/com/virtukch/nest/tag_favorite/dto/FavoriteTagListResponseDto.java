package com.virtukch.nest.tag_favorite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class FavoriteTagListResponseDto {
    Long memberId;
    String memberName;
    private List<FavoriteTagResponseDto> favoriteTags;
}
