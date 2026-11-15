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
    private final TeamMemberDao teamMemberDao;
    private final TournamentTermDao tournamentTermDao;
    private final RegistrationDao registrationDao;

    @Autowired
    public DataInitializer(SchoolRepository schoolRepository,
                           TeamDao teamDao,
                           TeamMemberDao teamMemberDao,
                           TournamentTermDao tournamentTermDao,
                           RegistrationDao registrationDao) {
        this.schoolRepository = schoolRepository;
        this.teamDao = teamDao;
        this.teamMemberDao = teamMemberDao;
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
        // 1. TOURNAMENT TERMS
        // ==========================================
        TournamentTerm term1 = new TournamentTerm();
        term1.setName("Přihlášené týmy - 1. kolo (20.11.2026)");
        tournamentTermDao.persist(term1);

        TournamentTerm term2 = new TournamentTerm();
        term2.setName("Přihlášené týmy - 2. kolo (21.11.2026)");
        tournamentTermDao.persist(term2);

        // ==========================================
        // 2. SCHOOLS
        // ==========================================
        School school1 = new School();
        school1.setName("SPŠST Panská");
        school1.setCity("Praha 1");
        school1.setAdress("Panská 856/3");
        school1.setZipCode("11000");
        school1.setWebsite("https://www.spsst.cz");
        school1.setApproved(true);
        schoolRepository.persist(school1);

        School school2 = new School();
        school2.setName("Gymnázium Elišky Krásnohorské");
        school2.setCity("Praha");
        school2.setAdress("Ohradní 55/111");
        school2.setZipCode("14000");
        school2.setWebsite("https://www.gek.cz");
        school2.setApproved(true);
        schoolRepository.persist(school2);

        // ==========================================
        // 3. TEAMS & REGISTRATIONS (Term 1)
        // ==========================================
        Team team1 = new Team();
        team1.setName("CyberBots");
        team1.setSchool(school1);
        team1.setTeacherName("Ing. Jan Novák, Ph.D.");
        teamDao.persist(team1);

        teamMemberDao.persist(new TeamMember(team1, "Adam Novotný"));
        teamMemberDao.persist(new TeamMember(team1, "Barbora Veselá"));
        teamMemberDao.persist(new TeamMember(team1, "Cyril Dvořák"));

        Registration reg1 = new Registration();
        reg1.setTeam(team1);
        reg1.setTournamentTerm(term1);
        reg1.setSchoolName(school1.getName());
        reg1.setSchoolAddress(school1.getAdress());
        reg1.setSchoolCity(school1.getCity());
        reg1.setSchoolZip(school1.getZipCode());
        reg1.setSchoolWeb(school1.getWebsite());
        reg1.setTeamName(team1.getName());
        reg1.setTeacherName(team1.getTeacherName());
        reg1.setTeacherEmail("jan.novak@spsst.cz");
        reg1.setTeacherPhone("+420 123 456 789");
        reg1.setStatus(RegistrationStatus.VALID);
        reg1.setRegisteredAt(LocalDateTime.of(2026, 11, 15, 10, 0));
        registrationDao.persist(reg1);

        Team team2 = new Team();
        team2.setName("KeplerRobotics");
        team2.setSchool(school2);
        team2.setTeacherName("Mgr. Petr Svoboda");
        teamDao.persist(team2);

        teamMemberDao.persist(new TeamMember(team2, "Filip Procházka"));
        teamMemberDao.persist(new TeamMember(team2, "Gabriela Kučerová"));
        teamMemberDao.persist(new TeamMember(team2, "Hana Horáková"));

        Registration reg2 = new Registration();
        reg2.setTeam(team2);
        reg2.setTournamentTerm(term1);
        reg2.setSchoolName(school2.getName());
        reg2.setSchoolAddress(school2.getAdress());
        reg2.setSchoolCity(school2.getCity());
        reg2.setSchoolZip(school2.getZipCode());
        reg2.setSchoolWeb(school2.getWebsite());
        reg2.setTeamName(team2.getName());
        reg2.setTeacherName(team2.getTeacherName());
        reg2.setTeacherEmail("svoboda@gek.cz");
        reg2.setTeacherPhone("+420 987 654 321");
        reg2.setStatus(RegistrationStatus.AWAITING);
        reg2.setRegisteredAt(LocalDateTime.of(2026, 11, 16, 14, 30));
        registrationDao.persist(reg2);

        // ==========================================
        // 4. TEAMS & REGISTRATIONS (Term 2)
        // ==========================================
        Team team3 = new Team();
        team3.setName("RoBobři");
        team3.setSchool(school2);
        team3.setTeacherName("Mgr. Petr Svoboda");
        teamDao.persist(team3);

        teamMemberDao.persist(new TeamMember(team3, "Jakub Marek"));
        teamMemberDao.persist(new TeamMember(team3, "Lucie Veselá"));

        Registration reg3 = new Registration();
        reg3.setTeam(team3);
        reg3.setTournamentTerm(term2);
        reg3.setSchoolName(school2.getName());
        reg3.setSchoolAddress(school2.getAdress());
        reg3.setSchoolCity(school2.getCity());
        reg3.setSchoolZip(school2.getZipCode());
        reg3.setSchoolWeb(school2.getWebsite());
        reg3.setTeamName(team3.getName());
        reg3.setTeacherName(team3.getTeacherName());
        reg3.setTeacherEmail("svoboda@gek.cz");
        reg3.setTeacherPhone("+420 987 654 321");
        reg3.setStatus(RegistrationStatus.VALID);
        reg3.setRegisteredAt(LocalDateTime.of(2026, 11, 17, 9, 15));
        registrationDao.persist(reg3);

        System.out.println("🎉 Všechna testovací data byla úspěšně nahrána!");
    }
}
