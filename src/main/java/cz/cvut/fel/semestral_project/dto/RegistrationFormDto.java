package cz.cvut.fel.semestral_project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class RegistrationFormDto {
    private Long schoolId;

    @NotBlank(message = "School name is required")
    private String schoolName;

    @NotBlank(message = "School address is required")
    private String schoolAddress;

    @NotBlank(message = "School city is required")
    private String schoolCity;

    @NotBlank(message = "School ZIP is required")
    private String schoolZip;

    @NotBlank(message = "School web is required")
    private String schoolWeb;

    @NotBlank(message = "Team name is required")
    private String teamName;
    private Long tournamentTermId;
    private String teacherName;
    private String teacherEmail;
    private String teacherPhone;
    private List<TeamMemberDto> teamMembers;
}

