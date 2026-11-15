package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dao.TeamDao;
import cz.cvut.fel.semestral_project.dao.TeamMemberDao;
import cz.cvut.fel.semestral_project.dto.TeamMemberDto;
import cz.cvut.fel.semestral_project.model.Team;
import cz.cvut.fel.semestral_project.model.TeamMember;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/team-members")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Členové týmů", description = "Správa členů soutěžních týmů")
public class TeamMemberApiController {

    @Autowired
    private TeamMemberDao teamMemberDao;

    @Autowired
    private TeamDao teamDao;

    @GetMapping
    @Operation(summary = "Získat všechny členy týmů")
    public ResponseEntity<List<TeamMemberDto>> getAllTeamMembers() {
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

    @GetMapping("/{id}")
    @Operation(summary = "Získat členu týmu podle ID")
    public ResponseEntity<TeamMemberDto> getTeamMemberById(@PathVariable Long id) {
        TeamMember m = teamMemberDao.find(id);
        if (m == null) {
            return ResponseEntity.notFound().build();
        }
        TeamMemberDto dto = new TeamMemberDto();
        dto.setId(m.getId());
        dto.setUserName(m.getUserName());
        if (m.getTeam() != null) {
            dto.setTeamId(m.getTeam().getId());
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @Operation(summary = "Přidat nového člena týmu")
    @Transactional
    public ResponseEntity<TeamMemberDto> createTeamMember(@RequestBody TeamMemberDto dto) {
        TeamMember member = new TeamMember();
        member.setUserName(dto.getUserName());
        if (dto.getTeamId() != null) {
            Team team = teamDao.find(dto.getTeamId());
            if (team != null) {
                member.setTeam(team);
            }
        }
        teamMemberDao.persist(member);

        dto.setId(member.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Aktualizovat člena týmu")
    @Transactional
    public ResponseEntity<TeamMemberDto> updateTeamMember(@PathVariable Long id, @RequestBody TeamMemberDto dto) {
        TeamMember member = teamMemberDao.find(id);
        if (member == null) {
            return ResponseEntity.notFound().build();
        }
        member.setUserName(dto.getUserName());
        if (dto.getTeamId() != null) {
            Team team = teamDao.find(dto.getTeamId());
            if (team != null) {
                member.setTeam(team);
            }
        }
        dto.setId(member.getId());
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Smazat člena týmu")
    @Transactional
    public ResponseEntity<Void> deleteTeamMember(@PathVariable Long id) {
        TeamMember member = teamMemberDao.find(id);
        if (member == null) {
            return ResponseEntity.notFound().build();
        }
        teamMemberDao.remove(member);
        return ResponseEntity.noContent().build();
    }
}
