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
    'aria.setTimerDuration': 'Set timer duration',

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
        // Guide Layout
    'guide.allGuides': 'Todos os Guias',
    'guide.breadcrumb': 'Guias / ',
    'guide.titleSuffix': ' — Guia do On Screen Timer',
    'guide.openTimer': 'Abrir On Screen Timer &rarr;',
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
  }
} as const;

export function useTranslations(locale: string) {
  return function t(key: keyof typeof ui['en']) {
    return ui[locale as keyof typeof ui]?.[key] || ui[DEFAULT_LOCALE][key];
  }
}
