import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000';

interface UserData {
  email: string;
  password?: string;
  name: string;
  hobbies: string[];
}

function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Nuevo estado
  const [name, setName] = useState('');
  const [hobbies, setHobbies] = useState<string[]>(['', '']);


  useEffect(() => {
    const loggedInUser = localStorage.getItem("user_session");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  // Función para validar email con regex
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que el email sea válido
    if (!isValidEmail(email)) {
      alert("Por favor, ingresa un correo válido (ejemplo: usuario@dominio.com)");
      return;
    }

    const storedUsers = localStorage.getItem("users_list");
    const usersList: UserData[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (isRegistering) {
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      const response = await fetch(`${API_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          name,
          hobbies
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Error al registrar');
        return;
      }

      const newUser = await response.json();
      setUser(newUser);
      localStorage.setItem("user_session", JSON.stringify(newUser));
    }

  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user_session");
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  if (user) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-left">
            <h2>¡Hola, {user.name}!</h2>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
        </nav>

        <div className="main-container">
          <div className="user-card">
            <div className="info-item">
              <label>Correo</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Hobby 1</label>
              <p>{user.hobbies[0]}</p>
            </div>
            <div className="info-item">
              <label>Hobby 2</label>
              <p>{user.hobbies[1]}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br /><br />

          {/* CAMPO CONDICIONAL: CONFIRMAR CONTRASEÑA */}
          {isRegistering && (
            <>
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <br /><br />
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <br /><br />
              <input
                type="text"
                placeholder="Hobby 1"
                value={hobbies[0]}
                onChange={(e) => setHobbies([e.target.value, hobbies[1]])}
                required
              />
              <br /><br />
              <input
                type="text"
                placeholder="Hobby 2"
                value={hobbies[1]}
                onChange={(e) => setHobbies([hobbies[0], e.target.value])}
                required
              />
              <br /><br />
            </>
          )}

          <button type="submit">
            {isRegistering ? "Registrarme" : "Entrar"}
          </button>
        </form>

        <p className="toggle-auth">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setPassword('');
              setConfirmPassword('');
            }}
            className="toggle-btn"
          >
            {isRegistering ? "Volver al Login" : "Regístrate aquí"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;