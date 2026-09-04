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
    
    // Timer Error / Validation
    'timer.error.blank': 'Please enter a duration',
    'timer.error.invalid': 'Invalid format',
  }
} as const;

export function useTranslations(locale: string) {
  return function t(key: keyof typeof ui['en']) {
    return ui[locale as keyof typeof ui]?.[key] || ui[DEFAULT_LOCALE][key];
  }
}
