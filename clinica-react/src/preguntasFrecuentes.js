const preguntasFrecuentes = [
  {
    id: 'horas-medicas',
    categoria: 'Horas médicas',
    preguntas: [
      { pregunta: '¿Cómo puedo agendar una hora?', respuesta: 'Ingresa a la sección Agendar hora, selecciona la especialidad, el médico, la fecha y la hora que prefieras y confirma tu reserva. Recibirás un comprobante con el ID de tu reserva.', enlace: { texto: 'Agendar hora', ruta: '/agendar-hora' } },
      { pregunta: '¿Puedo modificar o cancelar una hora ya agendada?', respuesta: 'Sí. Desde tu cuenta puedes modificar la fecha u hora de tu reserva o cancelarla con al menos 24 horas de anticipación, sin costo.' },
      { pregunta: '¿Necesito una cuenta para agendar?', respuesta: 'Sí. Debes registrarte como paciente e iniciar sesión. Así podrás revisar tus horas agendadas y tu historial de atenciones.' },
      { pregunta: '¿Qué pasa si llego atrasado a mi hora?', respuesta: 'Se aceptan hasta 10 minutos de atraso. Pasado ese tiempo la hora puede ser reasignada y deberás agendar nuevamente.' },
    ],
  },
  {
    id: 'atencion-pagos',
    categoria: 'Atención y pagos',
    preguntas: [
      { pregunta: '¿Qué debo llevar el día de mi atención?', respuesta: 'Tu cédula de identidad, el comprobante de reserva (puede ser digital) y, si corresponde, exámenes o informes médicos previos.' },
      { pregunta: '¿Trabajan con Fonasa e Isapres?', respuesta: 'Sí. Atendemos pacientes de Fonasa y de las principales Isapres. Consulta por convenios específicos en Contacto.', enlace: { texto: 'Contacto', ruta: '/contacto' } },
      { pregunta: '¿Cuáles son los medios de pago?', respuesta: 'Aceptamos efectivo, tarjetas de débito y crédito, y bonos electrónicos. El pago se realiza en recepción antes de la atención.' },
      { pregunta: '¿Cómo obtengo los resultados de mis exámenes?', respuesta: 'Los resultados quedan disponibles en tu historial de atenciones dentro de tu cuenta. También puedes retirarlos en la sucursal donde te atendiste.' },
    ],
  },
  {
    id: 'sucursales-horarios',
    categoria: 'Sucursales y horarios',
    preguntas: [
      { pregunta: '¿Dónde están ubicadas las sucursales?', respuesta: 'Contamos con sucursales en Santiago Centro, Providencia, Maipú y La Florida. Revisa sus direcciones y horarios en Sucursales.', enlace: { texto: 'Sucursales', ruta: '/sucursales' } },
      { pregunta: '¿Atienden los fines de semana?', respuesta: 'La mayoría de nuestras sucursales atiende los sábados en la mañana. Los domingos y festivos no hay atención.' },
    ],
  },
]

export default preguntasFrecuentes