package cz.cvut.fel.semestral_project.dao;

import cz.cvut.fel.semestral_project.model.Registration;
import org.springframework.stereotype.Repository;

@Repository
public class RegistrationDao extends BaseDao<Registration> {
    public RegistrationDao() {
        super(Registration.class);
    }
}
