export class AudioSystem {
	private context: AudioContext | null = null;

	public async init(): Promise<void> {
		if (this.context) {
			if (this.context.state === 'suspended') {
				await this.context.resume();
			}
			return;
		}

		try {
			const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
			if (!AudioContextClass) return;
			this.context = new AudioContextClass();
			if (this.context.state === 'suspended') {
				await this.context.resume();
			}
		} catch (e) {
			console.warn('Failed to initialize AudioContext', e);
		}
	}

	public playCompletionSound(muted: boolean): void {
		if (muted || !this.context) return;
		
		try {
			const t = this.context.currentTime;
			
			const osc = this.context.createOscillator();
			const gain = this.context.createGain();
			
			osc.type = 'sine';
			osc.frequency.setValueAtTime(523.25, t); // C5
			osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.1); // E5
			osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.2); // G5
			
			gain.gain.setValueAtTime(0, t);
			gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
			gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
			
			osc.connect(gain);
			gain.connect(this.context.destination);
			
			osc.start(t);
			osc.stop(t + 1.2);
		} catch (e) {
			console.warn('Failed to play sound', e);
		}
	}
}
