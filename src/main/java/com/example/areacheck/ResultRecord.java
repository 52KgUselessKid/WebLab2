package com.example.areacheck;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "RESULTS")
public class ResultRecord implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 40, scale = 20)
    private BigDecimal x;

    @Column(precision = 40, scale = 20)
    private BigDecimal y;
    private double r;
    private boolean hit;
    private LocalDateTime time;
    private long execMillis;

    public ResultRecord() {
    }

    public ResultRecord(BigDecimal x, BigDecimal y, double r,
                        boolean hit, LocalDateTime time, long execMillis) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.time = time;
        this.execMillis = execMillis;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getX() {
        return x;
    }

    public void setX(BigDecimal x) {
        if (x != null) {
            this.x = x;
        }
    }


    public BigDecimal getY() {
        return y;
    }

    public void setY(BigDecimal y) {
        if (y != null) {
            this.y = y;
        }
    }


    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }

    public boolean isHit() {
        return hit;
    }

    public void setHit(boolean hit) {
        this.hit = hit;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public long getExecMillis() {
        return execMillis;
    }

    public void setExecMillis(long execMillis) {
        this.execMillis = execMillis;
    }

    public String getFormattedTime() {
        return time.format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"));
    }

    public String getFormattedExec() {
        return String.format("%.3f мс", execMillis / 1_000_000.0);
    }
}