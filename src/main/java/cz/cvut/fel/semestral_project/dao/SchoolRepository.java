package cz.cvut.fel.semestral_project.dao;

import cz.cvut.fel.semestral_project.model.School;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SchoolRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public void persist(School school) {
        entityManager.persist(school);
    }

    public School find(Long id) {
        return entityManager.find(School.class, id);
    }

    public List<School> findAll() {
        return entityManager.createQuery("SELECT s FROM School s", School.class).getResultList();
    }

    public School update(School school) {
        return entityManager.merge(school);
    }

    public void remove(School school) {
        entityManager.remove(entityManager.contains(school) ? school : entityManager.merge(school));
    }
}