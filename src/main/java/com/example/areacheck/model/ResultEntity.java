package com.example.areacheck.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "results")
public class ResultEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double x;
    private double y;
    private double r;

    private boolean hit;

    @Column(name = "time")
    private String time;

    @Column(name = "exec_time")
    private long execTime;

    public ResultEntity() {
    }

    public ResultEntity(double x, double y, double r, boolean hit, String time, long execTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.time = time;
        this.execTime = execTime;
    }

    // Getters и Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public double getR() { return r; }
    public void setR(double r) { this.r = r; }

    public boolean isHit() { return hit; }
    public void setHit(boolean hit) { this.hit = hit; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public long getExecTime() { return execTime; }
    public void setExecTime(long execTime) { this.execTime = execTime; }

    @Override
    public String toString() {
        return "ResultEntity{" +
                "id=" + id +
                ", x=" + x +
                ", y=" + y +
                ", r=" + r +
                ", hit=" + hit +
                ", time='" + time + '\'' +
                ", execTime=" + execTime +
                '}';
    }
}