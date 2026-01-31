package com.example.areacheck;

import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Named("pointBean")
@ViewScoped
public class PointBean implements Serializable {

    @Inject
    private ResultsBean resultsBean;

    private BigDecimal x = BigDecimal.ZERO;
    private BigDecimal y = BigDecimal.ZERO;
    private double r = 3.0;

    public BigDecimal getX() {
        return x;
    }

    // incomingPercent приходит из hiddenX (0..100)
    public void setX(BigDecimal incomingPercent) {
        if (incomingPercent == null) return;

        BigDecimal percent = incomingPercent
                .max(BigDecimal.ZERO)
                .min(BigDecimal.valueOf(100));

        // rawX = -5 + percent/100 * 10
        BigDecimal rawX = BigDecimal.valueOf(-5)
                .add(percent
                        .divide(BigDecimal.valueOf(100), 20, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.TEN));

        this.x = rawX;   // ❗ НИ ОДНОГО округления
    }


    public BigDecimal getY() {
        return y;
    }

    public void setY(BigDecimal y) {
        this.y = y;
    }


    public double getR() { return r; }
    public void setR(double r) { this.r = r; }

    // ================================================
// Поля для чекбоксов R (каждый вариант — отдельный boolean)
    private boolean r1Selected  = false;
    private boolean r15Selected = false;
    private boolean r2Selected  = false;
    private boolean r25Selected = false;
    private boolean r3Selected  = true;   // по умолчанию выбрано 3.0

    // Геттеры и сеттеры — ИМЕННО ТАК, иначе JSF не найдёт свойство
    public boolean isR1Selected() {
        return r1Selected;
    }

    public void setR1Selected(boolean selected) {
        if (selected) syncR(1.0);
        this.r1Selected = selected;
    }

    public boolean isR15Selected() {
        return r15Selected;
    }

    public void setR15Selected(boolean selected) {
        if (selected) syncR(1.5);
        this.r15Selected = selected;
    }

    public boolean isR2Selected() {
        return r2Selected;
    }

    public void setR2Selected(boolean selected) {
        if (selected) syncR(2.0);
        this.r2Selected = selected;
    }

    public boolean isR25Selected() {
        return r25Selected;
    }

    public void setR25Selected(boolean selected) {
        if (selected) syncR(2.5);
        this.r25Selected = selected;
    }

    public boolean isR3Selected() {
        return r3Selected;
    }

    public void setR3Selected(boolean selected) {
        if (selected) syncR(3.0);
        this.r3Selected = selected;
    }

    // Синхронизация: только один true + реальное значение в поле r
    private void syncR(double value) {
        this.r = value;
        this.r1Selected  = (value == 1.0);
        this.r15Selected = (value == 1.5);
        this.r2Selected  = (value == 2.0);
        this.r25Selected = (value == 2.5);
        this.r3Selected  = (value == 3.0);
    }

    // Метод check (без параметров — берём значения из бина)
    public void check() {
        boolean hit = false;
        try {
//            if (x < -5 || x > 3 || y < -3 || y > 5 || r < 1 || r > 3) {  // пример для многих вариантов
//                throw new IllegalArgumentException("Значения вне диапазона");
//            }

            long start = System.nanoTime();
            hit = isHit(x, y, BigDecimal.valueOf(r));

            long execTime = System.nanoTime() - start;

            LocalDateTime now = LocalDateTime.now();
            ResultRecord record = new ResultRecord(
                    x,          // ← BigDecimal, без округлений
                    y,
                    r,
                    hit,
                    now,
                    execTime
            );

            resultsBean.add(record);

            // Для отладки — выведи в консоль сервера, что реально пришло
            System.out.println("check() вызван: x=" + x + ", y=" + y + ", r=" + r + ", hit=" + hit);
        } catch (IllegalArgumentException e) {
            FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "Ошибка", e.getMessage()));
        } catch (Exception e) {
            FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "Ошибка сервера", e.getMessage()));
            e.printStackTrace();
        }
    }

    public void clear() {
        resultsBean.clear();
        x = BigDecimal.ZERO;
        y = BigDecimal.ZERO;
        syncR(3.0);
    }


    private boolean isHit(BigDecimal x, BigDecimal y, BigDecimal r) {

        // x >= 0 && y >= 0
        if (x.compareTo(BigDecimal.ZERO) >= 0 &&
                y.compareTo(BigDecimal.ZERO) >= 0) {

            return x.compareTo(r.divide(BigDecimal.valueOf(2), 20, RoundingMode.HALF_UP)) <= 0
                    && y.compareTo(
                    r.subtract(x.multiply(BigDecimal.valueOf(2)))
            ) <= 0;
        }

        // x <= 0 && y >= 0
        if (x.compareTo(BigDecimal.ZERO) <= 0 &&
                y.compareTo(BigDecimal.ZERO) >= 0) {

            return x.compareTo(r.negate()) >= 0 &&
                    y.compareTo(r) <= 0;
        }

        // x < 0 && y < 0
        if (x.compareTo(BigDecimal.ZERO) < 0 &&
                y.compareTo(BigDecimal.ZERO) < 0) {
            return false;
        }

        // четверть круга
        if (x.compareTo(BigDecimal.ZERO) >= 0 &&
                y.compareTo(BigDecimal.ZERO) <= 0) {

            BigDecimal left = x.pow(2).add(y.pow(2));
            BigDecimal right = r.pow(2);

            return left.compareTo(right) <= 0;
        }

        return false;
    }


    private int sliderPercent = 100;  // центр = 0.0

    public int getSliderPercent() {
        return sliderPercent;
    }

    public void setSliderPercent(int percent) {
        this.sliderPercent = Math.max(0, Math.min(100, percent));

        BigDecimal rawX = BigDecimal.valueOf(-5)
                .add(
                        BigDecimal.valueOf(sliderPercent)
                                .divide(BigDecimal.valueOf(100), 20, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.TEN)
                );

        // ⚠️ ВАЖНО: тут МОЖНО округлять, потому что это СЛАЙДЕР
        this.x = rawX.setScale(2, RoundingMode.HALF_UP);
    }
}