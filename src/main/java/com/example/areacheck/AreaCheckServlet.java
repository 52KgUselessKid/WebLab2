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
        long start = System.currentTimeMillis();
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

        long exec = System.currentTimeMillis() - start;
        LocalDateTime now = LocalDateTime.now();

        // сохраняем в сессии
        HttpSession session = req.getSession(true);
        synchronized (session) {
            List<ResultRecord> results = (List<ResultRecord>) session.getAttribute("results");
            if (results == null) {
                results = new ArrayList<>();
                session.setAttribute("results", results);
            }
            results.add(new ResultRecord(x, y, r, hit, now, exec));
        }

        // Формируем HTML ответ
        try (PrintWriter out = resp.getWriter()) {
            out.println("<!doctype html><html><head><meta charset='utf-8'><title>Результат проверки</title></head><body>");
            out.printf("<h2>Результат проверки точки</h2>%n");
            if (errmsg != null) {
                out.printf("<p style='color:red;'>%s</p>", errmsg);
            } else {
                out.println("<table border='1' cellpadding='4'>");
                out.println("<tr><th>x</th><th>y</th><th>r</th><th>Попадание?</th><th>Время</th><th>Время вып. (мс)</th></tr>");
                out.printf("<tr><td>%.5f</td><td>%.5f</td><td>%.5f</td><td>%s</td><td>%s</td><td>%d</td></tr>",
                        x, y, r, hit ? "Да" : "Нет", now.toString(), exec);
                out.println("</table>");
            }

            out.println("<p><a href=\"" + req.getContextPath() + "/app\">Вернуться к форме</a></p>");
            out.println("</body></html>");
        }
    }

    // Условие попадания: (см. комментарий в начале)
    private boolean isHit(double x, double y, double r) {
        // 1) Rectangle: x in [-R,0], y in [0,R/2]
        if (x <= 0 && x >= -r && y >= 0 && y <= r/2.0) return true;

        // 2) Triangle in I quadrant: x>=0, y>=0, y <= -x + R/2
        if (x >= 0 && y >= 0 && y <= (-x + r/2.0)) return true;

        // 3) Quarter circle in IV quadrant: x>=0, y<=0 and x^2+y^2 <= (R/2)^2
        if (x <= 0 && y <= 0 && (x*x + y*y) <= (r*r/4.0)) return true;

        return false;
    }
}
