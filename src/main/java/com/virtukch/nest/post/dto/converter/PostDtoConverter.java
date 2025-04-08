package com.virtukch.nest.post.dto.converter;

import com.virtukch.nest.post.dto.*;
import com.virtukch.nest.post.model.Post;

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

    public static PostSummaryDto toSummaryDto(Post post) {
        return PostSummaryDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .previewContent(generatePreview(post.getContent()))
                .tags(extractTagNames(post))
                .authorName(post.getMember().getMemberName())
                .viewCount(post.getViewCount())
                .createdAt(timeFormat(post.getCreatedAt()))
                .build();
    }

    public static PostDetailResponseDto toDetailResponseDto(Post post) {
        return PostDetailResponseDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .tags(extractTagNames(post))
                .author(AuthorDto.builder()
                        .id(post.getMember().getMemberId())
                        .name(post.getMember().getMemberName())
                        .build())
                .viewCount(post.getViewCount())
                .createdAt(timeFormat(post.getCreatedAt()))
                .updatedAt(timeFormat(post.getUpdatedAt()))
                .build();
    }

    public static PostListResponseDto toListResponseDto(List<PostSummaryDto> summaries) {
        return PostListResponseDto.builder()
                .posts(summaries)
                .totalCount(summaries.size())
                .build();
    }



    private static List<String> extractTagNames(Post post) {
        return post.getPostTags().stream().map(pt -> pt.getTag().getName()).toList();
    }

    private static String timeFormat(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }

    private static String generatePreview(String content) {
        if (content == null) return "";
        return content.length() <= 100 ? content : content.substring(0, 100) + "...";
    }
}