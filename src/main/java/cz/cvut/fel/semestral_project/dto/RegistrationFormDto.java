package cz.cvut.fel.semestral_project.dto;

import lombok.Data;
import java.util.List;

@Data
public class RegistrationFormDto {
    private Long schoolId;
    private String schoolName;
    private String schoolAddress;
    private String schoolCity;
    private String schoolZip;
    private String schoolWeb;
    private String teamName;
    private Long tournamentTermId;
    private String teacherName;
    private String teacherEmail;
    private String teacherPhone;
    private List<String> teamMembers;
}

