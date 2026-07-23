package net.reformedwitness.rwn;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import net.reformedwitness.rwn.web.NetworkController;

@SpringBootTest(properties = "site.assets.base-url=https://s3.example.test/rwn")
@Testcontainers
class NetworkContentTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>(DockerImageName.parse("postgres:18-alpine"));

    @Autowired
    NetworkController network;

    @Test
    void servesEveryMinistryInOrder() {
        assertThat(network.network().ministries())
                .extracting(NetworkController.MinistryView::name)
                .containsExactly("Pulpit Stream", "Confessions of Grace", "Confessional.social",
                        "Dead Puritan Society");
    }

    @Test
    void everyMinistryHasACardTreatmentTheGridKnows() {
        // An unknown style falls through to the OUTLINE card, which would quietly mis-render.
        assertThat(network.network().ministries())
                .extracting(NetworkController.MinistryView::style)
                .containsExactly("FEATURE", "LIGHT", "DARK", "OUTLINE");
    }

    @Test
    void onlyTheFeatureCardCarriesAPhoto() {
        assertThat(network.network().ministries())
                .filteredOn(m -> m.imageUrl() != null)
                .singleElement()
                .satisfies(m -> {
                    assertThat(m.name()).isEqualTo("Pulpit Stream");
                    assertThat(m.imageUrl()).isEqualTo("https://s3.example.test/rwn/images/pulpit.webp");
                });
    }

    @Test
    void aMinistryWithNowhereToGoOffersAStatusInstead() {
        assertThat(network.network().ministries())
                .filteredOn(m -> m.linkUrl() == null)
                .singleElement()
                .satisfies(m -> {
                    assertThat(m.name()).isEqualTo("Dead Puritan Society");
                    assertThat(m.statusNote()).isNotBlank();
                });
    }

    @Test
    void everyLinkedMinistryHasALabelForItsLink() {
        // A link with no label renders as an empty clickable gap.
        assertThat(network.network().ministries())
                .filteredOn(m -> m.linkUrl() != null)
                .allSatisfy(m -> assertThat(m.linkLabel()).isNotBlank());
    }

    @Test
    void listsThePublishedRepositories() {
        assertThat(network.network().labs())
                .extracting(NetworkController.LabView::repo)
                .containsExactly("gba-2lbcf", "konfessio");
    }
}
