//package com.virtukch.nest.interest.config;
//
//import com.virtukch.nest.interest.model.Interest;
//import com.virtukch.nest.interest.repository.InterestRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.boot.ApplicationArguments;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.core.annotation.Order;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//@Order(0) // 기본 데이터와 함께 먼저 실행
//public class InterestDataLoader implements ApplicationRunner {
//
//    private final InterestRepository interestRepository;
//
//    @Override
//    public void run(ApplicationArguments args) throws Exception {
//        if (interestRepository.count() == 0) {
//            List<String> jobFields = List.of(
//                // 개발 직군
//                "백엔드 개발자", "프론트엔드 개발자", "풀스택 개발자", "안드로이드 개발자", "iOS 개발자",
//                "임베디드 개발자", "하드웨어 개발자", "게임 클라이언트 개발자", "게임 서버 개발자",
//                "데이터 엔지니어", "DBA", "DevOps 엔지니어", "보안 엔지니어", "인프라 엔지니어",
//                "클라우드 아키텍트", "QA 엔지니어", "테크니컬 PM",
//
//                // AI/데이터 관련
//                "AI 엔지니어", "머신러닝 엔지니어", "딥러닝 엔지니어", "데이터 사이언티스트", "추천 시스템 엔지니어",
//
//                // 기획/PM/디자인
//                "서비스 기획자", "프로덕트 매니저", "UI/UX 디자이너", "BX 디자이너", "게임 기획자",
//
//                // 기타 특화 포지션
//                "로보틱스 엔지니어", "자율주행 개발자", "VR/AR 개발자", "펌웨어 개발자",
//                "테스트 자동화 엔지니어", "그래픽 프로그래머", "영상 처리 엔지니어",
//
//                // 신입/교육 관련
//                "멘토", "테크 리더", "아키텍트"
//            );
//
//
//            List<Interest> initialInterests = jobFields.stream()
//                .map(name -> Interest.builder().interestName(name).build())
//                .toList();
//
//            interestRepository.saveAll(initialInterests);
//            log.info("✅ Interest 직무 데이터 로딩 완료: {}개", initialInterests.size());
//        } else {
//            log.info("⏭️ Interest 테이블에 이미 데이터 존재. 로딩 생략");
//        }
//    }
//}
