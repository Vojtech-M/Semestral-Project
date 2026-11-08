package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "registrations") // Optional, specifies table name
@Data
public class Registration extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    private String schoolName;
    private String schoolAddress;
    private String schoolCity;
    private String schoolZip;
    private String schoolWeb;
    private String teamName;
}