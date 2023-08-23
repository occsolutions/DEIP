
const required = '<br/><br/><b>Este campo es obligatorio.</b>'

export default {
  icon: 'mdi-help-circle',
  engagement: {
    create: {
      name: {
        title: 'Nombre de la encuesta',
        text: `Sirve como medio de identificación para la encuesta. ${required}`
      },
      displayName: {
        title: 'Nombre externo para los encuestados',
        // tslint:disable-next-line:max-line-length
        text: 'En caso de ser seleccionado, este será el nombre mostrado a los colaboradores que vayan a realizar la encuesta.'
      },
      deliveredAt: {
        title: 'Fecha de lanzamiento',
        text: `Establece la fecha de inicio de la encuesta. A partir de esta fecha, se enviaran los correos de participación y los colaboradores podrán responder la medición. ${required}`
      },
      validUntil: {
        title: 'Encuesta válida hasta',
        text: `Establece la fecha de cierre de la medición. Después del cierre, no se podrán responder más encuestas de esta medición. ${required}`
      },
      timezone: {
        title: 'Zona horaria',
        text: `Las fechas de lanzamiento, cierre y recordatorios se basarán en la zona horaria elegida. ${required}`
      },
      reminders: {
        title: 'Recordatorios',
        // tslint:disable-next-line:max-line-length
        text: 'Los recordatorios se enviaran vía correo electrónico a aquellos colaboradores que no hayan respondido hasta el momento. Se pueden configurar máximo 5 recordatorios.'
      },
      openQuestion: {
        title: 'Añadir preguntas adicionales',
        text: 'Permite agregar hasta tres preguntas abiertas extras a la encuesta con un máximo de cinco opciones cada una.'
      },
      subject: {
        title: 'Asunto del mensaje',
        text: 'Asunto que se utilizará en el correo electrónico enviado.'
      },
      body: {
        title: 'Cuerpo del mensaje',
        text: 'Contenido del correo electrónico enviado.'
      },
      thankMessage: {
        title: 'Mensaje de agradecimiento',
        text: 'Este mensaje será enviado al correo electrónico del receptor que finalice satisfactoriamente el llenado de la encuesta.'
      },
      remember_load_update_collaborators: 'Recuerda cargar o actualizar los colaboradores antes de crear la encuesta.'
    }
  },
  employee: {
    create: {
      identifyDocument: {
        title: 'Documento de identificación',
        text: 'Documento de identificación del empleado. Es necesario indicar el tipo de documento.',
        required
      },
      firstName: {
        title: 'Nombre',
        text: 'Los nombres del empleado.',
        required
      },
      lastName: {
        title: 'Apellido',
        text: 'Los apellidos del empleado.',
        required
      },
      gender: {
        title: 'Género',
        text: 'Género del empleado.',
        required
      },
      birthdate: {
        title: 'Fecha de nacimiento',
        text: 'Fecha de nacimiento del empleado.',
        required
      },
      academicDegree: {
        title: 'Título académico',
        text: 'Título académico del empleado.',
        required
      },
      country: {
        title: 'País',
        text: 'País del empleado.',
        required
      },
      headquarter: {
        title: 'Sede',
        text: 'Sede donde trabaja el empleado.',
        required
      },
      email: {
        title: 'Correo electrónico',
        text: 'Correo electrónico del empleado.',
        required
      },
      phoneNumber: {
        title: 'Número de teléfono',
        text: 'Número de teléfono del empleado.',
        required
      },
      admission: {
        title: 'Fecha de ingreso',
        text: 'Fecha en la cual fue contratado el empleado.',
        required
      },
      jobType: {
        title: 'Tipo de contratación',
        text: 'Tipo de contratación del empleado.',
        required
      },
      department: {
        title: 'Área o departamento',
        text: 'Área o departamento al cual pertenece el empleado.',
        required
      },
      charge: {
        title: 'Cargo',
        text: 'Cargo que desempeña el empleado dentro de la Organización.',
        required
      }
    }
  },
  pulse: {
    create: {
      committal: {
        title: 'Añadir preguntas de compromiso',
        text: 'Permite añadir de una a seis preguntas de compromiso a la encuesta. Esta acción es obligatoria en caso de no incluir preguntas de un cuestionario en la encuesta.'
      },
      questionnaire: {
        title: 'Añadir preguntas de un cuestionario',
        text: 'Permite añadir las preguntas de una o más dimensiones pertenecientes a un cuestionario. Esta acción es obligatoria en caso de no incluir preguntas de compromiso en la encuesta.'
      },
      open: {
        title: 'Añadir preguntas adicionales',
        text: 'Permite agregar hasta tres preguntas abiertas extras a la encuesta con un máximo de cinco opciones cada una.'
      },
      selection: {
        title: '¿A quién desea enviar esta encuesta?',
        text: `Permite seleccionar a los participantes de la encuesta en base a tres criterios distintos: toda la organización, filtrados por cortes demográficos o individual. ${required}`
      }
    }
  },
  questionnaire: {
    create: {
      name: {
        title: 'Nombre',
        text: `Nombre que será asignado al cuestionario. ${required}`
      },
      base: {
        title: 'Cuestionario base',
        text: `Cuestionario del cual se hará una copia para generar el nuevo cuestionario. ${required}`
      },
      language: {
        title: 'Idiomas',
        text: `Idiomas en los que estará disponible el cuestionario. ${required}`
      },
      assignate: {
        title: 'Asignar cuestionario',
        text: 'Permite asignar el cuestionario a un sector empresarial específico o a una organización en particular.'
      }
    }
  },
  enterprise: {
    create: {
      video: {
        title: 'Video',
        text: 'Puede adjuntar un archivo de video cuyo peso no supere los 50 MB.'
      },
      logo: {
        title: 'Logo',
        text: 'El logo de la empresa debe ser una imagen cuyo peso no supere los 2MB.'
      },
      name: {
        title: 'Nombre',
        text: `Nombre de la empresa. ${required}`
      },
      sector: {
        title: 'Sector',
        text: `Sector empresarial de la empresa. ${required}`
      },
      language: {
        title: 'Idioma',
        text: `Idioma principal de la empresa. ${required}`
      },
      country: {
        title: 'País',
        text: `País en el que se encuentra la empresa. ${required}`
      },
      headquarter: {
        title: 'Sede',
        text: `Sede de la empresa. ${required}`
      },
      address: {
        title: 'Dirección',
        text: `Dirección principal de la empresa. ${required}`
      },
      groups: {
        title: 'Grupo',
        text: 'Grupo al cual pertenece la empresa.'
      },
      size: {
        title: 'Tamaño de la empresa',
        text: `Tamaño de la empresa en base a sus ingresos. ${required}`
      },
      employeesNumber: {
        title: 'Número de colaboradores',
        text: `Número de colaboradores de la empresa. ${required}`
      },
      license: {
        title: 'Licencia',
        text: `Licencia que se asignará a la empresa. ${required}`
      },
      engagements: {
        title: 'Cantidad de Engagement',
        text: 'Cantidad de Engagement disponibles en el plan personalizado.'
      },
      pulses: {
        title: 'Cantidad de Pulse',
        text: 'Cantidad de Pulse disponibles en el plan personalizado.'
      },
      startAt: {
        title: 'Fecha de Inicio',
        text: `Fecha de inicio para el plan de la empresa. ${required}`
      },
      duration: {
        title: 'Duración',
        text: `Duración de la licencia. ${required}`
      },
      identifyDocument: {
        title: 'Documento de identificación',
        text: `Documento de identificación del empleado de conacto. Es necesario indicar el tipo de documento. ${required}`,
        required
      },
      firstName: {
        title: 'Nombre',
        text: `Los nombres del empleado de contacto. ${required}`,
        required
      },
      lastName: {
        title: 'Apellido',
        text: `Los apellidos del empleado de contacto. ${required}`,
        required
      },
      email: {
        title: 'Correo electrónico',
        text: `Correo electrónico del empleado de contacto. ${required}`,
        required
      },
      phoneNumber: {
        title: 'Número de teléfono',
        text: 'Número de teléfono del empleado de contacto.'
      },
      contactAddress: {
        title: 'Dirección',
        text: 'Dirección del empleado de contacto.'
      }
    },
    plan: {
      pulse_quantity: {
        title: 'Cantidad de Pulse a agregar',
        text: `Pulse que se agregarán a la empresa en la extensión del plan. ${required}`
      },
      engagement_quantity: {
        title: 'Cantidad de Engagement a agregar',
        text: `Engagement que se agregarán a la empresa en la extensión del plan. ${required}`
      },
      new: {
        title: 'Nuevo plan',
        text: `Plan que será asignado a la empresa. ${required}`
      },
      duration: {
        title: 'Duración',
        text: `Duración en meses para el nuevo plan. ${required}`
      }
    },
    massive: {
      file_input: {
        title: 'Archivo a cargar',
        text: `Cargue un archivo excel (.xls/.xlsx) o csv (.csv) que contenga los datos de sus colaboradores. Esta acción actualizará su base total de colaboradores, por lo que debe agregar la base completa de colaboradores disponibles.<br/><br/>Recuerde utilizar la plantilla descargable que puede obtener al hacer click en el botón "DESCARGAR PLANTILLA". ${required}`
      }
    },
    group: {
      name: {
        title: 'Nombre del grupo',
        text: `Nombre con el que se identificará al grupo de empresas. ${required}`
      },
      leader: {
        title: 'Empresa líder',
        text: 'La empresa líder (líder del grupo) tiene la capacidad de gestionar los planes de las empresas partenecientes a su grupo.'
      }
    }
  }
}
