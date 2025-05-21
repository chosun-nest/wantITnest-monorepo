package com.virtukch.nest.tag.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;

@Entity
@NoArgsConstructor
@Getter
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String pathName;

    @Column(nullable = false)
    private boolean isActive = true;

    public Tag(Category category, String name) {
        this.category = category;
        this.name = name;
        this.pathName = generatePathName(name);
    }

    public Tag(Category category, String name, String pathName) {
        this.category = category;
        this.name = name;
        this.pathName = StringUtils.hasText(pathName) ? pathName : generatePathName(name);
    }

    private String generatePathName(String name) {
        // 이름을 소문자로 변환하고 공백을 하이픈으로 대체
        return name.toLowerCase().replaceAll("\\s+", "-");
    }

    public void deactivate() {
        this.isActive = false;
    }
}
