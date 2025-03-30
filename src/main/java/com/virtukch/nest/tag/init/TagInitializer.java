package com.virtukch.nest.tag.init;

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
                new Tag("JAVA"),
                new Tag("SPRING"),
                new Tag("웹개발"),
                new Tag("유니티"),
                new Tag("React"),
                new Tag("TypeScript"),
                new Tag("MySQL"),
                new Tag("데이터베이스"),
                new Tag("알고리즘"),
                new Tag("CS기초")
        );

        tagRepository.saveAll(defaultTags);

        log.info("✅ [TagInitializer] 태그 10개 자동 등록 완료");
    }
}