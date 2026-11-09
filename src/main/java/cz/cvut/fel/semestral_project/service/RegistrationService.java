package cz.cvut.fel.semestral_project.service;

import cz.cvut.fel.semestral_project.dao.RegistrationDao;
import cz.cvut.fel.semestral_project.dao.SchoolRepository;
import cz.cvut.fel.semestral_project.dao.TeamDao;
import cz.cvut.fel.semestral_project.dao.TournamentTermDao;
import cz.cvut.fel.semestral_project.dto.RegistrationFormDto;
import cz.cvut.fel.semestral_project.model.Registration;
import cz.cvut.fel.semestral_project.model.School;
import cz.cvut.fel.semestral_project.model.Team;
import cz.cvut.fel.semestral_project.model.TournamentTerm;
import cz.cvut.fel.semestral_project.model.enums.RegistrationStatus;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationDao registrationDao;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private TeamDao teamDao;

    @Autowired
    private TournamentTermDao tournamentTermDao;

    @Transactional
    public void registerTeam(RegistrationFormDto dto) {
        School school;
        if (dto.getSchoolId() != null) {
            school = schoolRepository.find(dto.getSchoolId());
            if (school == null) {
                throw new IllegalArgumentException("Škola s ID " + dto.getSchoolId() + " nebyla nalezena.");
            }
        } else {
            school = new School();
            school.setName(dto.getSchoolName());
            school.setAdress(dto.getSchoolAddress());
            school.setCity(dto.getSchoolCity());
            school.setZipCode(dto.getSchoolZip());
            school.setWebsite(dto.getSchoolWeb());
            school.setApproved(false);
            schoolRepository.persist(school);
        }

        Team team = new Team();
        team.setName(dto.getTeamName());
        team.setSchool(school);
        teamDao.persist(team);

        Registration reg = new Registration();
        reg.setTeam(team);
        reg.setStatus(RegistrationStatus.AWAITING);
        reg.setRegisteredAt(LocalDateTime.now());

        if (dto.getTournamentTermId() != null) {
            TournamentTerm term = tournamentTermDao.find(dto.getTournamentTermId());
            if (term != null) {
                reg.setTournamentTerm(term);
            }
        }

        reg.setSchoolName(school.getName());
        reg.setSchoolAddress(school.getAdress());
        reg.setSchoolCity(school.getCity());
        reg.setSchoolZip(school.getZipCode());
        reg.setSchoolWeb(school.getWebsite());
        reg.setTeamName(team.getName());

        registrationDao.persist(reg);
    }

    @Transactional
    public List<Registration> getAllRegistrations() {
        return registrationDao.findAll();
    }
}