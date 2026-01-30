package com.example.areacheck;

import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;

import java.io.Serializable;
import java.time.LocalDateTime;

@Named("pointBean")
@ViewScoped
public class PointBean implements Serializable {

    @Inject
    private ResultsBean resultsBean;

    private double x = 0.0;
    private double y = 0.0;
    private double r = 3.0;

    // ── новые поля для чекбоксов R ────────────────────────────────
    private boolean rSelected1  = false;
    private boolean rSelected15 = false;
    private boolean rSelected2  = false;
    private boolean rSelected25 = false;
    private boolean rSelected3  = true;   // по умолчанию выбрано 3

    // Геттеры и сеттеры для X, Y, R (старые — оставляем)
    public double getX() { return x; }
    public void setX(double x) {
        // Защита от мусора 0–100
        if (x >= 0 && x <= 100) {
            // Предполагаем, что это процент → пересчитываем
            this.x = -5 + (x / 100.0) * 10;  // от -5 до 5
        } else {
            this.x = x;
        }

        // Дополнительная обрезка
        //this.x = Math.max(-5, Math.min(5, x));  // жёстко обрезаем до допустимого
    }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

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
            hit = isHit(x, y, r);
            long execTime = System.nanoTime() - start;

            LocalDateTime now = LocalDateTime.now();
            ResultRecord record = new ResultRecord(x, y, r, hit, now, execTime);
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
        x = 0;
        y = 0;
        syncR(3.0);   // ← важно — сбрасываем и чекбоксы, и r
    }

    private boolean isHit(double x, double y, double r) {
        // ваша логика попадания — оставляем как есть
        if (x <= 0 && x >= -r && y >= 0 && y <= r / 2.0) return true;
        if (x >= 0 && y <= 0 && y >= x - r / 2.0) return true;
        return x <= 0 && y <= 0 && (x * x + y * y) <= (r * r / 4.0);
    }
}