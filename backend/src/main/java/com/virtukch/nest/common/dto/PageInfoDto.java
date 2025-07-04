package com.virtukch.nest.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
@Builder
@AllArgsConstructor
public class PageInfoDto {
    private int pageNumber;      // 현재 페이지 번호
    private int pageSize;        // 페이지당 항목 수
    private int totalPages;      // 전체 페이지 수
    private long totalElements;  // 전체 항목 수
    private boolean first;       // 첫 페이지 여부
    private boolean last;        // 마지막 페이지 여부
    private boolean hasNext;     // 다음 페이지 존재 여부
    private boolean hasPrevious; // 이전 페이지 존재 여부

    public static PageInfoDto create(Page<?> page) {
        return PageInfoDto.builder()
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .first(page.isFirst())
                .last(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}