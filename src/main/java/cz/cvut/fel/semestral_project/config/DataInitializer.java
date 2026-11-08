package cz.cvut.fel.semestral_project.config;

import cz.cvut.fel.semestral_project.dao.*;
import cz.cvut.fel.semestral_project.model.*;
import cz.cvut.fel.semestral_project.model.enums.RegistrationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Component responsible for populating the database with initial test data on application startup.
 * It creates Tournament Terms, Schools, Teams, and Registrations.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final SchoolRepository schoolRepository;
    private final TeamDao teamDao;
    private final TournamentTermDao tournamentTermDao;
    private final RegistrationDao registrationDao;

    @Autowired
    public DataInitializer(SchoolRepository schoolRepository,
                           TeamDao teamDao,
                           TournamentTermDao tournamentTermDao,
                           RegistrationDao registrationDao) {
        this.schoolRepository = schoolRepository;
        this.teamDao = teamDao;
        this.tournamentTermDao = tournamentTermDao;
        this.registrationDao = registrationDao;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (registrationDao.findAll() != null && !registrationDao.findAll().isEmpty()) {
            System.out.println("⚠️ Databáze již obsahuje data. Inicializaci přeskakuji.");
            return;
        }

        System.out.println("🚀 Začínám generovat testovací data pro Robosoutěž...");

        // ==========================================
        // 1. TOURNAMENT TERM
        // ==========================================
        TournamentTerm term = new TournamentTerm();
        tournamentTermDao.persist(term);

        // ==========================================
        // 2. SCHOOL 1 & TEAM 1 & REGISTRATION 1
        // ==========================================
        School school1 = new School();
        school1.setName("ČVUT FEL");
        school1.setCity("Praha");
        school1.setAdress("Technická 2");
        school1.setZipCode("16627");
        school1.setWebsite("https://fel.cvut.cz");
        school1.setApproved(true);
        schoolRepository.persist(school1);

        Team team1 = new Team();
        team1.setName("CyberBots");
        team1.setSchool(school1);
        teamDao.persist(team1); // <-- CRITICAL: Must persist team before registration!

        Registration reg1 = new Registration();
        reg1.setTeam(team1);
        reg1.setTournamentTerm(term);
        reg1.setStatus(RegistrationStatus.VALID);
        reg1.setRegisteredAt(LocalDateTime.now().minusDays(2));
        registrationDao.persist(reg1);

        // ==========================================
        // 3. SCHOOL 2 & TEAM 2 & REGISTRATION 2
        // ==========================================
        School school2 = new School();
        school2.setName("Gymnázium Jana Keplera");
        school2.setCity("Praha");
        school2.setAdress("Parléřova 2");
        school2.setZipCode("16900");
        school2.setWebsite("https://www.gjk.cz");
        school2.setApproved(true);
        schoolRepository.persist(school2);

        Team team2 = new Team();
        team2.setName("KeplerRobotics");
        team2.setSchool(school2);
        teamDao.persist(team2); // <-- CRITICAL: Must persist team before registration!

        Registration reg2 = new Registration();
        reg2.setTeam(team2);
        reg2.setTournamentTerm(term);
        reg2.setStatus(RegistrationStatus.AWAITING);
        reg2.setRegisteredAt(LocalDateTime.now().minusDays(1));
        registrationDao.persist(reg2);

        System.out.println("🎉 Všechna testovací data byla úspěšně nahrána!");
    }
}