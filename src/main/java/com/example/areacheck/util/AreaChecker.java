package com.example.areacheck.util;

public class AreaChecker {

    public static boolean check(double x, double y, double r) {

        if (x <= 0 && x >= -r && y >= 0 && y <= r / 2.0)
            return true;

        if (x >= 0 && y <= 0 && y >= x - r / 2.0)
            return true;

        return x <= 0 && y <= 0 &&
                (x * x + y * y) <= (r * r / 4.0);
    }
}
