package com.virtukch.nest.tag.service;

import com.virtukch.nest.post_tag.repository.PostTagRepository;
import com.virtukch.nest.tag.dto.TagListResponseDto;
import com.virtukch.nest.tag.dto.TagResponseDto;
import com.virtukch.nest.tag.exception.TagNotFoundException;
import com.virtukch.nest.tag.model.Category;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final PostTagRepository postTagRepository;

    @Transactional(readOnly = true)
    public TagListResponseDto getAllTags() {
        log.info("[TagService] 전체 태그 조회 시작");
        List<Tag> tags = tagRepository.findAll();
        log.info("[TagService] 조회된 태그 수: {}", tags.size());
        return buildTagListResponseDto(tags);
    }

    @Transactional(readOnly = true)
    public TagListResponseDto getTagsByCategory(Category category) {
        log.info("[TagService] 카테고리별 태그 조회: {}", category);
        List<Tag> tags = tagRepository.findByCategory(category);
        return buildTagListResponseDto(tags);
    }

    @Transactional(readOnly = true)
    public TagResponseDto getTagByName(String tagName) {
        log.info("[TagService] 태그 이름으로 조회: {}", tagName);
        Tag tag = findByNameOrThrow(tagName);
        return buildTagResponseDto(tag);
    }

    private TagResponseDto buildTagResponseDto(Tag tag) {
        return TagResponseDto.builder()
                .tagId(tag.getId())
                .tagName(tag.getName())
                .category(tag.getCategory())
                .categoryDisplayName(tag.getCategory().getDisplayName())
                .postCount(postTagRepository.findAllByTagId(tag.getId()).size())
                .build();
    }

    private TagListResponseDto buildTagListResponseDto(List<Tag> tags) {
        List<TagResponseDto> tagSummaries = tags.stream().map(this::buildTagResponseDto).toList();
        return TagListResponseDto.builder()
                .tags(tagSummaries)
                .tagCount(tags.size())
                .build();
    }

    @Transactional(readOnly = true)
    public Tag findByNameOrThrow(String tagName) {
        log.info("[TagService] 태그 검색 요청: {}", tagName);
        Optional<Tag> existingTag = tagRepository.findByName(tagName);
        return existingTag.orElseThrow(() -> {
            log.warn("[TagService] 태그 없음: {}", tagName);
            return new TagNotFoundException(tagName);
        });
    }

    @Transactional
    public Tag findOrCreateTag(Category category, String tagName) {
        Optional<Tag> existingTag = tagRepository.findByName(tagName);
        return existingTag.orElseGet(() -> tagRepository.save(new Tag(category, tagName)));
    }

    @Transactional(readOnly = true)
    public Tag findByIdOrThrow(Long tagId) {
        return tagRepository.findById(tagId).orElseThrow(() -> new TagNotFoundException(tagId));
    }
}
