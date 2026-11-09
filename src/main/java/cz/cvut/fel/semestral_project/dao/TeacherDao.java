package cz.cvut.fel.semestral_project.dao;

import cz.cvut.fel.semestral_project.model.Teacher;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TeacherDao {

    @PersistenceContext
    private EntityManager entityManager;

    public void persist(Teacher teacher) {
        entityManager.persist(teacher);
    }

    public Teacher find(Long id) {
        return entityManager.find(Teacher.class, id);
    }

    public List<Teacher> findAll() {
        return entityManager.createQuery("SELECT t FROM Teacher t", Teacher.class).getResultList();
    }

    public void update(Teacher teacher) {
        entityManager.merge(teacher);
    }

    public void remove(Teacher teacher) {
        entityManager.remove(teacher);
    }
}
