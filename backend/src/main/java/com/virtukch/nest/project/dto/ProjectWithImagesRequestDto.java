package com.virtukch.nest.project.dto;

import com.virtukch.nest.project_member.model.ProjectMember;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ProjectWithImagesRequestDto {
    @NotBlank(message = "모집글 제목은 비어 있을 수 없습니다.")
    private String projectTitle;
    private String projectDescription;
    private Boolean isRecruiting;
    private List<String> tags;
    private List<MultipartFile> images;
    private Map<ProjectMember.Part, Integer> partCounts;
    private ProjectMember.Part creatorPart; // 작성자가 들어갈 파트
    private ProjectMember.Role creatorRole = ProjectMember.Role.LEADER; // 기본값 LEADER
    private List<Long> membersToRemove;
}
