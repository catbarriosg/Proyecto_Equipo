
function Especialidades() {
  const especialidades = [
    'Medicina General',
    'Pediatría',
    'Cardiología',
    'Dermatología',
    'Ginecología'
  ]

  return (
    <main>
      <h2>Nuestras especialidades</h2>

      <p>
        Conoce las especialidades médicas disponibles en nuestra clínica.
      </p>

      <ul>
        {especialidades.map((especialidad) => (
          <li key={especialidad}>{especialidad}</li>
        ))}
      </ul>
    </main>
  )
}

export default Especialidades
