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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      <div className="card">
        <h1>¡Hola, {user.name}!</h1>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Hobby 1:</strong> {user.hobby1}</p>
        <p><strong>Hobby 2:</strong> {user.hobby2}</p>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    );
  }

  return (
    <div className="card">
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

      <p style={{ marginTop: '20px' }}>
        <button 
          onClick={() => {
            setIsRegistering(!isRegistering);
            setPassword('');
            setConfirmPassword('');
          }}
          style={{ background: 'none', border: 'none', color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isRegistering ? "Volver al Login" : "Regístrate aquí"}
        </button>
      </p>
    </div>
  );
}

export default App;