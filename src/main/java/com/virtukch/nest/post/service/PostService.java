package com.virtukch.nest.post.service;

import com.virtukch.nest.comment.repository.CommentRepository;
import com.virtukch.nest.common.service.ImageService;
import com.virtukch.nest.member.exception.MemberNotFoundException;
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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 게시글 관련 비즈니스 로직을 처리하는 서비스 클래스입니다.
 * 게시글의 생성, 조회, 수정, 삭제 및 검색 기능을 제공합니다.
 */
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
    private final ImageService imageService;

    private final String prefix = "interest";

    /**
     * 새로운 게시글을 생성합니다.
     *
     * @param memberId 게시글 작성자의 회원 ID
     * @param requestDto 게시글 생성에 필요한 정보(제목, 내용, 태그 등)를 담은 DTO
     * @return 생성된 게시글 정보를 담은 응답 DTO
     */
    @Transactional
    public PostResponseDto createPost(Long memberId, PostRequestDto requestDto) {
        String title = requestDto.getTitle();
        log.info("[게시글 생성 시작] title={}, memberId={}", title, memberId);
        Post post = postRepository.save(Post.createPost(memberId, title, requestDto.getContent()));

        savePostTags(post, requestDto.getTags());

        log.info("[게시글 생성 완료] postId={}", post.getId());

        return PostDtoConverter.toCreateResponseDto(post);
    }

    /**
     * 이미지를 포함한 새로운 게시글을 생성합니다.
     *
     * @param memberId 게시글 작성자의 회원 ID
     * @param requestDto 게시글 생성에 필요한 정보(제목, 내용, 태그, 이미지 파일 등)를 담은 DTO
     * @return 생성된 게시글 정보를 담은 응답 DTO
     */
    @Transactional
    public PostResponseDto createPost(Long memberId, PostWithImagesRequestDto requestDto) {
        String title = requestDto.getTitle();
        log.info("[게시글 생성 시작] title={}, memberId={}", title, memberId);
        Post post = postRepository.save(Post.createPost(memberId, title, requestDto.getContent()));

        savePostTags(post, requestDto.getTags());

        // 이미지 업로드 및 URL 받기
        List<String> imageUrls;
        if (requestDto.getImages() != null && !requestDto.getImages().isEmpty()) {
            imageUrls = imageService.uploadImages(requestDto.getImages(), prefix, post.getId());
            post.updatePost(post.getTitle(), post.getContent(), imageUrls);
        }

        log.info("[게시글 생성 완료] postId={}", post.getId());

        return PostDtoConverter.toCreateResponseDto(post);
    }

    /**
     * 게시글 상세 정보를 조회합니다. 조회 시 조회수가 증가합니다.
     *
     * @param postId 조회할 게시글 ID
     * @return 게시글 상세 정보를 담은 응답 DTO
     * @throws PostNotFoundException 게시글이 존재하지 않을 경우
     */
    @Transactional
    public PostDetailResponseDto getPostDetail(Long postId) {
        Post post = findByIdOrThrow(postId);
        post.increaseViewCount(); // 조회수 증가

        Member member = findMemberOrThrow(post);
        List<String> tagNames = extractTagNames(postId);
        List<String> imageUrls = post.getImageUrlList();

        return PostDtoConverter.toDetailResponseDto(post, member, tagNames, imageUrls);
    }

    /**
     * 전체 게시글 목록을 페이징하여 조회합니다.
     *
     * @param pageable 페이징 정보
     * @return 게시글 목록과 페이징 정보를 담은 응답 DTO
     */
    @Transactional(readOnly = true)
    public PostListResponseDto getPostList(Pageable pageable) {
        Page<Post> postPage = postRepository.findAll(pageable);
        return buildPostListResponse(postPage);
    }

    /**
     * 특정 태그가 포함된 게시글 목록을 페이징하여 조회합니다.
     *
     * @param tags 필터링할 태그 이름 목록
     * @param pageable 페이징 정보
     * @return 필터링된 게시글 목록과 페이징 정보를 담은 응답 DTO
     */
    @Transactional(readOnly = true)
    public PostListResponseDto getPostList(List<String> tags, Pageable pageable) {
        List<Long> tagIds = tags.stream()
                .map(tagService::findByNameOrThrow)
                .map(Tag::getId)
                .toList();

        Page<Post> postPage = postRepository.findByTagIds(tagIds, pageable);
        return buildPostListResponse(postPage);
    }

    /**
     * 게시글을 수정합니다. 게시글 작성자만 수정할 수 있습니다.
     *
     * @param postId 수정할 게시글 ID
     * @param memberId 수정 요청자의 회원 ID
     * @param requestDto 게시글 수정에 필요한 정보(제목, 내용, 태그 등)를 담은 DTO
     * @return 수정된 게시글 정보를 담은 응답 DTO
     * @throws PostNotFoundException 게시글이 존재하지 않을 경우
     * @throws NoPostAuthorityException 게시글 수정 권한이 없을 경우
     */
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

    /**
     * 게시글을 수정합니다. 게시글 작성자만 수정할 수 있습니다.
     *
     * @param postId 수정할 게시글 ID
     * @param memberId 수정 요청자의 회원 ID
     * @param requestDto 게시글 수정에 필요한 정보(제목, 내용, 태그 등)를 담은 DTO
     * @return 수정된 게시글 정보를 담은 응답 DTO
     * @throws PostNotFoundException 게시글이 존재하지 않을 경우
     * @throws NoPostAuthorityException 게시글 수정 권한이 없을 경우
     */
    @Transactional
    public PostResponseDto updatePost(Long postId, Long memberId, PostWithImagesRequestDto requestDto) {
        Post post = validatePostOwnershipAndGet(postId, memberId);

        List<String> imageUrls = imageService.replaceImages(requestDto.getImages(), prefix, postId, post.getImageUrlList());
        post.updatePost(post.getTitle(), post.getContent(), imageUrls);

        // 관련된 postTag 전부 삭제
        postTagRepository.deleteAllByPostId(post.getId());
        // 수정된 Tag로 다시 저장
        savePostTags(post, requestDto.getTags());

        return PostDtoConverter.toUpdateResponseDto(post);
    }

    /**
     * 게시글을 삭제합니다. 게시글 작성자만 삭제할 수 있습니다.
     * 게시글 삭제 시 관련된 태그 매핑 정보와 댓글도 함께 삭제됩니다.
     *
     * @param memberId 삭제 요청자의 회원 ID
     * @param postId 삭제할 게시글 ID
     * @return 삭제된 게시글 정보를 담은 응답 DTO
     * @throws PostNotFoundException 게시글이 존재하지 않을 경우
     * @throws NoPostAuthorityException 게시글 삭제 권한이 없을 경우
     */
    @Transactional
    public PostResponseDto deletePost(Long memberId, Long postId) {
        Post post = validatePostOwnershipAndGet(postId, memberId);

        postTagRepository.deleteAllByPostId(postId); // 연관된 postTag 삭제
        commentRepository.deleteAllByPostId(postId); // 연관된 댓글 삭제

        List<String> imageUrlList = post.getImageUrlList();
        if(!imageUrlList.isEmpty()) {
            imageUrlList.forEach(imageService::deleteImage);
        }

        postRepository.delete(post);
        return PostDtoConverter.toDeleteResponseDto(post);
    }

    /**
     * ID로 게시글을 조회합니다. 게시글이 존재하지 않으면 예외를 발생시킵니다.
     *
     * @param postId 조회할 게시글 ID
     * @return 조회된 게시글 엔티티
     * @throws PostNotFoundException 게시글이 존재하지 않을 경우
     */
    @Transactional(readOnly = true)
    public Post findByIdOrThrow(Long postId) {
        return postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
    }

    /**
     * 게시글의 소유권을 확인합니다. 요청자가 게시글 작성자인지 검증합니다.
     *
     * @param postId 검증할 게시글 ID
     * @param memberId 요청자의 회원 ID
     * @return 검증된 게시글 엔티티
     * @throws PostNotFoundException 게시글이 존재하지 않을 경우
     * @throws NoPostAuthorityException 게시글 소유권이 없을 경우
     */
    @Transactional(readOnly = true)
    public Post validatePostOwnershipAndGet(Long postId, Long memberId) {
        Post post = findByIdOrThrow(postId);
        if (!Objects.equals(post.getMemberId(), memberId)) {
            throw new NoPostAuthorityException(postId, memberId);
        }
        return post;
    }

    /**
     * 게시글에 태그를 저장합니다. 태그가 설정되지 않은 경우 기본 태그인 "UNCATEGORIZED"로 설정합니다.
     *
     * @param post 태그를 저장할 게시글 엔티티
     * @param tagNames 저장할 태그 이름 목록
     */
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
    
    /**
     * 키워드로 게시글을 검색합니다.
     * 검색 타입에 따라 제목, 내용 또는 전체에서 검색할 수 있습니다.
     *
     * @param keyword 검색 키워드
     * @param searchType 검색 타입 (TITLE, CONTENT, ALL)
     * @param pageable 페이징 정보
     * @return 검색된 게시글 목록과 페이징 정보를 담은 응답 DTO
     */
    @Transactional(readOnly = true)
    public PostListResponseDto searchPosts(String keyword, String searchType, Pageable pageable) {
        Page<Post> postPage;

        // 검색 타입에 따라 다른 메서드 호출
        switch (searchType.toUpperCase()) {
            case "TITLE" -> postPage = postRepository
                    .searchByTitle(keyword, pageable);

            case "CONTENT" -> postPage = postRepository
                    .searchByContent(keyword, pageable);

            default -> postPage = postRepository
                    .searchByTitleOrContent(keyword, keyword, pageable);
        }

        return buildPostListResponse(postPage);
    }

    /**
     * 키워드와 태그로 게시글을 검색합니다.
     * 태그가 없는 경우 키워드만으로 검색합니다.
     *
     * @param keyword 검색 키워드
     * @param tags 필터링할 태그 이름 목록
     * @param searchType 검색 타입 (TITLE, CONTENT, ALL)
     * @param pageable 페이징 정보
     * @return 검색된 게시글 목록과 페이징 정보를 담은 응답 DTO
     */
    @Transactional(readOnly = true)
    public PostListResponseDto searchPostsWithTags(String keyword, List<String> tags, String searchType, Pageable pageable) {
        // 태그 ID 목록 조회
        List<Long> tagIds = tags.stream()
                .map(tagService::findByNameOrThrow)
                .map(Tag::getId)
                .toList();

        // 해당 태그를 가진 게시글 ID 목록 조회
        List<Long> postIds = postTagRepository.findByTagIdIn(tagIds).stream()
                .map(PostTag::getPostId)
                .distinct()
                .toList();

        // 게시글 ID 목록이 비어있으면 빈 결과 반환
        if (postIds.isEmpty()) {
            Page<Post> emptyPage = new PageImpl<>(List.of(), pageable, 0);
            return buildPostListResponse(emptyPage);
        }

        // 검색 타입과 태그로 필터링된 게시글 ID 목록으로 검색
        Page<Post> postPage;
        switch (searchType.toUpperCase()) {
            case "TITLE" -> postPage = postRepository
                    .searchByTitleInIds(postIds, keyword, pageable);
            case "CONTENT" -> postPage = postRepository
                    .searchByContentInIds(postIds, keyword, pageable);
            default -> postPage = postRepository
                    .searchByTitleOrContentInIds(postIds, keyword, postIds, keyword, pageable);
        }

        return buildPostListResponse(postPage);
    }

    /**
     * 게시글 ID로 연관된 태그 이름 목록을 추출합니다.
     *
     * @param postId 태그를 추출할 게시글 ID
     * @return 태그 이름 목록
     */
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

    /**
     * 게시글의 작성자 정보를 조회합니다. 작성자가 존재하지 않으면 예외를 발생시킵니다.
     *
     * @param post 작성자를 조회할 게시글 엔티티
     * @return 조회된 회원 엔티티
     * @throws MemberNotFoundException 회원이 존재하지 않을 경우
     */
    private Member findMemberOrThrow(Post post) {
        return memberRepository.findById(post.getMemberId())
                .orElseThrow(() -> new MemberNotFoundException(
                        String.format("MemberId [%d] : 회원 정보를 찾을 수 없습니다.", post.getMemberId()))
                );
    }

    /**
     * 게시글 목록에 대한 응답 DTO를 구성합니다.
     * 게시글 목록과 관련된 회원 이름, 태그 정보, 댓글 개수를 매핑하여 응답 DTO를 생성합니다.
     *
     * @param postPage 게시글 페이지 정보
     * @return 게시글 목록과 페이징 정보를 담은 응답 DTO
     */
    private PostListResponseDto buildPostListResponse(Page<Post> postPage) {
        List<Post> posts = postPage.getContent();

        Map<Long, String> memberNameMap = fetchMemberNameMap(posts);  // memberId -> memberName
        Map<Long, List<Long>> postTagMap = fetchPostTagMap(posts);  // postId -> List<TagId>
        Map<Long, String> tagNameMap = fetchTagNameMap(postTagMap);  // tagId → tagName
        Map<Long, Long> commentCountMap = fetchCommentCountMap(posts);  // postId -> commentCount

        List<PostSummaryDto> summaries = posts.stream()
                .map(post -> buildPostSummaryDto(post, memberNameMap, postTagMap, tagNameMap, commentCountMap))
                .toList();

        return PostDtoConverter.toListResponseDto(summaries, postPage);
    }

    /**
     * 게시글 요약 DTO를 구성합니다.
     * 게시글 정보와 작성자 이름, 태그 이름 목록, 댓글 개수를 포함한 DTO를 생성합니다.
     *
     * @param post 게시글 엔티티
     * @param memberNameMap 회원 ID와 이름을 매핑한 맵
     * @param postTagMap 게시글 ID와 태그 ID 목록을 매핑한 맵
     * @param tagNameMap 태그 ID와 이름을 매핑한 맵
     * @param commentCountMap 게시글 ID와 댓글 개수를 매핑한 맵
     * @return 게시글 요약 정보를 담은 DTO
     */
    private PostSummaryDto buildPostSummaryDto(
            Post post,
            Map<Long, String> memberNameMap,
            Map<Long, List<Long>> postTagMap,
            Map<Long, String> tagNameMap,
            Map<Long, Long> commentCountMap
    ){
        String memberName = memberNameMap.get(post.getMemberId());
        List<String> tagNames = postTagMap.getOrDefault(post.getId(), Collections.emptyList()).stream()
                .map(tagNameMap::get)
                .filter(Objects::nonNull)
                .toList();
        Long commentCount = commentCountMap.getOrDefault(post.getId(), 0L);

        String imageUrl = null;
        List<String> imageUrlList = post.getImageUrlList();
        if(imageUrlList != null && !imageUrlList.isEmpty()) {
            imageUrl = imageUrlList.get(0);
        }

        return PostDtoConverter.toSummaryDto(post, memberName, tagNames, commentCount, imageUrl);
    }

    /**
     * 게시글 목록에 포함된 회원 ID에 해당하는 회원 이름 맵을 조회합니다.
     *
     * @param posts 게시글 목록
     * @return 회원 ID를 키로, 회원 이름을 값으로 하는 맵
     */
    private Map<Long, String> fetchMemberNameMap(List<Post> posts) {
        List<Long> memberIds = posts.stream()
                                .map(Post::getMemberId)
                                .distinct()
                                .toList();
        return memberRepository.findAllById(memberIds).stream()
            .collect(Collectors.toMap(Member::getMemberId, Member::getMemberName));
    }

    /**
     * 게시글 목록에 포함된 게시글 ID에 해당하는 태그 ID 목록 맵을 조회합니다.
     *
     * @param posts 게시글 목록
     * @return 게시글 ID를 키로, 태그 ID 목록을 값으로 하는 맵
     */
    private Map<Long, List<Long>> fetchPostTagMap(List<Post> posts) {
        List<Long> postIds = posts.stream().map(Post::getId).toList();
        return postTagRepository.findByPostIdIn(postIds).stream()
            .collect(Collectors.groupingBy(
                    PostTag::getPostId,
                    Collectors.mapping(PostTag::getTagId, Collectors.toList())
            ));
    }

    /**
     * 태그 ID에 해당하는 태그 이름 맵을 조회합니다.
     *
     * @param postTagMap 게시글 ID와 태그 ID 목록을 매핑한 맵
     * @return 태그 ID를 키로, 태그 이름을 값으로 하는 맵
     */
    private Map<Long, String> fetchTagNameMap(Map<Long, List<Long>> postTagMap) {
        List<Long> tagIds = postTagMap.values().stream()
                                  .flatMap(Collection::stream)
                                  .distinct()
                                  .toList();
        return tagRepository.findAllById(tagIds).stream()
            .collect(Collectors.toMap(Tag::getId, Tag::getName));
    }

    /**
     * 게시글 목록에 포함된 게시글 ID에 해당하는 댓글 개수 맵을 조회합니다.
     *
     * @param posts 게시글 목록
     * @return 게시글 ID를 키로, 댓글 개수를 값으로 하는 맵
     */
    private Map<Long, Long> fetchCommentCountMap(List<Post> posts) {
        List<Long> postIds = posts.stream().map(Post::getId).toList();
        
        if (postIds.isEmpty()) {
            return Collections.emptyMap();
        }
        
        return commentRepository.countByPostIdIn(postIds).stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0],  // postId
                        result -> (Long) result[1]   // count
                ));
    }
}