package com.virtukch.nest.comment.service;

import com.virtukch.nest.comment.dto.CommentDeleteResponseDto;
import com.virtukch.nest.comment.dto.CommentListResponseDto;
import com.virtukch.nest.comment.dto.CommentRequestDto;
import com.virtukch.nest.comment.dto.CommentResponseDto;
import com.virtukch.nest.comment.dto.converter.CommentDtoConverter;
import com.virtukch.nest.comment.exception.CommentNotFoundException;
import com.virtukch.nest.comment.exception.NoCommentAuthorityException;
import com.virtukch.nest.comment.model.BoardType;
import com.virtukch.nest.comment.model.Comment;
import com.virtukch.nest.comment.repository.CommentRepository;
import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.post.repository.PostRepository;
import com.virtukch.nest.project.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
     * @param boardType     댓글을 작성한 게시판
     * @param postId       댓글을 작성할 게시글 ID
     * @param memberId      댓글을 작성한 사용자 ID
     * @param requestDto    댓글 내용이 담긴 요청 DTO
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
     * @param boardType     댓글을 작성한 게시판
     * @param postId     대댓글이 달릴 게시글 ID
     * @param parentId   부모 댓글 ID (대댓글 대상)
     * @param memberId   대댓글을 작성한 사용자 ID
     * @param requestDto 대댓글 내용이 담긴 요청 DTO
     * @return 작성된 대댓글에 대한 응답 DTO
     */
    @Transactional
    public CommentResponseDto createReply(BoardType boardType, Long postId, Long parentId, Long memberId, @Valid CommentRequestDto requestDto) {
        validatePostExistence(boardType, postId);
        Comment comment = Comment.createReply(boardType, postId, memberId, requestDto.getContent(), parentId);
        return saveAndConvert(comment, memberId);
    }

    private CommentResponseDto saveAndConvert(Comment comment, Long memberId) {
        Comment savedComment = commentRepository.save(comment);
        String memberName = findMemberOrThrow(memberId).getMemberName();
        return CommentDtoConverter.toResponseDto(savedComment, memberName);
    }

    /**
     * 특정 게시글의 댓글 목록을 계층 구조로 조회합니다.
     * <p>
     * - 대댓글 기능을 포함한 트리 구조로 응답을 구성합니다.<br>
     * - 댓글 작성자의 이름은 memberId 기반으로 조회하여 매핑합니다.<br>
     * - 댓글은 작성일 기준 오름차순으로 정렬되며, 자식 댓글은 부모 댓글 하위에 포함됩니다.
     * </p>
     *
     * @param boardType 댓글을 조회할 대상 게시글이 속한 게시판
     * @param postId 댓글을 조회할 대상 게시글의 ID
     * @return {@link CommentListResponseDto} 트리 구조로 구성된 댓글 목록 DTO
     */
    @Transactional(readOnly = true)
    public CommentListResponseDto getCommentList(BoardType boardType, Long postId) {
        validatePostExistence(boardType, postId);

        List<Comment> comments = commentRepository.findByBoardTypeAndPostIdOrderByCreatedAtAsc(boardType, postId);

        Map<Long, String> memberNameMap = memberRepository.findAllById(
                comments.stream().map(Comment::getMemberId).distinct().toList()
        ).stream().collect(Collectors.toMap(Member::getMemberId, Member::getMemberName));

        Map<Long, CommentResponseDto> responseMap = new LinkedHashMap<>();

        for (Comment comment : comments) {
            String authorName = memberNameMap.get(comment.getMemberId());
            CommentResponseDto dto = CommentDtoConverter.toResponseDto(comment, authorName);
            responseMap.put(comment.getCommentId(), dto);
        }

        List<CommentResponseDto> rootComments = new ArrayList<>();

        for (Comment comment : comments) {
            CommentResponseDto dto = responseMap.get(comment.getCommentId());
            Long parentId = comment.getParentId();

            if (parentId == null) {
                rootComments.add(dto);
            } else {
                CommentResponseDto parentDto = responseMap.get(parentId);
                if (parentDto != null) {
                    parentDto.getChildren().add(dto);
                }
            }
        }

        // 자식 댓글들을 작성일 기준 오름차순으로 정렬
        Comparator<CommentResponseDto> byCreatedAt = Comparator.comparing(CommentResponseDto::getCreatedAt);
        for (CommentResponseDto parent : responseMap.values()) {
            parent.getChildren().sort(byCreatedAt);
        }

        return CommentDtoConverter.toCommentList(rootComments);
    }

    /**
     * 사용자가 작성한 댓글을 수정합니다.
     * <p>
     * - 댓글의 소유자인지 검증한 후 내용을 수정합니다.<br>
     * - 대댓글이 달린 댓글이라도 수정 가능하며, 제한 조건은 없습니다.<br>
     * - 수정 시점은 updatedAt 필드에 자동으로 반영됩니다.
     * </p>
     *
     * @param commentId 수정할 댓글의 ID
     * @param memberId  요청 사용자(댓글 작성자)의 ID
     * @param requestDto 수정할 댓글 내용을 담은 요청 DTO
     * @return 수정된 댓글 정보를 담은 {@link CommentResponseDto}
     *
     * @throws NoCommentAuthorityException 댓글 소유자가 아닌 경우
     * @throws EntityNotFoundException 댓글 또는 사용자 정보가 존재하지 않는 경우
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
     *
     * @throws NoCommentAuthorityException 댓글 소유자가 아닌 경우
     * @throws EntityNotFoundException 댓글 또는 사용자 정보가 존재하지 않는 경우
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
            // 대댓글이 없는 경우 → 물리 삭제
            commentRepository.delete(comment);
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
            case TOPIC -> {
                if (!postRepository.existsById(postId)) {
                    throw new EntityNotFoundException("[관심분야 정보 게시판] 해당 게시글을 찾을 수 없습니다. postId = " + postId);
                }
            }
            case PROJECT -> {
                if (!projectRepository.existsById(postId)) {
                    throw new EntityNotFoundException("[프로젝트 모집 게시판] 해당 게시글을 찾을 수 없습니다. postId = " + postId);
                }
            }
            default -> throw new IllegalArgumentException("지원하지 않는 게시판 타입입니다: " + boardType);
        }
    }

    private Comment findByIdOrThrow(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));
    }

    private Member findMemberOrThrow(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
