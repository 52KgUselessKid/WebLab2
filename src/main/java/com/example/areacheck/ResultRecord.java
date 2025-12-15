package com.example.areacheck;

import java.io.Serializable;
import java.time.LocalDateTime;

public class ResultRecord implements Serializable {
    private final double x;
    private final double y;
    private final double r;
    private final boolean hit;
    private final LocalDateTime time;
    private final long execMillis;

    public ResultRecord(double x, double y, double r, boolean hit, LocalDateTime time, long execMillis) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.time = time;
        this.execMillis = execMillis;
    }

    public double getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public boolean isHit() { return hit; }
    public LocalDateTime getTime() { return time; }
    public long getExecMillis() { return execMillis; }
}