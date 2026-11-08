package cz.cvut.fel.semestral_project.dao;

import cz.cvut.fel.semestral_project.model.School;
import org.springframework.stereotype.Repository;

@Repository
public class SchoolDao extends BaseDao<School> {
    public SchoolDao() {
        super(School.class);
    }
}
