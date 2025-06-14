package com.virtukch.nest.comment.service;

import com.virtukch.nest.comment.dto.CommentDeleteResponseDto;
import com.virtukch.nest.comment.dto.CommentListResponseDto;
import com.virtukch.nest.comment.dto.CommentRequestDto;
import com.virtukch.nest.comment.dto.CommentResponseDto;
import com.virtukch.nest.comment.dto.converter.CommentDtoConverter;
import com.virtukch.nest.comment.exception.*;
import com.virtukch.nest.comment.model.BoardType;
import com.virtukch.nest.comment.model.Comment;
import com.virtukch.nest.comment.repository.CommentRepository;
import com.virtukch.nest.member.exception.MemberNotFoundException;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.post.exception.PostNotFoundException;
import com.virtukch.nest.post.repository.PostRepository;
import com.virtukch.nest.project.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;
    private final ProjectRepository projectRepository;

    /**
     * 게시글에 새로운 댓글을 작성하고, 저장 후 응답 DTO로 반환합니다.
     *
     * @param boardType  댓글을 작성한 게시판
     * @param postId     댓글을 작성할 게시글 ID
     * @param memberId   댓글을 작성한 사용자 ID
     * @param requestDto 댓글 내용이 담긴 요청 DTO
     * @return 작성된 댓글에 대한 응답 DTO
     */
    @Transactional
    public CommentResponseDto createComment(BoardType boardType, Long postId, Long memberId, CommentRequestDto requestDto) {
        validatePostExistence(boardType, postId);
        Comment comment = Comment.createComment(boardType, postId, memberId, requestDto.getContent());
        return saveAndConvert(comment, memberId);
    }

    /**
     * 기존 댓글(parentId)에 대한 대댓글을 작성하고 저장한 후, 응답 DTO로 반환합니다.
     *
     * @param boardType  댓글을 작성한 게시판
     * @param postId     대댓글이 달릴 게시글 ID
     * @param parentId   부모 댓글 ID (대댓글 대상)
     * @param memberId   대댓글을 작성한 사용자 ID
     * @param requestDto 대댓글 내용이 담긴 요청 DTO
     * @return 작성된 대댓글에 대한 응답 DTO
     */
    @Transactional
    public CommentResponseDto createReply(BoardType boardType, Long postId, Long parentId, Long memberId, @Valid CommentRequestDto requestDto) {
        validatePostExistence(boardType, postId);

        Comment parentComment = commentRepository.findById(parentId)
                .orElseThrow(() -> new ParentCommentNotFoundException(parentId));

        // 부모 댓글이 같은 게시글에 속하는지 검증
        if (!Objects.equals(parentComment.getPostId(), postId) ||
                !Objects.equals(parentComment.getBoardType(), boardType)) {
            throw new ParentCommentMismatchException(parentId, postId);
        }

        // 삭제된 댓글에는 대댓글 달 수 없음
        if (parentComment.isDeleted()) {
            throw new CannotReplyToDeletedCommentException(parentId);
        }

        Comment comment = Comment.createReply(boardType, postId, memberId, requestDto.getContent(), parentId);
        return saveAndConvert(comment, memberId);
    }

    private CommentResponseDto saveAndConvert(Comment comment, Long memberId) {
        Comment savedComment = commentRepository.save(comment);
        String memberName = findMemberOrThrow(memberId).getMemberName();
        return CommentDtoConverter.toResponseDto(savedComment, memberName);
    }

    /**
     * 특정 게시글의 댓글 목록을 트리 구조로 조회합니다. (최상위 댓글 기준 페이징)
     * <p>
     * - 최상위 댓글만 페이징하고, 해당 댓글들의 모든 대댓글을 함께 조회합니다.<br>
     * - 대댓글의 대댓글도 최상위 댓글의 children에 평면적으로 포함됩니다.<br>
     * - 각 페이지에서 댓글-대댓글 관계가 끊어지지 않도록 보장합니다.<br>
     * - 댓글 작성자의 이름은 memberId 기반으로 조회하여 매핑합니다.
     * </p>
     *
     * @param boardType 댓글을 조회할 대상 게시글이 속한 게시판
     * @param postId    댓글을 조회할 대상 게시글의 ID
     * @param pageable  페이징 정보 (최상위 댓글 기준)
     * @return {@link CommentListResponseDto} 트리 구조로 구성된 댓글 목록 DTO
     */
    @Transactional(readOnly = true)
    public CommentListResponseDto getCommentList(BoardType boardType, Long postId, Pageable pageable) {
        validatePostExistence(boardType, postId);

        // 1. 최상위 댓글만 페이징 조회
        Page<Comment> rootCommentsPage = commentRepository.findRootCommentsPaged(boardType, postId, pageable);
        List<Comment> rootComments = rootCommentsPage.getContent();
        if (rootComments.isEmpty()) {
            return CommentDtoConverter.toCommentList(List.of(), rootCommentsPage);
        }

        // 2. 해당 최상위 댓글들의 모든 대댓글을 재귀적으로 조회
        List<Comment> allComments = new ArrayList<>(rootComments);
        List<Comment> allReplies = findAllRepliesRecursively(boardType, postId, rootComments);
        allComments.addAll(allReplies);

        // 3. 멤버 이름 매핑
        Map<Long, String> memberNameMap = memberRepository.findAllById(
                allComments.stream().map(Comment::getMemberId).distinct().toList()
        ).stream().collect(Collectors.toMap(Member::getMemberId, Member::getMemberName));

        // 4. DTO 변환
        Map<Long, CommentResponseDto> responseMap = new LinkedHashMap<>();
        for (Comment comment : allComments) {
            String authorName = memberNameMap.get(comment.getMemberId());
            CommentResponseDto dto = CommentDtoConverter.toResponseDto(comment, authorName);
            responseMap.put(comment.getCommentId(), dto);
        }

        // 5. 트리 구조 생성 (최상위 댓글들만 root로 사용)
        List<CommentResponseDto> rootCommentsDto = buildOptimizedTreeStructure(rootComments, allComments, responseMap);

        return CommentDtoConverter.toCommentList(rootCommentsDto, rootCommentsPage);
    }

    /**
     * 주어진 최상위 댓글들의 모든 대댓글을 재귀적으로 조회합니다.
     */
    private List<Comment> findAllRepliesRecursively(BoardType boardType, Long postId, List<Comment> parentComments) {
        List<Comment> allReplies = new ArrayList<>();
        List<Long> currentParentIds = parentComments.stream()
                .map(Comment::getCommentId)
                .toList();

        while (!currentParentIds.isEmpty()) {
            // 현재 부모들의 직접 대댓글들 조회
            List<Comment> directReplies = commentRepository.findDirectRepliesByParentIds(boardType, postId, currentParentIds);

            if (directReplies.isEmpty()) {
                break; // 더 이상 대댓글이 없으면 종료
            }

            allReplies.addAll(directReplies);

            // 다음 레벨의 부모 ID들 (대댓글의 대댓글을 찾기 위해)
            currentParentIds = directReplies.stream()
                    .map(Comment::getCommentId)
                    .toList();
        }

        return allReplies;
    }

    /**
     * 최상위 댓글들과 그들의 모든 대댓글로 최적화된 트리 구조를 생성합니다.
     */
    private List<CommentResponseDto> buildOptimizedTreeStructure(
            List<Comment> rootComments,
            List<Comment> allComments,
            Map<Long, CommentResponseDto> responseMap) {

        List<CommentResponseDto> result = new ArrayList<>();

        // 성능 최적화를 위해 commentMap과 rootMapping을 미리 계산
        Map<Long, Long> commentToRootMap = calculateRootParentMapping(allComments);

        Set<Long> rootCommentIds = rootComments.stream()
                .map(Comment::getCommentId)
                .collect(Collectors.toSet());

        // 1. 최상위 댓글들을 결과에 추가
        for (Comment rootComment : rootComments) {
            result.add(responseMap.get(rootComment.getCommentId()));
        }

        // 2. 모든 대댓글을 해당하는 최상위 댓글의 children에 추가
        for (Comment comment : allComments) {
            if (comment.getParentId() != null) {
                Long rootParentId = commentToRootMap.get(comment.getCommentId());

                // 현재 페이지에 있는 최상위 댓글인지 확인
                if (rootCommentIds.contains(rootParentId)) {
                    CommentResponseDto rootParent = responseMap.get(rootParentId);
                    CommentResponseDto replyDto = responseMap.get(comment.getCommentId());

                    if (rootParent != null && replyDto != null) {
                        rootParent.getChildren().add(replyDto);
                    }
                }
            }
        }

        // 3. 각 최상위 댓글의 children을 작성시간순으로 정렬
        for (CommentResponseDto rootComment : result) {
            rootComment.getChildren().sort(Comparator.comparing(CommentResponseDto::getCreatedAt));
        }

        return result;
    }

    /**
     * 모든 댓글의 최상위 부모를 메모이제이션으로 효율적으로 계산합니다.
     */
    private Map<Long, Long> calculateRootParentMapping(List<Comment> allComments) {
        Map<Long, Comment> commentMap = allComments.stream()
                .collect(Collectors.toMap(Comment::getCommentId, c -> c));

        Map<Long, Long> rootMapping = new HashMap<>();

        for (Comment comment : allComments) {
            if (comment.getParentId() == null) {
                // 최상위 댓글은 자기 자신이 root
                rootMapping.put(comment.getCommentId(), comment.getCommentId());
            } else if (!rootMapping.containsKey(comment.getCommentId())) {
                // 대댓글은 부모 체인을 따라 최상위 찾기 (메모이제이션 활용)
                Long rootId = findRootParentIdWithMemo(comment, commentMap, rootMapping);
                rootMapping.put(comment.getCommentId(), rootId);
            }
        }

        return rootMapping;
    }

    /**
     * 메모이제이션을 활용한 최적화된 최상위 부모 찾기
     */
    private Long findRootParentIdWithMemo(Comment comment, Map<Long, Comment> commentMap, Map<Long, Long> memo) {
        // 이미 계산된 값이 있으면 재사용
        if (memo.containsKey(comment.getCommentId())) {
            return memo.get(comment.getCommentId());
        }

        Comment current = comment;
        List<Long> path = new ArrayList<>();

        while (current.getParentId() != null) {
            path.add(current.getCommentId());

            // 이미 계산된 부모가 있으면 사용
            if (memo.containsKey(current.getParentId())) {
                Long rootId = memo.get(current.getParentId());
                // 경로상의 모든 댓글들도 같은 root를 가짐
                for (Long commentId : path) {
                    memo.put(commentId, rootId);
                }
                return rootId;
            }

            current = commentMap.get(current.getParentId());
            if (current == null) break;
        }

        // 최상위에 도달
        Long rootId = current.getCommentId();

        // 경로상의 모든 댓글들을 메모에 저장
        for (Long commentId : path) {
            memo.put(commentId, rootId);
        }

        return rootId;
    }

    /**
     * 사용자가 작성한 댓글을 수정합니다.
     * <p>
     * - 댓글의 소유자인지 검증한 후 내용을 수정합니다.<br>
     * - 대댓글이 달린 댓글이라도 수정 가능하며, 제한 조건은 없습니다.<br>
     * - 수정 시점은 updatedAt 필드에 자동으로 반영됩니다.
     * </p>
     *
     * @param commentId  수정할 댓글의 ID
     * @param memberId   요청 사용자(댓글 작성자)의 ID
     * @param requestDto 수정할 댓글 내용을 담은 요청 DTO
     * @return 수정된 댓글 정보를 담은 {@link CommentResponseDto}
     * @throws NoCommentAuthorityException 댓글 소유자가 아닌 경우
     * @throws EntityNotFoundException     댓글 또는 사용자 정보가 존재하지 않는 경우
     */
    @Transactional
    public CommentResponseDto updateComment(Long commentId, Long memberId, CommentRequestDto requestDto) {
        Comment comment = validateCommentOwnershipAndGet(commentId, memberId);
        Member member = findMemberOrThrow(memberId);

        comment.update(requestDto.getContent());
        return CommentDtoConverter.toResponseDto(comment, member.getMemberName());
    }

    /**
     * 사용자가 작성한 댓글을 삭제합니다.
     * <p>
     * - 댓글의 소유자인지 검증한 후 삭제를 수행합니다.<br>
     * - 대댓글이 존재하는 경우 soft delete 방식으로 삭제 처리되며, 본문 내용은 "삭제된 댓글입니다."로 대체됩니다.<br>
     * - 대댓글이 없는 경우 실제 DB에서 삭제됩니다.
     * </p>
     *
     * @param commentId 삭제할 댓글의 ID
     * @param memberId  요청 사용자(댓글 작성자)의 ID
     * @return 삭제 결과 메시지를 포함한 {@link CommentDeleteResponseDto}
     * @throws NoCommentAuthorityException 댓글 소유자가 아닌 경우
     * @throws EntityNotFoundException     댓글 또는 사용자 정보가 존재하지 않는 경우
     */
    @Transactional
    public CommentDeleteResponseDto deleteComment(Long commentId, Long memberId) {
        Comment comment = validateCommentOwnershipAndGet(commentId, memberId);

        // 자식 대댓글 존재 여부 확인
        boolean hasChildren = commentRepository.existsByParentId(commentId);

        if (hasChildren) {
            // 대댓글이 달린 댓글 → soft delete
            comment.delete(); // isDeleted = true, content = "삭제된 댓글입니다."
        } else {
            Long parentId = comment.getParentId();
            commentRepository.delete(comment);

            if (parentId != null) {
                Comment parentComment = findByIdOrThrow(parentId);
                // 부모 댓글이 이미 삭제 되었고, 하위 대댓글이 존재하지 않으면 부모 댓글도 hard-delete
                if (parentComment.isDeleted() && !commentRepository.existsByParentId(parentId)) {
                    commentRepository.delete(parentComment);
                }
            }
        }

        return CommentDtoConverter.toDeleteResponseDto(comment);
    }

    private Comment validateCommentOwnershipAndGet(Long commentId, Long memberId) {
        Comment comment = findByIdOrThrow(commentId);
        if (!Objects.equals(comment.getMemberId(), memberId)) {
            throw new NoCommentAuthorityException(commentId, memberId);
        }
        return comment;
    }

    private void validatePostExistence(BoardType boardType, Long postId) {
        switch (boardType) {
            case INTEREST -> {
                if (!postRepository.existsById(postId)) {
                    throw new PostNotFoundException(boardType, postId);
                }
            }
            case PROJECT -> {
                if (!projectRepository.existsById(postId)) {
                    throw new PostNotFoundException(boardType, postId);
                }
            }
            default -> throw new InvalidBoardTypeException(boardType);
        }
    }

    public Comment findByIdOrThrow(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));
    }

    private Member findMemberOrThrow(Long memberId) {
        String msg = String.format("MemberId [%d] : 회원 정보를 찾을 수 없습니다.", memberId);
        return memberRepository.findById(memberId).orElseThrow(() -> new MemberNotFoundException(msg));
    }
}
