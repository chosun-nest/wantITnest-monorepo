package com.virtukch.nest.post.service;

import com.virtukch.nest.comment.repository.CommentRepository;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.post.dto.*;
import com.virtukch.nest.post.dto.converter.PostDtoConverter;
import com.virtukch.nest.post.exception.NoPostAuthorityException;
import com.virtukch.nest.post.exception.PostNotFoundException;
import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.post.repository.PostRepository;
import com.virtukch.nest.post_tag.model.PostTag;
import com.virtukch.nest.post_tag.repository.PostTagRepository;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import com.virtukch.nest.tag.service.TagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final PostTagRepository postTagRepository;
    private final MemberRepository memberRepository;
    private final TagRepository tagRepository;
    private final TagService tagService;
    private final CommentRepository commentRepository;

    @Transactional
    public PostResponseDto createPost(Long memberId, PostRequestDto requestDto) {
        String title = requestDto.getTitle();
        log.info("[게시글 생성 시작] title={}, memberId={}", title, memberId);
        Post post = postRepository.save(Post.createPost(memberId, title, requestDto.getContent()));

        savePostTags(post, requestDto.getTags());

        log.info("[게시글 생성 완료] postId={}", post.getId());

        return PostDtoConverter.toCreateResponseDto(post);
    }

    @Transactional
    public PostDetailResponseDto getPostDetail(Long postId) {
        Post post = findByIdOrThrow(postId);
        post.increaseViewCount(); // 조회수 증가

        Member member = findMemberOrThrow(post);
        List<String> tagNames = extractTagNames(postId);

        return PostDtoConverter.toDetailResponseDto(post, member, tagNames);
    }

    // 게시글 목록 조회
    @Transactional(readOnly = true)
    public PostListResponseDto getPostList(Pageable pageable) {
        Page<Post> postPage = postRepository.findAll(pageable);
        return buildPostListResponse(postPage);
    }

    // 게시글 목록 조회 (태그 필터링 포함)
    @Transactional(readOnly = true)
    public PostListResponseDto getPostList(List<String> tags, Pageable pageable) {
        List<Long> tagIds = tags.stream()
                .map(tagService::findByNameOrThrow)
                .map(Tag::getId)
                .toList();

        Page<Post> postPage = postRepository.findByTagIds(tagIds, pageable);
        return buildPostListResponse(postPage);
    }

    // 게시글 수정
    @Transactional
    public PostResponseDto updatePost(Long postId, Long memberId, PostRequestDto requestDto) {
        Post post = validatePostOwnershipAndGet(postId, memberId);
        post.updatePost(requestDto.getTitle(), requestDto.getContent());

        // 관련된 postTag 전부 삭제
        postTagRepository.deleteAllByPostId(post.getId());
        // 수정된 Tag로 다시 저장
        savePostTags(post, requestDto.getTags());

        return PostDtoConverter.toUpdateResponseDto(post);
    }

    // 게시글 삭제
    @Transactional
    public PostResponseDto deletePost(Long memberId, Long postId) {
        Post post = validatePostOwnershipAndGet(postId, memberId);

        postTagRepository.deleteAllByPostId(postId); // 연관된 postTag 삭제
        commentRepository.deleteAllByPostId(postId); // 연관된 댓글 삭제
        postRepository.delete(post);
        return PostDtoConverter.toDeleteResponseDto(post);
    }

    @Transactional(readOnly = true)
    public Post findByIdOrThrow(Long postId) {
        return postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
    }

    // 게시글 소유권 확인
    @Transactional(readOnly = true)
    public Post validatePostOwnershipAndGet(Long postId, Long memberId) {
        Post post = findByIdOrThrow(postId);
        if (!Objects.equals(post.getMemberId(), memberId)) {
            throw new NoPostAuthorityException(postId, memberId);
        }
        return post;
    }

    @Transactional
    protected void savePostTags(Post post, List<String> tagNames) {
        // 태그가 설정되지 않았다면, 기본 태그인 "UNCATEGORIZED"로 자동 설정
        List<String> tags = (tagNames == null || tagNames.isEmpty())
                ? List.of("UNCATEGORIZED")
                : tagNames;

        tags.stream()
                .map(tagService::findByNameOrThrow)
                .map(tag -> new PostTag(post.getId(), tag.getId()))
                .forEachOrdered(postTagRepository::save);
    }


    private List<String> extractTagNames(Long postId) {
        List<PostTag> postTags = postTagRepository.findAllByPostId(postId);
        List<Long> tagIds = postTags.stream()
                .map(PostTag::getTagId)
                .toList();

        Map<Long, String> tagNameMap = tagRepository.findAllById(tagIds).stream()
                .collect(Collectors.toMap(Tag::getId, Tag::getName));

        return tagIds.stream()
                .map(tagNameMap::get)
                .filter(Objects::nonNull)
                .toList();
    }

    private Member findMemberOrThrow(Post post) {
        return memberRepository.findById(post.getMemberId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private PostListResponseDto buildPostListResponse(Page<Post> postPage) {
        List<Post> posts = postPage.getContent();

        Map<Long, String> memberNameMap = fetchMemberNameMap(posts);
        Map<Long, List<Long>> postTagMap = fetchPostTagMap(posts);
        Map<Long, String> tagNameMap = fetchTagNameMap(postTagMap);

        List<PostSummaryDto> summaries = posts.stream()
                .map(post -> buildPostSummaryDto(post, memberNameMap, postTagMap, tagNameMap))
                .toList();

        return PostDtoConverter.toListResponseDto(summaries, postPage);
    }

    private Map<Long, String> fetchMemberNameMap(List<Post> posts) {
        List<Long> memberIds = posts.stream()
                                .map(Post::getMemberId)
                                .distinct()
                                .toList();
        return memberRepository.findAllById(memberIds).stream()
            .collect(Collectors.toMap(Member::getMemberId, Member::getMemberName));
    }

    private Map<Long, List<Long>> fetchPostTagMap(List<Post> posts) {
        List<Long> postIds = posts.stream()
                              .map(Post::getId)
                              .toList();
        return postTagRepository.findByPostIdIn(postIds).stream()
            .collect(Collectors.groupingBy(
                    PostTag::getPostId,
                    Collectors.mapping(PostTag::getTagId, Collectors.toList())
            ));
    }

    private Map<Long, String> fetchTagNameMap(Map<Long, List<Long>> postTagMap) {
        List<Long> tagIds = postTagMap.values().stream()
                                  .flatMap(Collection::stream)
                                  .distinct()
                                  .toList();
        return tagRepository.findAllById(tagIds).stream()
            .collect(Collectors.toMap(Tag::getId, Tag::getName));
    }

    private PostSummaryDto buildPostSummaryDto(
            Post post,
            Map<Long, String> memberNameMap,
            Map<Long, List<Long>> postTagMap,
            Map<Long, String> tagNameMap
    ){
        String memberName = memberNameMap.get(post.getMemberId());
        List<String> tagNames = postTagMap.getOrDefault(post.getId(), Collections.emptyList()).stream()
                                      .map(tagNameMap::get)
                                      .filter(Objects::nonNull)
                                      .toList();
        return PostDtoConverter.toSummaryDto(post, memberName, tagNames);
    }
}