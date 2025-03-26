package com.virtukch.nest.post.service;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.post.dto.PostCreateRequestDto;
import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.post.repository.PostRepository;
import com.virtukch.nest.postTag.model.PostTag;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.service.TagService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    private final TagService tagService;

    @Transactional
    public Long savePost(Long memberId, PostCreateRequestDto postCreateRequestDto) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Post post = Post.builder().member(member)
                .title(postCreateRequestDto.getTitle())
                .content(postCreateRequestDto.getContent())
                .build();

        for (String tagName : postCreateRequestDto.getTags()) {
            Tag tag = tagService.findOrCreateTag(tagName);
            PostTag postTag = new PostTag(post, tag);
            post.addPostTag(postTag);
        }

        return postRepository.save(post).getId();
    }
}
