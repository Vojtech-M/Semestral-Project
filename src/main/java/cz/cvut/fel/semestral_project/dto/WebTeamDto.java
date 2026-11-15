package cz.cvut.fel.semestral_project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebTeamDto {
    private String termName;
    private String teamName;
    private String schoolName;
    private String schoolAddress;
    private String schoolCity;
}
