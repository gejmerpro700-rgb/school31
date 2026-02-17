// Мобильное меню (бургер)
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Аккордеон для FAQ
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

// Плавное закрытие меню при клике на ссылку
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Небольшая анимация для кнопок админа (просто демо)
const adminButtons = document.querySelectorAll('.admin-btn');
adminButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Проверяем, не является ли эта кнопка кнопкой отправки идеи
        if (!btn.classList.contains('idea-submit')) {
            alert('Демо-режим: Функционал администратора в разработке.');
        }
    });
});

// Демо отправки формы (ТОЛЬКО ОДИН РАЗ)
const contactFormBtn = document.querySelector('.contact-form .btn');
if (contactFormBtn) {
    // Убираем все предыдущие обработчики
    contactFormBtn.replaceWith(contactFormBtn.cloneNode(true));
    
    // Находим новую кнопку после замены
    const newContactBtn = document.querySelector('.contact-form .btn');
    if (newContactBtn) {
        newContactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Спасибо! Ваше сообщение отправлено (демо-режим).');
        });
    }
}

// Демо отправки идеи (ТОЛЬКО ОДИН РАЗ)
const ideaBtn = document.querySelector('.idea-box .admin-btn');
if (ideaBtn) {
    // Убираем все предыдущие обработчики
    ideaBtn.replaceWith(ideaBtn.cloneNode(true));
    
    // Находим новую кнопку после замены
    const newIdeaBtn = document.querySelector('.idea-box .admin-btn');
    if (newIdeaBtn) {
        newIdeaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const ideaInput = document.querySelector('.idea-box input');
            if (ideaInput && ideaInput.value.trim() !== '') {
                alert('Идея отправлена! Спасибо за ваш вклад.');
                ideaInput.value = '';
            } else {
                alert('Пожалуйста, напишите вашу идею.');
            }
        });
    }
}
// ===== РЕАЛЬНАЯ ПАНЕЛЬ АДМИНИСТРАТОРА для GitHub Pages =====
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. СОЗДАЕМ ПАНЕЛЬ УПРАВЛЕНИЯ (если её нет)
    if (!document.getElementById('real-admin-panel')) {
        const adminPanel = document.createElement('div');
        adminPanel.id = 'real-admin-panel';
        adminPanel.className = 'admin-panel glass';
        adminPanel.style.marginTop = '30px';
        adminPanel.style.marginBottom = '30px';
        adminPanel.innerHTML = `
            <h3>⚡ РЕАЛЬНАЯ ПАНЕЛЬ УПРАВЛЕНИЯ</h3>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 20px 0;">
                <button class="admin-btn" id="addTaskBtn">➕ Добавить задачу</button>
                <button class="admin-btn" id="clearTasksBtn">🗑️ Очистить всё</button>
                <button class="admin-btn" id="exportDataBtn">📥 Сохранить на диск</button>
                <input type="file" id="importFile" accept=".json" style="display: none;">
                <button class="admin-btn" id="importDataBtn">📤 Загрузить с диска</button>
            </div>
            <div id="tasksList" style="text-align: left; margin-top: 20px;"></div>
        `;
        
        // Вставляем после существующей панели или в конец body
        const existingPanel = document.querySelector('.admin-panel');
        if (existingPanel) {
            existingPanel.parentNode.insertBefore(adminPanel, existingPanel.nextSibling);
        } else {
            document.body.appendChild(adminPanel);
        }
    }

    // 2. ЗАГРУЖАЕМ ЗАДАЧИ из localStorage
    let tasks = JSON.parse(localStorage.getItem('school31_tasks')) || [];
    
    // 3. ФУНКЦИЯ показа задач
    function renderTasks() {
        const tasksList = document.getElementById('tasksList');
        if (!tasksList) return;
        
        if (tasks.length === 0) {
            tasksList.innerHTML = '<p style="color: white; text-align: center;">✨ Нет задач. Нажмите "Добавить задачу"</p>';
            return;
        }
        
        let html = '<h4 style="color: white; margin-bottom: 15px;">📋 Список задач:</h4>';
        tasks.forEach((task, index) => {
            html += `
                <div style="background: rgba(255,255,255,0.2); padding: 15px; margin-bottom: 10px; border-radius: 10px; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <span>${task.text} <small style="opacity: 0.7;">(${task.date})</small></span>
                    <button class="admin-btn" onclick="deleteTask(${index})" style="padding: 5px 15px;">✓</button>
                </div>
            `;
        });
        tasksList.innerHTML = html;
    }
    
    // 4. ФУНКЦИЯ удаления задачи
    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        localStorage.setItem('school31_tasks', JSON.stringify(tasks));
        renderTasks();
    };
    
    // 5. ОБРАБОТЧИКИ
    setTimeout(() => {
        // Добавить задачу
        const addBtn = document.getElementById('addTaskBtn');
        if (addBtn) {
            addBtn.onclick = function() {
                const taskText = prompt('Введите новую задачу:');
                if (taskText && taskText.trim() !== '') {
                    tasks.push({
                        text: taskText,
                        date: new Date().toLocaleDateString('ru-RU')
                    });
                    localStorage.setItem('school31_tasks', JSON.stringify(tasks));
                    renderTasks();
                }
            };
        }
        
        // Очистить всё
        const clearBtn = document.getElementById('clearTasksBtn');
        if (clearBtn) {
            clearBtn.onclick = function() {
                if (confirm('Удалить все задачи?')) {
                    tasks = [];
                    localStorage.setItem('school31_tasks', JSON.stringify(tasks));
                    renderTasks();
                }
            };
        }
        
        // Сохранить на диск
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.onclick = function() {
                const dataStr = JSON.stringify(tasks, null, 2);
                const blob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `school31_backup_${new Date().toISOString().slice(0,10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                alert('✅ Файл сохранен!');
            };
        }
        
        // Загрузить с диска
        const importBtn = document.getElementById('importDataBtn');
        const importFile = document.getElementById('importFile');
        if (importBtn && importFile) {
            importBtn.onclick = function() {
                importFile.click();
            };
            
            importFile.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(ev) {
                        try {
                            const importedTasks = JSON.parse(ev.target.result);
                            if (Array.isArray(importedTasks)) {
                                tasks = importedTasks;
                                localStorage.setItem('school31_tasks', JSON.stringify(tasks));
                                renderTasks();
                                alert('✅ Задачи загружены!');
                            } else {
                                alert('❌ Неверный формат файла');
                            }
                        } catch (err) {
                            alert('❌ Ошибка при загрузке');
                        }
                    };
                    reader.readAsText(file);
                }
                importFile.value = '';
            };
        }
        
        // Показываем задачи
        renderTasks();
    }, 100);
});