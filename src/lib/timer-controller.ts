// Phase 3: Timer controller forwards to unified workspace controller
import { initWorkspaceController } from './workspace-controller';

export function initTimerController() {
	return initWorkspaceController();
}

export { initWorkspaceController };
