package cz.cvut.fel.semestral_project.dao;

import cz.cvut.fel.semestral_project.model.TournamentTerm;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Repository;

import java.util.List;

@Setter
@Getter
@Repository
public class TournamentTermDao {

    @PersistenceContext
    private EntityManager entityManager;

    public void persist(TournamentTerm term) {
        entityManager.persist(term);
    }

    public TournamentTerm find(Long id) {
        return entityManager.find(TournamentTerm.class, id);
    }

    public List<TournamentTerm> findAll() {
        return entityManager.createQuery("SELECT t FROM TournamentTerm t", TournamentTerm.class).getResultList();
    }

    public TournamentTerm update(TournamentTerm term) {
        return entityManager.merge(term);
    }

    public void remove(TournamentTerm term) {
        entityManager.remove(entityManager.contains(term) ? term : entityManager.merge(term));

    }
}