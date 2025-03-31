package com.virtukch.nest.post.service;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.post.dto.*;
import com.virtukch.nest.post.dto.converter.PostDtoConverter;
import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.post.repository.PostRepository;
import com.virtukch.nest.post_tag.model.PostTag;
import com.virtukch.nest.post_tag.repository.PostTagRepository;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.service.TagService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final TagService tagService;

    private final PostTagRepository postTagRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public PostCreateResponseDto createPost(Long memberId, PostCreateRequestDto requestDto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        log.info("[게시글 생성 시작] title={}, memberId={}", requestDto.getTitle(), memberId);
        Post post = Post.builder()
                .member(member)
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .build();

        // 태그가 설정되지 않았다면, 기본 태그인 "UNCATEGORIZED"로 자동 설정
        List<String> tags = requestDto.getTags().isEmpty() ? List.of("UNCATEGORIZED") : requestDto.getTags();

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
        Post post = findByIdOrThrow(postId);
        if (!post.getMember().getMemberId().equals(memberId)) {
            throw new AccessDeniedException("수정 권한 없음");
        }

        List<Tag> tags = requestDto.getTags().stream().map(tagService::findByNameOrThrow).toList();
        post.updatePost(requestDto.getTitle(), requestDto.getContent(), tags);

        return PostDtoConverter.toUpdateResponseDto(postId);
    }

    @Transactional(readOnly = true)
    public Post findByIdOrThrow(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with ID: " + postId));
    }
}