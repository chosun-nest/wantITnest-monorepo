package com.virtukch.nest.tag.controller;

import com.virtukch.nest.tag.dto.TagResponseDto;
import com.virtukch.nest.tag.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagResponseDto>> getTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }
}
