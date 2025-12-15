package com.example.areacheck;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/app")
public class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        dispatch(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        dispatch(req, resp);
    }

    private void dispatch(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String x = req.getParameter("x");
        String y = req.getParameter("y");
        String r = req.getParameter("r");

        if (x != null && y != null && r != null) {
            req.getRequestDispatcher("/AreaCheck").forward(req, resp);
        } else {
            req.getRequestDispatcher("/WEB-INF/jsp/form.jsp").forward(req, resp);
        }
        String cmd = req.getParameter("cmd");
        if ("clear".equals(cmd)) {
            req.getSession().removeAttribute("results");
            resp.sendRedirect(req.getContextPath() + "/app");
        }
    }
}