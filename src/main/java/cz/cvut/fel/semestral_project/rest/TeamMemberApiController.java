package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dao.TeamMemberDao;
import cz.cvut.fel.semestral_project.dto.TeamMemberDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class TeamMemberApiController {

    @Autowired
    private TeamMemberDao teamMemberDao;

    @GetMapping
    public ResponseEntity<List<TeamMemberDto>> getAllStudents() {
        List<TeamMemberDto> dtos = teamMemberDao.findAll().stream().map(m -> {
            TeamMemberDto dto = new TeamMemberDto();
            dto.setId(m.getId());
            dto.setUserName(m.getUserName());
            if (m.getTeam() != null) {
                dto.setTeamId(m.getTeam().getId());
            }
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
