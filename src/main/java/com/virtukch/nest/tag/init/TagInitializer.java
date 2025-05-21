package com.virtukch.nest.tag.init;

import com.virtukch.nest.tag.model.Category;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class TagInitializer implements CommandLineRunner {

    private final TagRepository tagRepository;

    @Override
    public void run(String... args) {
        if (tagRepository.count() > 0) return;

        List<Tag> defaultTags = List.of(
                new Tag(Category.UNCATEGORIZED, "UNCATEGORIZED", "uncategorized"),
                new Tag(Category.PROGRAMMING, "JAVA", "java"),
                new Tag(Category.PROGRAMMING, "SPRING", "spring"),
                new Tag(Category.WEB_DEVELOPMENT, "웹개발", "web-development"),
                new Tag(Category.GAME_DEVELOPMENT, "유니티", "unity"),
                new Tag(Category.WEB_DEVELOPMENT, "React", "react"),
                new Tag(Category.PROGRAMMING, "TypeScript", "typescript"),
                new Tag(Category.DATABASE, "MySQL", "mysql"),
                new Tag(Category.DATABASE, "데이터베이스", "database"),
                new Tag(Category.COMPUTER_SCIENCE, "알고리즘", "algorithm"),
                new Tag(Category.COMPUTER_SCIENCE, "CS기초", "cs-basics")
        );

        tagRepository.saveAll(defaultTags);

        log.info("✅ [TagInitializer] 태그 {}개 자동 등록 완료", defaultTags.size());
    }
}