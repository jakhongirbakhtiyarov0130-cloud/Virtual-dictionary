import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    uz: {
        login: "Kirish",
        register: "Ro'yxatdan o'tish",
        logout: "Chiqish",
        search_placeholder: "Atamani qidirish...",
        composers: "Kompozitorlar",
        profile: "Profil",
        fullname: "To'liq ismingiz",
        username: "Foydalanuvchi nomi",
        password: "Parol",
        submit: "Tasdiqlash",
        loading: "Yuklanmoqda...",
        error_empty: "Jadval bo'sh yoki yuklanmadi.",
        error_fetch: "Jadvalni yuklab bo'lmadi.",
        no_results: "Hech narsa topilmadi",
        trending: "Ko'p qidirilgan:",
        theme_dark: "Tungi rejim",
        theme_light: "Kunduzgi rejim",
        listen: "Eshitish",
        home: "Bosh sahifa",
        have_account: "Hisobingiz bormi?",
        no_account: "Hisobingiz yo'qmi?",
        enter: "Kirish",
        register_action: "Ro'yxatdan o'tish",
        term_def_label: "Izoh",
        composers_title: "Mashhur Kompozitorlar"
    },
    ru: {
        login: "Вход",
        register: "Регистрация",
        logout: "Выйти",
        search_placeholder: "Поиск термина...",
        composers: "Композиторы",
        profile: "Профиль",
        fullname: "Полное имя",
        username: "Имя пользователя",
        password: "Пароль",
        submit: "Подтвердить",
        loading: "Загрузка...",
        error_empty: "Таблица пуста или не загружена.",
        error_fetch: "Не удалось загрузить таблицу.",
        no_results: "Ничего не найдено",
        trending: "Популярные:",
        theme_dark: "Ночной режим",
        theme_light: "Дневной режим",
        listen: "Прослушать",
        home: "Главная",
        have_account: "Есть аккаунт?",
        no_account: "Нет аккаунта?",
        enter: "Войти",
        register_action: "Зарегистрироваться",
        term_def_label: "Описание",
        composers_title: "Известные Композиторы"
    },
    kaa: {
        login: "Kiriw",
        register: "Dizimnen o'tiw",
        logout: "Shig'iw",
        search_placeholder: "Atamani izlew...",
        composers: "Kompozitorlar",
        profile: "Profil",
        fullname: "Tolıq atıńız",
        username: "Paydalanıwshı ati",
        password: "Parol",
        submit: "Tastıyıqlaw",
        loading: "Jüklennpekte...",
        error_empty: "Keste bos yamasa jüklennbedi.",
        error_fetch: "Kesteni jüklep bolmadı.",
        no_results: "Hesh nárse tabılmadı",
        trending: "Kóp izlengen:",
        theme_dark: "Túngi rejim",
        theme_light: "Kúndizgi rejim",
        listen: "Tıńlaw",
        home: "Bas bet",
        have_account: "Esabıńız bar ma?",
        no_account: "Esabıńız joq pa?",
        enter: "Kiriw",
        register_action: "Dizimnen o'tiw",
        term_def_label: "Túsindirme",
        composers_title: "Belgili Kompozitorlar"
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('appLanguage') || 'uz';
    });

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
