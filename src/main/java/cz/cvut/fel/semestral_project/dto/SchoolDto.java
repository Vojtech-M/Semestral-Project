package cz.cvut.fel.semestral_project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SchoolDto {
    private Long id;

    @NotBlank(message = "School name is required")
    private String name;
    private String city;
    private String adress;
    private String zipCode;
    private String website;
    private boolean approved;

    // Konstruktor, který převede entitu School na bezpečné DTO
    public SchoolDto(cz.cvut.fel.semestral_project.model.School school) {
        this.id = school.getId();
        this.name = school.getName();
        this.city = school.getCity();
        this.adress = school.getAdress();
        this.zipCode = school.getZipCode();
        this.website = school.getWebsite();
        this.approved = school.isApproved();
    }
}