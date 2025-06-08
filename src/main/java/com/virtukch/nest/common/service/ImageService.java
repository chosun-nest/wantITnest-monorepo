package com.virtukch.nest.common.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// 추후 S3로 저장소 변경을 쉽게 할 수 있도록 인터페이스 선언
public interface ImageService {

    /**
     * 단일 이미지 파일을 업로드합니다.
     */
    String uploadImage(MultipartFile file, String prefix, Long ownerId);

    /**
     * 여러 이미지 파일을 업로드합니다.
     */
    List<String> uploadImages(List<MultipartFile> files, String prefix, Long ownerId);

    /**
     * 이전 이미지를 삭제하고 새 이미지로 교체합니다.
     */
    String replaceImage(MultipartFile file, String prefix, Long ownerId, String prevImageUrl);

    /**
     * 여러 이미지를 삭제하고 새 이미지들로 교체합니다.
     */
    List<String> replaceImages(List<MultipartFile> files, String prefix, Long ownerId, List<String> prevImageUrls);

    /**
     * 이미지를 삭제합니다.
     */
    boolean deleteImage(String imageUrl);
}