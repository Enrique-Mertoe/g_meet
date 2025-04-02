// screenShareManager.ts
import ScreenShareOptions from "@/app/ui/Meeting/Sharing/ScreenShareOptions";
import {ControlItemOptionsAction} from "@/app/ui/Meeting/Controls/Controls";

class ScreenShareManager {
    private stream: MediaStream | null = null;
    private listeners: ((isActive: boolean) => void)[] = [];
    public ac: boolean = false

    start(callback: (stream: MediaStream | null) => void) {
        this._start().then(() => {
            callback(this.stream)
        })
    }

    private async _start() {
        if (this.stream) return;

        try {
            this.stream = await navigator.mediaDevices.getDisplayMedia({video: true});

            this.notifyListeners(true);
            this.stream.getVideoTracks()[0].onended = () => this.stop();
        } catch (error) {
            console.error("Error starting screen share:", error);
        }
    }

    stop() {

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.notifyListeners(false);
        }
        navigator.mediaDevices.getUserMedia({video: true}).then(media => {
            media.getTracks().forEach(track => track.stop());
        });

        return this;
    }

    getStream() {
        return this.stream;
    }

    isSharing() {
        return this.stream !== null;
    }

    // Listener management
    addListener(callback: (isActive: boolean) => void) {
        this.listeners.push(callback);
    }

    removeListener(callback: (isActive: boolean) => void) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    private notifyListeners(isActive: boolean) {
        this.listeners.forEach(callback => callback(isActive));
    }


    Options(props: ControlItemOptionsAction) {
        return ScreenShareOptions(props)
    }
}

export const sSm = new ScreenShareManager();
