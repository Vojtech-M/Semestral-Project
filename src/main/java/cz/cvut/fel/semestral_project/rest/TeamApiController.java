package cz.cvut.fel.semestral_project.rest;

import cz.cvut.fel.semestral_project.dto.TeamDto;
import cz.cvut.fel.semestral_project.dto.TeamMemberDto;
import cz.cvut.fel.semestral_project.dto.TournamentTermWebDto;
import cz.cvut.fel.semestral_project.dto.WebTeamDto;
import cz.cvut.fel.semestral_project.model.Registration;
import cz.cvut.fel.semestral_project.model.Team;
import cz.cvut.fel.semestral_project.service.RegistrationService;
import cz.cvut.fel.semestral_project.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Týmy", description = "Správa soutěžních týmů")
public class TeamApiController {

    @Autowired
    private TeamService teamService;

    @Autowired
    private RegistrationService registrationService;

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
                md.setTshirtSize(m.getTshirtSize());
                return md;
            }).collect(Collectors.toList());
            dto.setTeamMembers(memberDtos);
        }
        return dto;
    }

    @GetMapping
    @Operation(summary = "Získat seznam všech týmů")
    public ResponseEntity<List<TeamDto>> getAllTeams() {
        List<TeamDto> dtos = teamService.getAllTeams().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Získat detail týmu podle ID")
    public ResponseEntity<TeamDto> getTeamById(@PathVariable Long id) {
        Team team = teamService.getTeamById(id);
        if (team == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(team));
    }

    @PostMapping
    @Operation(summary = "Vytvořit nový tým")
    public ResponseEntity<TeamDto> createTeam(@RequestBody Team team) {
        Team created = teamService.createTeam(team);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Aktualizovat údaje týmu")
    public ResponseEntity<TeamDto> updateTeam(@PathVariable Long id, @RequestBody Team teamDetails) {
        Team updated = teamService.updateTeam(id, teamDetails);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDto(updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Smazat tým")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/web")
    @Operation(summary = "Získat seznam týmů pro web seskupený podle turnajových termínů")
    public ResponseEntity<List<TournamentTermWebDto>> getWebTeams() {
        List<Registration> registrations = registrationService.getAllRegistrations();
        
        // Group registrations by tournament term name
        var grouped = registrations.stream().collect(Collectors.groupingBy(reg -> 
            reg.getTournamentTerm() != null ? reg.getTournamentTerm().getName() : "Neznámý termín"
        ));

        List<TournamentTermWebDto> result = grouped.entrySet().stream().map(entry -> {
            String termName = entry.getKey();
            List<WebTeamDto> teamDtos = entry.getValue().stream().map(reg -> {
                WebTeamDto dto = new WebTeamDto();
                dto.setTeamName(reg.getTeamName());
                dto.setSchoolName(reg.getSchoolName());
                dto.setSchoolAddress(reg.getSchoolAddress());
                dto.setSchoolCity(reg.getSchoolCity());
                return dto;
            }).collect(Collectors.toList());

            TournamentTermWebDto termDto = new TournamentTermWebDto();
            termDto.setTermName(termName);
            termDto.setTeams(teamDtos);
            return termDto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
