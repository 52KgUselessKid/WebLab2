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
           this.restoreSelection();   
           drawGraph();
    }
    getContextPath() {
        const path = window.location.pathname;
        const contextPath = path.substring(0, path.indexOf('/', 1));
        return contextPath || '';
    }
    setupEventListeners() {







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
        
        const num = this.parseNumber(value);
        if (isNaN(num)) return;

        
        let percent;
        if (num >= -5 && num <= 5) {
            percent = Math.round(((num + 5) / 10) * 100);
        } else if (num >= 0 && num <= 100) {
            percent = Math.round(num);
        } else {
            
            return;
        }

        this.currentX = percent;
        const hidden = document.getElementById('pointForm:hiddenX');
        if (hidden) hidden.value = percent;



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
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const size = canvas.width;
        const center = size / 2;
        const scale = size / 10;

        
        let selectedRadio = document.querySelector('.r-radio:checked');
        let rValue = null;
        if (selectedRadio) {
            rValue = this.parseNumber(selectedRadio.value);
        }
        if (!rValue || isNaN(rValue)) {
            const hiddenR = document.getElementById('pointForm:r');
            if (hiddenR && hiddenR.value) {
                rValue = this.parseNumber(hiddenR.value);
            }
        }
        if (!rValue || isNaN(rValue) || rValue < 1) {
            rValue = 3;
            const defRadio = document.querySelector('.r-radio[value="3"]');
            if (defRadio) {
                defRadio.checked = true;
                const hiddenR = document.getElementById('pointForm:r');
                if (hiddenR) hiddenR.value = '3';
                drawGraph(3);
            }
        }

      const realX = (clickX - center) / scale;
      const realY = (center - clickY) / scale;

      
      function formatNum(num) {
          let s = num.toPrecision(16);
          
          s = s.replace(/\.?0+$/, '');
          return s;
      }

      const strX = formatNum(realX);
      const strY = formatNum(realY);

      
      const xInput = document.getElementById('pointForm:xInput');
      if (xInput) {
          xInput.value = strX;
          xInput.dispatchEvent(new Event('input', { bubbles: true }));
          xInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const yInput = document.getElementById('pointForm:y');
      if (yInput) {
          yInput.value = strY;
          yInput.dispatchEvent(new Event('input', { bubbles: true }));
          yInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

       
       const hiddenX = document.getElementById('pointForm:hiddenX');
       if (hiddenX) {
           const percentX = Math.round(((realX + 5) / 10) * 100);
           hiddenX.value = percentX;
           const inputEvent = new Event('input', { bubbles: true });
           const changeEvent = new Event('change', { bubbles: true });
           hiddenX.dispatchEvent(inputEvent);
           hiddenX.dispatchEvent(changeEvent);
       }


        
        const hiddenR = document.getElementById('pointForm:r');
        if (hiddenR) hiddenR.value = rValue;

        










        
        
        const submitBtn = document.querySelector('[id$="submitBtn"], [id$="checkBtn"]');

        
        if (submitBtn) {
            
            setTimeout(() => {
                try {
                    submitBtn.click();
                } catch (err) {
                    
                    const form = document.getElementById('pointForm');
                    if (form) form.submit();
                }
            }, 20);
        } else {
            const form = document.getElementById('pointForm');
            if (form) form.submit();
        }
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

function drawSavedPoints(r) {
    const tableContainer = document.getElementById('resultsPanel');
    if (!tableContainer) return;

    const rows = tableContainer.querySelectorAll('tr');
    const canvas = document.getElementById('areaGraph');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const center = canvas.width / 2;
    const scale = canvas.width / 10;

    let drawnCount = 0;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 4) return;

        const xStr = cells[0].textContent.trim();
        const yStr = cells[1].textContent.trim();
        const rStr = cells[2].textContent.trim();
        const resultText = cells[3].textContent.trim();

        const px = parseFloat(xStr);
        const py = parseFloat(yStr);
        const pr = parseFloat(rStr);

        if (isNaN(px) || isNaN(py) || isNaN(pr)) return;
        if (Math.abs(pr - r) > 0.001) return;

        const isHit = resultText.includes("Попадание") || resultText.toLowerCase().includes("hit");

        const pointX = center + px * scale;
        const pointY = center - py * scale;

        ctx.fillStyle = isHit ? '#28a745' : '#dc3545';   
        ctx.beginPath();
        ctx.arc(pointX, pointY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        drawnCount++;
    });

    console.log(`Нарисовано точек для R=${r}: ${drawnCount}`);
}

function drawGraph(r = 3) {
    if (typeof r !== 'number' || isNaN(r) || r <= 0) r = 3;

    const canvas = document.getElementById('areaGraph');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const scale = size / 10;

    ctx.clearRect(0, 0, size, size);

    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center, 0); ctx.lineTo(center, size);
    ctx.moveTo(0, center); ctx.lineTo(size, center);
    ctx.stroke();

    
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.moveTo(center, 0);     ctx.lineTo(center-7,14); ctx.lineTo(center+7,14); ctx.fill();
    ctx.beginPath(); ctx.moveTo(size, center);  ctx.lineTo(size-14,center-7); ctx.lineTo(size-14,center+7); ctx.fill();

    
    ctx.fillStyle   = 'rgba(30, 144, 255, 0.22)';
    ctx.strokeStyle = '#1e90ff';
    ctx.lineWidth   = 1.6;

    const rPx    = r * scale;
    const halfRPx = (r / 2) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, size, size);
    ctx.clip();

    
    ctx.fillRect(center - rPx, center - rPx, rPx, rPx);
    ctx.strokeRect(center - rPx, center - rPx, rPx, rPx);

    
    ctx.beginPath();
    ctx.moveTo(center, center);                
    ctx.lineTo(center + halfRPx, center);      
    ctx.lineTo(center, center - rPx);          
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    
    ctx.beginPath();
    ctx.arc(center, center, rPx, 0, Math.PI / 2, false);   
    ctx.lineTo(center, center);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    

    ctx.restore();

    
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
        ctx.fillText(i, center - 20, py + 5);
    }
    ctx.fillText('X', size - 18, center - 10);
    ctx.fillText('Y', center + 22, 24);

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

function updateR(checkbox, intendedR) {
    const rValue = parseFloat(intendedR);
    if (isNaN(rValue)) {
        console.warn("updateR получил некорректное значение:", intendedR);
        return;
    }

    
    document.querySelectorAll('.r-row input[type="checkbox"]').forEach(cb => {
        if (cb !== checkbox) cb.checked = false;
    });

    if (checkbox.checked) {
        
        const hiddenR = document.getElementById('pointForm:r');
        if (hiddenR) hiddenR.value = rValue;

        
        drawGraph(rValue);

        
        try {
            localStorage.setItem('selectedR', rValue);
        } catch(e) { console.error(e); }

    } else {
        
        const defCheckbox = document.querySelector('.r-row input[id$="r3"]');
        if (defCheckbox) defCheckbox.checked = true;

        const hiddenR = document.getElementById('pointForm:r');
        if (hiddenR) hiddenR.value = 3;

        drawGraph(3);

        try {
            localStorage.setItem('selectedR', 3);
        } catch(e) { console.error(e); }
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
     updateXFromSlider();
 }

function updateXFromInput() {
    const input = document.getElementById('pointForm:xInput');
    const hidden = document.getElementById('pointForm:hiddenX');
    const slider = PF('xSliderWidget');

    let val = parseFloat(input.value.replace(',', '.'));
    if (isNaN(val)) return;

    
    val = Math.max(-5, Math.min(5, val));

    
    const percent = Math.round(((val + 5) / 10) * 100);

    hidden.value = percent;

    if (slider) slider.setValue(percent);
}

function updateXFromSlider() {
    const hidden = document.getElementById('pointForm:hiddenX');
    const input = document.getElementById('pointForm:xInput');

    let percent = parseFloat(hidden.value);
    if (isNaN(percent)) percent = 50;

    const real = -5 + (percent / 100) * 10;
    const rounded = Math.round(real * 100) / 100;

    input.value = rounded;
}

function updateClientTime() {
    const now = new Date();
    
    const day   = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year  = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins  = String(now.getMinutes()).padStart(2, '0');
    const secs  = String(now.getSeconds()).padStart(2, '0');

    const formatted = `${day}.${month}.${year} ${hours}:${mins}:${secs}`;
    const span = document.getElementById('clientTime');
    if (span) span.textContent = formatted;
}


document.addEventListener('DOMContentLoaded', updateClientTime);


setInterval(updateClientTime, 13000);


(function monitorSystemTime() {
    let last = Date.now();
    function tick() {
        const now = Date.now();
        
        if (Math.abs(now - last) > 2000) {
            updateClientTime();
        }
        last = now;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();
