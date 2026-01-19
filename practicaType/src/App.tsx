import { useState, useEffect } from 'react'
import './App.css'

interface UserData {
  email: string;
  password: string;
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

  // 1. Validación básica de Email
  if (!isValidEmail(email)) {
    alert("Por favor, ingresa un correo válido");
    return;
  }

  // 2. Definir URL y datos según la acción (Registro o Login)
  // Asegúrate de que el puerto coincida con el de tu servidor Node
  const API_URL = 'http://localhost:3000'; 
  const endpoint = isRegistering ? '/users/create' : '/users/login';
  
  const payload = isRegistering 
    ? { email, password, name, hobbies } 
    : { email, password };

  try {
    // 3. Realizar la petición al servidor
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // 4. Manejar errores del servidor (ej. 401 Credenciales inválidas)
    if (!response.ok) {
      throw new Error(data.error || 'Hubo un error en la autenticación');
    }

    // 5. Manejar éxito
    if (isRegistering) {
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setIsRegistering(false); // Cambia automáticamente a la vista de Login
      setPassword(''); // Limpia para el login
    } else {
      // Caso Login exitoso
      setUser(data.user); // Guardamos el usuario en el estado de React
      localStorage.setItem("user_session", JSON.stringify(data.user));
      alert(data.message || "Bienvenido");
    }

  } catch (error: any) {
    alert("Error del servidor: " + error.message);
  }
};

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user_session");
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setHobbies(['', '']);
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
            {user.hobbies.map((hobby, index) => (
              <div className="info-item" key={index}>
                <label>Hobby {index + 1}</label>
                <p>{hobby}</p>
              </div>
            ))}
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
          <label htmlFor="email">{isRegistering ? "Registra tu correo electrónico" : "Ingresa tu correo electrónico"}</label>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <br/><br/>

        <label htmlFor="password">{isRegistering ? "Regístra tu contraseña" : "Ingresa con tu contraseña"}</label>
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
          <label htmlFor="confirmPassword">Confirma tu contraseña</label>
            <input 
              type="password" 
              placeholder="Confirmar contraseña" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
            <br/><br/>
            <label htmlFor="name">Nombre Completo</label>
            <input 
              type="text" 
              placeholder="Nombre completo" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
            <br/><br/>
            {hobbies.map((hobby, index) => (
              <div key={index}>
                <label htmlFor={`hobby${index}`}>Hobby {index + 1}</label>
                <input 
                  type="text" 
                  id={`hobby${index}`}
                  placeholder={`Hobby ${index + 1}`}
                  value={hobby}
                  onChange={(e) => {
                    const newHobbies = [...hobbies];
                    newHobbies[index] = e.target.value;
                    setHobbies(newHobbies);
                  }}
                  required 
                />
                <br/><br/>
              </div>
            ))}
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