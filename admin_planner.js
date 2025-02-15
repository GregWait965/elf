// Генерация списка сотрудников
const employees = Array.from({length: 20}, (_, i) => `Сотрудник ${i + 1}`);
const employeeList = document.getElementById('employeeList');

// Добавление сотрудников в список
employees.forEach(emp => {
    const checkbox = document.createElement('div');
    checkbox.className = 'employee-item';
    checkbox.innerHTML = `
        <input type="checkbox" id="${emp}" name="employee">
        <label for="${emp}">${emp}</label>
    `;
    employeeList.appendChild(checkbox);
});

// Обработка показа/скрытия списка сотрудников
const employeeSelector = document.getElementById('employeeSelector');
const handleEmployeeListVisibility = (show) => {
    employeeList.style.display = show ? 'block' : 'none';
};

employeeSelector.addEventListener('mouseenter', () => handleEmployeeListVisibility(true));
employeeList.addEventListener('mouseenter', () => handleEmployeeListVisibility(true));
employeeList.addEventListener('mouseleave', () => handleEmployeeListVisibility(false));
employeeSelector.addEventListener('mouseleave', (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest('.employee-list')) {
        handleEmployeeListVisibility(false);
    }
});




// Функция добавления задачи
function addTask() {
    const date = document.getElementById('taskDate').value;
    const taskName = document.getElementById('taskName').value;
    const selectedEmployees = [...document.querySelectorAll('input[name="employee"]:checked')]
        .map(cb => cb.id);

    // Валидация полей
    if (!date) {
        alert('Выберите дату');
        return;
    }
    if (!taskName) {
        alert('Поставьте задачу');
        return;
    }
    if (selectedEmployees.length === 0) {
        alert('Выберите исполнителей');
        return;
    }

    // Сохранение задачи
    const taskData = {
        date,
        taskName,
        selectedEmployees,
        createdAt: new Date().toISOString(),
    };

    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(taskData);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayTasks();
    resetForm();
}
// Добавляем функцию удаления задачи
function deleteTask(date, index) {
const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
const dateTaskIndex = tasks.findIndex((task, i) => 
task.date === date && i === index
);

if (dateTaskIndex !== -1) {
tasks.splice(dateTaskIndex, 1);
localStorage.setItem('tasks', JSON.stringify(tasks));
displayTasks();
}
}
// Отображение задач
function displayTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const taskBlocks = document.getElementById('taskBlocks');
    taskBlocks.innerHTML = '';

    // Группировка задач по датам
    const groupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.date]) acc[task.date] = [];
        acc[task.date].push(task);
        return acc;
    }, {});

    // Отображение сгруппированных задач
    Object.entries(groupedTasks)
        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
        .forEach(([date, dateTasks]) => {
            const block = document.createElement('div');
            block.className = 'task-block';
            block.innerHTML = `<h3>Дата: ${date}</h3>`;

            dateTasks.forEach((task, index) => {
const isEditable = (new Date() - new Date(task.createdAt)) <= 3 * 24 * 60 * 60 * 1000;
block.innerHTML += `
<div class="task-item">
    <p><strong>${index + 1}.</strong> ${task.taskName}</p>
    <p>Исполнители: ${task.selectedEmployees.join(', ')}</p>
    <div class="task-controls">
        ${isEditable ? '<button class="btn" onclick="enableEdit(this)">Редактировать</button>' : ''}
        <button class="btn-delete" onclick="deleteTask('${task.date}', ${index})">✖</button>
    </div>
</div>
`;
});

            taskBlocks.appendChild(block);
        });
}

// Публикация задач
function publishTasks() {
    const tasks = localStorage.getItem('tasks');
    if (!tasks || JSON.parse(tasks).length === 0) {
        alert('Нет задач для публикации');
        return;
    }
    sessionStorage.setItem('publishedTasks', tasks);
    alert('Задачи опубликованы и доступны на странице index.html');
}

// Сброс формы
function resetForm() {
    document.getElementById('taskForm').reset();
    handleEmployeeListVisibility(false);
}

// Инициализация отображения задач при загрузке страницы
displayTasks();

// ------------------------------------

// function displayPublishedTasks() {
//     const tasks = JSON.parse(sessionStorage.getItem('publishedTasks') || '[]');
//     const taskBlocks = document.getElementById('publishedTaskBlocks');
    
//     if (tasks.length === 0) {
//         taskBlocks.innerHTML = '<p>Нет опубликованных задач</p>';
//         return;
//     }

//     // Группировка задач по датам
//     const groupedTasks = tasks.reduce((acc, task) => {
//         if (!acc[task.date]) acc[task.date] = [];
//         acc[task.date].push(task);
//         return acc;
//     }, {});

//     // Отображение сгруппированных задач
//     Object.entries(groupedTasks)
//         .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
//         .forEach(([date, dateTasks]) => {
//             const block = document.createElement('div');
//             block.className = 'task-block';
//             block.innerHTML = `<h3>Дата: ${date}</h3>`;

//             dateTasks.forEach((task, index) => {
//                 block.innerHTML += `
//                     <div class="task-item">
//                         <p><strong>${index + 1}.</strong> ${task.taskName}</p>
//                         <p>Исполнители: ${task.selectedEmployees.join(', ')}</p>
//                     </div>
//                 `;
//             });

//             taskBlocks.appendChild(block);
//         });
// }

// // Инициализация отображения при загрузке страницы
// displayPublishedTasks();

