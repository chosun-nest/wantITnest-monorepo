package com.virtukch.nest.tag.service;

import com.virtukch.nest.tag.dto.TagResponseDto;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public List<TagResponseDto> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        List<TagResponseDto> tagResponseDtos = new ArrayList<>();
        for (Tag tag : tags) {
            tagResponseDtos.add(new TagResponseDto(tag.getId(), tag.getName(), tag.getPostTags().size()));
        }
        return tagResponseDtos;
    }
}
