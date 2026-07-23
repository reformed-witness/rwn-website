package net.reformedwitness.rwn.domain;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MinistryRepository extends JpaRepository<Ministry, Long> {

    List<Ministry> findAllByOrderByPositionAsc();
}
