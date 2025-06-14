package com.virtukch.nest.comment.dto;

import com.virtukch.nest.common.dto.PageInfoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Builder
@Getter
public class CommentListResponseDto {
    private List<CommentResponseDto> comments;
    private int totalCount;
    private PageInfoDto pageInfo;
}

