package com.virtukch.nest.post.config;

import com.virtukch.nest.comment.model.BoardType;
import com.virtukch.nest.comment.model.Comment;
import com.virtukch.nest.comment.repository.CommentRepository;
import com.virtukch.nest.member.repository.MemberRepository;
import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.post.repository.PostRepository;
import com.virtukch.nest.post_tag.model.PostTag;
import com.virtukch.nest.post_tag.repository.PostTagRepository;
import com.virtukch.nest.tag.model.Tag;
import com.virtukch.nest.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 애플리케이션 시작 시 게시글 테스트 데이터를 자동으로 삽입하는 컴포넌트
 * 개발 환경에서만 실행됩니다. (production 환경 제외)
 * <br>
 * production 환경으로 실행하려면 : java -jar app.jar --spring.profiles.active=prod
 */
@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!prod") // production 환경에서는 실행하지 않음
@Order(10) // 가장 나중에 실행 - Member와 Tag가 모두 준비된 후
public class PostTestDataLoader implements ApplicationRunner {

    private final MemberRepository memberRepository;
    private final TagRepository tagRepository;
    private final PostRepository postRepository;
    private final PostTagRepository postTagRepository;
    private final CommentRepository commentRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        // 게시글이 이미 있으면 삽입하지 않음
        if (postRepository.count() > 0) {
            log.info("게시글 테스트 데이터가 이미 존재합니다. 삽입을 건너뜁니다.");
            return;
        }

        log.info("📝 게시글 테스트 데이터 삽입을 시작합니다...");

        // 테스트 게시글 생성
        createTestPosts();
        
        // 테스트 댓글 생성
        createTestComments();

        log.info("✅ 게시글 테스트 데이터 삽입이 완료되었습니다!");
    }

    private void createTestPosts() {
        log.info("📝 테스트 게시글 생성 중...");
        
        // 게시글 데이터 배열
        Object[][] postData = {
            {1L, "Spring Boot 완전 정복하기", "Spring Boot를 이용한 웹 애플리케이션 개발의 모든 것을 알아보겠습니다. 프로젝트 구조부터 실제 배포까지 단계별로 설명하며, REST API 구현, JPA 활용, 보안 설정 등 실무에서 필요한 모든 기능을 다룹니다.", new String[]{"백엔드"}},
            {2L, "React Hook 완벽 가이드", "React Hook을 활용한 현대적인 React 개발 방법을 배워봅시다. useState, useEffect부터 커스텀 Hook 작성까지, 실제 프로젝트에서 활용할 수 있는 다양한 패턴과 베스트 프랙티스를 제공합니다.", new String[]{"React", "프론트엔드"}},
            {2L, "Python으로 시작하는 머신러닝", "Python과 scikit-learn을 이용한 머신러닝 입문 가이드입니다. 데이터 전처리부터 모델 훈련, 평가까지 전체 머신러닝 파이프라인을 실습을 통해 학습할 수 있습니다.", new String[]{"머신러닝", "AI활용"}},
            {1L, "데이터베이스 설계 원칙", "효율적인 데이터베이스 설계를 위한 핵심 원칙들을 정리했습니다. 정규화, 인덱스 설계, 성능 최적화 등 실무에서 반드시 알아야 할 데이터베이스 설계 노하우를 공유합니다.", new String[]{"데이터베이스", "백엔드"}},
            {1L, "Unity로 만드는 2D 게임", "Unity를 이용한 2D 게임 개발 튜토리얼입니다. 캐릭터 움직임, 충돌 처리, UI 구현 등 기본적인 게임 시스템을 구축하면서 Unity의 핵심 기능들을 학습할 수 있습니다.", new String[]{"게임 프로그래밍"}},
            {2L, "모던 CSS 레이아웃 기법", "Flexbox와 Grid를 활용한 현대적인 CSS 레이아웃 구현 방법을 알아봅시다. 반응형 웹 디자인부터 복잡한 레이아웃까지, 실무에서 활용할 수 있는 다양한 기법들을 예제와 함께 설명합니다.", new String[]{"웹 퍼블리싱", "프론트엔드"}},
            {2L, "Docker 컨테이너 완벽 이해", "Docker를 이용한 컨테이너화 기술의 모든 것을 다룹니다. 이미지 빌드부터 Docker Compose, 쿠버네티스 연동까지 현대적인 DevOps 환경에서 필수적인 컨테이너 기술을 학습할 수 있습니다.", new String[]{"데브옵스•인프라"}},
            {1L, "효과적인 알고리즘 문제 해결법", "코딩 테스트와 알고리즘 문제를 효율적으로 해결하기 위한 접근법과 패턴들을 정리했습니다. 시간 복잡도 분석부터 동적 계획법, 그래프 알고리즘까지 단계별로 학습할 수 있습니다.", new String[]{"알고리즘", "프로그래밍 언어", "자료구조"}},
            {1L, "AWS 클라우드 아키텍처 설계", "AWS를 활용한 확장 가능한 클라우드 아키텍처 설계 방법론을 소개합니다. EC2, RDS, Lambda 등 주요 서비스들을 조합하여 실제 서비스 운영에 필요한 인프라를 구축하는 방법을 학습합니다.", new String[]{"클라우드", "데브옵스•인프라"}},
            {2L, "UX/UI 디자인 가이드", "사용자 중심의 인터페이스 디자인 원칙과 실무 적용 방법을 다룹니다. 사용자 리서치부터 프로토타이핑, 사용성 테스트까지 전체 UX 프로세스를 실제 프로젝트 사례와 함께 설명합니다.", new String[]{"UX/UI"}},
            {1L, "Flutter 모바일 앱 개발", "Flutter를 이용한 크로스 플랫폼 모바일 앱 개발 가이드입니다. Dart 언어 기초부터 상태 관리, 네이티브 기능 활용까지 실제 앱 출시에 필요한 모든 과정을 단계별로 설명합니다.", new String[]{"모바일 앱 개발"}},
            {1L, "사이버보안 기초와 실습", "사이버보안의 기본 개념과 실무에서 적용할 수 있는 보안 기법들을 소개합니다. 네트워크 보안, 웹 애플리케이션 보안, 암호화 기술 등을 실습을 통해 학습할 수 있습니다.", new String[]{"사이버보안", "네트워크", "보안"}},
            {2L, "데이터 시각화 마스터하기", "Python의 matplotlib, seaborn을 활용한 효과적인 데이터 시각화 방법을 학습합니다. 데이터의 특성에 따른 차트 선택부터 인터랙티브 시각화까지 다양한 기법들을 실습을 통해 익힐 수 있습니다.", new String[]{"데이터 분석"}},
            {2L, "블록체인과 스마트 컨트랙트", "블록체인 기술의 원리부터 이더리움 기반 스마트 컨트랙트 개발까지 다룹니다. Solidity 언어를 이용한 DApp 개발과 Web3 연동 방법을 실제 프로젝트를 통해 학습할 수 있습니다.", new String[]{"블록체인"}},
            {2L, "리눅스 시스템 관리 완벽 가이드", "리눅스 서버 관리에 필요한 모든 지식을 체계적으로 정리했습니다. 기본 명령어부터 서비스 관리, 보안 설정, 성능 튜닝까지 실무에서 바로 활용할 수 있는 실용적인 내용들을 다룹니다.", new String[]{"시스템•운영체제"}}
        };
        
        for (Object[] data : postData) {
            Long memberId = (Long) data[0];
            String title = (String) data[1];
            String content = (String) data[2];
            String[] tags = (String[]) data[3];
            
            // 게시글 생성
            Post post = Post.createPost(memberId, title, content);
            Post savedPost = postRepository.save(post);
            
            // 태그 연결
            for (String tagName : tags) {
                Tag tag = tagRepository.findByName(tagName).orElse(null);
                if (tag != null) {
                    PostTag postTag = new PostTag(savedPost.getId(), tag.getId());
                    postTagRepository.save(postTag);
                } else {
                    log.warn("태그를 찾을 수 없습니다: {}", tagName);
                }
            }
        }
        
        log.info("✅ 테스트 게시글 {}개 생성 완료", postData.length);
    }

    private void createTestComments() {
        log.info("💬 테스트 댓글 생성 중...");
        
        // 모든 게시글에 댓글 추가
        postRepository.findAll().forEach(post -> {
            // 회원이 존재하는지 확인
            long memberCount = memberRepository.count();
            if (memberCount == 0) {
                log.warn("회원 데이터가 없어 댓글을 생성할 수 없습니다.");
                return;
            }
            
            // 각 게시글마다 2-4개의 댓글 생성
            int commentCount = (int) (Math.random() * 3) + 2; // 2-4개
            
            for (int i = 1; i <= commentCount; i++) {
                // 1부터 회원 수까지 중 랜덤
                Long commenterId = (long) ((Math.random() * memberCount) + 1);
                
                Comment comment = Comment.createComment(BoardType.INTEREST, post.getId(), commenterId, generateRandomComment(i));
                
                commentRepository.save(comment);
            }
        });
        
        log.info("✅ 테스트 댓글 생성 완료");
    }
    
    private String generateRandomComment(int index) {
        String[] comments = {
            "정말 유익한 글이네요! 실무에 바로 적용해보겠습니다.",
            "자세한 설명 감사합니다. 많은 도움이 되었어요.",
            "이런 내용을 찾고 있었는데, 완벽한 가이드네요!",
            "실제 프로젝트에서 써본 경험이 있는데, 정말 효과적입니다.",
            "초보자도 이해하기 쉽게 작성해주셔서 감사합니다.",
            "코드 예제가 특히 도움이 되었어요. 따라해보겠습니다!",
            "추가로 궁금한 점이 있는데, 질문 드려도 될까요?",
            "이 기술에 대해 더 깊이 공부해보고 싶어졌습니다.",
            "실무 경험을 바탕으로 한 팁들이 정말 값진 것 같아요.",
            "다음 글도 기대하겠습니다! 좋은 콘텐츠 감사합니다.",
            "베스트 프랙티스를 알려주셔서 감사합니다.",
            "이 방법으로 해보니까 정말 성능이 개선되네요!",
            "step-by-step으로 설명해주셔서 따라하기 쉬웠어요.",
            "실제 업무에서 마주했던 문제를 해결할 수 있을 것 같습니다.",
            "공식 문서보다 이해하기 쉽게 설명해주셨네요."
        };
        
        return comments[index % comments.length];
    }
}
