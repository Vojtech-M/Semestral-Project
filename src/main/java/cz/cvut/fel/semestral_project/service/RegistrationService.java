package cz.cvut.fel.semestral_project.service;

import cz.cvut.fel.semestral_project.dao.RegistrationDao;
import cz.cvut.fel.semestral_project.dao.SchoolRepository;
import cz.cvut.fel.semestral_project.dao.TeamDao;
import cz.cvut.fel.semestral_project.dto.RegistrationFormDto;
import cz.cvut.fel.semestral_project.model.Registration;
import cz.cvut.fel.semestral_project.model.School;
import cz.cvut.fel.semestral_project.model.Team;
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

    @Transactional
    public void registerTeam(RegistrationFormDto dto) {
        // 1. Vytvoříme a uložíme školu
        School school = new School();
        school.setName(dto.getSchoolName());
        school.setAdress(dto.getSchoolAddress());
        school.setCity(dto.getSchoolCity());
        school.setZipCode(dto.getSchoolZip());
        school.setWebsite(dto.getSchoolWeb());
        school.setApproved(false); // Nově registrovaná škola obvykle čeká na schválení
        schoolRepository.persist(school);

        // 2. Vytvoříme a uložíme tým spojený se školou
        Team team = new Team();
        team.setName(dto.getTeamName());
        team.setSchool(school);
        teamDao.persist(team);

        // 3. Vytvoříme registraci a propojíme ji s týmem
        Registration reg = new Registration();
        reg.setTeam(team); // Toto je to nejdůležitější, co chybělo!
        reg.setStatus(RegistrationStatus.AWAITING);
        reg.setRegisteredAt(LocalDateTime.now());

        // Pokud máš v entitě Registration ještě staré textové sloupce, můžeš je vyplnit také:
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