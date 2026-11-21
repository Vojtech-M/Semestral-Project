package cz.cvut.fel.semestral_project.service;

import cz.cvut.fel.semestral_project.dao.SchoolRepository;
import cz.cvut.fel.semestral_project.dao.TeamDao;
import cz.cvut.fel.semestral_project.dao.TeamMemberDao;
import cz.cvut.fel.semestral_project.model.School;
import cz.cvut.fel.semestral_project.model.Team;
import cz.cvut.fel.semestral_project.model.TeamMember;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class TeamService {

    private final TeamDao teamDao;
    private final TeamMemberDao teamMemberDao;
    private final SchoolRepository schoolRepository;

    public TeamService(TeamDao teamDao, TeamMemberDao teamMemberDao, SchoolRepository schoolRepository) {
        this.teamDao = teamDao;
        this.teamMemberDao = teamMemberDao;
        this.schoolRepository = schoolRepository;
    }

    @Transactional(readOnly = true)
    public List<Team> getAllTeams() {
        return teamDao.findAll();
    }

    @Transactional(readOnly = true)
    public Team getTeamById(Long id) {
        Objects.requireNonNull(id, "Team ID cannot be null");
        Team team = teamDao.findById(id);
        if (team == null) {
            throw new EntityNotFoundException("Team with ID " + id + " not found.");
        }
        return team;
    }

    @Transactional
    public Team createTeam(Team team) {
        Objects.requireNonNull(team, "Team cannot be null");

        if (team.getName() == null || team.getName().isBlank()) {
            throw new IllegalArgumentException("Team name must not be empty.");
        }
        if (team.getTeacherName() == null || team.getTeacherName().isBlank()) {
            throw new IllegalArgumentException("Teacher name must not be empty.");
        }
        if (team.getSchool() == null || team.getSchool().getId() == null) {
            throw new IllegalArgumentException("Team must be assigned to an existing school.");
        }

        // Verify the school actually exists in the database before saving
        School existingSchool = schoolRepository.find(team.getSchool().getId());
        if (existingSchool == null) {
            throw new EntityNotFoundException("School with ID " + team.getSchool().getId() + " not found.");
        }
        team.setSchool(existingSchool);

        // Link bidirectional relationship for team members if present
        if (team.getTeamMembers() != null) {
            for (TeamMember member : team.getTeamMembers()) {
                member.setTeam(team);
            }
        }

        teamDao.persist(team);
        return team;
    }

    @Transactional
    public Team updateTeam(Long id, Team teamDetails) {
        Objects.requireNonNull(id, "Team ID cannot be null");
        Objects.requireNonNull(teamDetails, "Team details cannot be null");

        Team team = getTeamById(id); // Throws EntityNotFoundException if missing

        if (teamDetails.getName() != null && !teamDetails.getName().isBlank()) {
            team.setName(teamDetails.getName().trim());
        }
        if (teamDetails.getTeacherName() != null && !teamDetails.getTeacherName().isBlank()) {
            team.setTeacherName(teamDetails.getTeacherName().trim());
        }

        if (teamDetails.getSchool() != null && teamDetails.getSchool().getId() != null) {
            School school = schoolRepository.find(teamDetails.getSchool().getId());
            if (school == null) {
                throw new EntityNotFoundException("School with ID " + teamDetails.getSchool().getId() + " not found.");
            }
            team.setSchool(school);
        }

        return teamDao.update(team);
    }

    @Transactional
    public void deleteTeam(Long id) {
        Objects.requireNonNull(id, "Team ID cannot be null");
        Team team = getTeamById(id); // Throws EntityNotFoundException if missing

        if (team.getTeamMembers() != null) {
            for (TeamMember member : team.getTeamMembers()) {
                teamMemberDao.remove(member);
            }
            team.getTeamMembers().clear();
        }

        teamDao.remove(team);
    }
}