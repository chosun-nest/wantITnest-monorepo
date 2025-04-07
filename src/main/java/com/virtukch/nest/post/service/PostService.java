package com.virtukch.nest.post.service;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.post.dto.*;
import com.virtukch.nest.post.dto.converter.PostDtoConverter;
import com.virtukch.nest.post.exception.CannotDeletePostException;
import com.virtukch.nest.post.exception.InvalidPostTitleException;
import com.virtukch.nest.post.exception.NoPostAuthorityException;
import com.virtukch.nest.post.exception.PostNotFoundException;
import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.post.repository.PostRepository;
import com.virtukch.nest.post_tag.model.PostTag;
import com.virtukch.nest.post_tag.repository.PostTagRepository;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.service.TagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final TagService tagService;

    private final PostTagRepository postTagRepository;

    @Transactional
    public PostCreateResponseDto createPost(Member member, PostCreateRequestDto requestDto) {
        String title = requestDto.getTitle();
        if(title == null || title.isBlank()) {
            throw new InvalidPostTitleException();
        }

        log.info("[게시글 생성 시작] title={}, memberId={}", title, member.getMemberId());
        Post post = Post.createPost(member, title, requestDto.getContent());

        // 태그가 설정되지 않았다면, 기본 태그인 "UNCATEGORIZED"로 자동 설정
        List<String> tagsFromRequest = requestDto.getTags();
        if (tagsFromRequest == null || tagsFromRequest.isEmpty()) {
            tagsFromRequest = List.of("UNCATEGORIZED");
        }
        List<String> tags = tagsFromRequest;

        tags.stream()
                .map(tagService::findByNameOrThrow)
                .map(tag -> new PostTag(post, tag))
                .forEachOrdered(post::addPostTag);

        Post savedPost = postRepository.save(post);
        log.info("[게시글 생성 완료] postId={}", savedPost.getId());

        return PostDtoConverter.toCreateResponseDto(savedPost);
    }

    @Transactional
    public PostDetailResponseDto getPostDetail(Long postId) {
        Post post = findByIdOrThrow(postId);
        post.increaseViewCount(); // 조회수 증가

        return PostDtoConverter.toDetailResponseDto(post);
    }

    // 게시글 목록 조회
    @Transactional(readOnly = true)
    public PostListResponseDto getPostList() {
        List<PostSummaryDto> summaries = postRepository.findAll().stream()
                .map(PostDtoConverter::toSummaryDto)
                .collect(Collectors.toList());
        return PostDtoConverter.toListResponseDto(summaries);
    }

    // 게시글 목록 조회 (태그 필터링 포함)
    @Transactional(readOnly = true)
    public PostListResponseDto getPostList(List<String> tags) {
        List<PostSummaryDto> summaries = new ArrayList<>();
        for (String tagName : tags) {
            Tag tag = tagService.findByNameOrThrow(tagName);
            for (PostTag postTag : postTagRepository.findByTag(tag)) {
                summaries.add(PostDtoConverter.toSummaryDto(postTag.getPost()));
            }
        }
        return PostDtoConverter.toListResponseDto(summaries);
    }

    @Transactional
    public PostUpdateResponseDto updatePost(Long postId, Long memberId, PostUpdateRequestDto requestDto) {
        Post post = validatePostOwnershipAndGet(postId, memberId);
        List<Tag> tags = requestDto.getTags().stream()
                .map(tagService::findByNameOrThrow).collect(Collectors.toList());

        if(tags.isEmpty()) {
            tags.add(tagService.findByNameOrThrow("UNCATEGORIZED"));
        }

        post.updatePost(requestDto.getTitle(), requestDto.getContent(), tags);
        return PostDtoConverter.toUpdateResponseDto(post);
    }

    @Transactional
    public PostDeleteResponseDto deletePost(Long memberId, Long postId) {
        Post post = validatePostOwnershipAndGet(postId, memberId);
        try { // TODO : 추후에 댓글 기능, 좋아요 기능 등등 추가하면 고려하여 수정해야함.
            postRepository.delete(post);
            return PostDtoConverter.toDeleteResponseDto(post);
        } catch (DataIntegrityViolationException e) {
            log.warn("게시글 삭제 실패 - 연관 데이터 문제 postId={}, memberId={}", postId, memberId);
            throw new CannotDeletePostException(postId);
        }
    }

    @Transactional(readOnly = true)
    public Post findByIdOrThrow(Long postId) {
        return postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
    }

    @Transactional(readOnly = true)
    public Post validatePostOwnershipAndGet(Long postId, Long memberId) {
        Post post = findByIdOrThrow(postId);
        if (!Objects.equals(post.getMember().getMemberId(), memberId)) {
            throw new NoPostAuthorityException(postId, memberId);
        }
        return post;
    }
}