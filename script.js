// Мобильное меню (бургер)
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const authBtn = document.getElementById('auth-btn');

// Включаем "JS-режим" для CSS-переходов
document.documentElement.classList.add('js');

// Безопасный доступ к crypto (на некоторых телефонах может отсутствовать)
const cryptoSafe = (typeof window !== 'undefined' && window.crypto) ? window.crypto : null;

// Текущий пользователь Firebase (если вошёл через Google)
let firebaseUser = null;

// Переключение языка (RU/KZ)
const LANG_STORAGE_KEY = 'school31_lang';
const langToggleBtn = document.getElementById('lang-toggle');

const translations = {
    ru: {
        nav: { home: 'Главная', about: 'О школе', news: 'Новости', contact: 'Связаться', questions: 'Вопросы', profile: 'Профиль' },
        hero: {
            location: 'село Жайнақ, Іле ауданы, Алматы облысы',
            tags: 'Казахский · Русский · Современное образование',
            more: 'Подробнее о школе',
        },
        features: {
            rating: 'Высокая оценка от родителей и сообщества',
            grades: 'Полное среднее образование',
            bilingual: 'Казахский и русский языки обучения',
        },
        admin: { title: '🔧 Панель администратора', addNews: '➕ Добавить новость', edit: '✏️ Редактировать', stats: '📊 Статистика' },

        about: {
            header: 'О школе №31',
            mainInfo: '🏫 Основная информация',
            addressLabel: 'Адрес:',
            typeLabel: 'Тип:',
            typeValue: 'Государственное коммунальное учреждение',
            langsLabel: 'Языки:',
            langsValue: 'Казахский, Русский',
            contactBtn: '✉️ Связаться',
            newsBtn: '📰 Новости',
            directorTitle: '👨‍🏫 Директор',
            directorRole: 'Руководитель школы',
            writeDirector: 'Написать директору',
            foundedTitle: '📅 Дата основания',
            foundedNote: 'Точная дата уточняется',
            faqBtn: 'Частые вопросы',
            achievementsTitle: '🏅 Достижения',
            ach1: '⭐ Положительная репутация (4.5 на 2ГИС)',
            ach2: '⭐ Активное участие в правовом воспитании (встречи с КНБ)',
            ach3: '⭐ Регулярные победители районных олимпиад',
            ach4: '⭐ Современные методы обучения',
            backHome: 'На главную',
        },

        news: {
            header: 'Новости школы',
            1: {
                date: '15 Февраля 2026',
                title: 'Классный час по безопасности',
                text: 'В школе прошли классные часы, посвященные личной безопасности и ответственному поведению в обществе.',
            },
            2: {
                date: '10 Февраля 2026',
                title: 'Встреча с представителями КНБ',
                text: 'Для старшеклассников организована встреча с целью профориентации и правового воспитания.',
            },
            3: {
                date: '5 Февраля 2026',
                title: 'Родительское собрание',
                text: 'Обсуждение новых образовательных программ и успеваемости учеников.',
            },
            4: {
                date: '28 Января 2026',
                title: 'Школьный диспут',
                text: 'Ученики старших классов приняли участие в диспуте на тему прав человека.',
            },
        },

        profile: {
            header: 'Профиль',
            changeAvatar: '📷 Выбрать аватар',
            removeAvatar: '🗑️ Удалить',
            nameLabel: 'Ваше имя (будет видно в обсуждениях)',
            namePh: 'Например: Дәурен',
            save: 'Сохранить',
            note: '* Сейчас профиль сохраняется только в вашем браузере. Для общего доступа всем ученикам нужен сервер/Firestore.',
        },

        discussion: {
            toggle: '💬 Обсуждение',
            title: '💬 Обсуждение',
            placeholder: 'Напишите комментарий...',
            send: 'Отправить',
            more: 'Показать ещё',
            close: 'Закрыть',
            anon: 'Аноним',
            empty: 'Комментариев пока нет. Напишите первый!',
        },

        contact: {
            header: 'Связаться с нами',
            writeUs: 'Напишите нам',
            namePh: 'Ваше имя',
            emailPh: 'Email',
            msgPh: 'Сообщение',
            send: 'Отправить',
            googleTitle: '📋 Быстрая связь (Google Form)',
            googleNote: '* Это тестовая форма. Замените ссылку на свою.',
            ideaTitle: '💡 Предложить идею для сайта',
            ideaPh: 'Ваша идея',
            ideaSend: 'Отправить идею',
        },

        faq: {
            header: 'Часто задаваемые вопросы',
            q1: { q: 'Какой язык обучения в школе?', a: 'В школе двуязычное обучение: казахский и русский.' },
            q2: { q: 'Как связаться с директором?', a: 'Вы можете написать через форму на странице "Связаться" или позвонить по номеру +7 (72752) ... (уточните в 2ГИС).' },
            q3: { q: 'Есть ли школьная форма?', a: 'Да, в школе действует стандартная школьная форма делового стиля.' },
            q4: { q: 'Принимаете ли вы детей из других сел?', a: 'Да, школа открыта для всех жителей Илийского района.' },
        },

        ui: {
            langSwitch: 'Сменить язык',
            demoAdmin: 'Демо-режим: Функционал администратора в разработке.',
            msgSent: 'Спасибо! Ваше сообщение отправлено (демо-режим).',
            ideaSent: 'Идея отправлена! Спасибо за ваш вклад.',
            ideaEmpty: 'Пожалуйста, напишите вашу идею.',
        },

        dev: {
            panelTitle: '🔒 Панель разработчика',
            login: 'Войти',
            logout: 'Выйти',
            setPassword: 'Установить пароль (только один раз):',
            repeatPassword: 'Повторите пароль:',
            enterPassword: 'Введите пароль:',
            wrongPassword: 'Неверный пароль',
            addArticle: '➕ Добавить статью',
            date: 'Дата',
            titleRu: 'Заголовок (RU)',
            textRu: 'Текст (RU)',
            titleKk: 'Заголовок (KZ)',
            textKk: 'Текст (KZ)',
            save: 'Сохранить',
            delete: 'Удалить',
            confirmDelete: 'Удалить эту статью?',
            missingFields: 'Заполните дату и хотя бы RU заголовок/текст.',
        },
    },
    kk: {
        nav: { home: 'Басты бет', about: 'Мектеп туралы', news: 'Жаңалықтар', contact: 'Байланыс', questions: 'Сұрақтар', profile: 'Профиль' },
        hero: {
            location: 'Жайнақ ауылы, Іле ауданы, Алматы облысы',
            tags: 'Қазақша · Орысша · Заманауи білім',
            more: 'Мектеп туралы толығырақ',
        },
        features: {
            rating: 'Ата-аналар мен қоғамның жоғары бағасы',
            grades: 'Толық орта білім',
            bilingual: 'Оқыту тілдері: қазақ және орыс',
        },
        admin: { title: '🔧 Әкімші панелі', addNews: '➕ Жаңалық қосу', edit: '✏️ Өңдеу', stats: '📊 Статистика' },

        about: {
            header: '№31 мектеп туралы',
            mainInfo: '🏫 Негізгі ақпарат',
            addressLabel: 'Мекенжай:',
            typeLabel: 'Түрі:',
            typeValue: 'Мемлекеттік коммуналдық мекеме',
            langsLabel: 'Тілдер:',
            langsValue: 'Қазақ, Орыс',
            contactBtn: '✉️ Байланысу',
            newsBtn: '📰 Жаңалықтар',
            directorTitle: '👨‍🏫 Директор',
            directorRole: 'Мектеп басшысы',
            writeDirector: 'Директорға жазу',
            foundedTitle: '📅 Құрылған жылы',
            foundedNote: 'Нақты күні нақтыланады',
            faqBtn: 'Жиі қойылатын сұрақтар',
            achievementsTitle: '🏅 Жетістіктер',
            ach1: '⭐ Жақсы бедел (2ГИС-та 4.5)',
            ach2: '⭐ Құқықтық тәрбиеге белсенді қатысу (ҰҚК-мен кездесулер)',
            ach3: '⭐ Аудандық олимпиадалардың тұрақты жеңімпаздары',
            ach4: '⭐ Заманауи оқыту әдістері',
            backHome: 'Басты бетке',
        },

        news: {
            header: 'Мектеп жаңалықтары',
            1: {
                date: '15 Ақпан 2026',
                title: 'Қауіпсіздік бойынша сынып сағаты',
                text: 'Мектепте жеке қауіпсіздік және қоғамдағы жауапты мінез-құлық тақырыбында сынып сағаттары өтті.',
            },
            2: {
                date: '10 Ақпан 2026',
                title: 'ҰҚК өкілдерімен кездесу',
                text: 'Жоғары сынып оқушылары үшін кәсіби бағдар және құқықтық тәрбие мақсатында кездесу ұйымдастырылды.',
            },
            3: {
                date: '5 Ақпан 2026',
                title: 'Ата-аналар жиналысы',
                text: 'Жаңа білім беру бағдарламалары және оқушылардың үлгерімі талқыланды.',
            },
            4: {
                date: '28 Қаңтар 2026',
                title: 'Мектептік пікірсайыс',
                text: 'Жоғары сынып оқушылары адам құқықтары тақырыбындағы пікірсайысқа қатысты.',
            },
        },

        profile: {
            header: 'Профиль',
            changeAvatar: '📷 Аватар таңдау',
            removeAvatar: '🗑️ Өшіру',
            nameLabel: 'Атыңыз (талқылауда көрінеді)',
            namePh: 'Мысалы: Дәурен',
            save: 'Сақтау',
            note: '* Қазір профиль тек сіздің браузеріңізде сақталады. Барлығына ортақ болу үшін сервер/Firestore керек.',
        },

        discussion: {
            toggle: '💬 Талқылау',
            title: '💬 Талқылау',
            placeholder: 'Пікір жазыңыз...',
            send: 'Жіберу',
            more: 'Тағы көрсету',
            close: 'Жабу',
            anon: 'Аноним',
            empty: 'Әзірге пікір жоқ. Біріншісін жазыңыз!',
        },

        contact: {
            header: 'Бізбен байланысу',
            writeUs: 'Бізге жазыңыз',
            namePh: 'Атыңыз',
            emailPh: 'Email',
            msgPh: 'Хабарлама',
            send: 'Жіберу',
            googleTitle: '📋 Жылдам байланыс (Google Form)',
            googleNote: '* Бұл тест формасы. Сілтемені өзіңіздікіне ауыстырыңыз.',
            ideaTitle: '💡 Сайтқа ұсыныс айту',
            ideaPh: 'Ұсынысыңыз',
            ideaSend: 'Ұсынысты жіберу',
        },

        faq: {
            header: 'Жиі қойылатын сұрақтар',
            q1: { q: 'Мектепте оқу тілі қандай?', a: 'Мектепте екі тілде оқытылады: қазақ және орыс.' },
            q2: { q: 'Директорға қалай хабарласуға болады?', a: '"Байланыс" бетіндегі форма арқылы жаза аласыз немесе +7 (72752) ... нөміріне қоңырау шала аласыз (2ГИС-та нақтылаңыз).' },
            q3: { q: 'Мектеп формасы бар ма?', a: 'Иә, мектепте іскерлік стильдегі стандартты форма бар.' },
            q4: { q: 'Басқа ауылдардан балалар қабылдайсыздар ма?', a: 'Иә, мектеп Іле ауданының барлық тұрғындарына ашық.' },
        },

        ui: {
            langSwitch: 'Тілді ауыстыру',
            demoAdmin: 'Демо: Әкімші функционалы әзірленуде.',
            msgSent: 'Рақмет! Хабарламаңыз жіберілді (демо).',
            ideaSent: 'Ұсыныс жіберілді! Үлесіңіз үшін рақмет.',
            ideaEmpty: 'Өтінеміз, ұсынысыңызды жазыңыз.',
        },

        dev: {
            panelTitle: '🔒 Әзірлеуші панелі',
            login: 'Кіру',
            logout: 'Шығу',
            setPassword: 'Құпиясөз орнатыңыз (бір рет):',
            repeatPassword: 'Құпиясөзді қайталаңыз:',
            enterPassword: 'Құпиясөзді енгізіңіз:',
            wrongPassword: 'Құпиясөз қате',
            addArticle: '➕ Мақала қосу',
            date: 'Күні',
            titleRu: 'Тақырып (RU)',
            textRu: 'Мәтін (RU)',
            titleKk: 'Тақырып (KZ)',
            textKk: 'Мәтін (KZ)',
            save: 'Сақтау',
            delete: 'Жою',
            confirmDelete: 'Осы мақаланы жою керек пе?',
            missingFields: 'Күнін және кемінде RU тақырып/мәтінді толтырыңыз.',
        },
    },
};

function t(path, lang) {
    const useLang = lang || (localStorage.getItem(LANG_STORAGE_KEY) || 'ru');
    const parts = String(path).split('.');
    let obj = translations[useLang];
    for (const p of parts) {
        if (!obj || typeof obj !== 'object') return '';
        obj = obj[p];
    }
    return typeof obj === 'string' ? obj : '';
}

let i18nAnimationToken = 0;

function setElementTextWithFade(el, newText, token) {
    if (!el) return;
    if (typeof newText !== 'string' || newText.length === 0) return;
    if (el.textContent === newText) return;

    el.classList.add('i18n-hide');

    window.setTimeout(() => {
        if (token !== i18nAnimationToken) return; // отмена, если быстро переключили назад
        el.textContent = newText;
        el.classList.remove('i18n-hide');
    }, 180);
}

function applyLanguage(lang, options = {}) {
    const safeLang = lang === 'kk' ? 'kk' : 'ru';
    const animate = Boolean(options.animate);

    document.documentElement.setAttribute('lang', safeLang);
    document.body.classList.toggle('lang-kk', safeLang === 'kk');

    // Тексты
    if (animate) i18nAnimationToken += 1;
    const token = i18nAnimationToken;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const value = t(key, safeLang);
        if (!value) return;
        if (animate) {
            setElementTextWithFade(el, value, token);
        } else {
            el.textContent = value;
        }
    });

    // Плейсхолдеры
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = t(key, safeLang);
        if (value) el.setAttribute('placeholder', value);
    });

    // ARIA для кнопки языка
    if (langToggleBtn) {
        langToggleBtn.setAttribute('aria-label', t('ui.langSwitch', safeLang) || 'Language');
        langToggleBtn.title = t('ui.langSwitch', safeLang) || 'Language';
    }

    // Сообщаем другим частям сайта (например, новости)
    try {
        document.dispatchEvent(new CustomEvent('school31:languagechange', { detail: { lang: safeLang } }));
    } catch {
        // ignore
    }
}

// ===== Firebase Auth (Google) =====
function updateAuthButton(user, lang) {
    if (!authBtn) return;
    const safeLang = lang || (localStorage.getItem(LANG_STORAGE_KEY) || 'ru');
    if (user) {
        const name = (user.displayName || '').split(' ')[0] || 'User';
        authBtn.textContent = `${name} · Выйти`;
        authBtn.setAttribute('aria-label', 'Выйти из аккаунта');
        authBtn.title = 'Выйти';
    } else {
        authBtn.textContent = safeLang === 'kk' ? 'Кіру' : 'Войти';
        authBtn.setAttribute('aria-label', 'Войти через Google');
        authBtn.title = 'Войти через Google';
    }
}

function initFirebaseAuth() {
    const fb = window.school31Firebase;
    if (!fb || !fb.auth || !fb.provider) return;

    const { auth, provider, signInWithPopup, signOut, onAuthStateChanged } = fb;

    onAuthStateChanged(auth, (user) => {
        firebaseUser = user || null;
        updateAuthButton(firebaseUser, currentLang);
    });

    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (!firebaseUser) {
                signInWithPopup(auth, provider).catch(() => {
                    // Ошибку можно показать позже, пока просто игнорируем
                });
            } else {
                signOut(auth).catch(() => {});
            }
        });
    }
}

let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'ru';
applyLanguage(currentLang);

if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        currentLang = document.body.classList.contains('lang-kk') ? 'ru' : 'kk';
        localStorage.setItem(LANG_STORAGE_KEY, currentLang);
        applyLanguage(currentLang, { animate: true });
    });
}

// Инициализируем Firebase Auth, когда SDK готов
document.addEventListener('school31:firebase-ready', () => {
    initFirebaseAuth();
});

// На случай, если firebase-init уже успел выполниться
if (window.school31Firebase) {
    initFirebaseAuth();
}

// Переключение темы (светлая/тёмная)
const THEME_STORAGE_KEY = 'school31_theme';
const themeToggleBtn = document.getElementById('theme-toggle');

function getPreferredTheme() {
    try {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
        return 'light';
    }
}

function updateThemeToggleUi() {
    if (!themeToggleBtn) return;
    const isDark = document.body.classList.contains('theme-dark');
    themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    const label = isDark ? 'Включить светлую тему' : 'Включить тёмную тему';
    themeToggleBtn.setAttribute('aria-label', label);
    themeToggleBtn.title = label;
}

function applyTheme(theme) {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    updateThemeToggleUi();
}

let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || getPreferredTheme();
applyTheme(currentTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('theme-dark');
        currentTheme = isDark ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
        applyTheme(currentTheme);
    });
}

// Плавный переход между страницами
function isInternalNavigableLink(anchor) {
    if (!anchor) return false;
    if (anchor.target && anchor.target !== '_self') return false;

    const hrefAttr = anchor.getAttribute('href');
    if (!hrefAttr || hrefAttr === '#' || hrefAttr.startsWith('javascript:')) return false;
    if (hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:')) return false;

    // Не мешаем скачиванию
    if (anchor.hasAttribute('download')) return false;

    let url;
    try {
        url = new URL(anchor.href, window.location.href);
    } catch {
        return false;
    }

    // Только переходы внутри сайта
    if (url.origin !== window.location.origin) return false;

    // Только обычные страницы (без hash-прыжков в пределах той же страницы)
    if (url.pathname === window.location.pathname && url.hash) return false;

    return true;
}

function navigateWithFade(url) {
    document.body.classList.add('page-leave');
    window.setTimeout(() => {
        window.location.href = url;
    }, 220);
}

document.addEventListener('click', (e) => {
    // Не трогаем модификаторы (ctrl/shift/alt) и среднюю кнопку мыши
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const anchor = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!isInternalNavigableLink(anchor)) return;

    e.preventDefault();
    navigateWithFade(anchor.href);
}, true);

// Fade-in после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // На всякий случай (если DOM появился позже)
    applyLanguage(currentLang);
    document.body.classList.add('page-loaded');
});

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
const adminButtons = document.querySelectorAll('.admin-panel.demo-admin .admin-btn');
adminButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Показываем демо-алерт только для настоящих кнопок в админ-панели.
        // Не блокируем обычные ссылки навигации, которые тоже используют класс admin-btn.
        if (btn.tagName === 'BUTTON') {
        e.preventDefault();
            alert(t('ui.demoAdmin', currentLang) || 'Demo');
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
            alert(t('ui.msgSent', currentLang) || 'OK');
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
                alert(t('ui.ideaSent', currentLang) || 'OK');
                ideaInput.value = '';
            } else {
                alert(t('ui.ideaEmpty', currentLang) || 'OK');
            }
        });
    }
}
// ===== Панель разработчика: статьи/новости (пароль + добавление/удаление) =====
const ARTICLES_STORAGE_KEY = 'school31_articles_v1';
const ADMIN_PASS_HASH_KEY = 'school31_admin_pass_hash';
const ADMIN_SESSION_KEY = 'school31_admin_authed';
const PROFILE_STORAGE_KEY = 'school31_profile_v1';
const COMMENTS_STORAGE_KEY = 'school31_comments_v1';

function loadProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
        const p = raw ? JSON.parse(raw) : null;
        if (p && typeof p === 'object') return p;
    } catch {
        // ignore
    }
    return { name: '', avatar: '' };
}

function saveProfile(p) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(p));
}

function isAdminAuthed() {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
}

async function sha256Hex(text) {
    // WebCrypto (нормальный вариант)
    if (cryptoSafe && cryptoSafe.subtle && typeof TextEncoder !== 'undefined') {
        const enc = new TextEncoder();
        const data = enc.encode(text);
        const digest = await cryptoSafe.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    // Фолбэк (слабее, но главное — не ломает сайт на старых устройствах)
    let h = 2166136261;
    for (let i = 0; i < String(text).length; i++) {
        h ^= String(text).charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return ('fnv1a_' + (h >>> 0).toString(16));
}

function loadArticles() {
    try {
        const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // ignore
    }

    // Seed: первые 4 новости из словаря переводов
    return [
        {
            id: 'a1',
            date: '2026-02-15',
            title: { ru: t('news.1.title', 'ru'), kk: t('news.1.title', 'kk') },
            text: { ru: t('news.1.text', 'ru'), kk: t('news.1.text', 'kk') },
        },
        {
            id: 'a2',
            date: '2026-02-10',
            title: { ru: t('news.2.title', 'ru'), kk: t('news.2.title', 'kk') },
            text: { ru: t('news.2.text', 'ru'), kk: t('news.2.text', 'kk') },
        },
        {
            id: 'a3',
            date: '2026-02-05',
            title: { ru: t('news.3.title', 'ru'), kk: t('news.3.title', 'kk') },
            text: { ru: t('news.3.text', 'ru'), kk: t('news.3.text', 'kk') },
        },
        {
            id: 'a4',
            date: '2026-01-28',
            title: { ru: t('news.4.title', 'ru'), kk: t('news.4.title', 'kk') },
            text: { ru: t('news.4.text', 'ru'), kk: t('news.4.text', 'kk') },
        },
    ];
}

function saveArticles(articles) {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
}

function formatArticleDate(isoDate, lang) {
    if (!isoDate) return '';
    const locale = lang === 'kk' ? 'kk-KZ' : 'ru-RU';
    try {
        const d = new Date(isoDate);
        if (Number.isNaN(d.getTime())) return isoDate;
        return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    } catch {
        return isoDate;
    }
}

function getArticleField(obj, lang) {
    if (!obj) return '';
    if (lang === 'kk' && obj.kk) return obj.kk;
    if (obj.ru) return obj.ru;
    return obj.kk || '';
}

function renderNewsArticles(lang) {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    const articles = loadArticles().slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const authed = isAdminAuthed();
    const profile = loadProfile();

    grid.innerHTML = '';
    articles.forEach((a) => {
        const card = document.createElement('div');
        card.className = 'news-card glass';

        const dateEl = document.createElement('div');
        dateEl.className = 'news-date';
        dateEl.textContent = formatArticleDate(a.date, lang);

        const titleEl = document.createElement('h3');
        titleEl.textContent = getArticleField(a.title, lang);

        const textEl = document.createElement('p');
        textEl.textContent = getArticleField(a.text, lang);

        card.appendChild(dateEl);
        card.appendChild(titleEl);
        card.appendChild(textEl);

        // Обсуждение (в модальном окне, не растягивает страницу)
        const discussBtn = document.createElement('button');
        discussBtn.type = 'button';
        discussBtn.className = 'discussion-toggle';
        discussBtn.textContent = t('discussion.toggle', lang) || 'Discussion';
        card.appendChild(discussBtn);

        discussBtn.addEventListener('click', () => {
            openCommentsModal(a.id, lang, profile);
        });

        if (authed) {
            const del = document.createElement('button');
            del.type = 'button';
            del.className = 'article-delete-btn';
            del.textContent = t('dev.delete', lang) || 'Delete';
            del.addEventListener('click', () => {
                if (!confirm(t('dev.confirmDelete', lang) || 'Delete?')) return;
                const next = loadArticles().filter((x) => x.id !== a.id);
                saveArticles(next);
                renderNewsArticles(lang);
            });
            card.appendChild(del);
        }

        grid.appendChild(card);
    });
}

function renderNewsAdminPanel(lang) {
    const host = document.getElementById('news-admin');
    if (!host) return;

    const authed = isAdminAuthed();
    host.innerHTML = `
        <div class="admin-inline">
            <h3 style="margin: 0;">${t('dev.panelTitle', lang) || 'Admin'}</h3>
            <div class="admin-actions">
                ${authed ? `<button class="admin-btn" id="devLogoutBtn" type="button">${t('dev.logout', lang) || 'Logout'}</button>` : `<button class="admin-btn" id="devLoginBtn" type="button">${t('dev.login', lang) || 'Login'}</button>`}
            </div>
        </div>
        ${authed ? `
            <div class="admin-form" style="margin-top: 14px;">
                <div class="full">
                    <label style="color:white; font-weight:700;">${t('dev.date', lang) || 'Date'}</label>
                    <input class="form-input" id="artDate" type="date">
                </div>
                <div>
                    <label style="color:white; font-weight:700;">${t('dev.titleRu', lang) || 'Title RU'}</label>
                    <input class="form-input" id="artTitleRu" type="text" placeholder="${t('dev.titleRu', lang) || ''}">
                </div>
                <div>
                    <label style="color:white; font-weight:700;">${t('dev.titleKk', lang) || 'Title KZ'}</label>
                    <input class="form-input" id="artTitleKk" type="text" placeholder="${t('dev.titleKk', lang) || ''}">
                </div>
                <div>
                    <label style="color:white; font-weight:700;">${t('dev.textRu', lang) || 'Text RU'}</label>
                    <textarea class="form-input" id="artTextRu" placeholder="${t('dev.textRu', lang) || ''}"></textarea>
                </div>
                <div>
                    <label style="color:white; font-weight:700;">${t('dev.textKk', lang) || 'Text KZ'}</label>
                    <textarea class="form-input" id="artTextKk" placeholder="${t('dev.textKk', lang) || ''}"></textarea>
                </div>
                <div class="full" style="display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end;">
                    <button class="admin-btn" id="artSaveBtn" type="button">${t('dev.save', lang) || 'Save'}</button>
                </div>
            </div>
        ` : ``}
    `;

    const loginBtn = document.getElementById('devLoginBtn');
    const logoutBtn = document.getElementById('devLogoutBtn');
    const saveBtn = document.getElementById('artSaveBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
            renderNewsAdminPanel(lang);
            renderNewsArticles(lang);
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const storedHash = localStorage.getItem(ADMIN_PASS_HASH_KEY);

            if (!storedHash) {
                const p1 = prompt(t('dev.setPassword', lang) || 'Set password');
                if (!p1) return;
                const p2 = prompt(t('dev.repeatPassword', lang) || 'Repeat password');
                if (!p2 || p2 !== p1) return;
                const hash = await sha256Hex(p1);
                localStorage.setItem(ADMIN_PASS_HASH_KEY, hash);
                sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
        } else {
                const p = prompt(t('dev.enterPassword', lang) || 'Enter password');
                if (!p) return;
                const hash = await sha256Hex(p);
                if (hash !== storedHash) {
                    alert(t('dev.wrongPassword', lang) || 'Wrong password');
                    return;
                }
                sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
            }

            renderNewsAdminPanel(lang);
            renderNewsArticles(lang);
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const date = (document.getElementById('artDate') || {}).value || '';
            const titleRu = (document.getElementById('artTitleRu') || {}).value || '';
            const textRu = (document.getElementById('artTextRu') || {}).value || '';
            const titleKk = (document.getElementById('artTitleKk') || {}).value || '';
            const textKk = (document.getElementById('artTextKk') || {}).value || '';

            if (!date || (!titleRu.trim() && !textRu.trim())) {
                alert(t('dev.missingFields', lang) || 'Missing fields');
                return;
            }

            const articles = loadArticles();
            const id = (cryptoSafe && cryptoSafe.randomUUID) ? cryptoSafe.randomUUID() : String(Date.now());
            articles.push({
                id,
                date,
                title: { ru: titleRu.trim(), kk: titleKk.trim() },
                text: { ru: textRu.trim(), kk: textKk.trim() },
            });
            saveArticles(articles);
            renderNewsArticles(lang);

            // очистка формы
            document.getElementById('artDate').value = '';
            document.getElementById('artTitleRu').value = '';
            document.getElementById('artTextRu').value = '';
            document.getElementById('artTitleKk').value = '';
            document.getElementById('artTextKk').value = '';
        });
    }
}

function loadAllComments() {
    try {
        const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed && typeof parsed === 'object') return parsed;
    } catch {
        // ignore
    }
    return {};
}

function saveAllComments(map) {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(map));
}

function loadComments(articleId) {
    const all = loadAllComments();
    const list = all[articleId];
    return Array.isArray(list) ? list : [];
}

function addComment(articleId, comment) {
    const all = loadAllComments();
    const list = Array.isArray(all[articleId]) ? all[articleId] : [];
    list.push(comment);
    all[articleId] = list;
    saveAllComments(all);
}

function formatTs(ts, lang) {
    const locale = lang === 'kk' ? 'kk-KZ' : 'ru-RU';
    try {
        return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts));
    } catch {
        return '';
    }
}

function renderDiscussionForArticle(articleId, host, lang, profile) {
    if (!host) return;

    host.innerHTML = '';

    const form = document.createElement('div');
    form.className = 'comment-form';

    const ta = document.createElement('textarea');
    ta.className = 'form-input';
    ta.placeholder = t('discussion.placeholder', lang) || '';

    const send = document.createElement('button');
    send.type = 'button';
    send.className = 'admin-btn';
    send.textContent = t('discussion.send', lang) || 'Send';

    form.appendChild(ta);
    form.appendChild(send);

    const list = document.createElement('div');
    list.className = 'comment-list';

    function renderList() {
        list.innerHTML = '';
        const cur = loadComments(articleId);
        cur.slice().reverse().forEach((c) => {
            const item = document.createElement('div');
            item.className = 'comment';

            const head = document.createElement('div');
            head.className = 'comment-head';

            const name = document.createElement('div');
            name.textContent = (c && c.name) ? c.name : (t('discussion.anon', lang) || 'Anon');

            const time = document.createElement('div');
            time.className = 'comment-time';
            time.textContent = c && c.ts ? formatTs(c.ts, lang) : '';

            head.appendChild(name);
            head.appendChild(time);

            const text = document.createElement('div');
            text.className = 'comment-text';
            text.textContent = (c && c.text) ? c.text : '';

            item.appendChild(head);
            item.appendChild(text);
            list.appendChild(item);
        });
    }

    send.addEventListener('click', () => {
        const text = ta.value.trim();
        if (!text) return;
        const author = (profile && profile.name && profile.name.trim()) ? profile.name.trim() : (t('discussion.anon', lang) || 'Anon');
        const id = (cryptoSafe && cryptoSafe.randomUUID) ? cryptoSafe.randomUUID() : String(Date.now());
        addComment(articleId, { id, ts: Date.now(), name: author, text });
        ta.value = '';
        renderList();
    });

    host.appendChild(form);
    host.appendChild(list);
    renderList();
}

let activeCommentsModal = null;

function closeCommentsModal() {
    if (activeCommentsModal) {
        activeCommentsModal.remove();
        activeCommentsModal = null;
    }
}

function openCommentsModal(articleId, lang, profile) {
    closeCommentsModal();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const card = document.createElement('div');
    card.className = 'modal-card glass';

    const head = document.createElement('div');
    head.className = 'modal-head';

    const title = document.createElement('div');
    title.className = 'modal-title';
    title.textContent = t('discussion.title', lang) || 'Discussion';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'modal-close';
    closeBtn.setAttribute('aria-label', t('discussion.close', lang) || 'Close');
    closeBtn.title = t('discussion.close', lang) || 'Close';
    closeBtn.textContent = '×';

    head.appendChild(title);
    head.appendChild(closeBtn);

    const body = document.createElement('div');
    body.className = 'modal-body';

    const form = document.createElement('div');
    form.className = 'comment-form';

    const ta = document.createElement('textarea');
    ta.className = 'form-input';
    ta.placeholder = t('discussion.placeholder', lang) || '';

    const actions = document.createElement('div');
    actions.className = 'comment-actions';

    const moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'admin-btn comment-more';
    moreBtn.textContent = t('discussion.more', lang) || 'More';

    const send = document.createElement('button');
    send.type = 'button';
    send.className = 'admin-btn';
    send.textContent = t('discussion.send', lang) || 'Send';

    actions.appendChild(moreBtn);
    actions.appendChild(send);

    form.appendChild(ta);
    form.appendChild(actions);

    const list = document.createElement('div');
    list.className = 'comment-list';

    let visibleCount = 10;

    function renderList() {
        list.innerHTML = '';
        const cur = loadComments(articleId);
        if (cur.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'small-note';
            empty.style.color = 'white';
            empty.style.opacity = '0.9';
            empty.textContent = t('discussion.empty', lang) || '';
            list.appendChild(empty);
            moreBtn.style.display = 'none';
            return;
        }
        
        const slice = cur.slice(-visibleCount).reverse(); // показываем последние N (новые сверху)
        slice.forEach((c) => {
            const item = document.createElement('div');
            item.className = 'comment';

            const h = document.createElement('div');
            h.className = 'comment-head';

            const name = document.createElement('div');
            name.textContent = (c && c.name) ? c.name : (t('discussion.anon', lang) || 'Anon');

            const time = document.createElement('div');
            time.className = 'comment-time';
            time.textContent = c && c.ts ? formatTs(c.ts, lang) : '';

            h.appendChild(name);
            h.appendChild(time);

            const text = document.createElement('div');
            text.className = 'comment-text';
            text.textContent = (c && c.text) ? c.text : '';

            item.appendChild(h);
            item.appendChild(text);
            list.appendChild(item);
        });

        moreBtn.style.display = cur.length > visibleCount ? 'inline-flex' : 'none';
    }

    moreBtn.addEventListener('click', () => {
        visibleCount += 10;
        renderList();
    });

    send.addEventListener('click', () => {
        const text = ta.value.trim();
        if (!text) return;
        const p = profile || loadProfile();
        const author = (p && p.name && p.name.trim()) ? p.name.trim() : (t('discussion.anon', lang) || 'Anon');
        const id = (cryptoSafe && cryptoSafe.randomUUID) ? cryptoSafe.randomUUID() : String(Date.now());
        addComment(articleId, { id, ts: Date.now(), name: author, text });
        ta.value = '';
        renderList();
        // чтобы новые сообщения было видно
        list.scrollTop = 0;
    });

    closeBtn.addEventListener('click', closeCommentsModal);
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeCommentsModal();
    });

    const onKey = (e) => {
        if (e.key === 'Escape') closeCommentsModal();
    };
    window.addEventListener('keydown', onKey, { once: true });

    body.appendChild(form);
    body.appendChild(list);

    card.appendChild(head);
    card.appendChild(body);
    modal.appendChild(card);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    activeCommentsModal = backdrop;
    renderList();
    ta.focus();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('news-grid')) {
        // сохраняем seed при первом заходе
        const existing = localStorage.getItem(ARTICLES_STORAGE_KEY);
        if (!existing) {
            saveArticles(loadArticles());
        }
        renderNewsAdminPanel(currentLang);
        renderNewsArticles(currentLang);
    }
});

document.addEventListener('school31:languagechange', (e) => {
    const lang = (e && e.detail && e.detail.lang) ? e.detail.lang : currentLang;
    if (document.getElementById('news-grid')) {
        renderNewsAdminPanel(lang);
        renderNewsArticles(lang);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('profileName');
    const avatarInput = document.getElementById('profileAvatarInput');
    const avatarPreview = document.getElementById('profileAvatarPreview');
    const saveBtn = document.getElementById('profileSave');
    const removeBtn = document.getElementById('profileAvatarRemove');

    if (!nameInput || !avatarPreview || !saveBtn) return;

    const p = loadProfile();
    nameInput.value = p.name || '';
    avatarPreview.src = p.avatar || '';
    avatarPreview.style.visibility = p.avatar ? 'visible' : 'hidden';

    function setAvatar(dataUrl) {
        const cur = loadProfile();
        cur.avatar = dataUrl || '';
        saveProfile(cur);
        avatarPreview.src = cur.avatar || '';
        avatarPreview.style.visibility = cur.avatar ? 'visible' : 'hidden';
    }

    if (avatarInput) {
        avatarInput.addEventListener('change', () => {
            const file = avatarInput.files && avatarInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setAvatar(String(reader.result || ''));
            reader.readAsDataURL(file);
            avatarInput.value = '';
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => setAvatar(''));
    }

    saveBtn.addEventListener('click', () => {
        const cur = loadProfile();
        cur.name = String(nameInput.value || '').trim();
        saveProfile(cur);
    });
});