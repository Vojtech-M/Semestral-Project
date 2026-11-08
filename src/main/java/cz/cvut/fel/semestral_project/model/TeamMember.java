package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.*;


@Entity
@Table(name = "team_members")
public class TeamMember extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    private String userName;


    public TeamMember() {
    }

    public TeamMember(Team team, String userName) {
        this.team = team;
        this.userName = userName;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }



}
