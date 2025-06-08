package com.virtukch.nest.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class ProjectWithImagesRequestDto {
    @NotBlank(message = "모집글 제목은 비어 있을 수 없습니다.")
    private String projectTitle;
    private String projectDescription;
    private int maxMember;
    private boolean isRecruiting;
    private List<String> tags;
    private List<MultipartFile> images;
}
