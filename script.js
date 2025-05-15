// База данных пользователей (эмулируем JSON файл)
let usersDB = JSON.parse(localStorage.getItem('usersDB')) || [
    {
        id: 1,
        name: "Иван Иванов",
        username: "ivan",
        password: "12345",
        avatar: "https://via.placeholder.com/150",
        settings: {
            theme: 'light',
            background: 'default',
            animations: true
        },
        tasks: [
            {
                id: 1,
                title: "Математика",
                description: "Решить задачи по алгебре",
                dueDate: "2023-12-15",
                status: "pending"
            },
            {
                id: 2,
                title: "Физика",
                description: "Лабораторная работа №3",
                dueDate: "2023-12-20",
                status: "completed"
            }
        ],
        schedule: [
            {
                id: 1,
                date: "2023-12-10",
                subject: "Математика",
                time: "09:00"
            },
            {
                id: 2,
                date: "2023-12-11",
                subject: "Физика",
                time: "11:00"
            }
        ]
    }
];

// Текущий пользователь
let currentUser = null;

// DOM элементы
const mainMenu = document.getElementById('main-menu');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const exitBtn = document.getElementById('exit-btn');
const userMenu = document.getElementById('user-menu');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username-display');
const userGreeting = document.getElementById('user-greeting');
const userAvatar = document.getElementById('user-avatar');
const profileAvatar = document.getElementById('profile-avatar');

// Модальные окна
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const settingsModal = document.getElementById('settings-modal');
const closeBtns = document.querySelectorAll('.close-btn');

// Формы
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileForm = document.getElementById('profile-form');
const avatarInput = document.getElementById('avatar-input');

// Секции контента
const tasksSection = document.getElementById('tasks-section');
const scheduleSection = document.getElementById('schedule-section');
const profileSection = document.getElementById('profile-section');
const tasksList = document.getElementById('tasks-list');
const scheduleList = document.getElementById('schedule-list');

// Кнопки меню пользователя
const tasksBtn = document.getElementById('tasks-btn');
const scheduleBtn = document.getElementById('schedule-btn');
const profileBtn = document.getElementById('profile-btn');
const settingsBtn = document.getElementById('settings-btn');

// Кнопки возврата
const backToMenuFromTasks = document.getElementById('back-to-menu-from-tasks');
const backToMenuFromSchedule = document.getElementById('back-to-menu-from-schedule');
const backToMenuFromProfile = document.getElementById('back-to-menu-from-profile');

// Уведомления
const notification = document.getElementById('notification');

// Настройки
const themeSelect = document.getElementById('theme-select');
const backgroundSelect = document.getElementById('background-select');
const animationsToggle = document.getElementById('animations-toggle');
const saveSettingsBtn = document.getElementById('save-settings');

// Темы оформления
const themes = {
    light: {
        '--primary-color': '#4a6fa5',
        '--secondary-color': '#166088',
        '--accent-color': '#4fc3f7',
        '--light-color': '#f8f9fa',
        '--dark-color': '#343a40',
        '--bg-color': '#f5f7fa',
        '--text-color': '#333',
        '--card-bg': '#fff'
    },
    dark: {
        '--primary-color': '#6c757d',
        '--secondary-color': '#495057',
        '--accent-color': '#4fc3f7',
        '--light-color': '#343a40',
        '--dark-color': '#f8f9fa',
        '--bg-color': '#212529',
        '--text-color': '#f8f9fa',
        '--card-bg': '#2c3034'
    },
    blue: {
        '--primary-color': '#1e88e5',
        '--secondary-color': '#1565c0',
        '--accent-color': '#64b5f6',
        '--light-color': '#bbdefb',
        '--dark-color': '#0d47a1',
        '--bg-color': '#e3f2fd',
        '--text-color': '#0a2e5a',
        '--card-bg': '#ffffff'
    },
    green: {
        '--primary-color': '#43a047',
        '--secondary-color': '#2e7d32',
        '--accent-color': '#81c784',
        '--light-color': '#c8e6c9',
        '--dark-color': '#1b5e20',
        '--bg-color': '#e8f5e9',
        '--text-color': '#1b5e20',
        '--card-bg': '#ffffff'
    },
    pink: {
        '--primary-color': '#d81b60',
        '--secondary-color': '#ad1457',
        '--accent-color': '#f06292',
        '--light-color': '#f8bbd0',
        '--dark-color': '#880e4f',
        '--bg-color': '#fce4ec',
        '--text-color': '#880e4f',
        '--card-bg': '#ffffff'
    }
};

// Фоны
const backgrounds = {
    default: 'linear-gradient(135deg, var(--bg-color) 0%, var(--light-color) 100%)',
    waves: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    abstract: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    nature: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    space: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    image1: 'url("https://source.unsplash.com/random/1600x900/?nature")',
    image2: 'url("https://source.unsplash.com/random/1600x900/?university")'
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, есть ли сохраненный пользователь в localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserMenu();
    }
    
    // Загрузка данных из "файла" users.json
    saveUsersToStorage();
});

// Функции для работы с "базой данных"
function saveUsersToStorage() {
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
}

function findUserByUsername(username) {
    return usersDB.find(user => user.username === username);
}

function findUserByCredentials(username, password) {
    return usersDB.find(user => user.username === username && user.password === password);
}

function createUser(name, username, password) {
    return {
        id: Date.now(),
        name,
        username,
        password,
        avatar: "https://via.placeholder.com/150",
        settings: {
            theme: 'light',
            background: 'default',
            animations: true
        },
        tasks: [],
        schedule: []
    };
}

function addUser(user) {
    usersDB.push(user);
    saveUsersToStorage();
}

function updateUser(updatedUser) {
    const index = usersDB.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
        usersDB[index] = updatedUser;
        saveUsersToStorage();
    }
}

// Функции отображения интерфейса
function showMainMenu() {
    mainMenu.classList.remove('hidden');
    userMenu.classList.add('hidden');
    hideAllSections();
    currentUser = null;
    localStorage.removeItem('currentUser');
    applyTheme('light');
    applyBackground('default');
    toggleAnimations(true);
}

function showUserMenu() {
    mainMenu.classList.add('hidden');
    userMenu.classList.remove('hidden');
    usernameDisplay.textContent = currentUser.name;
    userAvatar.src = currentUser.avatar;
    profileAvatar.src = currentUser.avatar;
    applyUserSettings(currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function hideAllSections() {
    tasksSection.classList.add('hidden');
    scheduleSection.classList.add('hidden');
    profileSection.classList.add('hidden');
}

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type, 'show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Функции для работы с темами и настройками
function applyTheme(themeName) {
    const theme = themes[themeName];
    for (const [key, value] of Object.entries(theme)) {
        document.documentElement.style.setProperty(key, value);
    }
}

function applyBackground(backgroundName) {
    document.body.style.backgroundImage = backgrounds[backgroundName];
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
}

function toggleAnimations(enabled) {
    if (enabled) {
        document.body.classList.add('animations-enabled');
    } else {
        document.body.classList.remove('animations-enabled');
    }
}

function applyUserSettings(user) {
    if (user && user.settings) {
        applyTheme(user.settings.theme);
        applyBackground(user.settings.background);
        toggleAnimations(user.settings.animations);
    }
}

// Функции рендеринга данных
function renderTasks() {
    tasksList.innerHTML = '';
    
    if (currentUser.tasks.length === 0) {
        tasksList.innerHTML = '<p class="no-tasks">Заданий нет</p>';
        return;
    }
    
    currentUser.tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-card';
        taskElement.style.animationDelay = `${index * 0.1}s`;
        taskElement.innerHTML = `
            <h3 class="task-title">${task.title}</h3>
            <p class="task-description">${task.description}</p>
            <p class="task-due">Срок: ${task.dueDate}</p>
            <span class="task-status ${task.status === 'completed' ? 'status-completed' : 'status-pending'}">
                ${task.status === 'completed' ? 'Выполнено' : 'В процессе'}
            </span>
        `;
        tasksList.appendChild(taskElement);
    });
}

function renderSchedule() {
    scheduleList.innerHTML = '';
    
    if (currentUser.schedule.length === 0) {
        scheduleList.innerHTML = '<p class="no-schedule">Расписание отсутствует</p>';
        return;
    }
    
    currentUser.schedule.forEach((item, index) => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.style.animationDelay = `${index * 0.1}s`;
        scheduleItem.innerHTML = `
            <span class="schedule-date">${item.date} ${item.time}</span>
            <span class="schedule-subject">${item.subject}</span>
        `;
        scheduleList.appendChild(scheduleItem);
    });
}

// Обработчики модальных окон
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('show');
});

registerBtn.addEventListener('click', () => {
    registerModal.classList.add('show');
});

settingsBtn.addEventListener('click', () => {
    if (currentUser) {
        themeSelect.value = currentUser.settings.theme;
        backgroundSelect.value = currentUser.settings.background;
        animationsToggle.checked = currentUser.settings.animations;
        settingsModal.classList.add('show');
    }
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.classList.remove('show');
        registerModal.classList.remove('show');
        settingsModal.classList.remove('show');
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('show');
    }
    if (e.target === registerModal) {
        registerModal.classList.remove('show');
    }
    if (e.target === settingsModal) {
        settingsModal.classList.remove('show');
    }
});

// Обработчики форм
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const user = findUserByCredentials(username, password);
    if (user) {
        currentUser = user;
        showUserMenu();
        loginModal.classList.remove('show');
        loginForm.reset();
        showNotification('Вход выполнен успешно!');
    } else {
        showNotification('Неверный логин или пароль', 'error');
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    
    if (findUserByUsername(username)) {
        showNotification('Логин уже занят', 'error');
    } else {
        const newUser = createUser(name, username, password);
        addUser(newUser);
        currentUser = newUser;
        showUserMenu();
        registerModal.classList.remove('show');
        registerForm.reset();
        showNotification('Регистрация прошла успешно!');
    }
});

profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('profile-password').value;
    
    if (newPassword) {
        currentUser.password = newPassword;
        updateUser(currentUser);
        showNotification('Пароль успешно изменен!');
        profileForm.reset();
    }
});

avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentUser.avatar = event.target.result;
            userAvatar.src = currentUser.avatar;
            profileAvatar.src = currentUser.avatar;
            updateUser(currentUser);
            showNotification('Аватар успешно обновлен!');
        };
        reader.readAsDataURL(file);
    }
});

// Сохранение настроек
saveSettingsBtn.addEventListener('click', () => {
    if (currentUser) {
        currentUser.settings.theme = themeSelect.value;
        currentUser.settings.background = backgroundSelect.value;
        currentUser.settings.animations = animationsToggle.checked;
        
        updateUser(currentUser);
        applyTheme(currentUser.settings.theme);
        applyBackground(currentUser.settings.background);
        toggleAnimations(currentUser.settings.animations);
        
        settingsModal.classList.remove('show');
        showNotification('Настройки сохранены');
    }
});

// Обработчики кнопок меню пользователя
tasksBtn.addEventListener('click', () => {
    hideAllSections();
    tasksSection.classList.remove('hidden');
    renderTasks();
});

scheduleBtn.addEventListener('click', () => {
    hideAllSections();
    scheduleSection.classList.remove('hidden');
    renderSchedule();
});

profileBtn.addEventListener('click', () => {
    hideAllSections();
    profileSection.classList.remove('hidden');
    document.getElementById('profile-name').value = currentUser.name;
    document.getElementById('profile-username').value = currentUser.username;
    document.getElementById('profile-password').value = '';
});

logoutBtn.addEventListener('click', () => {
    showMainMenu();
    showNotification('Вы успешно вышли из системы');
});

exitBtn.addEventListener('click', () => {
    showNotification('До свидания!', 'warning');
    setTimeout(() => {
        window.close();
    }, 1000);
});

// Обработчики кнопок возврата
backToMenuFromTasks.addEventListener('click', () => {
    hideAllSections();
});

backToMenuFromSchedule.addEventListener('click', () => {
    hideAllSections();
});

backToMenuFromProfile.addEventListener('click', () => {
    hideAllSections();
});