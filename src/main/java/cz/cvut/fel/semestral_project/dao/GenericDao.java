package cz.cvut.fel.semestral_project.dao;

import cz.cvut.fel.semestral_project.model.BaseEntity;
import java.util.List;

public interface GenericDao<T extends BaseEntity> {
    T findById(Long id);
    List<T> findAll();
    T persist(T entity);
    T update(T entity);
    void remove(T entity);
}

