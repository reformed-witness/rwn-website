package net.reformedwitness.rwn.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import net.thebennett.platform.data.BaseEntity;

/** A published repository. */
@Entity
@Table(name = "lab")
public class Lab extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 120)
    private String repo;

    @Column(name = "link_url", nullable = false, length = 500)
    private String linkUrl;

    @Column(name = "position", nullable = false)
    private int position;

    protected Lab() {
        // for JPA
    }

    public String getName() { return name; }
    public String getRepo() { return repo; }
    public String getLinkUrl() { return linkUrl; }
    public int getPosition() { return position; }
}
