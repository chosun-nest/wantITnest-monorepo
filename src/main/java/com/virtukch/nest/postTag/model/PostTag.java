package com.virtukch.nest.postTag.model;

import com.virtukch.nest.post.model.Post;
import com.virtukch.nest.tag.model.Tag;
import jakarta.persistence.*;

@Entity
public class PostTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Post post;

    @ManyToOne
    private Tag tag;
}