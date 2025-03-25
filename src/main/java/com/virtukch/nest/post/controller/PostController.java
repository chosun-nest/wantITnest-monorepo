package com.virtukch.nest.post.controller;

import com.virtukch.nest.post.dto.NewPostRequestDto;
import com.virtukch.nest.post.dto.NewPostResponseDto;
import com.virtukch.nest.post.service.PostService;
import com.virtukch.nest.tag.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final TagService tagService;

    @GetMapping("/api/posts/new")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> checkPostWriteAccess() {
        return ResponseEntity.ok().build();
    }


    // TODO
    @PostMapping("/api/posts/new")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NewPostResponseDto> savePost(@AuthenticationPrincipal Long memberId,
                                                       NewPostRequestDto newPostRequestDto) {
        return ResponseEntity.ok(new NewPostResponseDto());
    }
}
