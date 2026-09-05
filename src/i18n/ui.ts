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
} as const;

export function useTranslations(locale: string) {
  return function t(key: keyof typeof ui['en']) {
    return ui[locale as keyof typeof ui]?.[key] || ui[DEFAULT_LOCALE][key];
  }
}
