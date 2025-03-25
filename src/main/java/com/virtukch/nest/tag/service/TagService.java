package com.virtukch.nest.tag.service;

import com.virtukch.nest.tag.dto.TagListResponseDto;
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

    public List<TagListResponseDto> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        List<TagListResponseDto> tagResponseDtos = new ArrayList<>();
        for (Tag tag : tags) {
            tagResponseDtos.add(new TagListResponseDto(tag.getId(), tag.getName(), tag.getPostTags().size()));
        }
        return tagResponseDtos;
    }
}
