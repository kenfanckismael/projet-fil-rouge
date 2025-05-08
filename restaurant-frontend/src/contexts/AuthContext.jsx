import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            if (!user) {
                fetchUser();
            }
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Non authentifié');
            }

            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            logout('Session expirée. Veuillez vous reconnecter.');
        }
    };

    const login = async (email, password) => {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Identifiants invalides');
        }

        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const logout = async (message = null) => {
        try {
            await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
        } catch (error) {
            // Ignorer l’erreur réseau
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            navigate('/login', { state: message ? { message } : {} });
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
