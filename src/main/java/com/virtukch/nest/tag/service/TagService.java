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
        List<Tag> tags = tagRepository.findAll();
        return buildTagListResponseDto(tags);
    }

    @Transactional(readOnly = true)
    public TagListResponseDto getTagsByCategory(String categoryPathName) {
        Category category = Category.findByPathName(categoryPathName);
        List<Tag> tags = tagRepository.findByCategory(category);
        return buildTagListResponseDto(tags);
    }

    @Transactional(readOnly = true)
    public TagResponseDto getTagByPathName(String tagPathName) {
        Tag tag = findByPathNameOrThrow(tagPathName);
        return buildTagResponseDto(tag);
    }

    private TagResponseDto buildTagResponseDto(Tag tag) {
        return TagResponseDto.builder()
                .tagId(tag.getId())
                .tagName(tag.getName())
                .tagPathName(tag.getPathName())
                .category(tag.getCategory())
                .categoryDisplayName(tag.getCategory().getDisplayName())
                .categoryPathName(tag.getCategory().getPathName())
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
    public Tag findByPathNameOrThrow(String tagPathName) {
        log.info("[TagService] 태그 경로명으로 검색 요청: {}", tagPathName);
        Optional<Tag> existingTag = tagRepository.findByPathName(tagPathName);
        return existingTag.orElseThrow(() -> {
            log.warn("[TagService] 태그 없음: {}", tagPathName);
            return new TagNotFoundException("경로명: " + tagPathName);
        });
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
