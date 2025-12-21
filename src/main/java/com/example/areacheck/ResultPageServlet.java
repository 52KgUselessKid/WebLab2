package com.example.areacheck;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet("/result")
public class ResultPageServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        HttpSession session = req.getSession(false);

        if (session == null || session.getAttribute("lastResult") == null) {
            resp.sendRedirect(req.getContextPath() + "/app");
            return;
        }

        req.getRequestDispatcher("/WEB-INF/jsp/result.jsp")
                .forward(req, resp);
    }
}
