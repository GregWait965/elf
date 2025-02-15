// <!-- Настройте конечную точку API в функции loadEmployeeData().
// Таблица будет автоматически обновляться при нажатии кнопки обновления,
//  получая новые данные из указанного вами внешнего источника. Да, вы можете использовать Google таблицу как источник данных для вашей функции loadEmployeeData(). Это удобное решение, которое позволит:

// Хранить данные в удобном табличном формате
// Легко редактировать информацию через веб-интерфейс
// Получать доступ к данным через Google Sheets API
// Вот как это реализовать:

// Создайте Google таблицу и опубликуйте её для доступа по ссылке
// Получите ID таблицы из URL
// Используйте этот код для загрузки данных:
// -->
    
// Основная функция инициализации

// document.addEventListener('DOMContentLoaded', function() {
//     initializeTable();
//     setupEventListeners();
// });

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeTable();
    setupEventListeners();
    updateCurrentDate();
    loadTasks();
    initNewsFeed();
    initTaskSystem();
    saveEmployeeData(); // Initial save using unified function
});

// Single enableManualInput implementation
function enableManualInput() {
    const tbody = document.getElementById('employeeData');
    if (!tbody) return;

    tbody.addEventListener('blur', function(e) {
        if (e.target.hasAttribute('contenteditable')) {
            saveEmployeeData();
        }
    }, true);
}

// Add save trigger to table updates
function updateTable(data) {
    const tbody = document.getElementById('employeeData');
    if (!tbody) return;

    tbody.innerHTML = '';
    const minRows = Math.max(10, data.length);
    
    for (let i = 0; i < minRows; i++) {
        const employee = data[i] || createEmptyEmployee();
        const row = createTableRow(i + 1, employee);
        tbody.appendChild(row);
    }
    
    saveEmployeeData(); // Save after table updates
}

// Add save trigger to refresh button
function setupEventListeners() {
    const refreshButton = document.getElementById('refreshData');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            loadEmployeeData();
            saveEmployeeData(); // Save after refresh
        });
    }
}


// Инициализация таблицы
function initializeTable() {
    loadEmployeeData();
    enableManualInput();
}

// Настройка слушателей событий
// First version
// Single version of setupEventListeners
function setupEventListeners() {
    const refreshButton = document.getElementById('refreshData');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            loadEmployeeData();
            saveEmployeeData();
        });
    }
}
// Загрузка данных сотрудников
function loadEmployeeData() {
    const SPREADSHEET_ID = 'ВАШ_ID_ТАБЛИЦЫ';
    const SHEET_NAME = 'показатели сотрудников';
    const API_KEY = 'ВАШ_API_КЛЮЧ';
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(data => {
            if (data && data.values) {
                const employees = parseEmployeeData(data.values);
                updateTable(employees);
            }
        })
        .catch(error => {
            console.log('Loading local data');
            loadLocalData();
        });
}

// Парсинг данных сотрудников
function parseEmployeeData(rows) {
    return rows.slice(1).map(row => ({
        name: row[0] || '',
        hoursWorked: row[1] || '',
        shiftsWorked: row[2] || '',
        assemblyPercentage: row[3] || '',
        loadingPercentage: row[4] || '',
        totalPercentage: row[5] || '',
        linesAssembled: row[6] || '',
        trucksLoaded: row[7] || '',
        errorsCount: row[8] || '',
        errorPercentage: row[9] || ''
    }));
}

// Обновление таблицы
// Single version of updateTable with data saving
function updateTable(data) {
    const tbody = document.getElementById('employeeData');
    if (!tbody) return;

    tbody.innerHTML = '';
    const minRows = Math.max(10, data.length);
    
    for (let i = 0; i < minRows; i++) {
        const employee = data[i] || createEmptyEmployee();
        const row = createTableRow(i + 1, employee);
        tbody.appendChild(row);
    }
    
    saveEmployeeData();
}   

// Создание пустой записи сотрудника
function createEmptyEmployee() {
    return {
        name: '',
        hoursWorked: '',
        shiftsWorked: '',
        assemblyPercentage: '',
        loadingPercentage: '',
        totalPercentage: '',
        linesAssembled: '',
        trucksLoaded: '',
        errorsCount: '',
        errorPercentage: ''
    };
}

// Создание строки таблицы
function createTableRow(index, employee) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${index}</td>
        <td contenteditable="true">${employee.name}</td>
        <td contenteditable="true">${employee.hoursWorked}</td>
        <td contenteditable="true">${employee.shiftsWorked}</td>
        <td contenteditable="true">${employee.assemblyPercentage}</td>
        <td contenteditable="true">${employee.loadingPercentage}</td>
        <td contenteditable="true">${employee.totalPercentage}</td>
        <td contenteditable="true">${employee.linesAssembled}</td>
        <td contenteditable="true">${employee.trucksLoaded}</td>
        <td contenteditable="true">${employee.errorsCount}</td>
        <td contenteditable="true">${employee.errorPercentage}</td>
    `;
    return row;
}

// Включение ручного ввода
function enableManualInput() {
    const tbody = document.getElementById('employeeData');
    if (!tbody) return;

    tbody.addEventListener('blur', function(e) {
        if (e.target.hasAttribute('contenteditable')) {
            saveEmployeeData();
        }
    }, true);
}

// Сохранение локальных изменений


function saveEmployeeData() {
    const tbody = document.getElementById('employeeData');
    if (!tbody) return;

    const employeeData = Array.from(tbody.getElementsByTagName('tr')).map(row => {
        const cells = row.getElementsByTagName('td');
        return {
            name: cells[1].textContent.trim(),
            hoursWorked: cells[2].textContent.trim(),
            shiftsWorked: cells[3].textContent.trim(),
            assemblyPercentage: cells[4].textContent.trim(),
            loadingPercentage: cells[5].textContent.trim(),
            totalPercentage: cells[6].textContent.trim(),
            linesAssembled: cells[7].textContent.trim(),
            trucksLoaded: cells[8].textContent.trim(),
            errorsCount: cells[9].textContent.trim(),
            errorPercentage: cells[10].textContent.trim()
        };
    });





// 
    localStorage.setItem('employeeData', JSON.stringify(employeeData));
}
// 




// Update event listeners to use the new unified function


// Загрузка локальных данных
function loadLocalData() {
    try {
        const localData = JSON.parse(localStorage.getItem('employeeData')) || [];
        updateTable(localData);
    } catch (error) {
        console.log('Создаем пустую таблицу');
        updateTable([]);
    }
}


// // Вызываем функцию при любом изменении таблицы


        function updateCurrentDate() {
            const dateElement = document.getElementById('currentDate');
            const now = new Date();
            dateElement.textContent = now.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        // Система задач
//         function initTaskSystem() {
//             const taskList = document.getElementById('taskList');
            
//             function generateExecutorsList() {
//                 const executors = [
//                     'Иванов И.И.', 'Петров П.П.', 'Сидоров С.С.', 'Козлов К.К.', 
//                     'Смирнов С.С.', 'Волков В.В.', 'Морозов М.М.', 'Лебедев Л.Л.',
//                     'Соколов С.С.', 'Попов П.П.'
//                 ];
                
//                 return executors.map((executor, index) => `
//                     <div class="dropdown-item">
//                         <input type="checkbox" id="executor-${index}" class="executor-checkbox">
//                         <label for="executor-${index}">${executor}</label>
//                     </div>
//                 `).join('');
//             }
        
//             window.addNewTask = function() {
//                 if (taskList.children.length >= 10) {
//                     alert('Максимальное количество задач - 10');
//                     return;
//                 }
        
//                 const taskNumber = taskList.children.length + 1;
//                 const currentDate = new Date().toISOString().split('T')[0];
//                 const taskDiv = document.createElement('div');
//                 taskDiv.className = 'task-item animated fadeIn';
//                 taskDiv.dataset.createDate = currentDate;
//                 taskDiv.innerHTML = `
//                     <div class="task-header">
//                         <span class="task-number">№${taskNumber}</span>
//                         <div class="task-actions">
//                             <button class="edit-btn" onclick="editTask(this)">✎</button>
//                             <button class="delete-btn" onclick="deleteTask(this)">×</button>
//                         </div>
//                     </div>
//                     <input type="text" class="task-input" placeholder="Введите задачу">
//                     <div class="executor-wrapper">
//                         <button class="dropdown-toggle">Выбрать исполнителей</button>
//                         <div class="dropdown-content">
//                             ${generateExecutorsList()}
//                         </div>
//                         <div class="selected-executors"></div>
//                     </div>
//                 `;
//                 taskList.appendChild(taskDiv);
//                 initializeExecutorHandlers(taskDiv);
//             }
//         }
        
//         // Система новостей
//         function initNewsFeed() {
//             const news = [
//                 {
//                     id: 1,
//                     date: '2024-01-20',
//                     message: 'Важное оперативное сообщение №1',
//                     acknowledged: false
//                 },
//                 {
//                     id: 2,
//                     date: '2024-01-21',
//                     message: 'Важное оперативное сообщение №2',
//                     acknowledged: false
//                 }
//             ];
        
//             const newsFeed = document.getElementById('newsFeed');
//             const notificationIcon = document.getElementById('notification-icon');
        
//             function updateNotification() {
//                 const hasUnacknowledged = news.some(item => !item.acknowledged);
//                 notificationIcon.style.display = hasUnacknowledged ? 'block' : 'none';
//             }
        
//             function renderNews() {
//                 newsFeed.innerHTML = news.map(item => `
//                     <div class="news-item" data-id="${item.id}">
//                         <div class="news-date">${new Date(item.date).toLocaleDateString('ru-RU')}</div>
//                         <div class="news-message">${item.message}</div>
//                         <button 
//                             class="acknowledge-btn ${item.acknowledged ? 'acknowledged' : ''}"
//                             ${item.acknowledged ? 'disabled' : ''}
//                             onclick="acknowledgeNews(${item.id})"
//                         >
//                             ${item.acknowledged ? 'Ознакомлен' : 'Ознакомиться'}
//                         </button>
//                     </div>
//                 `).join('');
//                 updateNotification();
//             }
        
//             window.acknowledgeNews = function(id) {
//                 const newsItem = news.find(item => item.id === id);
//                 if (newsItem) {
//                     newsItem.acknowledged = true;
//                     renderNews();
//                 }
//             }
        
//             renderNews();
//         }
        
//         // Обработчики для исполнителей
//         function initializeExecutorHandlers(taskDiv) {
//             const dropdownToggle = taskDiv.querySelector('.dropdown-toggle');
//             const dropdownContent = taskDiv.querySelector('.dropdown-content');
//             const checkboxes = taskDiv.querySelectorAll('.executor-checkbox');
//             const selectedExecutors = taskDiv.querySelector('.selected-executors');
        
//             dropdownToggle.addEventListener('click', function() {
//                 dropdownContent.classList.toggle('show');
//             });
        
//             checkboxes.forEach(checkbox => {
//                 checkbox.addEventListener('change', function() {
//                     const label = this.nextElementSibling.textContent;
//                     if (this.checked) {
//                         const executorTag = document.createElement('span');
//                         executorTag.className = 'selected-executor-tag';
//                         executorTag.textContent = label;
//                         executorTag.innerHTML += '<span class="remove-executor" onclick="removeExecutor(this)">×</span>';
//                         selectedExecutors.appendChild(executorTag);
//                     } else {
//                         const existingTag = selectedExecutors.querySelector(`[data-executor="${label}"]`);
//                         if (existingTag) existingTag.remove();
//                     }
//                 });
//             });
        
//             document.addEventListener('click', function(e) {
//                 if (!taskDiv.contains(e.target)) {
//                     dropdownContent.classList.remove('show');
//                 }
//             });
//         }
        
//         // Функции управления задачами
//         function editTask(button) {
//             const taskDiv = button.closest('.task-item');
//             const createDate = new Date(taskDiv.dataset.createDate);
//             const currentDate = new Date();
//             const diffTime = Math.abs(currentDate - createDate);
//             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
//             if (diffDays > 3) {
//                 alert('Редактирование доступно только в течение 3 дней после создания задачи');
//                 return;
//             }
        
//             const taskInput = taskDiv.querySelector('.task-input');
//             taskInput.removeAttribute('readonly');
//             taskInput.focus();
//         }
        
//         function deleteTask(button) {
//             const taskDiv = button.closest('.task-item');
//             const createDate = new Date(taskDiv.dataset.createDate);
//             const currentDate = new Date();
//             const diffTime = Math.abs(currentDate - createDate);
//             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
//             if (diffDays > 3) {
//                 alert('Удаление доступно только в течение 3 дней после создания задачи');
//                 return;
//             }
        
//             if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
//                 taskDiv.remove();
//                 renumberTasks();
//             }
//         }
        
//         function removeExecutor(element) {
//             const tag = element.parentElement;
//             const label = tag.textContent.slice(0, -1);
//             const checkbox = document.querySelector(`input[type="checkbox"] + label:contains("${label}")`).previousElementSibling;
//             checkbox.checked = false;
//             tag.remove();
//         }
        
//         function renumberTasks() {
//             const tasks = document.querySelectorAll('.task-item');
//             tasks.forEach((task, index) => {
//                 const numberSpan = task.querySelector('.task-number');
//                 numberSpan.textContent = `№${index + 1}`;
//             });
//         }
        
//         function loadTasks() {
//             // Здесь будет логика загрузки сохраненных задач
//         }
//         document.addEventListener('DOMContentLoaded', function() {
//     initializeTable();
//     setupEventListeners(); // Called twice
//     updateCurrentDate();
//     loadTasks();
//     initNewsFeed();
//     initTaskSystem();
//     saveEmployeeData();
// });function loadLocalData() {
//     try {
//         const localData = JSON.parse(localStorage.getItem('employeeData')) || [];
//         updateTable(localData); // This also triggers saveEmployeeData
//     } catch (error) {
//         updateTable([]); // And this triggers saveEmployeeData again
//     }
// }function loadLocalData() {
//     try {
//         const localData = JSON.parse(localStorage.getItem('employeeData')) || [];
//         updateTable(localData); // This also triggers saveEmployeeData
//     } catch (error) {
//         updateTable([]); // And this triggers saveEmployeeData again
//     }
// }