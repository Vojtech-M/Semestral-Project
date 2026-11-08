package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity // <-- Add this annotation
@Table(name = "teachers")
@Data
public class Teacher extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

}