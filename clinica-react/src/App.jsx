
import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './Header'
import Inicio from './Inicio'
import Footer from './Footer'
import QuienesSomos from './QuienesSomos'
import Especialidades from './Especialidades'
import AgendarHora from './AgendarHora'
import MisHoras from './MisHoras'
import Medicos from './Medicos.jsx'
import Contacto from './Contacto.jsx'
import Sucursales from './Sucursales.jsx'
import PreguntasFrecuentes from './PreguntasFrecuentes.jsx'
import Login from './Login.jsx'
import RegistroPaciente from './RegistroPaciente.jsx'
import PerfilPaciente from './PerfilPaciente.jsx'
import horasIniciales from './horas.js'

function App() {
  const [horas, setHoras] = useState(() => {
    const horasGuardadas = localStorage.getItem('horas')

    if (horasGuardadas) {
      try {
        const datosGuardados = JSON.parse(horasGuardadas)
        return Array.isArray(datosGuardados) ? datosGuardados : horasIniciales
      } catch {
        return horasIniciales
      }
    }

    return horasIniciales
  })

  useEffect(() => {
    localStorage.setItem('horas', JSON.stringify(horas))
  }, [horas])

  function agregarHora(nuevaHora) {
    setHoras([...horas, nuevaHora])
  }
  function eliminarHora(id) {
    setHoras(horas.filter((hora) => hora.id !== id))
  }
  function actualizarHora(horaActualizada) {
    setHoras(
      horas.map((hora) =>
        hora.id === horaActualizada.id ? horaActualizada : hora
      )
    )
  }

  return (
    <div className="app-shell">
      <Header />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="/medicos" element={<Medicos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/sucursales" element={<Sucursales />} />
        <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro-paciente" element={<RegistroPaciente />} />
        <Route path="/perfil" element={<PerfilPaciente />} />
        <Route
          path="/agendar-hora"
          element={<AgendarHora agregarHora={agregarHora} />}
        />
        <Route
          path="/mis-horas"
          element={
            <MisHoras
              horas={horas}
              eliminarHora={eliminarHora}
              actualizarHora={actualizarHora}
            />
          }
        />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
