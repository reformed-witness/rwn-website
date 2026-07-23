package net.reformedwitness.rwn.domain;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LabRepository extends JpaRepository<Lab, Long> {

    List<Lab> findAllByOrderByPositionAsc();
}
