package cz.cvut.fel.semestral_project.service;

import cz.cvut.fel.semestral_project.dao.TeamDao;
import cz.cvut.fel.semestral_project.dao.TeamMemberDao;
import cz.cvut.fel.semestral_project.dao.SchoolRepository;
import cz.cvut.fel.semestral_project.model.Team;
import cz.cvut.fel.semestral_project.model.TeamMember;
import cz.cvut.fel.semestral_project.model.School;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {

    @Autowired
    private TeamDao teamDao;

    @Autowired
    private TeamMemberDao teamMemberDao;

    @Autowired
    private SchoolRepository schoolRepository;

    @Transactional
    public List<Team> getAllTeams() {
        return teamDao.findAll();
    }

    @Transactional
    public Team getTeamById(Long id) {
        return teamDao.findById(id);
    }

    @Transactional
    public Team createTeam(Team team) {
        teamDao.persist(team);
        return team;
    }

    @Transactional
    public Team updateTeam(Long id, Team teamDetails) {
        Team team = teamDao.findById(id);
        if (team != null) {
            team.setName(teamDetails.getName());
            team.setTeacherName(teamDetails.getTeacherName());
            if (teamDetails.getSchool() != null && teamDetails.getSchool().getId() != null) {
                School school = schoolRepository.find(teamDetails.getSchool().getId());
                if (school != null) {
                    team.setSchool(school);
                }
            }
            teamDao.update(team);
        }
        return team;
    }

    @Transactional
    public void deleteTeam(Long id) {
        Team team = teamDao.findById(id);
        if (team != null) {
            // Smazat i členy
            if (team.getTeamMembers() != null) {
                for (TeamMember m : team.getTeamMembers()) {
                    teamMemberDao.remove(m);
                }
            }
            teamDao.remove(team);
        }
    }
}
