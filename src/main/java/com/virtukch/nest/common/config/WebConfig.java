package com.virtukch.nest.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 이미지가 저장되는 로컬 경로
        String uploadDir = "file:/app/uploaded-images/";

        // 이 경로로 요청 시 → 실제 파일 경로에서 파일 제공
        registry.addResourceHandler("/uploaded-images/**")
            .addResourceLocations(uploadDir);
    }
}