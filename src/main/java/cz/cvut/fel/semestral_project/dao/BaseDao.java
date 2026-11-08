package cz.cvut.fel.semestral_project.dao;

import cz.cvut.fel.semestral_project.model.BaseEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;

// REMOVED @Repository, MADE abstract
public abstract class BaseDao<T extends BaseEntity> implements GenericDao<T> {

    private final Class<T> entityClass;

    @PersistenceContext
    protected EntityManager em;

    protected BaseDao(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    @Override
    public T findById(Long id) {
        return em.find(entityClass, id);
    }

    @Override
    public List<T> findAll() {
        return em.createQuery("SELECT e FROM " + entityClass.getSimpleName() + " e", entityClass).getResultList();
    }

    @Override
    public T persist(T entity) {
        em.persist(entity);
        return entity;
    }

    @Override
    public T update(T entity) {
        return em.merge(entity);
    }

    @Override
    public void remove(T entity) {
        if (em.contains(entity)) {
            em.remove(entity);
        } else {
            T managed = em.merge(entity);
            if (managed != null) {
                em.remove(managed);
            }
        }
    }
}