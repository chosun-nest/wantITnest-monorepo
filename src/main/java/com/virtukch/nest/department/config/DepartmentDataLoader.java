//package com.virtukch.nest.department.config;
//
//import com.virtukch.nest.department.model.Department;
//import com.virtukch.nest.department.repository.DepartmentRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.ApplicationArguments;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.core.annotation.Order;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//
//@Component
//@RequiredArgsConstructor
//@Order(0)
//public class DepartmentDataLoader implements ApplicationRunner {
//
//    private final DepartmentRepository departmentRepository;
//
//    @Override
//    public void run(ApplicationArguments args) {
//        if (departmentRepository.count() > 0) {
//            return; // 이미 있으면 skip
//        }
//
//        List<String> departmentNames = List.of(
//            // 공학 계열
//            "컴퓨터공학과", "소프트웨어공학과", "정보보호학과", "전자공학과", "전기공학과",
//            "기계공학과", "산업공학과", "화학공학과", "신소재공학과", "건축학과", "토목공학과",
//            "환경공학과", "에너지공학과", "로봇공학과", "항공우주공학과", "바이오메디컬공학과",
//
//            // 자연과학 계열
//            "수학과", "물리학과", "화학과", "생명과학과", "통계학과", "지구과학과", "해양학과",
//
//            // 인문학 계열
//            "국어국문학과", "영어영문학과", "불어불문학과", "독어독문학과", "중어중문학과",
//            "일어일문학과", "사학과", "철학과", "문예창작과", "언어학과", "종교학과",
//
//            // 사회과학 계열
//            "사회학과", "심리학과", "정치외교학과", "행정학과", "언론정보학과", "사회복지학과",
//            "국제학과", "지리학과", "문화인류학과",
//
//            // 경상 계열
//            "경영학과", "경제학과", "무역학과", "회계학과", "금융학과", "마케팅학과",
//            "보험계리학과", "벤처경영학과", "물류학과",
//
//            // 교육 계열
//            "교육학과", "유아교육과", "초등교육과", "특수교육과", "체육교육과", "영어교육과",
//            "수학교육과", "과학교육과", "도덕윤리교육과",
//
//            // 예체능 계열
//            "디자인학과", "시각디자인과", "산업디자인과", "패션디자인과",
//            "미술학과", "조소과", "회화과", "음악학과", "성악과", "작곡과", "피아노과",
//            "무용학과", "체육학과", "스포츠과학과", "연극영화과", "공연예술학과",
//
//            // 의약 계열
//            "의학과", "간호학과", "치의학과", "약학과", "한의학과", "물리치료학과", "작업치료학과",
//            "임상병리학과", "방사선학과", "응급구조학과", "보건행정학과",
//
//            // 융합/기타
//            "데이터사이언스학과", "인공지능학과", "스마트팜공학과", "게임공학과", "문화콘텐츠학과",
//            "국방과학기술학과", "스마트시티학과", "융합보안학과", "해양산업융합학과", "반도체시스템공학과"
//        );
//
//        List<Department> departments = departmentNames.stream()
//            .map(name -> Department.builder()
//                .departmentName(name)
//                .build())
//            .toList();
//
//        departmentRepository.saveAll(departments);
//    }
//}
