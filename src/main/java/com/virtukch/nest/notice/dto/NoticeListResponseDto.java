package com.virtukch.nest.notice.dto;

import com.virtukch.nest.common.dto.PageInfoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class NoticeListResponseDto {
    private List<NoticeResponseDto> notices;
    private int totalCount;
    private PageInfoDto pageInfo; // 페이지 정보
}