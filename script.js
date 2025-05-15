// Состояние приложения
const state = {
    currentUser: null,
    users: [
        { id: 1, name: "Админ", username: "admin", password: "admin123", avatar: "https://via.placeholder.com/150" },
        { id: 2, name: "qwe", username: "qwe", password: "qwe123", avatar: "https://via.placeholder.com/150" },
        { id: 3, name: "i", username: "i", password: "i123", avatar: "https://via.placeholder.com/150" },
        { id: 4, name: "you", username: "you", password: "you123", avatar: "https://via.placeholder.com/150" }
    ],
    tasks: [
        { id: 1, userId: 1, title: "Математика", description: "Решить задачи по алгебре", dueDate: "2024-12-15", status: "pending" },
        { id: 2, userId: 2, title: "Программирование", description: "Написать код на JavaScript", dueDate: "2025-12-20", status: "completed" },
        { id: 3, userId: 3, title: "Программирование", description: "Написать код на JavaScript", dueDate: "2025-12-20", status: "completed" },
        { id: 4, userId: 4, title: "Программирование", description: "Написать код на JavaScript", dueDate: "2025-12-20", status: "completed" },
        { id: 5, userId: 4, title: "Программирование", description: "Написать код на JavaScript", dueDate: "2025-12-20", status: "completed" }
    ],
    schedule: [
        { id: 1, userId: 1, date: "2023-12-10", subject: "Математика", time: "09:00" },
        { id: 2, userId: 2, date: "2023-12-11", subject: "Программирование", time: "11:00" },
        { id: 3, userId: 2, date: "2023-12-10", subject: "Математика", time: "10:00" },
        { id: 4, userId: 3, date: "2023-12-11", subject: "Программирование", time: "15:00" },
        { id: 5, userId: 3, date: "2023-12-10", subject: "Математика", time: "14:00" },
        { id: 6, userId: 4, date: "2023-12-11", subject: "Программирование", time: "18:00" },
        { id: 7, userId: 4, date: "2023-12-10", subject: "Математика", time: "19:00" },
        { id: 8, userId: 1, date: "2023-12-11", subject: "Программирование", time: "04:00" },
        { id: 9, userId: 2, date: "2023-12-10", subject: "Математика", time: "22:00" },
        { id: 10, userId: 1, date: "2023-12-11", subject: "Программирование", time: "11:00" }
    ],
    themeSettings: {
        theme: "light",
        background: "none",
        fontSize: "medium"
    },
    customBackgroundUrl: null
};

// Функция для показа уведомлений
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon;
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    notification.innerHTML = `
        ${icon}
        <span>${message}</span>
        <span class="notification-close">&times;</span>
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Обработчик закрытия
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Автоматическое закрытие
    if (duration > 0) {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
}

// Загрузка сохраненных настроек темы
function loadThemeSettings() {
    const savedSettings = localStorage.getItem('themeSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        state.themeSettings = settings;
        state.customBackgroundUrl = settings.customBackgroundUrl || null;
        applyThemeSettings();
    }
}

// Сохранение настроек темы
function saveThemeSettings() {
    const settingsToSave = {
        ...state.themeSettings,
        customBackgroundUrl: state.customBackgroundUrl
    };
    localStorage.setItem('themeSettings', JSON.stringify(settingsToSave));
}

// Применение настроек темы
function applyThemeSettings() {
    const { theme, background, fontSize } = state.themeSettings;
    
    // Удаляем все классы тем
    document.body.classList.remove('light-theme', 'dark-theme', 'blue-theme', 'green-theme');
    // Добавляем текущую тему
    document.body.classList.add(`${theme}-theme`);
    
    // Удаляем все классы фона
    document.body.classList.remove('pattern1', 'pattern2', 'nature', 'custom-bg');
    // Добавляем текущий фон, если он не 'none'
    if (background !== 'none') {
        document.body.classList.add(background);
    }
    
    // Применяем кастомный фон, если есть
    if (state.customBackgroundUrl && background === 'custom') {
        document.body.classList.add('custom-bg');
        document.body.style.setProperty('--custom-bg-image', `url('${state.customBackgroundUrl}')`);
    } else {
        document.body.style.removeProperty('--custom-bg-image');
    }
    
    // Удаляем все классы размера шрифта
    document.body.classList.remove('small-font', 'medium-font', 'large-font');
    // Добавляем текущий размер шрифта
    document.body.classList.add(`${fontSize}-font`);
    
    // Обновляем селекторы в модальном окне
    document.getElementById('theme-selector').value = theme;
    document.getElementById('background-selector').value = background;
    document.getElementById('font-size-selector').value = fontSize;
    
    // Показываем/скрываем поле для кастомного фона
    const customBgContainer = document.getElementById('custom-bg-container');
    if (background === 'custom') {
        customBgContainer.style.display = 'block';
        document.getElementById('custom-background-url').value = state.customBackgroundUrl || '';
    } else {
        customBgContainer.style.display = 'none';
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    loadThemeSettings();
    setupEventListeners();
    showMainMenu();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Главное меню
    document.getElementById('login-btn').addEventListener('click', showLoginModal);
    document.getElementById('register-btn').addEventListener('click', showRegisterModal);
    document.getElementById('exit-btn').addEventListener('click', exitApp);
    
    // Меню пользователя
    document.getElementById('tasks-btn').addEventListener('click', showTasksModal);
    document.getElementById('schedule-btn').addEventListener('click', showScheduleModal);
    document.getElementById('profile-btn').addEventListener('click', showProfileModal);
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Формы
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
    
    // Модальные окна
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });
    
    // Настройки темы
    document.getElementById('theme-settings-btn').addEventListener('click', showThemeSettingsModal);
    document.getElementById('apply-theme-btn').addEventListener('click', applyNewThemeSettings);
    document.getElementById('reset-theme-btn').addEventListener('click', resetThemeSettings);
    document.getElementById('background-selector').addEventListener('change', function() {
        const customBgContainer = document.getElementById('custom-bg-container');
        if (this.value === 'custom') {
            customBgContainer.style.display = 'block';
        } else {
            customBgContainer.style.display = 'none';
        }
    });
    document.getElementById('test-bg-btn').addEventListener('click', testCustomBackground);
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

// Проверка кастомного фона
function testCustomBackground() {
    const url = document.getElementById('custom-background-url').value.trim();
    
    if (!url) {
        showNotification('Введите URL изображения', 'error');
        return;
    }
    
    showNotification('Проверяем изображение...', 'info', 0);
    
    const img = new Image();
    img.onload = function() {
        showNotification('Изображение загружено успешно!', 'success');
        // Применяем временно для предпросмотра
        document.body.classList.add('custom-bg');
        document.body.style.setProperty('--custom-bg-image', `url('${url}')`);
    };
    img.onerror = function() {
        showNotification('Не удалось загрузить изображение', 'error');
    };
    img.src = url;
}

// Показать главное меню
function showMainMenu() {
    document.getElementById('main-menu').classList.add('active');
    document.getElementById('user-menu').classList.remove('active');
    state.currentUser = null;
}

// Показать меню пользователя
function showUserMenu() {
    document.getElementById('main-menu').classList.remove('active');
    document.getElementById('user-menu').classList.add('active');
    document.getElementById('welcome-message').textContent = `Добро пожаловать, ${state.currentUser.name}!`;
}

// Показать модальное окно входа
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
    document.getElementById('login-username').focus();
}

// Показать модальное окно регистрации
function showRegisterModal() {
    document.getElementById('register-modal').style.display = 'block';
    document.getElementById('register-name').focus();
}

// Показать модальное окно заданий
function showTasksModal() {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';
    
    const userTasks = state.tasks.filter(task => task.userId === state.currentUser.id);
    
    if (userTasks.length === 0) {
        tasksList.innerHTML = '<p id="no-tasks-message">Заданий нет</p>';
    } else {
        userTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.innerHTML = `
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
                <div class="task-due-date">Дата сдачи: ${task.dueDate}</div>
                <div class="task-status status-${task.status}">${task.status === 'pending' ? 'В процессе' : 'Завершено'}</div>
            `;
            tasksList.appendChild(taskElement);
        });
    }
    
    document.getElementById('tasks-modal').style.display = 'block';
}

// Показать модальное окно расписания
function showScheduleModal() {
    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = '';
    
    const userSchedule = state.schedule.filter(item => item.userId === state.currentUser.id);
    
    if (userSchedule.length === 0) {
        scheduleList.innerHTML = '<p>Расписание пусто</p>';
    } else {
        userSchedule.forEach(item => {
            const scheduleElement = document.createElement('div');
            scheduleElement.className = 'schedule-item';
            scheduleElement.innerHTML = `
                <div><strong>${item.date}</strong> - ${item.subject}</div>
                <div>Время: ${item.time}</div>
            `;
            scheduleList.appendChild(scheduleElement);
        });
    }
    
    document.getElementById('schedule-modal').style.display = 'block';
}

// Показать модальное окно профиля
function showProfileModal() {
    document.getElementById('user-avatar').src = state.currentUser.avatar;
    document.getElementById('profile-modal').style.display = 'block';
}

// Показать модальное окно настроек темы
function showThemeSettingsModal() {
    document.getElementById('theme-settings-modal').style.display = 'block';
}

// Закрыть модальное окно
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    // Восстанавливаем текущий фон после предпросмотра
    applyThemeSettings();
}

// Обработка входа
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const user = state.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        state.currentUser = user;
        closeModal();
        showUserMenu();
        document.getElementById('login-error').textContent = '';
        document.getElementById('login-form').reset();
        showNotification(`Добро пожаловать, ${user.name}!`, 'success');
    } else {
        document.getElementById('login-error').textContent = 'Неверный логин или пароль.';
        showNotification('Неверный логин или пароль', 'error');
    }
}

// Обработка регистрации
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    
    const userExists = state.users.some(u => u.username === username);
    
    if (userExists) {
        document.getElementById('register-error').textContent = 'Логин уже занят.';
        showNotification('Логин уже занят', 'error');
    } else {
        const newUser = {
            id: state.users.length + 1,
            name,
            username,
            password,
            avatar: 'https://via.placeholder.com/150'
        };
        
        state.users.push(newUser);
        state.currentUser = newUser;
        
        closeModal();
        showUserMenu();
        document.getElementById('register-error').textContent = '';
        document.getElementById('register-form').reset();
        showNotification('Регистрация прошла успешно!', 'success');
    }
}

// Обработка обновления профиля
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('profile-password').value;
    const avatarFile = document.getElementById('profile-avatar').files[0];
    
    if (newPassword) {
        state.currentUser.password = newPassword;
    }
    
    if (avatarFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            state.currentUser.avatar = e.target.result;
            document.getElementById('user-avatar').src = e.target.result;
            showNotification('Аватар успешно обновлён!', 'success');
        };
        reader.readAsDataURL(avatarFile);
    }
    
    if (newPassword) {
        showNotification('Пароль успешно изменён!', 'success');
    }
    
    document.getElementById('profile-form').reset();
}

// Выход из системы
function logout() {
    state.currentUser = null;
    showMainMenu();
    showNotification('Вы успешно вышли из системы', 'info');
}

// Выход из приложения
function exitApp() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        showNotification('До свидания!', 'info', 1000);
        setTimeout(() => {
            window.close();
        }, 1500);
    }
}

// Применение новых настроек темы
function applyNewThemeSettings() {
    const background = document.getElementById('background-selector').value;
    
    state.themeSettings = {
        theme: document.getElementById('theme-selector').value,
        background: background,
        fontSize: document.getElementById('font-size-selector').value
    };
    
    if (background === 'custom') {
        const url = document.getElementById('custom-background-url').value.trim();
        if (url) {
            state.customBackgroundUrl = url;
        } else {
            state.customBackgroundUrl = null;
            showNotification('Введите URL для фона', 'warning');
        }
    } else {
        state.customBackgroundUrl = null;
    }
    
    applyThemeSettings();
    saveThemeSettings();
    showNotification('Настройки темы применены!', 'success');
    closeModal();
}

// Сброс настроек темы
function resetThemeSettings() {
    state.themeSettings = {
        theme: "light",
        background: "none",
        fontSize: "medium"
    };
    state.customBackgroundUrl = null;
    applyThemeSettings();
    saveThemeSettings();
    showNotification('Настройки темы сброшены', 'info');
}

// Поиск пользователя
function findUser(username, password = null) {
    if (password) {
        return state.users.find(u => u.username === username && u.password === password);
    } else {
        return state.users.find(u => u.username === username);
    }
}