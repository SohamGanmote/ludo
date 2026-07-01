const audioCache: Record<string, HTMLAudioElement> = {};

export const playSound = (src: string) => {
	if (typeof window === "undefined") return;

	const isEnabled = localStorage.getItem("soundEnabled") !== "false";
	if (!isEnabled) return;

	if (!audioCache[src]) {
		audioCache[src] = new Audio(src);
	}

	const audio = audioCache[src];
	audio.currentTime = 0;
	audio.play().catch(() => {});
};
