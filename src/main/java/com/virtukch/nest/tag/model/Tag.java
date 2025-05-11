package com.virtukch.nest.tag.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private boolean isActive = true;

    public Tag(String name) {
        this.name = name;
    }

    public void deactivate() {
        this.isActive = false;
    }
}
