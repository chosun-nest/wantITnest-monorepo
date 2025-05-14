package com.virtukch.nest.notice.dto;

import com.virtukch.nest.notice.model.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeResponseDto {
    private Long id;
    private Long number;
    private String noticeType;
    private String title;
    private String writer;
    private String postDate;
    private String link;
    private String views;
    private LocalDateTime createdAt;

    public static NoticeResponseDto fromEntity(Notice notice) {
        return NoticeResponseDto.builder()
                .id(notice.getId())
                .number(notice.getNumber())
                .noticeType(notice.getNoticeType())
                .title(notice.getTitle())
                .writer(notice.getWriter())
                .postDate(notice.getPostDate())
                .link(notice.getLink())
                .views(notice.getViews())
                .createdAt(notice.getCreatedAt())
                .build();
    }
}
