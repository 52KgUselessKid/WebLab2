<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.example.areacheck.ResultRecord" %>
<%@ page import="java.time.format.DateTimeFormatter" %>

<%
    ResultRecord r = (ResultRecord) session.getAttribute("lastResult");

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
%>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Результат</title>
</head>
<body>

<h2>Результат проверки точки</h2>

<table border="1" cellpadding="5">
    <tr>
        <th>X</th>
        <th>Y</th>
        <th>R</th>
        <th>Результат</th>
        <th>Время</th>
        <th>Время выполнения</th>
    </tr>
    <tr>
        <td><%= r.getX() %></td>
        <td><%= r.getY() %></td>
        <td><%= r.getR() %></td>
        <td><%= r.isHit() ? "Попадание" : "Промах" %></td>
        <td><%= r.getTime().format(formatter) %></td>
        <td><%= String.format("%.3f мс", r.getExecMillis() / 1_000_000.0) %></td>
    </tr>
</table>

<br>
<a href="<%= request.getContextPath() %>/app">Вернуться к форме</a>

</body>
</html>
