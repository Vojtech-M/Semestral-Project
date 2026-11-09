package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dto.TeamDto;
import cz.cvut.fel.semestral_project.dto.TeamMemberDto;
import cz.cvut.fel.semestral_project.model.Team;
import cz.cvut.fel.semestral_project.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:5173")
public class TeamApiController {

    @Autowired
    private TeamService teamService;

    private TeamDto convertToDto(Team t) {
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
            List<TeamMemberDto> memberDtos = t.getTeamMembers().stream().map(m -> {
                TeamMemberDto md = new TeamMemberDto();
                md.setId(m.getId());
                md.setTeamId(t.getId());
                md.setUserName(m.getUserName());
                return md;
            }).collect(Collectors.toList());
            dto.setTeamMembers(memberDtos);
        }
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<TeamDto>> getAllTeams() {
        List<TeamDto> dtos = teamService.getAllTeams().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDto> getTeamById(@PathVariable Long id) {
        Team team = teamService.getTeamById(id);
        if (team == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(team));
    }

    @PostMapping
    public ResponseEntity<TeamDto> createTeam(@RequestBody Team team) {
        Team created = teamService.createTeam(team);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamDto> updateTeam(@PathVariable Long id, @RequestBody Team teamDetails) {
        Team updated = teamService.updateTeam(id, teamDetails);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}
