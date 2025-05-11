package com.virtukch.nest.tag_favorite.service;

import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.service.TagService;
import com.virtukch.nest.tag_favorite.dto.FavoriteTagListResponseDto;
import com.virtukch.nest.tag_favorite.dto.FavoriteTagResponseDto;
import com.virtukch.nest.tag_favorite.model.TagFavorite;
import com.virtukch.nest.tag_favorite.repository.TagFavoriteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagFavoriteService {

    private final TagFavoriteRepository tagFavoriteRepository;
    private final MemberRepository memberRepository;
    private final TagService tagService;

    /**
     * 회원 ID로 관심 태그 목록 조회
     * @param memberId 회원 ID
     * @return 관심 태그 목록
     */
    @Transactional(readOnly = true)
    public FavoriteTagListResponseDto getFavoriteTagsByMemberId(Long memberId) {
        log.info("[TagFavoriteService] 회원 ID: {}의 관심 태그 조회 시작", memberId);

        List<TagFavorite> favorites = tagFavoriteRepository.findByMemberId(memberId);

        List<FavoriteTagResponseDto> responseDtoList = favorites.stream()
                .map(favorite -> {
                    Tag tag = tagService.findByIdOrThrow(favorite.getTagId());
                    return FavoriteTagResponseDto.builder()
                            .tagId(tag.getId())
                            .tagName(tag.getName())
                            .build();
                })
                .collect(Collectors.toList());

        log.info("[TagFavoriteService] 회원 ID: {}의 관심 태그 {}개 조회 완료", memberId, responseDtoList.size());

        String memberName = memberRepository.findById(memberId).get().getMemberName();

        return FavoriteTagListResponseDto.builder()
                .memberId(memberId)
                .memberName(memberName)
                .favoriteTags(responseDtoList)
                .build();
    }

    /**
     * 관심 태그 추가
     * @param memberId 회원 ID
     * @param tagName 태그 이름
     */
    @Transactional
    public void addFavoriteTag(Long memberId, String tagName) {
        log.info("[TagFavoriteService] 회원 ID: {}, 태그 이름: {} 관심 태그 추가 시작", memberId, tagName);

        Tag tag = tagService.findByNameOrThrow(tagName);
        Long tagId = tag.getId();

        // 이미 관심 태그로 등록되어 있는지 확인
        Optional<TagFavorite> existingFavorite = tagFavoriteRepository.findByMemberIdAndTagId(memberId, tagId);

        if (existingFavorite.isPresent()) {
            log.info("[TagFavoriteService] 회원 ID: {}, 태그 ID: {} 이미 관심 태그로 등록되어 있습니다", memberId, tagId);
            return;
        }

        // 관심 태그로 등록
        TagFavorite tagFavorite = TagFavorite.builder()
                .memberId(memberId)
                .tagId(tagId)
                .build();

        tagFavoriteRepository.save(tagFavorite);
        log.info("[TagFavoriteService] 회원 ID: {}, 태그 ID: {} 관심 태그 추가 완료", memberId, tagId);
    }

    /**
     * 관심 태그 삭제
     * @param memberId 회원 ID
     * @param tagName 태그 이름
     */
    @Transactional
    public void removeFavoriteTag(Long memberId, String tagName) {
        log.info("[TagFavoriteService] 회원 ID: {}, 태그 이름: {} 관심 태그 삭제 시작", memberId, tagName);

        Tag tag = tagService.findByNameOrThrow(tagName);
        Long tagId = tag.getId();

        // 관심 태그 삭제
        tagFavoriteRepository.deleteByMemberIdAndTagId(memberId, tagId);

        log.info("[TagFavoriteService] 회원 ID: {}, 태그 ID: {} 관심 태그 삭제 완료", memberId, tagId);
    }

    /**
     * 관심 태그 여부 확인
     * @param memberId 회원 ID
     * @param tagName 태그 이름
     * @return 관심 태그 여부
     */
    @Transactional(readOnly = true)
    public boolean isFavoriteTag(Long memberId, String tagName) {
        log.info("[TagFavoriteService] 회원 ID: {}, 태그 이름: {} 관심 태그 여부 확인", memberId, tagName);

        Tag tag = tagService.findByNameOrThrow(tagName);
        Long tagId = tag.getId();

        return tagFavoriteRepository.findByMemberIdAndTagId(memberId, tagId).isPresent();
    }
}