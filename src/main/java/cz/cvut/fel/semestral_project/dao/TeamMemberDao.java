package cz.cvut.fel.semestral_project.dao;

import cz.cvut.fel.semestral_project.model.TeamMember;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TeamMemberDao {

    @PersistenceContext
    private EntityManager entityManager;

    public void persist(TeamMember member) {
        entityManager.persist(member);
    }

    public TeamMember find(Long id) {
        return entityManager.find(TeamMember.class, id);
    }

    public List<TeamMember> findAll() {
        return entityManager.createQuery("SELECT m FROM TeamMember m", TeamMember.class).getResultList();
    }

    public void remove(TeamMember m) {
        entityManager.remove(m);
    }
}
