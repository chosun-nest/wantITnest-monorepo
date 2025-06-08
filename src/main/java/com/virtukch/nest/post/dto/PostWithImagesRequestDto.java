package com.virtukch.nest.post.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter // `Multipart/form-data` 형식에서는 반드시 필요 -> 리플렉션 안 써서 @ModelAttribute로 값 할당하려면 반드시 필요하다고 함.
public class PostWithImagesRequestDto {
    private String title;
    private String content;
    private List<String> tags;
    private List<MultipartFile> images;
}
