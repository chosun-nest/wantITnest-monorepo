package com.virtukch.nest.tag.config;

import com.virtukch.nest.tag.model.Category;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
@Order(2) // Member 다음에 실행 - Tag 생성
public class TagDataLoader implements ApplicationRunner {

    private final TagRepository tagRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (tagRepository.count() > 0) {
            log.info("태그 데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
            return;
        }

        log.info("🏷️ 태그 데이터 초기화를 시작합니다..." );

        List<Tag> allTags = new ArrayList<>();

        // 🖥️ 개발•프로그래밍 카테고리
        allTags.addAll(createDevelopmentTags());

        // 🤖 인공지능 카테고리
        allTags.addAll(createAiTags());

        // 🥼 데이터 사이언스 카테고리
        allTags.addAll(createDataScienceTags());

        // 🎮 게임 개발 카테고리
        allTags.addAll(createGameDevelopmentTags());

        // 🛡️ 보안•네트워크 카테고리
        allTags.addAll(createSecurityNetworkTags());

        // 💽 하드웨어 카테고리
        allTags.addAll(createHardwareTags());

        // 🎨 디자인•아트 카테고리
        allTags.addAll(createDesignArtTags());

        // 미분류 카테고리
        allTags.add(new Tag(Category.UNCATEGORIZED, "UNCATEGORIZED"));

        tagRepository.saveAll(allTags);

        log.info("✅ 태그 {}개 초기화 완료", allTags.size());
        log.info("카테고리별 태그 개수:");
        log.info("  🖥️ 개발•프로그래밍: {}개", createDevelopmentTags().size());
        log.info("  🤖 인공지능: {}개", createAiTags().size());
        log.info("  🥼 데이터 사이언스: {}개", createDataScienceTags().size());
        log.info("  🎮 게임 개발: {}개", createGameDevelopmentTags().size());
        log.info("  🛡️ 보안•네트워크: {}개", createSecurityNetworkTags().size());
        log.info("  💽 하드웨어: {}개", createHardwareTags().size());
        log.info("  🎨 디자인•아트: {}개", createDesignArtTags().size());
    }

    private List<Tag> createDevelopmentTags() {
        Category category = Category.DEVELOPMENT_PROGRAMMING;
        return List.of(
                new Tag(category, "풀스택"),
                new Tag(category, "웹개발"),
                new Tag(category, "프론트엔드"),
                new Tag(category, "백엔드"),
                new Tag(category, "모바일 앱 개발"),
                new Tag(category, "프로그래밍 언어"),
                new Tag(category, "알고리즘•자료구조"),
                new Tag(category, "데이터베이스"),
                new Tag(category, "데브옵스•인프라"),
                new Tag(category, "소프트웨어 테스트"),
                new Tag(category, "데스크톱 앱 개발"),
                new Tag(category, "VR/AR"),
                new Tag(category, "개발•프로그래밍 자격증"),
                new Tag(category, "개발•프로그래밍 기타")
        );
    }

    private List<Tag> createAiTags() {
        Category category = Category.ARTIFICIAL_INTELLIGENCE;
        return List.of(
                new Tag(category, "AI활용"),
                new Tag(category, "머신러닝•딥러닝"),
                new Tag(category, "컴퓨터 비전"),
                new Tag(category, "자연어 처리"),
                new Tag(category, "영상 처리"),
                new Tag(category, "음성 처리"),
                new Tag(category, "인공지능 기타")
        );
    }

    private List<Tag> createDataScienceTags() {
        Category category = Category.DATA_SCIENCE;
        return List.of(
                new Tag(category, "데이터 분석"),
                new Tag(category, "데이터 엔지니어링"),
                new Tag(category, "데이터 사이언스 자격증"),
                new Tag(category, "데이터 사이언스 기타")
        );
    }

    private List<Tag> createGameDevelopmentTags() {
        Category category = Category.GAME_DEVELOPMENT;
        return List.of(
                new Tag(category, "게임 프로그래밍"),
                new Tag(category, "게임 기획"),
                new Tag(category, "게임 아트•그래픽"),
                new Tag(category, "3D 모델링"),
                new Tag(category, "게임 개발 기타")
        );
    }

    private List<Tag> createSecurityNetworkTags() {
        Category category = Category.SECURITY_NETWORK;
        return List.of(
                new Tag(category, "보안"),
                new Tag(category, "사이버보안"),
                new Tag(category, "해킹"),
                new Tag(category, "네트워크"),
                new Tag(category, "시스템•운영체제"),
                new Tag(category, "클라우드"),
                new Tag(category, "블록체인"),
                new Tag(category, "보안•네트워크 자격증"),
                new Tag(category, "보안•네트워크 기타")
        );
    }

    private List<Tag> createHardwareTags() {
        Category category = Category.HARDWARE;
        return List.of(
                new Tag(category, "컴퓨터구조"),
                new Tag(category, "임베디드•IoT"),
                new Tag(category, "반도체"),
                new Tag(category, "로봇공학"),
                new Tag(category, "모빌리티"),
                new Tag(category, "하드웨어 자격증"),
                new Tag(category, "하드웨어 기타")
        );
    }

    private List<Tag> createDesignArtTags() {
        Category category = Category.DESIGN_ART;
        return List.of(
                new Tag(category, "CAD•3D 모델링"),
                new Tag(category, "UX/UI"),
                new Tag(category, "그래픽 디자인"),
                new Tag(category, "사진•영상"),
                new Tag(category, "사운드"),
                new Tag(category, "디자인 자격증"),
                new Tag(category, "디자인 기타")
        );
    }
}
