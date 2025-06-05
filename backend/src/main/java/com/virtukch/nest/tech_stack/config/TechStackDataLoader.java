package com.virtukch.nest.tech_stack.config;

import com.virtukch.nest.tech_stack.model.TechStack;
import com.virtukch.nest.tech_stack.repository.TechStackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@Order(0) // 기본 데이터와 함께 먼저 실행
public class TechStackDataLoader implements ApplicationRunner {

    private final TechStackRepository techStackRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (techStackRepository.count() == 0) {
            List<String> stackNames = List.of(
                // Programming Languages
                "Java", "Python", "C", "C++", "C#", "Go", "Rust", "Kotlin", "Swift", "JavaScript", "TypeScript", "Dart", "Ruby", "PHP",

                // Web Frameworks
                "Spring", "Spring Boot", "Django", "Flask", "Express", "NestJS", "Ruby on Rails", "ASP.NET", "Next.js", "Nuxt.js",

                // Frontend
                "React", "Vue.js", "Angular", "Svelte", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "jQuery",

                // Databases
                "MySQL", "PostgreSQL", "MongoDB", "Redis", "MariaDB", "SQLite", "OracleDB", "DynamoDB", "Elasticsearch",

                // DevOps & Infra
                "Docker", "Kubernetes", "Nginx", "Apache", "Terraform", "Ansible", "Git", "GitHub Actions", "Jenkins",

                // Cloud
                "AWS", "GCP", "Azure", "Firebase", "Vercel", "Netlify",

                // Mobile & Desktop
                "Android", "iOS", "Flutter", "React Native", "Electron",

                // ML & Data
                "TensorFlow", "PyTorch", "Pandas", "NumPy", "scikit-learn", "Apache Spark",

                // Messaging / Event
                "Kafka", "RabbitMQ", "gRPC", "WebSocket"
            );

            List<TechStack> stacks = stackNames.stream()
                .map(name -> TechStack.builder().techStackName(name).build())
                .toList();

            techStackRepository.saveAll(stacks);
            log.info("✅ TechStack 초기 데이터 로딩 완료: {}개", stacks.size());
        } else {
            log.info("⏭️ TechStack 테이블에 이미 데이터 존재. 로딩 생략");
        }
    }
}
