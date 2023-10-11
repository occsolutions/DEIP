
export default {
  list: {
    title: 'Valoraciones',
    btn_create: 'Crear Valoración',
    btn_link: 'Copiar enlace',
    btn_edit: 'Editar valoración',
    btn_details: 'Ver detalles',
    btn_report: 'Ver reportes',
    input_filter_by: 'Filtrar por',
    generic_link_btn: 'Enlace para Colaboradores sin Correo',
    table_name: 'Nombre',
    table_status: 'Estado',
    table_vigency: 'Vigencia',
    table_actions: 'Acciones',
    table_no_data: 'No hay valoraciones para mostrar',
    status_creating: 'Creando',
    status_editing: 'Editando',
    status_pending: 'Pendiente',
    status_in_progress: 'En progreso',
    status_completed: 'Completada',
    modal_invitation_url: 'Enlace de invitación',
    modal_url_copied: 'Enlace copiado',
    modal_copy_invitation_url_title: 'Enlace para colaboradores sin correo',
    modal_copy_invitation_url: 'Este enlace lo puedes copiar y enviar a los colaboradores que estén participando en la medición y no tengan correo electrónico o no les haya llegado el correo de invitación. Para poder responder la encuesta, los colaboradores deberán ingresar su documento de identidad con el cual se han cargado en la plataforma.',
    modal_link: 'Copiar enlace',
    modal_btn_close: 'Cerrar',
    may_take_while: 'Esta acción puede tardar unos minutos',
    msg_link_copied: 'Enlace copiado',
    refresh: 'Refrescar'
  },
  create: {
    title: 'Crear valoración',
    stepper_overview: 'Nombre de la encuesta',
    stepper_date: 'Fecha',
    stepper_questions: 'Preguntas',
    stepper_population: 'Participantes',
    stepper_additional_segmentation: 'Segmentación Adicional',
    stepper_revition: 'Revisión y personalización',
    stepper_btn_next: 'Siguiente',
    stepper_btn_back: 'Atrás',
    stepper_btn_cancel: 'Cancelar',
    stepper_btn_save: 'Guardar',
    stepper_btn_confirm_create: 'Confirmar y Crear',
    modal_confirm_create_title: 'Confirme la creación de la valoración',
    modal_workshop_cost: 'Costo de la valoración',
    total_receptors: 'Total de participantes: {n}',
    total_receptors_leaders: 'Total de participantes líderes: {n}',
    msg_created_evaluation: 'Valoración creada satisfactoriamente'
  },
  stepOverview: {
    title: 'Nombre de la encuesta',
    input_name: 'Nombre',
    tooltip_input_name: 'Nombre interno de la valoración',
    want_external_name: '¿Desea colocar un nombre externo para los participantes?',
    input_display_name: 'Nombre de muestra',
    tooltip_input_display_name: 'Nombre de muestra'
  },
  stepDate: {
    title: 'Fecha',
    date_delivery: 'Fecha de lanzamiento',
    poll_valid_until: 'Valoración válida hasta',
    hours_valid_until: 'Hora de cierre',
    time_zone: 'Zona horaria',
    want_send_reminders: '¿Desea enviar recordatorios?',
    reminders: 'Enviar recordatorio',
    invalid_reminder_date: 'La Fecha del Recordatorio debe estar dentro del período de lanzamiento',
    hours: 'Hora de lanzamiento',
    add: 'Agregar',
    trash: 'Borrar',
    the_reminders: 'Los recordatorios'
  },
  stepQuestion: {
    title: 'Preguntas',
    custom_questionnaire_info: 'Si usted desea modificar alguno de los enunciados de la encuesta podrá hacerlo, siempre y cuando se mantenga el modelo DEIP. Por favor comuníquese a través de nuestro correo info@occsolutions.org',
    inputDownload: 'Descargar Cuestionario',
    questionnaire_e: 'Cuestionario DEIP',
    pdf_explained: 'Este archivo contiene las preguntas del cuestionario "{name}" agrupadas por dimensión.',
    questionnaire_title: 'OCC - Reporte DEIP',
    leader: 'Líder con personas a cargo',
    copyright: 'Copyright por OCC - Todos los derechos reservados',
    autoEvaluation: 'Autovaloración',
    generalEvaluation: 'Valoración del equipo',
    want_open_question: '¿Desea añadir preguntas adicionales?',
    open_question_info: 'Puede indicar preguntas personalizadas adicionales, indicando las posibles respuestas.',
    open_question: 'Preguntas adicionales',
    add_open_question: 'Añadir otra pregunta adicional',
    remove_open_question: 'Eliminar última pregunta adicional',
    min_open_question: 'Debe tener al menos una pregunta abierta disponible',
    max_open_question: 'Solamente puede {n} preguntas abiertas por encuesta',
    insert_question: 'Insertar contenido de la pregunta {n}',
    insert_question_option: 'Insertar opción {o} para pregunta {n}',
    add_question_option: 'Añadir otra opción ',
    remove_question_option: 'Eliminar opción ',
    min_question_option: 'Debe tener al menos {n} opciones disponibles',
    max_question_option: 'Sólo puede indicar {n} opciones para una pregunta abierta',
    additional_n: 'pregunta {n}',
    option_n: 'opción {n}'
  },
  stepEvaluatedSelection: {
    title: 'Participantes',
    desc: 'En esta sección, podrás elegir los participantes de la medición, puedes escoger entre todos los colaboradores activos en la empresa o por corte demográfico. Recuerda que todos los participantes de la medición, deben estar previamente cargados.',
    want_massive: '¿Desea realizar la asignación de la valoración via carga masiva?',
    add_evaluated: 'Agregar participante',
    add_evaluated_leader: 'Agregar líder',
    select_file_to_upload: 'Selecciones archivo a subir',
    evaluatedExists: 'Hay participantes en el archivo que ya se encuentran en el listado',
    incorrect_file: 'Por favor cargue un archivo valido',
    input_upload_file: 'Subir archivo',
    modal_del_title: 'Confirmar Borrado',
    modal_del_question: '¿Desea borrar este participante?',
    modal_del_question_leader: '¿Desea borrar este participante como líder con personas a cargo?',
    input_trash: 'Borrar',
    population_diff_singular: 'Con la última actualizacion de Colaboradores, se agregará (1) nuevo participante al momento de confirmar la edición de la medición.',
    population_diff_plural: 'Con la última actualizacion de Colaboradores, se agregarán ({n}) nuevos participantes al momento de confirmar la edición de la medición.',
    evaluatedTable: {
      team_members: 'Participantes',
      actions: 'Acciones',
      eval_no_data: 'No hay participantes para mostrar',
      input_trash: 'Borrar'
    },
    generateInstructive: {
      download_instructive: 'Descargar instructivo'
    },
    generateTemplate: {
      download_template: 'Descargar plantilla'
    },
    warningsDialog: {
      evaluated_not_found_warning: 'Los participantes mostrados a continación no fueron encontrados como colaboradores de su empresa:',
      multiple_appears_warning: 'se ha repetido como evaluado, por lo cual se tomó en cuenta en su primera aparición y se ignoró en la o las siguientes',
      the_member: 'El participante',
      warnings_list: 'Listado de advertencias',
      input_close: 'Cerrar'
    },
    addEvaluatorDialog: {
      add_evaluated: 'Agregar participante',
      evaluated: 'Participantes',
      input_cancel: 'Cancelar',
      input_save: 'Guardar'
    },
    want_to_send: '¿A quién desea enviar esta encuesta?',
    selectionType: {
      everybody: 'A toda mi organización',
      demographic_cuts: 'A cortes demográficos'
    },
    please_wait: 'Por favor espere mientras se cargan todos los demográficos',
    demographic_cuts: {
      departments: 'Áreas / Departamentos',
      charges: 'Cargos',
      academic_degrees: 'Nivel Académico',
      job_types: 'Tipo de Contratación',
      select_age_range: 'Rango de Edad',
      select_antiquity_range: 'Rango de Antigüedad',
      genders: 'Género',
      countries: 'País',
      headquarter: 'Sede',
      optionalDemo1: 'Demográfico Adicional 1',
      optionalDemo2: 'Demográfico Adicional 2'
    },
    ranges: {
      antiquity_low: 'Menos de {n} meses',
      antiquity_range_single: 'De {n} meses a {p} año',
      antiquity_range_one: 'De {n} año a {p} años',
      antiquity_range: 'De {n} años a {p} años',
      antiquity_upper: 'Más de {n} años',
      age_low: 'Menos de {n} años',
      age_range: 'De {n} a {p} años',
      age_upper: 'Más de {n} años'
    },
    leader_title: 'Participantes líderes con personas a cargo',
    leader_desc: 'Entre los participantes previamente elegidos, indica quienes son líderes con personas a cargo, estos líderes tendrán una sección especial en la medición. Este paso no es obligatorio.',
    leader_want_massive: '¿Desea realizar la seleción de líderes via carga masiva?',
    leader_add_evaluated: 'Selécionar más líderes'
  },
  stepRevition: {
    poll_name: 'Nombre de la valoración',
    external_name: 'Nombre de muestra',
    date_delivery: 'Fecha de lanzamiento',
    poll_valid_until: 'Valoración válida hasta',
    time_zone: 'Zona horaria',
    send_reminders: 'Envio de recordatorios',
    questionnaire: 'Cuestionario',
    paid_measuring: 'La valoración ya ha sido pagada.',
    workshop_cost: 'Costo de la valoración para {members} participantes',
    personalization: 'Personalización de correos electrónicos',
    poll_invitation: 'Invitación a la valoración',
    reminder_mail: 'Correo de recordatorio',
    tk_message: 'Mensaje de agradecimiento',
    message_subject: 'Asunto del mensaje',
    body_message: 'Cuerpo del mensaje',
    input_preview: 'Previsualización',
    fileExistNote: 'Para sustituir el archivo adjunto no es necesario eliminar el anterior.',
    input_select_video: 'Seleccionar video',
    fileExist: 'Video adjunto',
    token_unit: 'OCC Tokens',
    team: 'Equipo',
    team_members: 'Participantes',
    deleteFile: 'Eliminar archivo',
    subject_msg: 'Bienvenido a la medición de Energía Personal',
    custom_msg: '<p>Bienvenido(a) al proceso de valoración de Energía Personal, la cual te permitirá obtener información valiosa acerca de tus niveles de energía en cuatro dimensiones: física, mental, emocional y profesional.</p>' +
    '<p>Información clave sobre esta encuesta:</p>' +
    '<ul>' +
    '<li>La valoración tarda menos de 15 minutos en completarse.</li>' +
    '<li>La información entregada será manejada de manera confidencial y será utilizada con fines estadísticos.</li>' +
    '<li>Por favor contestar con total objetividad.</li>' +
    '<li>Para una mejor experiencia, utiliza <b>Google Chrome</b>. Recuerda que debes estar conectado(a) a Internet.</li>' +
    '<li>Si tienes alguna duda o evidencia algún problema con la encuesta por favor no dude en contactarnos en el correo: <a href="mailto:info@occsolutions.org">info@occsolutions.org</a>.</li>' +
    '<li>Recuerda que <b>este link es personal</b> y no se debe compartir.</li>' +
    '</ul><br>' +
    '<p>De antemano te agradecemos por tu tiempo y valiosos aportes en este proceso.</p>',
    subject_reminder: 'Recordatorio medición Energía Personal',
    custom_reminder: '<p>Te recordamos culminar el proceso de valoración de Energía Personal, la cual te permitirá obtener información valiosa acerca de tus niveles de energía en cuatro dimensiones: física, mental, emocional y profesional.</p>' +
    '<p>Información clave sobre esta encuesta:</p>' +
    '<ul>' +
    '<li>La valoración tarda menos de 15 minutos en completarse.</li>' +
    '<li>La información entregada será manejada de manera confidencial y será utilizada con fines estadísticos.</li>' +
    '<li>Por favor contestar con total objetividad.</li>' +
    '<li>Para una mejor experiencia, utiliza <b>Google Chrome</b>. Recuerda que debes estar conectado(a) a Internet.</li>' +
    '<li>Si tienes alguna duda o evidencia algún problema con la encuesta por favor no dude en contactarnos en el correo: <a href="mailto:info@occsolutions.org">info@occsolutions.org</a>.</li>' +
    '<li>Recuerda que <b>este link es personal</b> y no se debe compartir.</li>' +
    '</ul><br>' +
    '<p>De antemano te agradecemos por tu tiempo y valiosos aportes en este proceso.</p>',
    previewEmail: {
      subject: 'Asunto',
      hello: 'Hola',
      link_to_poll: 'El siguiente enlace le enviará hacia la encuesta',
      click_here: 'click aquí',
      por_team_members_info: 'En la siguiente tabla se listan todos los participantes del equipo a valorar',
      por_team_members: 'Participantes del equipo',
      attached_video: 'Vídeo adjunto',
      rights_reserved: 'Todos los derechos reservados 2022',
      sent_automatic: 'Este mensaje fue automáticamente enviado desde',
      support: 'Por favor no responda directamente a este correo. Las respuestas llegarán a un buzón automatizado y no nos será posible leer o contestar su correo. Para ponerse en contacto con nosotros envíe un correo a'
    }
  },
  stepAdditionalSegmentation: {
    title: 'Segmentación Adicional',
    description: 'Selecciona las opciones de segmentación que quieres utilizar en la Valoración. Al momento de entrar a llenar su encuesta, al colaborador se le pedirá que responda esta segmentación. Posteriormente podrás generar reportes con esta información. Si no encuentras la segmentación que deseas realizar en este listado, puedes crearla previamente en la sección de configuración de la Suite.',
    no_segmentation_found: 'Tu empresa no tiene Segmentación Adicional',
    selected: 'Seleccionada(s):'
  },
  edit: {
    title: 'Editar valoración',
    confirm_edit_title: 'Confirme la edición de la valoración<br/>Nuevos participantes',
    diff_cost: 'Costo de la diferencia',
    updated_evaluation: 'Valoración actualizada exitosamente',
    stepper_overview: 'Nombre de la encuesta',
    stepper_date: 'Fecha',
    stepper_questions: 'Preguntas',
    stepper_population: 'Participantes',
    stepper_additional_segmentation: 'Segmentación Adicional',
    stepper_revition: 'Revisión y personalización',
    stepper_btn_next: 'Siguiente',
    stepper_btn_back: 'Atrás',
    stepper_btn_cancel: 'Cancelar',
    stepper_btn_update: 'Actualizar'
  },
  show: {
    evaluation: 'Medición DEIP',
    options: 'Opciones',
    generate_report: 'Generar reportes',
    edit: 'Editar valoración',
    sending_reminders: 'Enviar recordatorios',
    close_evaluation: 'Cerrar valoración',
    close_evaluation_q: '¿Desea cerrar la valoración?',
    total: 'Total',
    pending_evaluations: 'Pendientes',
    finished_evaluations: 'Completadas',
    of_polls: 'de encuestas',
    date_delivery: 'Fecha de lanzamiento',
    poll_valid_until: 'Valoración válida hasta',
    scheduled_reminders: 'Recordatorios programados',
    no_reminders: 'Sin recordatorios programados',
    completed: 'Completada',
    send_reminders: 'Envio de recordatorios',
    send_reminders_q: '¿Desea enviar recordatorios?',
    reminders_sent_succesfully: 'Recordatorios enviados correctamente',
    evaluation_closed_succesfully: 'Valoración cerrada correctamente',
    team: 'Equipo',
    team_members: 'Participantes',
    status_pending: 'Pendiente',
    status_in_progress: 'En progreso',
    status_completed: 'Completada',
    input_confirm: 'Confirmar',
    download_reports: 'Descargar Reportes',
    modal_title: 'Participación de los participantes del equipo',
    modal_info: 'A continuación se muestra una explicación del estado de la participación de los participantes del equipo según un color representativo',
    modal_chip_default: 'No han iniciado o ingresado a responder la valoración',
    modal_chip_info: 'Ha ingresado a responder la valoración',
    modal_chip_success: 'Ha finalizado de responder la valoración',
    modal_input_close: 'Cerrar',
    look_for_name: 'Buscar por nombre...',
    tracking: 'Seguimiento',
    evaluated_list: {
      table_name: 'Nombre',
      table_status: 'Estado'
    }
  },
  evaluation: {
    evaluate: 'Participante',
    information_1: 'Bienvenido(a) a la encuesta DEIP',
    information_2: 'DEIP, es una medición de XX preguntas que explora las 4 dimensiones de las personas de alta energía positiva: Física, Mental, Emocional y Profesional.',
    information_3: 'El primer paso en este camino de mejoramiento personal, es el de generar auto-consciencia de tus fortalezas y áreas de oportunidad, por ello te invitamos a contestar de manera totalmente honesta cada una de las preguntas.',
    score_label1: 'Nunca',
    score_label2: 'Casi nunca',
    score_label3: 'Ocasionalmente',
    score_label4: 'Con frecuencia',
    score_label5: 'Casi siempre',
    score_label6: 'Siempre',
    confirmation_modal_title: 'Finalizar encuesta',
    confirmation_modal_des: 'Asegúrese de verificar sus respuestas, ya que una vez guardadas no se pueden modificar',
    expiration_date: 'La encuesta a la que se está intentando ingresar ha terminado',
    wellcome_instructions: 'Recuerde, para obtener resultados fieles a la realidad asegúrese de estar respondiendo de forma sincera. Su valoración no es ni buena ni mala, se trata de encontrar el valor que refleje con mayor fidelidad a la realidad. Confiamos en su criterio y sinceridad. Asegúrese de leer adecuadamente la información. El plazo máximo para completar la encuesta es: {deadline}',
    end: 'Muchas gracias por tu participación. Has completado la encuesta satisfactoriamente.',
    middle: '¡Muy Bien! ¡Ya has completado la mitad del proceso, mantente atento a cada pregunta!',
    invalid_token: 'No existe encuesta para este acceso, por favor coloque uno válido',
    before_date: 'La encuesta no se encuentra disponible para la fecha actual',
    not_available: 'La encuesta no se encuentra disponible en estos momentos',
    evaluation_completed: 'Ya has completado esta encuesta.',
    columm_auto_info: 'Las preguntas en esta columna se representan en primera persona y refieren a tu autoevaluación',
    columm_team_info: 'Las preguntas en esta columna se representan en tercera persona y refieren a la valoración del equipo',
    input_save: 'Guardar',
    input_finish: 'Finalizar',
    input_back: 'Atras',
    input_next: 'Siguiente',
    answer: 'Respuesta',
    wellcomeDialog: {
      wellcome_instructions: 'DEIP, es una medición de XX preguntas que explora las 4 dimensiones de las personas de alta energía positiva: Física, Mental, Emocional y Profesional.' +
      '<br/><br/>El primer paso en este camino de mejoramiento personal, es el de generar auto-consciencia de tus fortalezas y áreas de oportunidad, por ello te invitamos a contestar de manera totalmente honesta cada una de las preguntas.' +
      '<br/><br/>El plazo máximo para completar la encuesta es: {deadline}',
      must_accept_policy_to_continue: 'Para continuar con la encuesta es indispensable que por favor aceptes las política de tratamiento de datos:',
      i_accept_the: 'Acepto la',
      policy: 'Política de Tratamiento de Datos',
      input_start_poll: 'Comenzar valoración'
    },
    middleDialog: {
      middle: '¡Muy Bien! ¡Ya has completado la mitad del proceso, mantente atento a cada pregunta!',
      input_continue: 'Continuar'
    },
    helpDialog: {
      tab_help: 'Información',
      tab_progress: 'Progreso',
      tab_team: 'Equipo',
      info: 'La valoración está compuesta por una serie comportamientos y conductas relacionadas con las competencias y valores del Modelo POR, sobre las cuales cada evaluador califica la frecuencia entre 1 y 6 de acuerdo a la siguiente escala:',
      score_label1: 'Nunca',
      score_label2: 'Casi nunca',
      score_label3: 'Ocasionalmente',
      score_label4: 'Con frecuencia',
      score_label5: 'Casi siempre',
      score_label6: 'Siempre',
      input_continue: 'Continuar',
      progress_auto_info: 'Progreso de respuestas por autoevaluación',
      progress_team_info: 'Progreso de respuestas por valoración al equipo',
      progress_info: 'Progreso de respuestas general',
      members_info: 'Participantes del equipo'
    },
    must_answer_all_questions: 'Debes responder todas las preguntas',
    endDialog: {
      text_1: 'Si deseas descargar tu reporte individual haz click en el siguiente botón:',
      text_2: 'O si prefieres que enviemos el reporte a tu correo electrónico, por favor escríbelo en el siguiente campo y haz click en enviar:',
      text_3: 'Tu reporte a sido enviado a la siguiente dirección de correo electrónico. Si aún no lo has recibido, haz click en reenviar:',
      btn_report: 'Ver reporte',
      btn_send: 'Enviar',
      btn_resend: 'Reenviar',
      email_subject: 'Resultados DEIP',
      email_body: '<p>Muchas gracias por tu participación en la Medición DEIP.</p>',
      email_sent: 'Mensaje enviado exitosamente'
    }
  },
  report: {
    no_answers_modal_msg: 'Esta valoración no posee respuestas, por lo cual no será posible generar reportes.',
    open_questions_button: 'Gráficas de preguntas adicionales',
    open_question_select_label: 'Seleccione una pregunta',
    please_wait: 'Por favor espere',
    select_report_type: 'Seleccione el tipo de reporte que desea generar',
    general_title: 'Reporte Organizacional',
    general_desc: 'Este reporte muestra los resultados de la apreciación de todos los participantes de la medición.',
    no_members: 'No hubo participación de los miembros',
    demographic_title: 'Reporte por corte demográfico',
    demographic_desc: 'Seleccione uno de los cortes demograficos o segmentación adicional para generar un reporte detallado con las variables que lo componen:',
    generate_report: 'Generar reporte',
    generated_reports: 'Reportes Generados',
    generated_reports_desc: 'En esta sección encontrarás todos los reportes que has generado.<br>Dependiendo del número de participantes cada reporte puede tardar hasta 30 minutos en generarse. Puedes actualizar el progreso recargando la página.<br>Se recomienda generar un máximo de 5 reportes a la vez, para mejorar el rendimiento de la plataforma.',
    generating_report: 'Generando reporte',
    failed_generation: 'Generación fallida',
    download_report: 'Descargar reporte',
    input_update_progress: 'Actualizar progreso',
    input_back: 'Atrás',
    input_accept: 'Aceptar',
    confirm_report_title: 'Confirme la generación del reporte',
    report_cost: 'Costo del reporte',
    organizational: {
      title: 'Reporte Organizacional',
      subject: 'Reporte Organizacional DEIP',
      already_generated_report: 'Este reporte ya ha sido generado. Puedes descargarlo en la parte inferior, donde se encuentran todos los reportes generados.',
      operation_init: 'Se ha dado inicio a un proceso de descarga "Reporte Organizacional". Este proceso puede tardar varios minutos',
      of_population: 'De la población',
      total_expected: 'Total Esperadas:',
      total_obtained: 'Total respondidas:',
      prev_score: 'Puntaje Anterior',
      previous: 'Anterior',
      trend: 'Tendencia'
    },
    demographic: {
      title: 'Reporte por corte Demográfico',
      subject: 'Reporte por Población DEIP',
      selected: 'Seleccionado(s)',
      demographic_cuts: 'Cortes Demográficos',
      additional_segmentation: 'Segmentación Adicional',
      table_legend: 'Puedes seleccionar 1 corte demografico o segmentación adicional',
      operation_init: 'Se ha dado inicio a un proceso de descarga "Reporte por Cortes Demográficos". Este proceso puede tardar varios minutos',
      page_header: 'Variable',
      table_header: 'Demográfico'
    },
    months: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ],
    // Table of Contents
    toc: {
      index: 'ÍNDICE',
      introduction: 'Introducción',
      methodology: 'Metodología',
      model: 'Modelo DEIP',
      response_rate: 'Nivel de respuesta',
      general_scores: 'Resultado General',
      dimension_results: 'Resultados por Dimensión',
      dimensions_variables_scores: 'Resultados por Dimensión/Variable',
      detailed_scores_dim_physical: 'Detalle Dimensión Física',
      detailed_scores_dim_mental: 'Detalle Dimensión Mental',
      detailed_scores_dim_emotional: 'Detalle Dimensión Emocional',
      detailed_scores_dim_professional: 'Detalle Dimensión Profesional',
      highest_scores: 'Atributos con puntaje más Alto',
      lowest_scores: 'Atributos con puntaje más Bajo',
      highest_scatter: 'Atributos con dispersión más Alta',
      lowest_scatter: 'Atributos con dispersión más Baja'
    },
    current: 'Actual',
    dimension: 'Dimensión',
    gral_score: 'Puntaje General',
    dimension_results: 'Resultados por Dimensión',
    introduction: {
      first_paragraph: 'Las organizaciones invierten recursos significativos para desarrollar los conocimientos, habilidades, compromiso y actitudes de sus colaboradores, con el propósito de lograr un alto desempeño que les permita conseguir mejores resultados de negocio. Sin embargo, la inversión tiende a ser significativamente inferior en un multiplicador (positivo o negativo) de la ecuación del desempeño: la energía. Como personas y como colaboradores de una organización, los niveles individuales de energía personal varían en términos de cantidad (alta, media, baja) y en términos de calidad (positiva, neutra, negativa). La zona más favorable es por supuesto la de altos niveles de energía positiva y es allí donde típicamente conseguimos mayores niveles de bienestar en nuestra vida y mayores niveles de desempeño en nuestro trabajo.',
      second_paragraph: 'A diferencia del tiempo, la energía individual se puede expandir a través de buenos hábitos de vida y se puede renovar a través de buenas prácticas de recuperación y descanso. Sin embargo, si no se cuenta con una buena alineación mental y emocional, la energía también se puede drenar a través de episodios de alto estrés. La responsabilidad primaria sobre la salud y bienestar de cada quien es indelegable y es por ello que a través del DEIP, buscamos elevar la consciencia individual del autocuidado como piedra angular para todos los objetivos de la vida. En adición a la gestión individual de la energía, las organizaciones tienen la corresponsabilidad de construir culturas y ambientes de trabajo sanos, y estilos de liderazgo constructivos que faciliten la conciliación de altos estándares de desempeño y bienestar.'
    },
    model: {
      first_paragraph: 'El estado pleno de bienestar requiere la alineación de cuatro dimensiones: la física, la mental, la emocional y la profesional. En la dimensión física generamos y renovamos la energía, en la dimensión mental enfocamos la energía en nuestras prioridades, en la dimensión emocional aseguramos buenas relaciones y alineación con nuestro propósito, y en la dimensión profesional establecemos hábitos deliberados para maximizar nuestro desempeño.',
      second_paragraph: 'El modelo DEIP está compuesto así:'
    },
    methodology: {
      first_paragraph: 'El cuestionario del DEIP formula XX preguntas cerradas (12 por cada dimensión), más 6 adicionales correspondientes al índice de Salud y 6 preguntas adicionales correspondientes al índice de riesgo de burnout. Adicionalmente se formulan dos preguntas semi-abiertas al final de la evaluación para obtener información cualitativa complementaria a la medición cuantitativa.',
      second_paragraph: 'Las preguntas son una autovaloración individual sobre afirmaciones positivas, calificadas en su mayoría con escala de Likert (desde Totalmente de Acuerdo hasta Totalmente en Desacuerdo). La escala de valoración de las respuestas es la siguiente:',
      third_paragraph: `Los resultados organizacionales son el promedio simple de todas las respuestas individuales obtenidas en la encuesta.
                         Adicionalmente, la evaluación incluye dos índices:`,
      fifth_paragraph: '1.   El índice de salud que incluye 6 variables, todas incluidas dentro de los factores recomendados por la OMS para lograr una buena salud.',
      sixth_paragraph: '2.   El índice de riesgo de burnout, que relaciona 6 factores individuales y 6 factores organizacionales que identifican el nivel de riesgo en incurrir en este síndrome.',
      seventh_paragraph: 'El índice de riesgo de burnout, o Síndrome de Desgaste Ocupacional según la OMS, es un conjunto de síntomas en respuesta a un estrés laboral crónico, caracterizado por fatiga física y emocional extrema, que se refleja en una actitud negativa hacia el trabajo, agotamiento constante, baja autoestima y pérdida de interés en los resultados.',
      scores: {
        very_good: 'Sobresaliente: 5.0 - 4.5',
        good: 'Bueno: 4.4 - 4.0',
        acceptable: 'Aceptable: 3.9 - 3.0',
        bad: 'Deficiente: 2.9 - 2.0',
        very_bad: 'Crítica: 1.9 - 1.0'
      }
    },
    burnout_index: 'El índice de riesgo de burnout, o Síndrome de Desgaste Ocupacional según la OMS, es un conjunto de síntomas en respuesta a un estrés laboral crónico, caracterizado por fatiga física y emocional extrema, que se refleja en una actitud negativa hacia el trabajo, agotamiento constante, baja autoestima y pérdida de interés en los resultados.' +
      '\n\nZona segura (verde): los resultados indican que no existe riesgo cercano de incurrir en burnout ya que el promedio de los indicadores individuales y de los indicadores organizacionales se encuentran en un nivel de excelencia. Se sugiere mantener los hábitos y prácticas que actualmente le permiten ubicarse en esta zona.' +
      '\n\nZona intermedia (amarilla): los resultados se ubican en una zona intermedia que no permiten afirmar que existe un alto o bajo riesgo de incurrir en burnout. Se sugiere identificar las variables bajo su control con resultado más bajo y definir acciones de mejoramiento que le permitan evolucionar a la zona segura.' +
      '\n\nZona crítica (naranja): los resultados indican que existe un alto riesgo de incurrir en burnout ya que el promedio de los indicadores individuales y de los indicadores organizacionales son insatisfactorios. Se sugiere revisar en detalle las diferentes variables e iniciar acciones inmediatas en los aspectos bajo su control.'
  }
}
