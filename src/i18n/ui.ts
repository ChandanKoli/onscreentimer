import { DEFAULT_LOCALE } from './config.ts';

export const ui = {
  en: {
    // Nav / Header
    'nav.tool': 'Tool',
    'nav.guide': 'Guide',
    'nav.faq': 'FAQ',

    // Workspace - Modes, Styles, Sizes
    'mode.timer': 'Timer',
    'mode.clock': 'Clock',
    'mode.stopwatch': 'Stopwatch',

    'style.modern': 'Modern',
    'style.digital': 'Digital',
    'style.analog': 'Analog',

    'size.full': 'Full',
    'size.big': 'Big',
    'size.mid': 'Mid',
    'size.tiny': 'Tiny',

    'label.mode': 'MODE',
    'label.style': 'STYLE',
    'label.size': 'SIZE',

    // Controls
    'timer.start': 'Start',
    'timer.pause': 'Pause',
    'timer.resume': 'Resume',
    'timer.reset': 'Reset',
    'timer.stop': 'Stop',
    'timer.placeholder': 'eg: 2mins, 02:00, 1hr 30mins, 90s',

    'stopwatch.start': 'Start',
    'stopwatch.pause': 'Pause',
    'stopwatch.resume': 'Resume',
    'stopwatch.reset': 'Reset',
    'stopwatch.stop': 'Stop',

    'workspace.exitFull': 'Exit Full',

    // Tasks
    'tasks.todo': 'To-do',
    'tasks.done': 'Done',
    'tasks.remaining': 'Remaining',
    'tasks.addPlaceholder': 'Add a task...',
    'tasks.endAll': 'End all',

    // Accessibility / ARIA
    'aria.home': 'On Screen Timer Home',
    'aria.soundEnabled': 'Sound enabled',
    'aria.soundEnabledMute': 'Sound enabled, click to mute',
    'aria.soundMutedEnable': 'Sound muted, click to enable',
    'aria.toggleTheme': 'Toggle theme',
    'aria.menu': 'Settings and menu',
    'aria.menuTitle': 'Menu',
    'aria.primaryNav': 'Primary',
    'aria.timerDisplay': 'Timer',
    'aria.digitalDisplay': 'Digital Display',
    'aria.analogDisplay': 'Analog Display',
    'aria.startTimer': 'Start timer',
    'aria.resetTimer': 'Reset timer',
    'aria.stopTimer': 'Stop timer',
    'aria.startStopwatch': 'Start stopwatch',
    'aria.resetStopwatch': 'Reset stopwatch',
    'aria.stopStopwatch': 'Stop stopwatch',
    'aria.exitFull': 'Exit full size mode',
    'aria.selectMode': 'Select mode',
    'aria.selectStyle': 'Select style',
    'aria.selectSize': 'Select size',
    'aria.currently': 'currently',
    'aria.setTimerDuration': 'Set timer duration',

    'aria.reopenTodo': 'Reopen To-do',
    'aria.minimizeTodo': 'Minimize To-do',
    'aria.minimize': 'Minimize',
    'aria.addTask': 'Add task',

    'menu.settings': 'Settings',
    'menu.sound': 'Sound',
    'menu.volume': 'Volume',

    'error.invalidFormat': 'Invalid timer duration format.',
    'error.empty': 'Timer duration cannot be empty.',

    'tasks.allCompleted': '✓ All tasks completed',
    'tasks.makeCurrent': 'Make current',
    'tasks.delete': 'Delete',
    'tasks.restart': 'Restart',
    'tasks.completeTask': 'Complete task',
    'tasks.returnPending': 'Return to pending',

    // Clock
    'clock.am': 'AM',
    'clock.pm': 'PM',

    // Study Blocks
    'preset.preset-1.name': 'Learn → Recall → Solve → Review',
    'preset.preset-2.name': 'Deep Study → Practice',
    'preset.preset-3.name': 'Learn → Solve',
    'preset.preset-4.name': 'Study → Solve → Review',

    'preset.phase.Learn': 'Learn',
    'preset.phase.Recall': 'Recall',
    'preset.phase.Solve': 'Solve',
    'preset.phase.Review': 'Review',
    'preset.phase.Study': 'Study',
    'preset.phase.Practice': 'Practice',
    'preset.blockComplete': 'Block complete',

    // Guide Layout
    'guide.allGuides': 'All Guides',
    'guide.breadcrumb': 'Guides / ',
    'guide.titleSuffix': ' — On Screen Timer Guide',
    'guide.openTimer': 'Open On Screen Timer &rarr;',

    // Footer
    'footer.description': 'A simple browser timer, clock, stopwatch, task timer, and study utility.',
    'footer.product': 'Product',
    'footer.learn': 'Learn',
    'footer.common': 'Common',
    'footer.legal': 'Legal',
    'footer.guide': 'Guide',
    'footer.faq': 'FAQ',
    'footer.howItWorks': 'How It Works',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.contact': 'Contact',
    'footer.5min': '5 Minute Timer',
    'footer.10min': '10 Minute Timer',
    'footer.20min': '20 Minute Timer',
    'footer.25min': '25 Minute Timer',
    'footer.free': 'Free to use. No account required.',

    // Analytics Consent
    'consent.message': 'On Screen Timer uses optional Google Analytics to understand how the site is used.',
    'consent.accept': 'Accept',
    'consent.reject': 'Reject',
    'consent.privacy': 'Privacy',
    'footer.analytics': 'Analytics preferences',

    // Parser Errors
    'parser.empty': 'Please enter a duration (e.g. 5, 2mins, 02:00, 90s)',
    'parser.invalidFormat': 'Invalid duration. Try "5", "2mins", "02:00", or "90s"',
    'parser.greaterThanZero': 'Duration must be greater than 0',
    'parser.exceedsMax': 'Duration cannot exceed 99 hours',
    'parser.invalidMmSs': 'Invalid time format. Use MM:SS (e.g. 02:00)',
    'parser.invalidSeconds': 'Seconds must be between 0 and 59 in MM:SS format',
    'parser.invalidHhMmSs': 'Invalid time format. Use HH:MM:SS (e.g. 01:30:00)',
    'parser.invalidMinSec': 'Minutes and seconds must be between 0 and 59 in HH:MM:SS format',
    'parser.invalidColon': 'Invalid colon format. Use MM:SS or HH:MM:SS',
    'parser.unrecognizedUnit': 'Unrecognized unit "{unit}". Use h, m, or s (e.g. 2mins, 90s)',

    // Timer Error / Validation
    'timer.error.blank': 'Please enter a duration',
    'timer.error.invalid': 'Invalid format',
  },
  es: {
    // Nav / Header
    'nav.tool': 'Herramienta',
    'nav.guide': 'Guía',
    'nav.faq': 'Preguntas frecuentes',

    // Workspace - Modes, Styles, Sizes
    'mode.timer': 'Temporizador',
    'mode.clock': 'Reloj',
    'mode.stopwatch': 'Cronómetro',

    'style.modern': 'Moderno',
    'style.digital': 'Digital',
    'style.analog': 'Analógico',

    'size.full': 'Pantalla completa',
    'size.big': 'Grande',
    'size.mid': 'Medio',
    'size.tiny': 'Pequeño',

    'label.mode': 'MODO',
    'label.style': 'ESTILO',
    'label.size': 'TAMAÑO',

    // Controls
    'timer.start': 'Iniciar',
    'timer.pause': 'Pausar',
    'timer.resume': 'Reanudar',
    'timer.reset': 'Reiniciar',
    'timer.stop': 'Detener',
    'timer.placeholder': 'ej: 5, 02:00, 01:30:00, 90s',

    'stopwatch.start': 'Iniciar',
    'stopwatch.pause': 'Pausar',
    'stopwatch.resume': 'Reanudar',
    'stopwatch.reset': 'Reiniciar',
    'stopwatch.stop': 'Detener',

    'workspace.exitFull': 'Salir de pantalla completa',

    // Tasks
    'tasks.todo': 'Tareas',
    'tasks.done': 'Completadas',
    'tasks.remaining': 'Restantes',
    'tasks.addPlaceholder': 'Añadir una tarea...',
    'tasks.endAll': 'Finalizar todo',

    // Accessibility / ARIA
    'aria.home': 'On Screen Timer — Inicio',
    'aria.soundEnabled': 'Sonido activado',
    'aria.soundEnabledMute': 'Sonido activado, haz clic para silenciar',
    'aria.soundMutedEnable': 'Sonido silenciado, haz clic para activar',
    'aria.toggleTheme': 'Cambiar tema',
    'aria.menu': 'Configuración y menú',
    'aria.menuTitle': 'Menú',
    'aria.primaryNav': 'Principal',
    'aria.timerDisplay': 'Temporizador',
    'aria.digitalDisplay': 'Pantalla digital',
    'aria.analogDisplay': 'Pantalla analógica',
    'aria.startTimer': 'Iniciar temporizador',
    'aria.resetTimer': 'Reiniciar temporizador',
    'aria.stopTimer': 'Detener temporizador',
    'aria.startStopwatch': 'Iniciar cronómetro',
    'aria.resetStopwatch': 'Reiniciar cronómetro',
    'aria.stopStopwatch': 'Detener cronómetro',
    'aria.exitFull': 'Salir del modo de pantalla completa',
    'aria.selectMode': 'Seleccionar modo',
    'aria.selectStyle': 'Seleccionar estilo',
    'aria.selectSize': 'Seleccionar tamaño',
    'aria.currently': 'actualmente',
    'aria.setTimerDuration': 'Establecer duración del temporizador',

    'aria.reopenTodo': 'Reabrir tareas',
    'aria.minimizeTodo': 'Minimizar tareas',
    'aria.minimize': 'Minimizar',
    'aria.addTask': 'Añadir tarea',

    'menu.settings': 'Configuración',
    'menu.sound': 'Sonido',
    'menu.volume': 'Volumen',

    'error.invalidFormat': 'Formato de duración no válido.',
    'error.empty': 'La duración no puede estar vacía.',

    'tasks.allCompleted': '✓ Todas las tareas completadas',
    'tasks.makeCurrent': 'Hacer actual',
    'tasks.delete': 'Eliminar',
    'tasks.restart': 'Reiniciar',
    'tasks.completeTask': 'Completar tarea',
    'tasks.returnPending': 'Devolver a pendientes',

    // Clock
    'clock.am': 'AM',
    'clock.pm': 'PM',

    // Study Blocks
    'preset.preset-1.name': 'Aprender → Recordar → Resolver → Repasar',
    'preset.preset-2.name': 'Estudio profundo → Practicar',
    'preset.preset-3.name': 'Aprender → Resolver',
    'preset.preset-4.name': 'Estudiar → Resolver → Repasar',

    'preset.phase.Learn': 'Aprender',
    'preset.phase.Recall': 'Recordar',
    'preset.phase.Solve': 'Resolver',
    'preset.phase.Review': 'Repasar',
    'preset.phase.Study': 'Estudiar',
    'preset.phase.Practice': 'Practicar',
    'preset.blockComplete': 'Bloque completado',

    // Guide Layout
    'guide.allGuides': 'Todas las guías',
    'guide.breadcrumb': 'Guías / ',
    'guide.titleSuffix': ' — Guía de On Screen Timer',
    'guide.openTimer': 'Abrir On Screen Timer &rarr;',

    // Footer
    'footer.description': 'Un temporizador, reloj, cronómetro y herramienta de tareas online, directamente en tu navegador.',
    'footer.product': 'Producto',
    'footer.learn': 'Aprender',
    'footer.common': 'Comunes',
    'footer.legal': 'Legal',
    'footer.guide': 'Guía',
    'footer.faq': 'Preguntas frecuentes',
    'footer.howItWorks': 'Cómo funciona',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',
    'footer.contact': 'Contacto',
    'footer.5min': 'Temporizador de 5 minutos',
    'footer.10min': 'Temporizador de 10 minutos',
    'footer.20min': 'Temporizador de 20 minutos',
    'footer.25min': 'Temporizador de 25 minutos',
    'footer.free': 'Uso gratuito. No se requiere cuenta.',

    // Analytics Consent
    'consent.message': 'On Screen Timer utiliza Google Analytics opcional para entender cómo se usa el sitio.',
    'consent.accept': 'Aceptar',
    'consent.reject': 'Rechazar',
    'consent.privacy': 'Privacidad',
    'footer.analytics': 'Preferencias de Analytics',

    // Parser Errors
    'parser.empty': 'Introduce una duración (ej. 5, 02:00, 90s)',
    'parser.invalidFormat': 'Duración no válida. Prueba "5", "02:00" o "90s"',
    'parser.greaterThanZero': 'La duración debe ser mayor que 0',
    'parser.exceedsMax': 'La duración no puede superar las 99 horas',
    'parser.invalidMmSs': 'Formato de tiempo no válido. Usa MM:SS (ej. 02:00)',
    'parser.invalidSeconds': 'Los segundos deben estar entre 0 y 59 en formato MM:SS',
    'parser.invalidHhMmSs': 'Formato de tiempo no válido. Usa HH:MM:SS (ej. 01:30:00)',
    'parser.invalidMinSec': 'Los minutos y segundos deben estar entre 0 y 59 en formato HH:MM:SS',
    'parser.invalidColon': 'Formato no válido. Usa MM:SS o HH:MM:SS',
    'parser.unrecognizedUnit': 'Unidad no reconocida "{unit}". Usa h, m o s (ej. 2m, 90s)',

    // Timer Error / Validation
    'timer.error.blank': 'Por favor, introduce una duración',
    'timer.error.invalid': 'Formato no válido',
  },
  'pt-br': {
    // Nav / Header
    'nav.tool': 'Ferramenta',
    'nav.guide': 'Guia',
    'nav.faq': 'FAQ',

    // Workspace - Modes, Styles, Sizes
    'mode.timer': 'Temporizador',
    'mode.clock': 'Relógio',
    'mode.stopwatch': 'Cronômetro',

    'style.modern': 'Moderno',
    'style.digital': 'Digital',
    'style.analog': 'Analógico',

    'size.full': 'Tela cheia',
    'size.big': 'Grande',
    'size.mid': 'Médio',
    'size.tiny': 'Pequeno',

    'label.mode': 'MODE',
    'label.style': 'STYLE',
    'label.size': 'SIZE',

    // Controls
    'timer.start': 'Iniciar',
    'timer.pause': 'Pausar',
    'timer.resume': 'Retomar',
    'timer.reset': 'Reiniciar',
    'timer.stop': 'Parar',
    'timer.placeholder': 'ex: 2mins, 02:00, 1hr 30mins, 90s',

    'stopwatch.start': 'Iniciar',
    'stopwatch.pause': 'Pausar',
    'stopwatch.resume': 'Retomar',
    'stopwatch.reset': 'Reiniciar',
    'stopwatch.stop': 'Parar',

    'workspace.exitFull': 'Sair da tela cheia',

    // Tasks
    'tasks.todo': 'Tarefas',
    'tasks.done': 'Concluído',
    'tasks.remaining': 'Restantes',
    'tasks.addPlaceholder': 'Adicionar uma tarefa...',
    'tasks.endAll': 'Finalizar tudo',

    // Accessibility / ARIA
    'aria.home': 'On Screen Timer - Início',
    'aria.soundEnabled': 'Som ativado',
    'aria.soundEnabledMute': 'Som ativado, clique para silenciar',
    'aria.soundMutedEnable': 'Som silenciado, clique para ativar',
    'aria.toggleTheme': 'Alternar tema',
    'aria.menu': 'Configurações e menu',
    'aria.menuTitle': 'Menu',
    'aria.primaryNav': 'Principal',
    'aria.timerDisplay': 'Temporizador',
    'aria.digitalDisplay': 'Visor Digital',
    'aria.analogDisplay': 'Visor Analógico',
    'aria.startTimer': 'Iniciar temporizador',
    'aria.resetTimer': 'Reiniciar temporizador',
    'aria.stopTimer': 'Parar temporizador',
    'aria.startStopwatch': 'Iniciar cronômetro',
    'aria.resetStopwatch': 'Reiniciar cronômetro',
    'aria.stopStopwatch': 'Parar cronômetro',
    'aria.exitFull': 'Sair do modo tela cheia',
    'aria.selectMode': 'Selecionar modo',
    'aria.selectStyle': 'Selecionar estilo',
    'aria.selectSize': 'Selecionar tamanho',
    'aria.currently': 'atualmente',
    'aria.setTimerDuration': 'Definir duração do temporizador',

    'aria.reopenTodo': 'Reabrir Tarefas',
    'aria.minimizeTodo': 'Minimizar Tarefas',
    'aria.minimize': 'Minimizar',
    'aria.addTask': 'Adicionar tarefa',

    'menu.settings': 'Configurações',
    'menu.sound': 'Som',
    'menu.volume': 'Volume',

    'error.invalidFormat': 'Formato de duração inválido.',
    'error.empty': 'A duração não pode estar vazia.',

    'tasks.allCompleted': '✓ Todas as tarefas concluídas',
    'tasks.makeCurrent': 'Tornar atual',
    'tasks.delete': 'Excluir',
    'tasks.restart': 'Reiniciar',
    'tasks.completeTask': 'Concluir tarefa',
    'tasks.returnPending': 'Retornar para pendentes',

    // Clock
    'clock.am': 'AM',
    'clock.pm': 'PM',

    // Study Blocks
    'preset.preset-1.name': 'Aprender → Lembrar → Resolver → Revisar',
    'preset.preset-2.name': 'Estudo Profundo → Praticar',
    'preset.preset-3.name': 'Aprender → Resolver',
    'preset.preset-4.name': 'Estudar → Resolver → Revisar',

    'preset.phase.Learn': 'Aprender',
    'preset.phase.Recall': 'Lembrar',
    'preset.phase.Solve': 'Resolver',
    'preset.phase.Review': 'Revisar',
    'preset.phase.Study': 'Estudar',
    'preset.phase.Practice': 'Praticar',
    'preset.blockComplete': 'Bloco concluído',

    // Guide Layout
    'guide.allGuides': 'Todos os Guias',
    'guide.breadcrumb': 'Guias / ',
    'guide.titleSuffix': ' — Guia do On Screen Timer',
    'guide.openTimer': 'Abrir On Screen Timer &rarr;',

    // Footer
    'footer.description': 'Um simples utilitário de navegador com temporizador, relógio, cronômetro, tarefas e foco.',
    'footer.product': 'Produto',
    'footer.learn': 'Aprender',
    'footer.common': 'Comum',
    'footer.legal': 'Legal',
    'footer.guide': 'Guia',
    'footer.faq': 'FAQ',
    'footer.howItWorks': 'Como Funciona',
    'footer.privacy': 'Privacidade',
    'footer.terms': 'Termos',
    'footer.contact': 'Contato',
    'footer.5min': 'Temporizador de 5 Minutos',
    'footer.10min': 'Temporizador de 10 Minutos',
    'footer.20min': 'Temporizador de 20 Minutos',
    'footer.25min': 'Temporizador de 25 Minutos',
    'footer.free': 'Gratuito para usar. Nenhuma conta é necessária.',

    // Analytics Consent
    'consent.message': 'On Screen Timer usa o Google Analytics opcional para entender como o site é usado.',
    'consent.accept': 'Aceitar',
    'consent.reject': 'Rejeitar',
    'consent.privacy': 'Privacidade',
    'footer.analytics': 'Preferências do Analytics',

    // Parser Errors
    'parser.empty': 'Insira uma duração (ex.: 5, 02:00, 90s)',
    'parser.invalidFormat': 'Duração inválida. Tente "5", "02:00" ou "90s"',
    'parser.greaterThanZero': 'A duração deve ser maior que 0',
    'parser.exceedsMax': 'A duração não pode exceder 99 horas',
    'parser.invalidMmSs': 'Formato de hora inválido. Use MM:SS (ex.: 02:00)',
    'parser.invalidSeconds': 'Os segundos devem estar entre 0 e 59 no formato MM:SS',
    'parser.invalidHhMmSs': 'Formato de hora inválido. Use HH:MM:SS (ex.: 01:30:00)',
    'parser.invalidMinSec': 'Minutos e segundos devem estar entre 0 e 59 no formato HH:MM:SS',
    'parser.invalidColon': 'Formato de dois pontos inválido. Use MM:SS ou HH:MM:SS',
    'parser.unrecognizedUnit': 'Unidade "{unit}" não reconhecida. Use h, m ou s (ex.: 2mins, 90s)',

    // Timer Error / Validation
    'timer.error.blank': 'Por favor, insira uma duração',
    'timer.error.invalid': 'Formato inválido',
  },
  fr: {
    // Nav / Header
    'nav.tool': 'Outil',
    'nav.guide': 'Guide',
    'nav.faq': 'FAQ',

    // Workspace - Modes, Styles, Sizes
    'mode.timer': 'Minuteur',
    'mode.clock': 'Horloge',
    'mode.stopwatch': 'Chronomètre',

    'style.modern': 'Moderne',
    'style.digital': 'Numérique',
    'style.analog': 'Analogique',

    'size.full': 'Plein écran',
    'size.big': 'Grand',
    'size.mid': 'Moyen',
    'size.tiny': 'Petit',

    'label.mode': 'MODE',
    'label.style': 'STYLE',
    'label.size': 'TAILLE',

    // Controls
    'timer.start': 'Démarrer',
    'timer.pause': 'Pause',
    'timer.resume': 'Reprendre',
    'timer.reset': 'Réinitialiser',
    'timer.stop': 'Arrêter',
    'timer.placeholder': 'ex : 5, 02:00, 01:30:00, 90s',

    'stopwatch.start': 'Démarrer',
    'stopwatch.pause': 'Pause',
    'stopwatch.resume': 'Reprendre',
    'stopwatch.reset': 'Réinitialiser',
    'stopwatch.stop': 'Arrêter',

    'workspace.exitFull': 'Quitter plein écran',

    // Tasks
    'tasks.todo': 'Tâches',
    'tasks.done': 'Terminé',
    'tasks.remaining': 'Restantes',
    'tasks.addPlaceholder': 'Ajouter une tâche…',
    'tasks.endAll': 'Tout terminer',

    // Accessibility / ARIA
    'aria.home': 'On Screen Timer — Accueil',
    'aria.soundEnabled': 'Son activé',
    'aria.soundEnabledMute': 'Son activé, cliquer pour couper',
    'aria.soundMutedEnable': 'Son coupé, cliquer pour activer',
    'aria.toggleTheme': 'Changer de thème',
    'aria.menu': 'Paramètres et menu',
    'aria.menuTitle': 'Menu',
    'aria.primaryNav': 'Principal',
    'aria.timerDisplay': 'Minuteur',
    'aria.digitalDisplay': 'Affichage numérique',
    'aria.analogDisplay': 'Affichage analogique',
    'aria.startTimer': 'Démarrer le minuteur',
    'aria.resetTimer': 'Réinitialiser le minuteur',
    'aria.stopTimer': 'Arrêter le minuteur',
    'aria.startStopwatch': 'Démarrer le chronomètre',
    'aria.resetStopwatch': 'Réinitialiser le chronomètre',
    'aria.stopStopwatch': 'Arrêter le chronomètre',
    'aria.exitFull': 'Quitter le mode plein écran',
    'aria.selectMode': 'Sélectionner le mode',
    'aria.selectStyle': 'Sélectionner le style',
    'aria.selectSize': 'Sélectionner la taille',
    'aria.currently': 'actuellement',
    'aria.setTimerDuration': 'Définir la durée du minuteur',

    'aria.reopenTodo': 'Rouvrir les tâches',
    'aria.minimizeTodo': 'Réduire les tâches',
    'aria.minimize': 'Réduire',
    'aria.addTask': 'Ajouter une tâche',

    'menu.settings': 'Paramètres',
    'menu.sound': 'Son',
    'menu.volume': 'Volume',

    'error.invalidFormat': 'Format de durée invalide.',
    'error.empty': 'La durée ne peut pas être vide.',

    'tasks.allCompleted': '✓ Toutes les tâches terminées',
    'tasks.makeCurrent': 'Rendre actuelle',
    'tasks.delete': 'Supprimer',
    'tasks.restart': 'Recommencer',
    'tasks.completeTask': 'Terminer la tâche',
    'tasks.returnPending': 'Remettre en attente',

    // Clock
    'clock.am': 'AM',
    'clock.pm': 'PM',

    // Study Blocks
    'preset.preset-1.name': 'Apprendre → Mémoriser → Résoudre → Réviser',
    'preset.preset-2.name': 'Étude approfondie → Pratiquer',
    'preset.preset-3.name': 'Apprendre → Résoudre',
    'preset.preset-4.name': 'Étudier → Résoudre → Réviser',

    'preset.phase.Learn': 'Apprendre',
    'preset.phase.Recall': 'Mémoriser',
    'preset.phase.Solve': 'Résoudre',
    'preset.phase.Review': 'Réviser',
    'preset.phase.Study': 'Étudier',
    'preset.phase.Practice': 'Pratiquer',
    'preset.blockComplete': 'Bloc terminé',

    // Guide Layout
    'guide.allGuides': 'Tous les guides',
    'guide.breadcrumb': 'Guides / ',
    'guide.titleSuffix': ' — Guide On Screen Timer',
    'guide.openTimer': 'Ouvrir On Screen Timer &rarr;',

    // Footer
    'footer.description': 'Un minuteur en ligne gratuit, une horloge, un chronomètre et un outil de gestion des tâches — directement dans votre navigateur.',
    'footer.product': 'Produit',
    'footer.learn': 'Apprendre',
    'footer.common': 'Minuteurs fréquents',
    'footer.legal': 'Légal',
    'footer.guide': 'Guide',
    'footer.faq': 'FAQ',
    'footer.howItWorks': 'Comment ça marche',
    'footer.privacy': 'Confidentialité',
    'footer.terms': 'Conditions',
    'footer.contact': 'Contact',
    'footer.5min': 'Minuteur 5 minutes',
    'footer.10min': 'Minuteur 10 minutes',
    'footer.20min': 'Minuteur 20 minutes',
    'footer.25min': 'Minuteur 25 minutes',
    'footer.free': 'Gratuit. Aucun compte requis.',

    // Analytics Consent
    'consent.message': 'On Screen Timer utilise Google Analytics optionnel pour comprendre comment le site est utilisé.',
    'consent.accept': 'Accepter',
    'consent.reject': 'Refuser',
    'consent.privacy': 'Confidentialité',
    'footer.analytics': 'Préférences Analytics',

    // Parser Errors
    'parser.empty': 'Veuillez saisir une durée (ex. : 5, 02:00, 90s)',
    'parser.invalidFormat': 'Durée invalide. Essayez « 5 », « 02:00 » ou « 90s »',
    'parser.greaterThanZero': 'La durée doit être supérieure à 0',
    'parser.exceedsMax': 'La durée ne peut pas dépasser 99 heures',
    'parser.invalidMmSs': 'Format invalide. Utilisez MM:SS (ex. : 02:00)',
    'parser.invalidSeconds': 'Les secondes doivent être comprises entre 0 et 59 au format MM:SS',
    'parser.invalidHhMmSs': 'Format invalide. Utilisez HH:MM:SS (ex. : 01:30:00)',
    'parser.invalidMinSec': 'Les minutes et secondes doivent être entre 0 et 59 au format HH:MM:SS',
    'parser.invalidColon': 'Format invalide. Utilisez MM:SS ou HH:MM:SS',
    'parser.unrecognizedUnit': 'Unité « {unit} » non reconnue. Utilisez h, m ou s (ex. : 2m, 90s)',

    // Timer Error / Validation
    'timer.error.blank': 'Veuillez saisir une durée',
    'timer.error.invalid': 'Format invalide',
  },
  it: {
    // Nav / Header
    'nav.tool': 'Strumento',
    'nav.guide': 'Guida',
    'nav.faq': 'FAQ',

    // Workspace - Modes, Styles, Sizes
    'mode.timer': 'Timer',
    'mode.clock': 'Orologio',
    'mode.stopwatch': 'Cronometro',

    'style.modern': 'Moderno',
    'style.digital': 'Digitale',
    'style.analog': 'Analogico',

    'size.full': 'Schermo intero',
    'size.big': 'Grande',
    'size.mid': 'Medio',
    'size.tiny': 'Piccolo',

    'label.mode': 'MODALITÀ',
    'label.style': 'STILE',
    'label.size': 'DIMENSIONE',

    // Controls
    'timer.start': 'Avvia',
    'timer.pause': 'Pausa',
    'timer.resume': 'Riprendi',
    'timer.reset': 'Azzera',
    'timer.stop': 'Ferma',
    'timer.placeholder': 'es: 5, 02:00, 01:30:00, 90s',

    'stopwatch.start': 'Avvia',
    'stopwatch.pause': 'Pausa',
    'stopwatch.resume': 'Riprendi',
    'stopwatch.reset': 'Azzera',
    'stopwatch.stop': 'Ferma',

    'workspace.exitFull': 'Esci da schermo intero',

    // Tasks
    'tasks.todo': 'Da fare',
    'tasks.done': 'Completate',
    'tasks.remaining': 'Rimanenti',
    'tasks.addPlaceholder': 'Aggiungi un\'attività...',
    'tasks.endAll': 'Termina tutto',

    // Accessibility / ARIA
    'aria.home': 'On Screen Timer — Home',
    'aria.soundEnabled': 'Audio attivato',
    'aria.soundEnabledMute': 'Audio attivato, fai clic per disattivarlo',
    'aria.soundMutedEnable': 'Audio disattivato, fai clic per attivarlo',
    'aria.toggleTheme': 'Cambia tema',
    'aria.menu': 'Impostazioni e menu',
    'aria.menuTitle': 'Menu',
    'aria.primaryNav': 'Principale',
    'aria.timerDisplay': 'Timer',
    'aria.digitalDisplay': 'Display digitale',
    'aria.analogDisplay': 'Display analogico',
    'aria.startTimer': 'Avvia timer',
    'aria.resetTimer': 'Azzera timer',
    'aria.stopTimer': 'Ferma timer',
    'aria.startStopwatch': 'Avvia cronometro',
    'aria.resetStopwatch': 'Azzera cronometro',
    'aria.stopStopwatch': 'Ferma cronometro',
    'aria.exitFull': 'Esci dalla modalità a schermo intero',
    'aria.selectMode': 'Seleziona modalità',
    'aria.selectStyle': 'Seleziona stile',
    'aria.selectSize': 'Seleziona dimensione',
    'aria.currently': 'attualmente',
    'aria.setTimerDuration': 'Imposta durata timer',

    'aria.reopenTodo': 'Riapri attività da fare',
    'aria.minimizeTodo': 'Riduci attività da fare',
    'aria.minimize': 'Riduci',
    'aria.addTask': 'Aggiungi attività',

    'menu.settings': 'Impostazioni',
    'menu.sound': 'Audio',
    'menu.volume': 'Volume',

    'error.invalidFormat': 'Formato di durata non valido.',
    'error.empty': 'La durata non può essere vuota.',

    'tasks.allCompleted': '✓ Tutte le attività completate',
    'tasks.makeCurrent': 'Rendi attuale',
    'tasks.delete': 'Elimina',
    'tasks.restart': 'Riavvia',
    'tasks.completeTask': 'Completa attività',
    'tasks.returnPending': 'Rimetti in sospeso',

    // Clock
    'clock.am': 'AM',
    'clock.pm': 'PM',

    // Study Blocks
    'preset.preset-1.name': 'Impara → Ricorda → Risolvi → Ripassa',
    'preset.preset-2.name': 'Studio profondo → Pratica',
    'preset.preset-3.name': 'Impara → Risolvi',
    'preset.preset-4.name': 'Studia → Risolvi → Ripassa',

    'preset.phase.Learn': 'Impara',
    'preset.phase.Recall': 'Ricorda',
    'preset.phase.Solve': 'Risolvi',
    'preset.phase.Review': 'Ripassa',
    'preset.phase.Study': 'Studia',
    'preset.phase.Practice': 'Pratica',
    'preset.blockComplete': 'Blocco completato',

    // Guide Layout
    'guide.allGuides': 'Tutte le guide',
    'guide.breadcrumb': 'Guide / ',
    'guide.titleSuffix': ' — Guida di On Screen Timer',
    'guide.openTimer': 'Apri On Screen Timer &rarr;',

    // Footer
    'footer.description': 'Un timer online, orologio, cronometro e strumento per la gestione delle attività, direttamente nel tuo browser.',
    'footer.product': 'Prodotto',
    'footer.learn': 'Impara',
    'footer.common': 'Più usati',
    'footer.legal': 'Note legali',
    'footer.guide': 'Guida',
    'footer.faq': 'FAQ',
    'footer.howItWorks': 'Come funziona',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Condizioni',
    'footer.contact': 'Contatti',
    'footer.5min': 'Timer da 5 minuti',
    'footer.10min': 'Timer da 10 minuti',
    'footer.20min': 'Timer da 20 minuti',
    'footer.25min': 'Timer da 25 minuti',
    'footer.free': 'Gratuito. Nessun account richiesto.',

    // Analytics Consent
    'consent.message': 'On Screen Timer utilizza Google Analytics opzionale per capire come viene utilizzato il sito.',
    'consent.accept': 'Accetta',
    'consent.reject': 'Rifiuta',
    'consent.privacy': 'Privacy',
    'footer.analytics': 'Preferenze Analytics',

    // Parser Errors
    'parser.empty': 'Inserisci una durata (es: 5, 02:00, 90s)',
    'parser.invalidFormat': 'Durata non valida. Prova "5", "02:00" o "90s"',
    'parser.greaterThanZero': 'La durata deve essere maggiore di 0',
    'parser.exceedsMax': 'La durata non può superare 99 ore',
    'parser.invalidMmSs': 'Formato non valido. Usa MM:SS (es: 02:00)',
    'parser.invalidSeconds': 'I secondi devono essere compresi tra 0 e 59 nel formato MM:SS',
    'parser.invalidHhMmSs': 'Formato non valido. Usa HH:MM:SS (es: 01:30:00)',
    'parser.invalidMinSec': 'Minuti e secondi devono essere compresi tra 0 e 59 nel formato HH:MM:SS',
    'parser.invalidColon': 'Formato non valido. Usa MM:SS o HH:MM:SS',
    'parser.unrecognizedUnit': 'Unità "{unit}" non riconosciuta. Usa h, m o s (es: 2m, 90s)',

    // Timer Error / Validation
    'timer.error.blank': 'Inserisci una durata',
    'timer.error.invalid': 'Formato non valido',
  },

  ja: {
    // Nav / Header
    'nav.tool': 'ツール',
    'nav.guide': 'ガイド',
    'nav.faq': 'よくある質問',

    // Workspace - Modes, Styles, Sizes
    'mode.timer': 'タイマー',
    'mode.clock': '時計',
    'mode.stopwatch': 'ストップウォッチ',

    'style.modern': 'モダン',
    'style.digital': 'デジタル',
    'style.analog': 'アナログ',

    'size.full': '全画面',
    'size.big': '大',
    'size.mid': '中',
    'size.tiny': '小',

    'label.mode': 'モード',
    'label.style': 'スタイル',
    'label.size': 'サイズ',

    // Controls
    'timer.start': 'スタート',
    'timer.pause': '一時停止',
    'timer.resume': '再開',
    'timer.reset': 'リセット',
    'timer.stop': 'ストップ',
    'timer.placeholder': '例: 5, 02:00, 01:30:00, 90s',

    'stopwatch.start': 'スタート',
    'stopwatch.pause': '一時停止',
    'stopwatch.resume': '再開',
    'stopwatch.reset': 'リセット',
    'stopwatch.stop': 'ストップ',

    'workspace.exitFull': '全画面表示を終了',

    // Tasks
    'tasks.todo': 'タスク',
    'tasks.done': '完了',
    'tasks.remaining': '残り',
    'tasks.addPlaceholder': 'タスクを追加...',
    'tasks.endAll': 'すべて完了',

    // Accessibility / ARIA
    'aria.home': 'On Screen Timer ホーム',
    'aria.soundEnabled': '音声オン',
    'aria.soundEnabledMute': '音声オン、クリックしてミュート',
    'aria.soundMutedEnable': '音声ミュート、クリックしてオン',
    'aria.toggleTheme': 'テーマを切り替える',
    'aria.menu': '設定とメニュー',
    'aria.menuTitle': 'メニュー',
    'aria.primaryNav': 'メイン',
    'aria.timerDisplay': 'タイマー',
    'aria.digitalDisplay': 'デジタル表示',
    'aria.analogDisplay': 'アナログ表示',
    'aria.startTimer': 'タイマーを開始',
    'aria.resetTimer': 'タイマーをリセット',
    'aria.stopTimer': 'タイマーを停止',
    'aria.startStopwatch': 'ストップウォッチを開始',
    'aria.resetStopwatch': 'ストップウォッチをリセット',
    'aria.stopStopwatch': 'ストップウォッチを停止',
    'aria.exitFull': '全画面モードを終了',
    'aria.selectMode': 'モードを選択',
    'aria.selectStyle': 'スタイルを選択',
    'aria.selectSize': 'サイズを選択',
    'aria.currently': '現在',
    'aria.setTimerDuration': 'タイマーの長さを設定',

    'aria.reopenTodo': 'タスクを再開',
    'aria.minimizeTodo': 'タスクを最小化',
    'aria.minimize': '最小化',
    'aria.addTask': 'タスクを追加',

    'menu.settings': '設定',
    'menu.sound': '音声',
    'menu.volume': '音量',

    'error.invalidFormat': 'タイマーの形式が無効です。',
    'error.empty': 'タイマーの長さを指定してください。',

    'tasks.allCompleted': '✓ 全てのタスクが完了しました',
    'tasks.makeCurrent': '実行中にする',
    'tasks.delete': '削除',
    'tasks.restart': '再開',
    'tasks.completeTask': '完了にする',
    'tasks.returnPending': '保留に戻す',

    // Clock
    'clock.am': 'AM',
    'clock.pm': 'PM',

    // Study Blocks
    'preset.preset-1.name': '学習 → 思い出す → 解く → 復習',
    'preset.preset-2.name': '集中学習 → 練習',
    'preset.preset-3.name': '学習 → 解く',
    'preset.preset-4.name': '学習 → 解く → 復習',

    'preset.phase.Learn': '学習',
    'preset.phase.Recall': '思い出す',
    'preset.phase.Solve': '解く',
    'preset.phase.Review': '復習',
    'preset.phase.Study': '勉強',
    'preset.phase.Practice': '練習',
    'preset.blockComplete': '完了',

    // Guide Layout
    'guide.allGuides': 'すべてのガイド',
    'guide.breadcrumb': 'ガイド / ',
    'guide.titleSuffix': ' — On Screen Timer ガイド',
    'guide.openTimer': 'On Screen Timer を開く &rarr;',

    // Footer
    'footer.description': 'ブラウザで使えるシンプルなタイマー、時計、ストップウォッチ、タスク管理ツール。',
    'footer.product': '製品情報',
    'footer.learn': '学ぶ',
    'footer.common': 'よく使われるタイマー',
    'footer.legal': '法的情報',
    'footer.guide': 'ガイド',
    'footer.faq': 'よくある質問',
    'footer.howItWorks': '使い方',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.contact': 'お問い合わせ',
    'footer.5min': '5分 タイマー',
    'footer.10min': '10分 タイマー',
    'footer.20min': '20分 タイマー',
    'footer.25min': '25分 タイマー',
    'footer.free': '無料で利用できます。アカウント登録は不要です。',

    // Analytics Consent
    'consent.message': 'On Screen Timerは、サイトの利用状況を把握するために、オプションでGoogle Analyticsを使用しています。',
    'consent.accept': '同意する',
    'consent.reject': '拒否する',
    'consent.privacy': 'プライバシー',
    'footer.analytics': 'Analytics の設定',

    // Parser Errors
    'parser.empty': '長さを入力してください (例: 5, 02:00, 90s)',
    'parser.invalidFormat': '無効な形式です。「5」、「02:00」、「90s」のように入力してください',
    'parser.greaterThanZero': '0より大きい値を入力してください',
    'parser.exceedsMax': '99時間を超えることはできません',
    'parser.invalidMmSs': '無効な時間形式です。MM:SS (例: 02:00) を使用してください',
    'parser.invalidSeconds': 'MM:SS形式の秒は0から59の間である必要があります',
    'parser.invalidHhMmSs': '無効な時間形式です。HH:MM:SS (例: 01:30:00) を使用してください',
    'parser.invalidMinSec': 'HH:MM:SS形式の分と秒は0から59の間である必要があります',
    'parser.invalidColon': '無効な形式です。MM:SSまたはHH:MM:SSを使用してください',
    'parser.unrecognizedUnit': '認識できない単位です。h、m、またはsを使用してください (例: 2mins, 90s)',

    // Timer Error / Validation
    'timer.error.blank': '長さを入力してください',
    'timer.error.invalid': '無効な形式です',
  },
  de: {
    // Nav / Header
    'nav.tool': 'Tool',
    'nav.guide': 'Anleitung',
    'nav.faq': 'FAQ',

    // Workspace - Modes, Styles, Sizes
    'mode.timer': 'Timer',
    'mode.clock': 'Uhr',
    'mode.stopwatch': 'Stoppuhr',

    'style.modern': 'Modern',
    'style.digital': 'Digital',
    'style.analog': 'Analog',

    'size.full': 'Vollbild',
    'size.big': 'Groß',
    'size.mid': 'Mittel',
    'size.tiny': 'Klein',

    'label.mode': 'MODUS',
    'label.style': 'STIL',
    'label.size': 'GRÖSSE',

    // Controls
    'timer.start': 'Starten',
    'timer.pause': 'Pause',
    'timer.resume': 'Fortsetzen',
    'timer.reset': 'Zurücksetzen',
    'timer.stop': 'Stoppen',
    'timer.placeholder': 'z. B.: 5, 02:00, 01:30:00, 90s',

    'stopwatch.start': 'Starten',
    'stopwatch.pause': 'Pause',
    'stopwatch.resume': 'Fortsetzen',
    'stopwatch.reset': 'Zurücksetzen',
    'stopwatch.stop': 'Stoppen',

    'workspace.exitFull': 'Vollbild verlassen',

    // Tasks
    'tasks.todo': 'Aufgaben',
    'tasks.done': 'Erledigt',
    'tasks.remaining': 'Verbleibend',
    'tasks.addPlaceholder': 'Aufgabe hinzufügen...',
    'tasks.endAll': 'Alle beenden',

    // Accessibility / ARIA
    'aria.home': 'On Screen Timer Startseite',
    'aria.soundEnabled': 'Ton an',
    'aria.soundEnabledMute': 'Ton an, zum Stummschalten klicken',
    'aria.soundMutedEnable': 'Ton aus, zum Einschalten klicken',
    'aria.toggleTheme': 'Design umschalten',
    'aria.menu': 'Einstellungen und Menü',
    'aria.menuTitle': 'Menü',
    'aria.primaryNav': 'Hauptmenü',
    'aria.timerDisplay': 'Timer',
    'aria.digitalDisplay': 'Digitale Anzeige',
    'aria.analogDisplay': 'Analoge Anzeige',
    'aria.startTimer': 'Timer starten',
    'aria.resetTimer': 'Timer zurücksetzen',
    'aria.stopTimer': 'Timer stoppen',
    'aria.startStopwatch': 'Stoppuhr starten',
    'aria.resetStopwatch': 'Stoppuhr zurücksetzen',
    'aria.stopStopwatch': 'Stoppuhr stoppen',
    'aria.exitFull': 'Vollbildmodus verlassen',
    'aria.selectMode': 'Modus auswählen',
    'aria.selectStyle': 'Stil auswählen',
    'aria.selectSize': 'Größe auswählen',
    'aria.currently': 'aktuell',
    'aria.setTimerDuration': 'Timer-Dauer einstellen',

    'aria.reopenTodo': 'Aufgaben erneut öffnen',
    'aria.minimizeTodo': 'Aufgaben minimieren',
    'aria.minimize': 'Minimieren',
    'aria.addTask': 'Aufgabe hinzufügen',

    'menu.settings': 'Einstellungen',
    'menu.sound': 'Ton',
    'menu.volume': 'Lautstärke',

    'error.invalidFormat': 'Ungültiges Format für die Dauer.',
    'error.empty': 'Die Dauer darf nicht leer sein.',

    'tasks.allCompleted': '✓ Alle Aufgaben erledigt',
    'tasks.makeCurrent': 'Als aktuell markieren',
    'tasks.delete': 'Löschen',
    'tasks.restart': 'Neu starten',
    'tasks.completeTask': 'Aufgabe abschließen',
    'tasks.returnPending': 'Als ausstehend markieren',

    // Clock
    'clock.am': 'AM',
    'clock.pm': 'PM',

    // Study Blocks
    'preset.preset-1.name': 'Lernen → Abrufen → Lösen → Wiederholen',
    'preset.preset-2.name': 'Intensives Lernen → Üben',
    'preset.preset-3.name': 'Lernen → Lösen',
    'preset.preset-4.name': 'Lernen → Lösen → Wiederholen',

    'preset.phase.Learn': 'Lernen',
    'preset.phase.Recall': 'Abrufen',
    'preset.phase.Solve': 'Lösen',
    'preset.phase.Review': 'Wiederholen',
    'preset.phase.Study': 'Lernen',
    'preset.phase.Practice': 'Üben',
    'preset.blockComplete': 'Block abgeschlossen',

    // Guide Layout
    'guide.allGuides': 'Alle Anleitungen',
    'guide.breadcrumb': 'Anleitungen / ',
    'guide.titleSuffix': ' — On Screen Timer Anleitung',
    'guide.openTimer': 'On Screen Timer öffnen &rarr;',

    // Footer
    'footer.description': 'Ein einfacher Online-Timer, eine Uhr, eine Stoppuhr und ein Aufgaben-Tool – direkt in deinem Browser.',
    'footer.product': 'Produkt',
    'footer.learn': 'Lernen',
    'footer.common': 'Häufig genutzt',
    'footer.legal': 'Rechtliches',
    'footer.guide': 'Anleitung',
    'footer.faq': 'FAQ',
    'footer.howItWorks': 'So funktioniert\'s',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.contact': 'Kontakt',
    'footer.5min': '5 Minuten Timer',
    'footer.10min': '10 Minuten Timer',
    'footer.20min': '20 Minuten Timer',
    'footer.25min': '25 Minuten Timer',
    'footer.free': 'Kostenlos nutzbar. Kein Konto erforderlich.',

    // Analytics Consent
    'consent.message': 'On Screen Timer verwendet optionales Google Analytics, um zu verstehen, wie die Website genutzt wird.',
    'consent.accept': 'Akzeptieren',
    'consent.reject': 'Ablehnen',
    'consent.privacy': 'Datenschutz',
    'footer.analytics': 'Analytics-Einstellungen',

    // Parser Errors
    'parser.empty': 'Bitte gib eine Dauer ein (z. B. 5, 02:00, 90s)',
    'parser.invalidFormat': 'Ungültige Dauer. Versuche "5", "02:00" oder "90s"',
    'parser.greaterThanZero': 'Die Dauer muss größer als 0 sein',
    'parser.exceedsMax': 'Die Dauer darf 99 Stunden nicht überschreiten',
    'parser.invalidMmSs': 'Ungültiges Format. Verwende MM:SS (z. B. 02:00)',
    'parser.invalidSeconds': 'Sekunden müssen zwischen 0 und 59 liegen (MM:SS)',
    'parser.invalidHhMmSs': 'Ungültiges Format. Verwende HH:MM:SS (z. B. 01:30:00)',
    'parser.invalidMinSec': 'Minuten und Sekunden müssen zwischen 0 und 59 liegen',
    'parser.invalidColon': 'Ungültiges Format. Verwende MM:SS oder HH:MM:SS',
    'parser.unrecognizedUnit': 'Unerkannte Einheit "{unit}". Verwende h, m oder s (z. B. 2m, 90s)',

    // Timer Error / Validation
    'timer.error.blank': 'Bitte gib eine Dauer ein',
    'timer.error.invalid': 'Ungültiges Format',
  },

  ko: {
    // Nav / Header
    'nav.tool': '도구',
    'nav.guide': '가이드',
    'nav.faq': '자주 묻는 질문',

    // Workspace - Modes, Styles, Sizes
    'mode.timer': '타이머',
    'mode.clock': '시계',
    'mode.stopwatch': '스톱워치',

    'style.modern': '모던',
    'style.digital': '디지털',
    'style.analog': '아날로그',

    'size.full': '전체화면',
    'size.big': '크게',
    'size.mid': '중간',
    'size.tiny': '작게',

    'label.mode': '모드',
    'label.style': '스타일',
    'label.size': '크기',

    // Controls
    'timer.start': '시작',
    'timer.pause': '일시정지',
    'timer.resume': '계속',
    'timer.reset': '초기화',
    'timer.stop': '중지',
    'timer.placeholder': '예: 5, 02:00, 01:30:00, 90s',

    'stopwatch.start': '시작',
    'stopwatch.pause': '일시정지',
    'stopwatch.resume': '계속',
    'stopwatch.reset': '초기화',
    'stopwatch.stop': '중지',

    'workspace.exitFull': '전체화면 종료',

    // Tasks
    'tasks.todo': '할 일',
    'tasks.done': '완료',
    'tasks.remaining': '남음',
    'tasks.addPlaceholder': '작업 추가...',
    'tasks.endAll': '모두 완료',

    // Accessibility / ARIA
    'aria.home': 'On Screen Timer 홈',
    'aria.soundEnabled': '소리 켜짐',
    'aria.soundEnabledMute': '소리 켜짐, 클릭하여 음소거',
    'aria.soundMutedEnable': '소리 꺼짐, 클릭하여 켜기',
    'aria.toggleTheme': '테마 전환',
    'aria.menu': '설정 및 메뉴',
    'aria.menuTitle': '메뉴',
    'aria.primaryNav': '주요 탐색',
    'aria.timerDisplay': '타이머 표시',
    'aria.digitalDisplay': '디지털 표시',
    'aria.analogDisplay': '아날로그 표시',
    'aria.startTimer': '타이머 시작',
    'aria.resetTimer': '타이머 초기화',
    'aria.stopTimer': '타이머 중지',
    'aria.startStopwatch': '스톱워치 시작',
    'aria.resetStopwatch': '스톱워치 초기화',
    'aria.stopStopwatch': '스톱워치 중지',
    'aria.exitFull': '전체화면 모드 종료',
    'aria.selectMode': '모드 선택',
    'aria.selectStyle': '스타일 선택',
    'aria.selectSize': '크기 선택',
    'aria.currently': '현재',
    'aria.setTimerDuration': '타이머 시간 설정',

    'aria.reopenTodo': '할 일 다시 열기',
    'aria.minimizeTodo': '할 일 최소화',
    'aria.minimize': '최소화',
    'aria.addTask': '작업 추가',

    'menu.settings': '설정',
    'menu.sound': '소리',
    'menu.volume': '볼륨',

    'error.invalidFormat': '잘못된 타이머 시간 형식입니다.',
    'error.empty': '타이머 시간을 입력해야 합니다.',

    'tasks.allCompleted': '✓ 모든 작업 완료',
    'tasks.makeCurrent': '현재 작업으로 설정',
    'tasks.delete': '삭제',
    'tasks.restart': '다시 시작',
    'tasks.completeTask': '작업 완료',
    'tasks.returnPending': '대기 중으로 되돌리기',

    // Clock
    'clock.am': '오전',
    'clock.pm': '오후',

    // Study Blocks
    'preset.preset-1.name': '학습 → 회상 → 풀이 → 복습',
    'preset.preset-2.name': '집중 학습 → 연습',
    'preset.preset-3.name': '학습 → 풀이',
    'preset.preset-4.name': '공부 → 풀이 → 복습',

    'preset.phase.Learn': '학습',
    'preset.phase.Recall': '회상',
    'preset.phase.Solve': '풀이',
    'preset.phase.Review': '복습',
    'preset.phase.Study': '공부',
    'preset.phase.Practice': '연습',
    'preset.blockComplete': '블록 완료',

    // Guide Layout
    'guide.allGuides': '모든 가이드',
    'guide.breadcrumb': '가이드 / ',
    'guide.titleSuffix': ' — On Screen Timer 가이드',
    'guide.openTimer': 'On Screen Timer 열기 &rarr;',

    // Footer
    'footer.description': '간편한 브라우저 타이머, 시계, 스톱워치, 작업 타이머 및 학습 도구입니다.',
    'footer.product': '제품',
    'footer.learn': '학습',
    'footer.common': '공통',
    'footer.legal': '법적 고지',
    'footer.guide': '가이드',
    'footer.faq': '자주 묻는 질문',
    'footer.howItWorks': '작동 방식',
    'footer.privacy': '개인정보처리방침',
    'footer.terms': '이용약관',
    'footer.contact': '연락처',
    'footer.5min': '5분 타이머',
    'footer.10min': '10분 타이머',
    'footer.20min': '20분 타이머',
    'footer.25min': '25분 타이머',
    'footer.free': '무료 사용. 계정이 필요하지 않습니다.',

    // Analytics Consent
    'consent.message': 'On Screen Timer는 사이트 이용 현황을 파악하기 위해 선택적으로 Google Analytics를 사용합니다.',
    'consent.accept': '수락',
    'consent.reject': '거부',
    'consent.privacy': '개인정보 보호',
    'footer.analytics': 'Analytics 환경설정',

    // Parser Errors
    'parser.empty': '시간을 입력해 주세요 (예: 5, 02:00, 01:30:00, 90s)',
    'parser.invalidFormat': '잘못된 형식입니다. "5", "02:00", "01:30:00" 또는 "90s"를 사용해 주세요.',
    'parser.greaterThanZero': '시간은 0보다 커야 합니다.',
    'parser.exceedsMax': '시간은 99시간을 초과할 수 없습니다.',
    'parser.invalidMmSs': '잘못된 시간 형식입니다. MM:SS (예: 02:00)를 사용해 주세요.',
    'parser.invalidSeconds': 'MM:SS 형식에서 초는 0에서 59 사이여야 합니다.',
    'parser.invalidHhMmSs': '잘못된 시간 형식입니다. HH:MM:SS (예: 01:30:00)를 사용해 주세요.',
    'parser.invalidMinSec': 'HH:MM:SS 형식에서 분과 초는 0에서 59 사이여야 합니다.',
    'parser.invalidColon': '콜론 형식이 잘못되었습니다. MM:SS 또는 HH:MM:SS를 사용해 주세요.',
    'parser.unrecognizedUnit': '인식할 수 없는 단위 "{unit}"입니다. h, m 또는 s를 사용해 주세요 (예: 2m, 90s).',

    // Timer Error / Validation
    'timer.error.blank': '시간을 입력해 주세요',
    'timer.error.invalid': '잘못된 형식',
  },

} as const;

export function useTranslations(locale: string) {
  return function t(key: keyof typeof ui['en']) {
    return ui[locale as keyof typeof ui]?.[key] || ui[DEFAULT_LOCALE][key];
  }
}
