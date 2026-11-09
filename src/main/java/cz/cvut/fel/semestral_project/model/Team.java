package cz.cvut.fel.semestral_project.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import cz.cvut.fel.semestral_project.model.enums.TShirtSize;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "teams")
public class Team extends BaseEntity {

    @Column(length = 24)
    private String name;

    private String teacherName;

    @Enumerated(EnumType.STRING)
    private TShirtSize tShirtSize;

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @OneToMany(mappedBy = "team")
    private List<TeamMember> teamMembers;

    @OneToMany(mappedBy = "team")
    @JsonManagedReference // Prevents infinite recursion in JSON
    private List<Registration> registrations = new ArrayList<>();

}
