package net.reformedwitness.rwn.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import net.thebennett.platform.data.BaseEntity;

/** One work of the network, as it appears in the bento grid. */
@Entity
@Table(name = "ministry")
public class Ministry extends BaseEntity {

    /** Card treatments the grid knows how to render. */
    public enum Style { FEATURE, LIGHT, DARK, OUTLINE }

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, columnDefinition = "text")
    private String blurb;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "link_label", length = 80)
    private String linkLabel;

    @Column(length = 40)
    private String badge;

    @Column(nullable = false, length = 20)
    private String style;

    @Column(name = "image_key", length = 300)
    private String imageKey;

    /** Shown instead of a link when there is nothing to visit yet. */
    @Column(name = "status_note", length = 120)
    private String statusNote;

    @Column(name = "position", nullable = false)
    private int position;

    protected Ministry() {
        // for JPA
    }

    public String getName() { return name; }
    public String getBlurb() { return blurb; }
    public String getLinkUrl() { return linkUrl; }
    public String getLinkLabel() { return linkLabel; }
    public String getBadge() { return badge; }
    public String getStyle() { return style; }
    public String getImageKey() { return imageKey; }
    public String getStatusNote() { return statusNote; }
    public int getPosition() { return position; }
}
