package com.example.areacheck.beans;

import com.example.areacheck.model.ResultEntity;
import com.example.areacheck.util.AreaChecker;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;


@Named("pointBean")
@SessionScoped
public class PointBean implements Serializable {

    private double x;
    private double y;
    private double r;

    private String result;

    private List<Double> xValues;
    private List<Double> rValues;


    @Inject
    private ResultsBean resultsBean;

    @PostConstruct
    public void init() {
        xValues = Arrays.asList(-2.0, -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0);
        rValues = Arrays.asList(1.0, 1.5, 2.0, 2.5, 3.0);

        x = 0;
        y = 0;
        r = 1;
        result = "Введите значения";
    }

    public void submit() {
        long start = System.nanoTime();
        boolean hit = AreaChecker.check(x, y, r);
        long execTime = System.nanoTime() - start;

        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        ResultEntity entity = new ResultEntity(x, y, r, hit, time, execTime);
        resultsBean.add(entity);

        result = hit ? "Попадание!" : "Промах!";
    }

    // Getters и Setters
    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public double getR() { return r; }
    public void setR(double r) { this.r = r; }

    public String getResult() { return result; }

    public List<Double> getXValues() { return xValues; }
    public void setXValues(List<Double> xValues) {
        this.xValues = xValues;
    }

    public List<Double> getRValues() { return rValues; }
    public void setRValues(List<Double> rValues) {
        this.rValues = rValues;
    }
}