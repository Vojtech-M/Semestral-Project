package cz.cvut.fel.semestral_project.model;

import jakarta.persistence.*;


@Entity
@Table(name = "team_members")
public class TeamMember extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    private String userName;
    private String tshirtSize;

    public TeamMember() {
    }

    public TeamMember(Team team, String userName) {
        this.team = team;
        this.userName = userName;
    }

    public TeamMember(Team team, String userName, String tshirtSize) {
        this.team = team;
        this.userName = userName;
        this.tshirtSize = tshirtSize;
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

    public String getTshirtSize() {
        return tshirtSize;
    }

    public void setTshirtSize(String tshirtSize) {
        this.tshirtSize = tshirtSize;
    }



}
