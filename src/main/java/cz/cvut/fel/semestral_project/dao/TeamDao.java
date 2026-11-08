package cz.cvut.fel.semestral_project.dao; // Ensure correct package

import cz.cvut.fel.semestral_project.model.Team;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class TeamDao {

    @PersistenceContext
    private EntityManager entityManager;

    public void persist(Team team) {
        entityManager.persist(team);
    }
}