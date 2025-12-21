package com.example.areacheck;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/AreaCheck")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        long start = System.nanoTime();

        String sx = req.getParameter("x");
        String sy = req.getParameter("y");
        String sr = req.getParameter("r");

        double x, y, r;
        boolean hit = false;

        try {
            x = Double.parseDouble(sx);
            y = Double.parseDouble(sy);
            r = Double.parseDouble(sr);
            hit = isHit(x, y, r);
        } catch (Exception e) {
            resp.sendRedirect(req.getContextPath() + "/app");
            return;
        }

        long execTime = System.nanoTime() - start;
        LocalDateTime now = LocalDateTime.now();

        HttpSession session = req.getSession(true);

        synchronized (session) {
            List<ResultRecord> results =
                    (List<ResultRecord>) session.getAttribute("results");

            if (results == null) {
                results = new ArrayList<>();
                session.setAttribute("results", results);
            }

            ResultRecord record =
                    new ResultRecord(x, y, r, hit, now, execTime);

            results.add(record);
            session.setAttribute("lastResult", record);
        }

        resp.sendRedirect(req.getContextPath() + "/result");
    }

    private boolean isHit(double x, double y, double r) {

        if (x <= 0 && x >= -r && y >= 0 && y <= r / 2.0) return true;

        if (x >= 0 && y <= 0 && y >= x - r / 2.0) return true;

        return x <= 0 && y <= 0 && (x * x + y * y) <= (r * r / 4.0);
    }
}
