package cz.cvut.fel.semestral_project.dao;

import cz.cvut.fel.semestral_project.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
