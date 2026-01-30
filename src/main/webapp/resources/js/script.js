class PointChecker {
    constructor() {
        this.currentX = null;
        this.currentR = null;
        this.appContextPath = '';
        this.init();
    }
    init() {
        this.appContextPath = this.getContextPath();
        this.setupEventListeners();
        drawGraph();
        this.restoreSelection();
    }
    getContextPath() {
        const path = window.location.pathname;
        const contextPath = path.substring(0, path.indexOf('/', 1));
        return contextPath || '';
    }
    setupEventListeners() {
        document.querySelectorAll('.r-radio').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.checked) {
            this.selectRValue(e.target.value);
        }
    });
});
        const yInput = document.getElementById('pointForm:y');
        if (yInput) {
            yInput.addEventListener('input', (e) => {
                this.validateY(e.target.value);
            });
        }
        const form = document.getElementById('pointForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm()) {
                    e.preventDefault();
                }
            });
        }
        const canvas = document.getElementById('areaGraph');
        if (canvas) {
            canvas.addEventListener('click', (e) => {
                this.handleCanvasClick(e);
            });
        }
    }
    selectXValue(value) {
        this.currentX = value;
        document.getElementById('pointForm:hiddenX').value = value;

        this.saveSelection();
    }
    selectRValue(value) {
    this.currentR = value;
    drawGraph(parseFloat(value));
    this.saveSelection();
}
    validateY(value) {
        const errorElement = document.getElementById('y-error');
        if (!errorElement) return false;
        const numValue = this.parseNumber(value);

        if (value === '') {
            errorElement.textContent = '';
            return false;
        }
        if (isNaN(numValue)) {
            errorElement.textContent = 'Y должен быть числом';
            return false;
        }
        if (numValue < -5 || numValue > 3) {
            errorElement.textContent = 'Y должен быть в диапазоне от -5 до 3';
            return false;
        }
        errorElement.textContent = '';
        return true;
    }
    validateR(value) {
    const errorElement = document.getElementById('r-error');
    if (!errorElement) return false;
    if (!value) {
        errorElement.textContent = 'Выберите значение R';
        return false;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 2 || numValue > 5) {
        errorElement.textContent = 'R должен быть числом от 2 до 5';
        return false;
    }
    errorElement.textContent = '';
    return true;
}
    parseNumber(value) {
        if (!value || value === '') return NaN;
        const normalizedValue = value.replace(',', '.');
        return parseFloat(normalizedValue);
    }
    validateForm() {
    const xInput = document.getElementById('pointForm:hiddenX');
    const yInput = document.getElementById('pointForm:y');

    const selectedRadio = document.querySelector('.r-radio:checked');
    if (!selectedRadio) {
        showError('Выберите значение R');
        return false;
    }
    const rValue = selectedRadio.value;
    if (!xInput.value) {
        showError('Выберите значение X');
        return false;
    }
    if (!yInput.value) {
        showError('Введите значение Y');
        return false;
    }
    const yValid = this.validateY(yInput.value);
    const rValid = this.validateR(rValue);
    if (!yValid || !rValid) {
        showError('Исправьте ошибки в форме');
        return false;
    }
    return true;
}

    handleCanvasClick(e) {
        const canvas = document.getElementById('areaGraph');
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const size = canvas.width;
        const center = size / 2;
        const scale = size / 10;

        // 1. Пытаемся взять из checked радио
        let selectedRadio = document.querySelector('.r-radio:checked');
        let rValue = null;

        if (selectedRadio) {
            rValue = this.parseNumber(selectedRadio.value);
        }

        // 2. Если не нашли — берём из hidden поля (самый надёжный запасной вариант)
        if (!rValue || isNaN(rValue)) {
            const hiddenR = document.getElementById('pointForm:r');
            if (hiddenR && hiddenR.value) {
                rValue = this.parseNumber(hiddenR.value);
                console.log("R взят из hidden поля:", rValue);
            }
        }

        // 3. Если всё равно ничего — дефолт 3 и принудительно отмечаем
        if (!rValue || isNaN(rValue) || rValue < 1) {
            rValue = 3;
            const defRadio = document.querySelector('.r-radio[value="3"]');
            if (defRadio) {
                defRadio.checked = true;
                document.getElementById('pointForm:r').value = '3';
                drawGraph(3);
            }
            console.log("R принудительно установлен на 3");
        }

        const realX = (clickX - center) / scale;
        const realY = (center - clickY) / scale;

        const clampedX = Math.max(-5, Math.min(3, Math.round(realX * 100) / 100));
        const clampedY = Math.max(-5, Math.min(3, Math.round(realY * 100) / 100));

        document.getElementById('pointForm:hiddenX').value = clampedX;
        document.getElementById('pointForm:y').value = clampedY;
        document.getElementById('pointForm:r').value = rValue;  // ← перестраховка

        // Показываем временную точку
        const point = document.getElementById('canvasPoint');
        point.style.left = `${clickX + rect.left}px`;
        point.style.top = `${clickY + rect.top}px`;
        point.style.display = 'block';

        // Отправка
        setTimeout(() => {
            const submitBtn = document.getElementById('pointForm:checkBtn') || document.querySelector('[id*="checkBtn"]');
            if (submitBtn) {
                submitBtn.click();
            } else {
                document.getElementById('pointForm').submit();
            }
        }, 100);
    }

    saveSelection() {
    try {
        if (this.currentX) {
            localStorage.setItem('selectedX', this.currentX);
        }
        if (this.currentR) {
            localStorage.setItem('selectedR', this.currentR);
        }
    } catch (e) {
        console.error('Error saving selection:', e);
    }
}
    restoreSelection() {
    try {
            const savedR = localStorage.getItem('selectedR') || '3';
            const radio = document.querySelector(`.r-radio[value="${savedR}"]`)
                       || document.querySelector('.r-radio[value="3"]');

            if (radio) {
                radio.checked = true;
                document.getElementById('pointForm:r').value = savedR;
                drawGraph(parseFloat(savedR));
            }
        } catch (e) {
        console.error('Error restoring selection:', e);
        const defaultRadio = document.querySelector('.r-radio[value="3"]');
        if (defaultRadio) {
            defaultRadio.checked = true;
            drawGraph(3);
        }
    }
}
}

document.addEventListener('DOMContentLoaded', () => {
    new PointChecker();
});

window.pointChecker = new PointChecker();

function drawSavedPoints(r) {
    // Самый надёжный селектор: все <tr> внутри контейнера результатов
    const tableContainer = document.getElementById('resultsPanel') ||
                          document.getElementById('results') ||
                          document.querySelector('[id*="results"]');

    if (!tableContainer) {
        console.warn("Контейнер результатов не найден");
        return;
    }

    // Ищем все строки таблицы внутри контейнера
    const rows = tableContainer.querySelectorAll('tr');

    const canvas = document.getElementById('areaGraph');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const center = canvas.width / 2;
    const scale = canvas.width / 10;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {  // X, Y, R, Результат, Время, Время работы
            const pointRText = cells[2].textContent.trim();
            const pointR = parseFloat(pointRText);

            if (!isNaN(pointR) && Math.abs(pointR - r) < 0.001) {
                const x = parseFloat(cells[0].textContent.trim());
                const y = parseFloat(cells[1].textContent.trim());
                const resultCell = cells[3];
                const isHit = resultCell && resultCell.classList.contains('hit');

                if (!isNaN(x) && !isNaN(y)) {
                    const pointX = center + x * scale;
                    const pointY = center - y * scale;

                    ctx.fillStyle = isHit ? '#4CAF50' : '#dc3545';
                    ctx.beginPath();
                    ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    });
}

function drawGraph(r = 3) {
    console.log("drawGraph вызван, r =", r);

    const canvas = document.getElementById('areaGraph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 300;
    const center = size / 2;
    const scale = size / 10;  // 30 px = 1 единица

    ctx.clearRect(0, 0, size, size);

    // Оси + стрелки (это рисуется всегда)
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center, 0); ctx.lineTo(center, size);
    ctx.moveTo(0, center); ctx.lineTo(size, center);
    ctx.stroke();

    // Стрелки
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.moveTo(center, 0); ctx.lineTo(center-6,12); ctx.lineTo(center+6,12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(size, center); ctx.lineTo(size-12,center-6); ctx.lineTo(size-12,center+6); ctx.fill();

    // === Область (с защитой от отрицательных/больших координат) ===
    ctx.fillStyle = 'rgba(0, 180, 255, 0.25)';
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 2;

    const halfR = r / 2;
    const rScale = r * scale;
    const halfRScale = halfR * scale;

    // Прямоугольник (второй квадрант)
    let rectLeft = center - rScale;
    let rectTop  = center - halfRScale;
    let rectW = rScale;
    let rectH = halfRScale;

    // Защита: если rectLeft < 0 — сдвигаем, но лучше клиппинг
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, size, size);  // клиппинг к canvas
    ctx.clip();

    ctx.fillRect(rectLeft, rectTop, rectW, rectH);
    ctx.strokeRect(rectLeft, rectTop, rectW, rectH);

    // Четверть круга (третий квадрант)
    ctx.beginPath();
    ctx.arc(center, center, halfRScale, Math.PI, 1.5 * Math.PI, false);
    ctx.lineTo(center, center);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Треугольник (четвёртый квадрант)
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center, center + halfRScale);
    ctx.lineTo(center + halfRScale, center);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Метки (всегда рисуем)
    ctx.fillStyle = '#000';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    for (let i = -5; i <= 5; i++) {
        if (i === 0) continue;
        const px = center + i * scale;
        const py = center - i * scale;
        ctx.beginPath(); ctx.moveTo(px, center-4); ctx.lineTo(px, center+4); ctx.stroke();
        ctx.fillText(i, px, center + 18);
        ctx.beginPath(); ctx.moveTo(center-4, py); ctx.lineTo(center+4, py); ctx.stroke();
        ctx.fillText(i, center - 20, py + 4);
    }
    ctx.fillText('X', size - 15, center - 10);
    ctx.fillText('Y', center + 18, 18);

    drawSavedPoints(r);

    console.log("drawGraph завершён");
}

function showError(message) {
        const banner = document.getElementById('error-banner');
        if (banner) {
            banner.textContent = message;
            banner.style.display = "block";
            setTimeout(() => {
                banner.style.display = "none";
            }, 4000);
        }
    }

function handleAfterSubmit() {
    const selRadio = document.querySelector('.r-radio:checked');
    const r = selRadio ? parseFloat(selRadio.value) : 3;
    drawGraph(r);
    document.getElementById('canvasPoint').style.display = 'none';
}

function handleAfterClear() {
    showError('Результаты успешно очищены');
    const selRadio = document.querySelector('.r-radio:checked');
    const r = selRadio ? parseFloat(selRadio.value) : 3;
    drawGraph(r);
    localStorage.removeItem('selectedX');
    localStorage.removeItem('selectedR');
}

// В updateR() обязательно обновляем hidden поле и снимаем другие галочки
function updateR(checkbox, value) {
    // Всегда снимаем с остальных
    document.querySelectorAll('input.r-radio[type="checkbox"]').forEach(cb => {
        if (cb !== checkbox) cb.checked = false;
    });

    if (checkbox.checked) {
        document.getElementById('pointForm:r').value = value;
        drawGraph(parseFloat(value));
    } else {
        // Если сняли — возвращаем дефолт
        const def = document.querySelector('.r-radio[value="3"]');
        if (def) {
            def.checked = true;
            document.getElementById('pointForm:r').value = '3';
            drawGraph(3);
        }
    }
}