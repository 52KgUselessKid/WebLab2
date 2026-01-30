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
        document.querySelectorAll('.x-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectXValue(e.target.dataset.value);
            });
        });
        document.querySelectorAll('.r-radio').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.checked) {
            this.selectRValue(e.target.value);
        }
    });
});
        const yInput = document.getElementById('y');
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
        document.getElementById('x').value = value;

        document.querySelectorAll('.x-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value === value) {
                btn.classList.add('active');
            }
        });

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
    const xInput = document.getElementById('x');
    const yInput = document.getElementById('y');

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
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = canvas.width;
        const center = size / 2;
        const scale = size / 10;

        const selectedRadio = document.querySelector('.r-radio:checked');
        if (!selectedRadio) {
            showError('Сначала выберите значение R');
            return;
        }

        const rValue = this.parseNumber(selectedRadio.value);
        if (isNaN(rValue) || !rValue) {
            showError('Сначала выберите значение R');
            return;
        }

        const realX = (x - center) / scale;
        const realY = (center - y) / scale;
        const clampedX = Math.max(-5, Math.min(3, Math.round(realX * 100) / 100));
        const clampedY = Math.max(-5, Math.min(3, Math.round(realY * 100) / 100));

        document.getElementById('y').value = clampedY;

        // Обработка X (кнопки или hidden)
        const xHiddenInput = document.getElementById('x');
        xHiddenInput.value = clampedX;

        // деактивируем все кнопки X
        document.querySelectorAll('.x-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // активируем ближайшую кнопку X (если нужно)
        const xButtons = Array.from(document.querySelectorAll('.x-btn'));
        const closestXBtn = xButtons.reduce((prev, curr) => {
            const prevDiff = Math.abs(parseFloat(prev.dataset.value) - clampedX);
            const currDiff = Math.abs(parseFloat(curr.dataset.value) - clampedX);
            return currDiff < prevDiff ? curr : prev;
        }, xButtons[0]);  // добавлен дефолт, чтобы не было undefined

        if (closestXBtn) {
            closestXBtn.classList.add('active');
        }

        // Показываем точку на графике
        const point = document.getElementById('canvasPoint');
        point.style.left = (x + rect.left) + 'px';
        point.style.top = (y + rect.top) + 'px';
        point.style.display = 'block';

        // Отправляем форму через 100 мс
        setTimeout(() => {
            // Ищем кнопку по части id (самый надёжный способ)
            const submitBtn = document.querySelector('[id*="submitBtn"]');
            if (submitBtn) {
                // Имитируем клик — PrimeFaces сам сделает AJAX
                submitBtn.click();
            } else {
                console.warn("Кнопка submitBtn не найдена");
                // Если кнопки нет — отправляем форму как обычный submit (но это перезагрузит)
                const form = document.getElementById('pointForm');
                if (form) form.submit();
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
        const savedX = localStorage.getItem('selectedX');
        const savedR = localStorage.getItem('selectedR');

        if (savedX) {
            this.selectXValue(savedX);
        }

        if (savedR) {
            const radio = document.querySelector(`.r-radio[value="${savedR}"]`);
            if (radio) {
                radio.checked = true;
                drawGraph(parseFloat(savedR));
            }
        } else {
            const defaultRadio = document.querySelector('.r-radio[value="3"]');
            if (defaultRadio) {
                defaultRadio.checked = true;
                drawGraph(3);
            }
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
             const canvas = document.getElementById('areaGraph');
             if (!canvas) return;
             const ctx = canvas.getContext('2d');
             const size = 300;
             const center = size / 2;
             const scale = size / 10;
             ctx.clearRect(0, 0, size, size);
             ctx.strokeStyle = '#000';
             ctx.lineWidth = 2;
             ctx.beginPath();
             ctx.moveTo(center, 0);
             ctx.lineTo(center, size);
             ctx.moveTo(0, center);
             ctx.lineTo(size, center);
             ctx.stroke();
             ctx.fillStyle = '#000';
             ctx.beginPath();
             ctx.moveTo(center, 0);
             ctx.lineTo(center - 5, 10);
             ctx.lineTo(center + 5, 10);
             ctx.fill();
             ctx.beginPath();
             ctx.moveTo(size, center);
             ctx.lineTo(size - 10, center - 5);
             ctx.lineTo(size - 10, center + 5);
             ctx.fill();
             ctx.fillStyle = 'rgba(0, 123, 255, 0.4)';
             ctx.strokeStyle = 'rgba(0, 123, 255, 0.8)';
             const rectX = center - r * scale;
             const rectY = center - (r/2) * scale;
             const rectWidth = r * scale;
             const rectHeight = (r/2) * scale;

             ctx.beginPath();
             ctx.rect(rectX, rectY, rectWidth, rectHeight);
             ctx.closePath();
             ctx.fill();
             ctx.stroke();
             ctx.beginPath();
             ctx.moveTo(center, center);
             ctx.arc(center, center, (r/2) * scale, 0.5 * Math.PI, Math.PI, false);
             ctx.closePath();
             ctx.fill();
             ctx.stroke();
             ctx.beginPath();
             ctx.moveTo(center, center);
             ctx.lineTo(center, center + (r/2) * scale);
             ctx.lineTo(center + (r/2) * scale, center);
             ctx.closePath();
             ctx.fill();
             ctx.stroke();
             ctx.fillStyle = '#000';
             ctx.font = '12px Arial';
             ctx.textAlign = 'center';
             for (let i = -5; i <= 5; i++) {
                 if (i !== 0) {
                     const x = center + i * scale;
                     const y = center - i * scale;
                     ctx.beginPath();
                     ctx.moveTo(x, center - 3);
                     ctx.lineTo(x, center + 3);
                     ctx.stroke();
                     ctx.fillText(i, x, center + 15);
                     ctx.beginPath();
                     ctx.moveTo(center - 3, y);
                     ctx.lineTo(center + 3, y);
                     ctx.stroke();
                     ctx.fillText(i, center - 15, y + 4);
                 }
             }
             ctx.fillText('X', size - 10, center - 10);
             ctx.fillText('Y', center + 10, 10);
             drawSavedPoints(r);
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

function updateR(checkbox, value) {
    if (checkbox.checked) {
        // снимаем галочку со всех остальных
        document.querySelectorAll('input[type="checkbox"][id^="r"]').forEach(cb => {
            if (cb !== checkbox) cb.checked = false;
        });
        // устанавливаем значение в hidden поле
        document.getElementById('pointForm:r').value = value;
        // перерисовываем график
        drawGraph(value);
    } else {
        // если сняли галочку — можно сбросить или оставить предыдущее
        document.getElementById('pointForm:r').value = '3';
        drawGraph(3);
    }
}