package cz.cvut.fel.semestral_project.dao; // Ensure correct package

import cz.cvut.fel.semestral_project.model.TournamentTerm;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Repository;

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
}