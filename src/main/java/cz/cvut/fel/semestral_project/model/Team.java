package cz.cvut.fel.semestral_project.model;

import cz.cvut.fel.semestral_project.model.enums.TShirtSize;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "teams")
@Data
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
    private List<Registration> registrations;
}
