package com.virtukch.nest.post.dto.converter;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.post.dto.*;
import com.virtukch.nest.post.model.Post;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class PostDtoConverter {

    public static PostResponseDto toCreateResponseDto(Post post) {
        return buildResponse(post, "게시글이 성공적으로 등록되었습니다.");
    }

    public static PostResponseDto toUpdateResponseDto(Post post) {
        return buildResponse(post, "게시글이 성공적으로 수정되었습니다.");
    }

    public static PostResponseDto toDeleteResponseDto(Post post) {
        return buildResponse(post, "게시글이 성공적으로 삭제되었습니다.");
    }

    private static PostResponseDto buildResponse(Post post, String message) {
        return PostResponseDto.builder()
                .postId(post.getId())
                .message(message)
                .build();
    }

    public static PostSummaryDto toSummaryDto(Post post, String memberName, List<String> tagNames) {
        return PostSummaryDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .previewContent(generatePreview(post.getContent()))
                .tags(tagNames)
                .authorName(memberName)
                .viewCount(post.getViewCount())
                .createdAt(timeFormat(post.getCreatedAt()))
                .build();
    }

    public static PostDetailResponseDto toDetailResponseDto(Post post, Member member, List<String> tagNames) {
        return PostDetailResponseDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .tags(tagNames)
                .author(AuthorDto.builder()
                        .id(member.getMemberId())
                        .name(member.getMemberName())
                        .build())
                .viewCount(post.getViewCount())
                .createdAt(timeFormat(post.getCreatedAt()))
                .updatedAt(timeFormat(post.getUpdatedAt()))
                .build();
    }

    public static PostListResponseDto toListResponseDto(List<PostSummaryDto> summaries, Page<?> page) {
        return PostListResponseDto.builder()
                .posts(summaries)
                .totalCount((int) page.getTotalElements())
                .pageInfo(toPageInfoDto(page))
                .build();
    }

    public static PageInfoDto toPageInfoDto(Page<?> page) {
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

    private static String timeFormat(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }

    private static String generatePreview(String content) {
        if (content == null) return "";
        return content.length() <= 100 ? content : content.substring(0, 100) + "...";
    }
}