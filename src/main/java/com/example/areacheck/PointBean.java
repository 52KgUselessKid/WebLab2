package com.example.areacheck;

import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;

@Named("pointBean")          // ← обязательно! имя "pointBean"
@ViewScoped                  // или @RequestScoped, если не нужно сохранять состояние между запросами
public class PointBean implements Serializable {
    @Inject
    private ResultsBean resultsBean;

//    public PointBean() {
//        this.resultsBean = (ResultsBean) FacesContext.getCurrentInstance().getExternalContext().getSessionMap().get("resultsBean");
//    }

    private double x = 0.0;
    private double y = 0.0;
    private double r = 3.0;

    // геттеры и сеттеры
    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public double getR() { return r; }
    public void setR(double r) { this.r = r; }

    public void check() {
        Map<String, String> params = FacesContext.getCurrentInstance()
                .getExternalContext().getRequestParameterMap();

        String sx = params.get("x");
        String sy = params.get("y");
        String sr = params.get("r");

        // Логируем входящие параметры — поможет понять проблему
        System.out.println("X: " + sx + ", Y: " + sy + ", R: " + sr);

        double x = 0, y = 0, r = 0;
        boolean hit = false;

        try {
            if (sx == null || sy == null || sr == null) {
                throw new IllegalArgumentException("Не переданы параметры x, y или r");
            }

            x = Double.parseDouble(sx);
            y = Double.parseDouble(sy);
            r = Double.parseDouble(sr);

            if (x < -5 || x > 3 || y < -5 || y > 3 || r < 2 || r > 5) {
                throw new IllegalArgumentException("Значения вне диапазона");
            }

            long start = System.nanoTime();
            hit = isHit(x, y, r);
            long execTime = System.nanoTime() - start;

            LocalDateTime now = LocalDateTime.now();
            ResultRecord record = new ResultRecord(x, y, r, hit, now, execTime);
            resultsBean.add(record);
        } catch (NumberFormatException e) {
            FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "Ошибка", "Неверный формат чисел в x/y/r"));
        } catch (IllegalArgumentException e) {
            FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "Ошибка", e.getMessage()));
        } catch (Exception e) {
            FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "Ошибка сервера", e.getMessage()));
            e.printStackTrace(); // для логов
        }
    }

    public void clear() {
        resultsBean.clear();
        x = 0; y = 0; r = 3;
    }

    private boolean isHit(double x, double y, double r) {
        if (x <= 0 && x >= -r && y >= 0 && y <= r / 2.0) return true;
        if (x >= 0 && y <= 0 && y >= x - r / 2.0) return true;
        return x <= 0 && y <= 0 && (x * x + y * y) <= (r * r / 4.0);
    }
}