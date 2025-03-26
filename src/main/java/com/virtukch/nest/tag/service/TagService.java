package com.virtukch.nest.tag.service;

import com.virtukch.nest.tag.dto.TagListResponseDto;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public List<TagListResponseDto> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        List<TagListResponseDto> tagResponseDtos = new ArrayList<>();
        for (Tag tag : tags) {
            tagResponseDtos.add(new TagListResponseDto(tag.getId(), tag.getName(), tag.getPostTags().size()));
        }
        return tagResponseDtos;
    }

    @Transactional
    public Tag findOrCreateTag(String tagName) {
        // 태그 이름으로 태그가 이미 존재하는지 조회
        Optional<Tag> existingTag = tagRepository.findByName(tagName);
        return existingTag.orElseGet(() -> tagRepository.save(new Tag(tagName)));
    }
}
