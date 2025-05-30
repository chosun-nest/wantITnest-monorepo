package com.virtukch.nest.common.service;

import com.virtukch.nest.common.exception.ImageDirectoryCreationException;
import com.virtukch.nest.common.exception.ImageUploadFailedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class LocalImageServiceImpl implements ImageService {

    /**
     * 여러 이미지 파일을 업로드합니다.
     *
     * @param files  업로드할 이미지 파일들
     * @param prefix 업로드 경로의 접두사 (예: "post", "comment")
     * @param ownerId 이미지 소유자 ID (예: memberId, postId)
     * @return 업로드된 이미지의 URL 목록
     */
    public List<String> uploadImages(List<MultipartFile> files, String prefix, Long ownerId) {
        if (files == null || files.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String imageUrl = uploadImage(file, prefix, ownerId);
                imageUrls.add(imageUrl);
            }
        }

        return imageUrls;
    }

    /**
     * 단일 이미지 파일을 업로드합니다.
     *
     * @param file   업로드할 이미지 파일
     * @param prefix 업로드 경로의 접두사 (예: "interest", "project", "member")
     * @param ownerId 이미지 소유자 ID (예: memberId, postId)
     * @return 업로드된 이미지의 URL
     */
    public String uploadImage(MultipartFile file, String prefix, Long ownerId) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 1. 기본 업로드 디렉토리
        String baseDir = new File("uploaded-images").getAbsolutePath();

        // 2. 소유자별 디렉토리 생성 (예: uploaded-images/interest_123/)
        String ownerDirName = prefix + "_" + ownerId;
        File ownerDir = new File(baseDir, ownerDirName);
        if (!ownerDir.exists() && !ownerDir.mkdirs()) {
            throw new ImageDirectoryCreationException(ownerDir.getPath());
        }

        // 3. 파일명 생성 (UUID + 원본 확장자)
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID() + extension;

        // 5. 대상 파일 생성
        File dest = new File(ownerDir, filename);

        try {
            // 6. 파일 저장
            file.transferTo(dest);
        } catch (Exception e) {
            throw new ImageUploadFailedException(
                    "이미지 저장 중 오류가 발생했습니다: " + e.getClass().getSimpleName(), e);
        }

        // 7. 이미지 URL 반환 (웹에서 접근 가능한 경로)
        return "/uploaded-images/" + ownerDirName + "/" + filename;
    }

    /**
     * 이전 이미지를 삭제하고 새 이미지로 교체합니다.
     *
     * @param file 새로 업로드할 이미지 파일
     * @param prefix 업로드 경로의 접두사
     * @param ownerId 이미지 소유자 ID
     * @param prevImageUrl 이전 이미지 URL (삭제할 이미지)
     * @return 새로 업로드된 이미지의 URL
     */
    public String replaceImage(MultipartFile file, String prefix, Long ownerId, String prevImageUrl) {
        if (file == null || file.isEmpty()) {
            return prevImageUrl; // 새 파일이 없으면 이전 URL 유지
        }

        // 1. 이전 이미지 삭제
        if (prevImageUrl != null && prevImageUrl.startsWith("/uploaded-images/")) {
            String baseDir = new File("uploaded-images").getAbsolutePath();
            String cleanedPath = prevImageUrl.substring("/uploaded-images/".length());
            File prevFile = new File(baseDir + File.separator + cleanedPath);
            try {
                Files.delete(prevFile.toPath());
                log.info("이전 이미지 삭제 성공: {}", prevFile.getAbsolutePath());
            } catch (IOException e) {
                log.error("이전 이미지 삭제 실패: {}", prevFile.getAbsolutePath(), e);
                // 이전 이미지 삭제 실패해도 계속 진행
            }
        }

        // 2. 새 이미지 업로드
        return uploadImage(file, prefix, ownerId);
    }

    /**
     * 여러 이미지를 삭제하고 새 이미지들로 교체합니다.
     *
     * @param files 새로 업로드할 이미지 파일들
     * @param prefix 업로드 경로의 접두사
     * @param ownerId 이미지 소유자 ID
     * @param prevImageUrls 이전 이미지 URL 목록 (삭제할 이미지들)
     * @return 새로 업로드된 이미지의 URL 목록
     */
    public List<String> replaceImages(List<MultipartFile> files, String prefix, Long ownerId, List<String> prevImageUrls) {
        if (files == null || files.isEmpty()) {
            return prevImageUrls; // 새 파일이 없으면 이전 URL 목록 유지
        }

        // 1. 이전 이미지들 삭제
        if (prevImageUrls != null && !prevImageUrls.isEmpty()) {
            String baseDir = new File("uploaded-images").getAbsolutePath();
            for (String prevUrl : prevImageUrls) {
                if (prevUrl != null && prevUrl.startsWith("/uploaded-images/")) {
                    String cleanedPath = prevUrl.substring("/uploaded-images/".length());
                    File prevFile = new File(baseDir + File.separator + cleanedPath);
                    try {
                        Files.delete(prevFile.toPath());
                    } catch (IOException e) {
                        log.error("이전 이미지 삭제 실패: {}", prevFile.getAbsolutePath(), e);
                        // 계속 진행
                    }
                }
            }
        }

        // 2. 새 이미지들 업로드
        return uploadImages(files, prefix, ownerId);
    }

    /**
     * 이미지를 삭제합니다.
     *
     * @param imageUrl 삭제할 이미지 URL
     * @return 삭제 성공 여부
     */
    public boolean deleteImage(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith("/uploaded-images/")) {
            return false;
        }

        String baseDir = new File("uploaded-images").getAbsolutePath();
        String cleanedPath = imageUrl.substring("/uploaded-images/".length());
        File imageFile = new File(baseDir + File.separator + cleanedPath);

        try {
            return Files.deleteIfExists(imageFile.toPath());
        } catch (IOException e) {
            log.error("이미지 삭제 중 오류 발생: {}", imageFile.getAbsolutePath(), e);
            return false;
        }
    }
}