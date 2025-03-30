package com.virtukch.nest.tag.service;

import com.virtukch.nest.tag.dto.TagListResponseDto;
import com.virtukch.nest.tag.dto.TagResponseDto;
import com.virtukch.nest.tag.exception.TagNotFoundException;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public TagListResponseDto getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        List<TagResponseDto> tagResponseDtos = tags.stream()
                .map(tag -> TagResponseDto.builder()
                        .tagId(tag.getId())
                        .tagName(tag.getName())
                        .postCount(tag.getPostTags().size()).build()
                ).toList();

        return TagListResponseDto.builder()
                .tags(tagResponseDtos)
                .tagCount(tags.size())
                .build();
    }

    @Transactional
    public Tag findOrCreateTag(String tagName) {
        Optional<Tag> existingTag = tagRepository.findByName(tagName);
        return existingTag.orElseGet(() -> tagRepository.save(new Tag(tagName)));
    }

    @Transactional(readOnly = true)
    public Tag findByNameOrThrow(String tagName) {
        Optional<Tag> existingTag = tagRepository.findByName(tagName);
        return existingTag.orElseThrow(() -> new TagNotFoundException("존재하지 않는 태그입니다 : " + tagName));
    }
}
