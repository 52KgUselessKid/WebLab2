package com.example.areacheck;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/AreaCheck")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        long start = System.nanoTime();
        resp.setContentType("text/html;charset=UTF-8");

        String sx = req.getParameter("x");
        String sy = req.getParameter("y");
        String sr = req.getParameter("r");

        double x, y, r;
        String errmsg = null;
        try {
            x = Double.parseDouble(sx);
            y = Double.parseDouble(sy);
            r = Double.parseDouble(sr);
        } catch (Exception e) {
            x = y = r = 0;
            errmsg = "Неверные параметры.";
        }

        boolean hit = false;
        if (errmsg == null) {
            hit = isHit(x, y, r);
        }

        long exec = System.nanoTime() - start;
        LocalDateTime now = LocalDateTime.now();


        HttpSession session = req.getSession(true);
        synchronized (session) {
            List<ResultRecord> results = (List<ResultRecord>) session.getAttribute("results");
            if (results == null) {
                results = new ArrayList<>();
                session.setAttribute("results", results);
            }
            results.add(new ResultRecord(x, y, r, hit, now, exec));
        }


        try (PrintWriter out = resp.getWriter()) {
            out.println("<!doctype html><html><head><meta charset='utf-8'><title>Результат проверки</title></head><body>");
            out.printf("<h2>Результат проверки точки</h2>%n");
            if (errmsg != null) {
                out.printf("<p style='color:red;'>%s</p>", errmsg);
            } else {
                out.println("<table border='1' cellpadding='4'>");
                out.println("<tr><th>x</th><th>y</th><th>r</th><th>Попадание?</th><th>Время</th><th>Время выполнения</th></tr>");
                String execFormatted;
                if (exec < 1000) {
                    execFormatted = "< 0.001 мс";
                } else if (exec < 1_000_000) {
                    execFormatted = String.format("%.3f мс", exec / 1_000_000.0);
                } else {
                    execFormatted = String.format("%.3f мс", exec / 1_000_000.0);
                }

                out.printf("<tr><td>%.5f</td><td>%.5f</td><td>%.5f</td><td>%s</td><td>%s</td><td>%s</td></tr>",
                        x, y, r, hit ? "Да" : "Нет", now.toString(), execFormatted);
                out.println("</table>");
            }

            out.println("<p><a href=\"" + req.getContextPath() + "/app\">Вернуться к форме</a></p>");
            out.println("</body></html>");
        }
    }


    private boolean isHit(double x, double y, double r) {

        if (x <= 0 && x >= -r && y >= 0 && y <= r/2.0) return true;

        if (x >= 0 && y <= 0 && y >= x - r/2.0) return true;

        if (x <= 0 && y <= 0 && (x*x + y*y) <= (r*r/4.0)) return true;

        return false;
    }
}
