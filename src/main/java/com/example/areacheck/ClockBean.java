package com.example.areacheck;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Named("clockBean")               // ← обязательно!
@RequestScoped
public class ClockBean {

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");

    public String getCurrentTime() {
        return LocalDateTime.now().format(FMT);
    }
}