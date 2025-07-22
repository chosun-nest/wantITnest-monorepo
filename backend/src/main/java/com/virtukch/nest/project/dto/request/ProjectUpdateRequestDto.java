package com.virtukch.nest.project.dto.request;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectUpdateRequestDto {
    String projectTitle;
    String projectDescription;

    LocalDateTime recruitmentEndDate;
    LocalDateTime projectStartDate;
    LocalDateTime projectEndDate;

    Boolean isRecruiting;

    List<String> tags;
}
