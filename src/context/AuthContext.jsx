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
            Papa.parse(USERS_SHEET_CSV_URL, {
                download: true,
                header: false, // Header yo'q deb faraz qilamiz yoki 1-qatorni tashlab o'tamiz
                skipEmptyLines: true,
                complete: (results) => {
                    const rows = results.data;
                    // 1-qator sarlavha deb hisoblaymiz (Username, Password, Fullname)
                    const dataRows = rows.slice(1);

                    const foundUser = dataRows.find(row => {
                        // CSV da ustunlar tartibi: 0=Username, 1=Password, 2=Fullname
                        const sheetUsername = row[0]?.trim();
                        const sheetPassword = row[1]?.trim();
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
                        reject(new Error("Login yoki parol noto'g'ri"));
                    }
                },
                error: (err) => {
                    reject(new Error("Tarmoq xatoligi yoki jadval topilmadi"));
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
