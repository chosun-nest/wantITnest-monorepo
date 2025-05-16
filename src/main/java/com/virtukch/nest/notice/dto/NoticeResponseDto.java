package com.virtukch.nest.notice.dto;

import com.virtukch.nest.notice.model.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
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
    private LocalDate postDate;
    private String link;
    private Long views;
    private LocalDateTime crawledAt;

    public static NoticeResponseDto create(Notice notice) {
        return NoticeResponseDto.builder()
                .id(notice.getId())
                .number(notice.getNumber())
                .noticeType(notice.getNoticeType())
                .title(notice.getTitle())
                .writer(notice.getWriter())
                .postDate(notice.getPostDate())
                .link(notice.getLink())
                .views(notice.getViews())
                .crawledAt(notice.getCrawledAt())
                .build();
    }
}
