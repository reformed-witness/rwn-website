package net.reformedwitness.rwn.web;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import net.reformedwitness.rwn.domain.Lab;
import net.reformedwitness.rwn.domain.LabRepository;
import net.reformedwitness.rwn.domain.Ministry;
import net.reformedwitness.rwn.domain.MinistryRepository;

/**
 * The network: what it runs and what it publishes.
 *
 * <p>Both lists were hard-coded in the page, so launching a ministry or publishing a repository meant
 * editing markup and redeploying. Image URLs are assembled here too, from the bucket configured for
 * the deployment, so the page never hard-codes where the photos live.
 */
@RestController
public class NetworkController {

    private final MinistryRepository ministries;
    private final LabRepository labs;
    private final String assetBaseUrl;

    public NetworkController(MinistryRepository ministries, LabRepository labs,
                             @Value("${site.assets.base-url:https://s3.thebennett.net/rwn}") String assetBaseUrl) {
        this.ministries = ministries;
        this.labs = labs;
        this.assetBaseUrl = assetBaseUrl.replaceAll("/+$", "");
    }

    /**
     * @param style    which card treatment the grid should use
     * @param imageUrl absolute, or null when the card has no photo
     */
    public record MinistryView(String name, String blurb, String linkUrl, String linkLabel,
                               String badge, String style, String imageUrl, String statusNote) {}

    public record LabView(String name, String repo, String linkUrl) {}

    public record Network(List<MinistryView> ministries, List<LabView> labs) {}

    @GetMapping("/api/network")
    @Transactional(readOnly = true)
    public Network network() {
        return new Network(
                ministries.findAllByOrderByPositionAsc().stream().map(this::toView).toList(),
                labs.findAllByOrderByPositionAsc().stream()
                        .map(l -> new LabView(l.getName(), l.getRepo(), l.getLinkUrl()))
                        .toList());
    }

    private MinistryView toView(Ministry m) {
        return new MinistryView(m.getName(), m.getBlurb(), m.getLinkUrl(), m.getLinkLabel(),
                m.getBadge(), m.getStyle(), imageUrl(m.getImageKey()), m.getStatusNote());
    }

    /** Each path segment is encoded so a key containing a space still fetches. */
    private String imageUrl(String key) {
        if (key == null || key.isBlank()) {
            return null;
        }
        String encoded = Arrays.stream(key.replaceAll("^/+", "").split("/"))
                .map(segment -> URLEncoder.encode(segment, StandardCharsets.UTF_8).replace("+", "%20"))
                .collect(Collectors.joining("/"));
        return assetBaseUrl + "/images/" + encoded;
    }
}
