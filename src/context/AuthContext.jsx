import React, { createContext, useState, useContext, useEffect } from 'react';
import Papa from 'papaparse';

const AuthContext = createContext();

// Ayni paytdagi Sheet ID (App.jsx dagi bilan bir xil bo'lishi kerak)
const SHEET_ID = '1EplZnqMhRJHS2XBqr00Qjpl8-iaXMDRKhMCL3E3Y2ts';
// "Foydalanuvchilar" nomli sheetdan o'qiydi
const USERS_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Foydalanuvchilar%20web`;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sahifa yangilanganda foydalanuvchini tiklash
        const storedUser = localStorage.getItem('music_dictionary_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        return new Promise((resolve, reject) => {
            // Cache busting uchun timestamp qo'shamiz
            const cacheBuster = `&t=${new Date().getTime()}`;
            const fetchUrl = USERS_SHEET_CSV_URL + cacheBuster;

            Papa.parse(fetchUrl, {
                download: true,
                header: false,
                skipEmptyLines: true,
                complete: (results) => {
                    const rows = results.data;
                    const dataRows = rows.slice(1); // Header ni tashlab yuboramiz

                    const foundUser = dataRows.find(row => {
                        const sheetUsername = row[0]?.toString().trim(); // Stringga o'tkazib trim qilamiz
                        const sheetPassword = row[1]?.toString().trim();
                        // Qat'iy tenglik tekshiruvi
                        return sheetUsername === username && sheetPassword === password;
                    });

                    if (foundUser) {
                        const userData = {
                            username: foundUser[0],
                            fullname: foundUser[2] || foundUser[0]
                        };
                        setUser(userData);
                        localStorage.setItem('music_dictionary_user', JSON.stringify(userData));
                        resolve(userData);
                    } else {
                        // Xatolik emas, shunchaki topilmadi -> false qaytaramiz
                        resolve(false);
                    }
                },
                error: (err) => {
                    console.error("CSV Parse Error:", err);
                    resolve(false); // Tarmoq xatosida ham false beramiz, Login.jsx "xato" deb ko'rsatadi
                }
            });
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('music_dictionary_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
