package cz.cvut.fel.semestral_project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TournamentTermWebDto {
    private String termName;
    private List<WebTeamDto> teams;
}
