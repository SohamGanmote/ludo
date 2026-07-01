import { SocketRes } from "@/types/types";
import Swal from "sweetalert2";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;

class SocketService {
	private ws: WebSocket | null = null;
	private listeners = new Map<string, Set<(data: unknown) => void>>();
	private latestRoomState: SocketRes | null = null;

	connect() {
		if (this.ws) return;

		this.ws = new WebSocket(WS_URL);

		this.ws.onopen = () => {
			console.log("Connected");
		};

		this.ws.onerror = (e) => {
			console.error("Socket error", e);
		};

		this.ws.onmessage = (event) => {
			const message = JSON.parse(event.data);

			// console.log("Received:", message);

			let alertOpen = false;

			if (message.type === "error" && !alertOpen) {
				alertOpen = true;

				console.error(message.message);

				Swal.fire({
					icon: "error",
					title: "Error",
					text: message.message,
				}).finally(() => {
					alertOpen = false;
				});
			}

			if (message.type === "room-state") {
				this.latestRoomState = message;
			}

			this.listeners.get(message.type)?.forEach((cb) => cb(message));
		};

		this.ws.onclose = () => {
			console.log("Disconnected");
			this.ws = null;

			// reconnect
			setTimeout(() => this.connect(), 2000);
		};
	}

	emit(type: string, data: unknown) {
		if (this.ws?.readyState !== WebSocket.OPEN) {
			console.error("Socket not connected");
			return;
		}

		this.ws.send(
			JSON.stringify({
				type,
				data,
			}),
		);
	}

	on(type: string, callback: (data: unknown) => void) {
		if (!this.listeners.has(type)) {
			this.listeners.set(type, new Set());
		}

		this.listeners.get(type)!.add(callback);

		return () => {
			this.listeners.get(type)?.delete(callback);
		};
	}

	getRoomState() {
		return this.latestRoomState;
	}
}

export default new SocketService();
