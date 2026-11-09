package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dao.TeamDao;
import cz.cvut.fel.semestral_project.dto.TeamDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:5173")
public class TeamApiController {

    @Autowired
    private TeamDao teamDao;

    @GetMapping
    public ResponseEntity<List<TeamDto>> getAllTeams() {
        List<TeamDto> dtos = teamDao.findAll().stream().map(t -> {
            TeamDto dto = new TeamDto();
            dto.setId(t.getId());
            dto.setName(t.getName());
            dto.setTeacherName(t.getTeacherName());
            if (t.getTShirtSize() != null) {
                dto.setTShirtSize(t.getTShirtSize().name());
            }
            if (t.getSchool() != null) {
                dto.setSchoolId(t.getSchool().getId());
            }
            if (t.getTeacher() != null) {
                dto.setTeacherId(t.getTeacher().getId());
            }
            if (t.getTeamMembers() != null) {
                List<cz.cvut.fel.semestral_project.dto.TeamMemberDto> memberDtos = t.getTeamMembers().stream().map(m -> {
                    cz.cvut.fel.semestral_project.dto.TeamMemberDto md = new cz.cvut.fel.semestral_project.dto.TeamMemberDto();
                    md.setId(m.getId());
                    md.setTeamId(t.getId());
                    md.setUserName(m.getUserName());
                    return md;
                }).collect(Collectors.toList());
                dto.setTeamMembers(memberDtos);
            }
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
