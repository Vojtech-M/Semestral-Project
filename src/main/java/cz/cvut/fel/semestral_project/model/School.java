package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import cz.cvut.fel.semestral_project.model.enums.SchoolLevel;

@Entity
@Table(name = "schools")
@Data
public class School extends BaseEntity {

    private String name;
    private String city;
    private String website;

    @Enumerated(EnumType.STRING)
    private SchoolLevel approvalStatus;

    private String zipCode;
    private String adress;

    private boolean approved = false;

    @OneToMany(mappedBy = "school")
    private List<Teacher> teachers;

    @OneToMany(mappedBy = "school")
    private List<Team> teams;
}
