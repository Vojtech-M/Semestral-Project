package cz.cvut.fel.semestral_project.service;

import cz.cvut.fel.semestral_project.dao.RegistrationDao;
import cz.cvut.fel.semestral_project.dto.RegistrationFormDto;
import cz.cvut.fel.semestral_project.model.Registration;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationDao registrationDao;

    @Transactional
    public void registerTeam(RegistrationFormDto dto) {
        Registration reg = new Registration();
        reg.setSchoolName(dto.getSchoolName());
        reg.setSchoolAddress(dto.getSchoolAddress());
        reg.setSchoolCity(dto.getSchoolCity());
        reg.setSchoolZip(dto.getSchoolZip());
        reg.setSchoolWeb(dto.getSchoolWeb());
        reg.setTeamName(dto.getTeamName());
        registrationDao.persist(reg);
    }

    @Transactional
    public List<Registration> getAllRegistrations() {
        return registrationDao.findAll();
    }
}
