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

    public Team find(Long id) {
        return entityManager.find(Team.class, id);
    }

    public java.util.List<Team> findAll() {
        return entityManager.createQuery("SELECT t FROM Team t", Team.class).getResultList();
    }

    public void update(Team team) {
        entityManager.merge(team);
    }

    public Team findById(Long id) {
        return entityManager.find(Team.class, id);
    }

    public void remove(Team team) {
        entityManager.remove(team);
    }
}