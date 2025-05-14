package com.virtukch.nest.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.fastapi-crawler-url}")
    private String fastApiCrawlerUrl;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 이미지가 저장되는 로컬 경로
        String uploadDir = "file:/app/uploaded-images/";

        // 이 경로로 요청 시 → 실제 파일 경로에서 파일 제공
        registry.addResourceHandler("/uploaded-images/**")
            .addResourceLocations(uploadDir);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/notices/**")
                .allowedOrigins(fastApiCrawlerUrl) // TODO FastAPI 서버 주소. 추후 변경 필요
                .allowedMethods("POST")
                .allowedHeaders("*");
    }
}