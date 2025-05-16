package com.virtukch.nest.notice.repository;

import com.virtukch.nest.notice.model.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    boolean existsByNoticeTypeAndNumber(String noticeType, Long number);

    Page<Notice> findByNoticeTypeOrderByPostDateDesc(String noticeType, Pageable pageable);
    Page<Notice> findByNoticeTypeAndTitleContainingOrderByPostDateDesc(String noticeType, String title, Pageable pageable);
}
