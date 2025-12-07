<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.example.areacheck.ResultRecord" %>
<%@ page import="java.util.List" %>
<%
    String fio = "Кабиров Данияр Умарович";
    String group = "P3223";
    String variant = "2555";
%>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Лабораторная работа №2</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/style.css">
</head>
<body>
    <div class="container">
        <header id="main-header">
            <h1>Лабораторная работа №2</h1>
            <div class="student-info">
                <span class="fio"><%= fio %></span>
                <span class="group">Группа: <%= group %></span>
                <span class="variant">Вариант: <%= variant %></span>
            </div>
        </header>

        <div class="input-section">
            <form id="pointForm" method="get" action="<%= request.getContextPath() %>/app">
                <div class="form-row">
                    <label for="x">X:</label>
                    <div class="x-buttons">
                        <% for (int i = -5; i <= 3; i++) { %>
                            <button type="button" class="x-btn" data-value="<%= i %>"><%= i %></button>
                        <% } %>
                    </div>
                    <input type="hidden" id="x" name="x" required>

                    <label for="y">Y:</label>
                    <input type="text" id="y" name="y" placeholder="-5...3" required>
                    <div class="error-message" id="y-error"></div>

                    <label for="r">R:</label>
                    <div class="r-radios">
                        <% for (int i = 2; i <= 5; i++) { %>
                            <div class="radio-option">
                                <input type="radio" id="r<%= i %>" name="r" value="<%= i %>" class="r-radio">
                                <label for="r<%= i %>" class="radio-label"><%= i %></label>
                            </div>
                        <% } %>
                    </div>
                    <input type="hidden" id="r" name="r" required>
                    <div class="error-message" id="r-error"></div>

                    <button type="submit" id="submitBtn">Проверить</button>
                    <button type="button" id="clearBtn">Сбросить</button>
                </div>
            </form>
            <div id="error-banner"></div>
        </div>

        <div class="graph-container">
            <canvas id="areaGraph" width="300" height="300"></canvas>
            <div id="canvasPoint"></div>
        </div>

        <div id="results">
            <h3>Результаты</h3>
            <table id="resultsTable">
                <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Результат</th>
                        <th>Время</th>
                        <th>Время работы скрипта</th>
                    </tr>
                </thead>
                <tbody id="resultsBody">
                <%
                    List<ResultRecord> results = (List<ResultRecord>) session.getAttribute("results");
                    if (results != null && !results.isEmpty()) {
                        for (int i = results.size() - 1; i >= 0; i--) {
                            ResultRecord rec = results.get(i);
                %>
                <tr>
                    <td><%= rec.getX() %></td>
                    <td><%= rec.getY() %></td>
                    <td><%= rec.getR() %></td>
                    <td class="<%= rec.isHit() ? "hit" : "miss" %>">
                        <%= rec.isHit() ? "Попадание" : "Промах" %>
                    </td>
                    <td><%= rec.getTime() %></td>
                    <td><%= rec.getExecMillis() %> мс</td>
                </tr>
                <%
                        }
                    }
                %>
                </tbody>
            </table>
            <div id="form-error"></div>
        </div>
    </div>

    <script src="<%= request.getContextPath() %>/js/script.js"></script>
</body>
</html>