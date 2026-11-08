package cz.cvut.fel.semestral_project.dto;

import lombok.Data;

@Data
public class RegistrationFormDto {
    private String schoolName;
    private String schoolAddress;
    private String schoolCity;
    private String schoolZip;
    private String schoolWeb;
    private String teamName;

}
