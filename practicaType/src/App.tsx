import { useState, useEffect } from 'react'
import './App.css'

interface UserData {
  email: string;
  password?: string;
  name: string;
  hobby1: string;
  hobby2: string;
  token: string;
}

function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Nuevo estado
  const [name, setName] = useState('');
  const [hobby1, setHobby1] = useState('');
  const [hobby2, setHobby2] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que el email sea válido
    if (!isValidEmail(email)) {
      alert("Por favor, ingresa un correo válido (ejemplo: usuario@dominio.com)");
      return;
    }

    const storedUsers = localStorage.getItem("users_list");
    const usersList: UserData[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (isRegistering) {
      // --- VALIDACIÓN DE CONTRASEÑA ---
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden. Por favor, verifica.");
        return; // Detiene la ejecución si no son iguales
      }

      const exists = usersList.find(u => u.email === email);
      if (exists) return alert("Este correo ya está registrado");

      const newUser: UserData = { 
        email, 
        password, 
        name, 
        hobby1, 
        hobby2, 
        token: "fake-jwt-" + Math.random() 
      };

      usersList.push(newUser);
      localStorage.setItem("users_list", JSON.stringify(usersList));
      
      setUser(newUser);
      localStorage.setItem("user_session", JSON.stringify(newUser));
      alert("Registro exitoso");

    } else {
      const foundUser = usersList.find(u => u.email === email && u.password === password);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user_session", JSON.stringify(foundUser));
      } else {
        alert("Correo o contraseña incorrectos");
      }
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
              <p>{user.hobby1}</p>
            </div>
            <div className="info-item">
              <label>Hobby 2</label>
              <p>{user.hobby2}</p>
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
        <br/><br/>
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <br/><br/>

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
            <br/><br/>
            <input 
              type="text" 
              placeholder="Nombre completo" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
            <br/><br/>
            <input 
              type="text" 
              placeholder="Hobby 1" 
              value={hobby1}
              onChange={(e) => setHobby1(e.target.value)}
              required 
            />
            <br/><br/>
            <input 
              type="text" 
              placeholder="Hobby 2" 
              value={hobby2}
              onChange={(e) => setHobby2(e.target.value)}
              required 
            />
            <br/><br/>
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