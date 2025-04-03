class SignalBox {
    private static eventHandlers: Record<string, Function[]> = {};
    private static plugins: Record<string, Function> = {};

    /**
     * Attach an event listener.
     */
    static on(action: string, handler: Function): void {

        if (!this.eventHandlers[action]) {
            this.eventHandlers[action] = [];
        }
        this.eventHandlers[action].push(handler);
    }

    /**
     * Attach a one-time event listener.
     */
    static once(action: string, handler: Function): void {
        const wrapper = (...args: any[]) => {
            handler(...args);
            this.off(action, wrapper);
        };
        this.on(action, wrapper);
    }

    /**
     * Remove a specific event handler or all handlers for an event.
     */
    static off(action: string, handler?: Function): void {
        if (!this.eventHandlers[action]) return;

        if (!handler) {
            delete this.eventHandlers[action];
        } else {
            this.eventHandlers[action] = this.eventHandlers[action].filter(h => h !== handler);
        }
    }

    /**
     * Trigger an event with optional arguments.
     */
    static trigger(action: string, ...args: any[]): void {
        this.eventHandlers[action]?.forEach(handler => handler(...args));
    }

    /**
     * Get a list of all registered event names.
     */
    static events(): string[] {
        return Object.keys(this.eventHandlers);
    }

    /**
     * Check if an event has any registered handlers.
     */
    static has(action: string): boolean {
        return !!this.eventHandlers[action]?.length;
    }

    /**
     * Remove all event listeners.
     */
    static clearAll(): void {
        this.eventHandlers = {};
    }

    /**
     * Register a plugin for extending Listener.
     */
    static registerPlugin(name: string, plugin: (box: typeof SignalBox, ...args: any[]) => any): void {
        if (this.plugins[name]) {
            throw new Error(`Plugin "${name}" is already registered.`);
        }
        this.plugins[name] = plugin;
    }

    /**
     * Use a registered plugin.
     */
    static use(name: string, ...args: any[]): any {
        if (!this.plugins[name]) {
            throw new Error(`Plugin "${name}" is not registered.`);
        }
        return this.plugins[name](this, ...args);
    }

    /**
     * Get a list of registered plugins.
     */
    static pluginsList(): string[] {
        return Object.keys(this.plugins);
    }

    static get(action: string) {
        return this.eventHandlers[action]
    }
}

export default SignalBox;
