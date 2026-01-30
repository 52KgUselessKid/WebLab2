class PointChecker {
    constructor() {
        this.currentX = null;
        this.currentR = null;
        this.appContextPath = '';
        this.init();
    }
    init() {
        localStorage.clear();
       this.appContextPath = this.getContextPath();
           this.setupEventListeners();
           this.restoreSelection();   // ← сначала восстанавливаем выбор
           drawGraph();
    }
    getContextPath() {
        const path = window.location.pathname;
        const contextPath = path.substring(0, path.indexOf('/', 1));
        return contextPath || '';
    }
    setupEventListeners() {
//        document.querySelectorAll('.r-radio').forEach(radio => {
//    radio.addEventListener('change', (e) => {
//        if (e.target.checked) {
//            this.selectRValue(e.target.value);
//        }
//    });
//});
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

        const clampedX = Math.max(-5, Math.min(5, Math.round(realX * 100) / 100));
        const clampedY = Math.max(-5, Math.min(5, Math.round(realY * 100) / 100));


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
             const savedX = localStorage.getItem('selectedX');
             let savedR = localStorage.getItem('selectedR');

             if (savedX) this.selectXValue(savedX);

             let rToUse = 3;
             if (savedR) {
                 const parsed = parseFloat(savedR);
                 if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
                     rToUse = parsed;
                 } else {
                     console.warn("Невалидный savedR из localStorage:", savedR);
                 }
             }

             const radioSelector = `.r-radio[value="${rToUse}"]`;
             const radio = document.querySelector(radioSelector) || document.querySelector('.r-radio[value="3"]');

             if (radio) {
                 radio.checked = true;
                 document.getElementById('pointForm:r').value = rToUse;
                 drawGraph(rToUse);
             }
         } catch (e) {
             console.error("Ошибка в restoreSelection", e);
             // дефолт
             const def = document.querySelector('.r-radio[value="3"]');
             if (def) {
                 def.checked = true;
                 document.getElementById('pointForm:r').value = '3';
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
console.log("drawSavedPoints вызван с r =", r);
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
    console.log("Нарисовано точек:", /* количество нарисованных */);
}

function drawGraph(r = 3) {
    console.log("drawGraph вызван с r =", r, "caller:", new Error().stack.split("\n")[2].trim());
    // Защита от NaN, undefined, некорректных значений
    if (typeof r !== 'number' || isNaN(r) || r <= 0) {
        console.warn("Некорректный r → используем 3 по умолчанию");
        r = 3;
    }

    const canvas = document.getElementById('areaGraph');
    if (!canvas) {
        console.warn("Canvas не найден");
        return;
    }

    const ctx = canvas.getContext('2d');
    const size = canvas.width;   // 300
    const center = size / 2;
    const scale = size / 10;     // 30 px = 1 единица

    ctx.clearRect(0, 0, size, size);

    // Оси
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center, 0); ctx.lineTo(center, size);
    ctx.moveTo(0, center); ctx.lineTo(size, center);
    ctx.stroke();

    // Стрелки (немного крупнее для видимости)
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.moveTo(center, 0); ctx.lineTo(center-7,14); ctx.lineTo(center+7,14); ctx.fill();
    ctx.beginPath(); ctx.moveTo(size, center); ctx.lineTo(size-14,center-7); ctx.lineTo(size-14,center+7); ctx.fill();

    // Область
    ctx.fillStyle = 'rgba(30, 144, 255, 0.28)';
    ctx.strokeStyle = '#1e90ff';
    ctx.lineWidth = 1.8;

    const half = r / 2;
    const rPx = r * scale;
    const halfPx = half * scale;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, size, size);
    ctx.clip();

    // 1. Прямоугольник (второй квадрант)
    ctx.fillRect(center - rPx, center - halfPx, rPx, halfPx);
    ctx.strokeRect(center - rPx, center - halfPx, rPx, halfPx);

    // 2. Четверть круга (третий квадрант)
    ctx.beginPath();
    ctx.arc(center, center, halfPx, Math.PI, 1.5 * Math.PI, false);
    ctx.lineTo(center, center);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Треугольник (четвёртый квадрант)
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center, center + halfPx);
    ctx.lineTo(center + halfPx, center);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Метки
    ctx.fillStyle = '#000';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    for (let i = -5; i <= 5; i++) {
        if (i === 0) continue;
        const px = center + i * scale;
        const py = center - i * scale;
        ctx.beginPath(); ctx.moveTo(px, center-4); ctx.lineTo(px, center+4); ctx.stroke();
        ctx.fillText(i, px, center + 20);
        ctx.beginPath(); ctx.moveTo(center-4, py); ctx.lineTo(center+4, py); ctx.stroke();
        ctx.fillText(i, center - 22, py + 5);
    }
    ctx.fillText('X', size - 18, center - 12);
    ctx.fillText('Y', center + 20, 22);

    drawSavedPoints(r);

    console.log("drawGraph завершён, r =", r);
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

function updateR(checkbox, intendedR) {
     // intendedR приходит из onclick как число (1.0, 1.5, 2.0, 2.5, 3.0)

     // Приводим к числу сразу
     const rValue = parseFloat(intendedR);
     if (isNaN(rValue)) {
         console.warn("updateR получил некорректный intendedR:", intendedR);
         return;  // ← не рисуем вообще, если пришло что-то невалидное
     }

     // Снимаем галочки с остальных
     document.querySelectorAll('input.r-radio[type="checkbox"]').forEach(cb => {
         if (cb !== checkbox) cb.checked = false;
     });

     if (checkbox.checked) {
         // Устанавливаем значение
         document.getElementById('pointForm:r').value = rValue;
         localStorage.setItem('selectedR', rValue);

         // Рисуем с новым радиусом
         drawGraph(rValue);
     } else {
         // Возвращаем дефолт 3
         const defCheckbox = document.querySelector('input.r-radio[value="3"]');
         if (defCheckbox) {
             defCheckbox.checked = true;
             document.getElementById('pointForm:r').value = '3';
             localStorage.setItem('selectedR', '3');
             drawGraph(3);
         }
     }
 }

 function redrawCurrentGraph() {
     const currentRInput = document.getElementById('pointForm:r');
     const r = currentRInput && currentRInput.value ? parseFloat(currentRInput.value) : 3;
     if (!isNaN(r)) {
         drawGraph(r);
     }
 }

 function adjustSliderValue() {
     // Берём значение из hidden-поля (оно обновляется PrimeFaces при движении слайдера)
     const hiddenInput = document.getElementById('pointForm:hiddenX');
     if (!hiddenInput) {
         console.warn("hiddenX не найден");
         return;
     }

     let rawValue = parseFloat(hiddenInput.value);

     // Если значение выглядит как процент (0–100), пересчитываем в реальный диапазон
     if (!isNaN(rawValue) && rawValue >= 0 && rawValue <= 100) {
         const min = -5;
         const max = 5;
         rawValue = min + (rawValue / 100) * (max - min);
     }

     // Округляем до 1 знака после запятой
     const correctedValue = isNaN(rawValue) ? 0 : Math.round(rawValue * 10) / 10;

     // Записываем обратно в hidden (на всякий случай)
     hiddenInput.value = correctedValue;

     // Обновляем отображаемый текст
     const display = document.getElementById('pointForm:xDisplay');
     if (display) {
         display.innerText = correctedValue.toFixed(1);
     }

     console.log("Слайдер скорректирован →", correctedValue);
 }