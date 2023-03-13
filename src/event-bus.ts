export default class Eventbus {
  constructor(private bus_: Record<string, Function[]> = {}) {
    this.off = this.off.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.listen = this.listen.bind(this);
    this.once = this.once.bind(this);
    this.getAllListenersFromEvent = this.getAllListenersFromEvent.bind(this);
  }

  public off(event: string, handler: Function): void {
    const index = this.bus_[event]?.indexOf(handler) ?? -1;
    this.bus_[event]?.splice(index >>> 0, 1);
  }

  public listen(event: string, handler: Function): Function {
    if (typeof handler !== 'function') {
      throw new Error('InvalidEventHandlerType');
    }

    if (this.bus_[event] === undefined) {
      this.bus_[event] = [];
    }

    this.bus_[event].push(handler);
    return () => this.off(event, handler);
  }

  public dispatch(event: string, payload?: unknown): void {
    const handlers = this.getAllListenersFromEvent(event);

    for (const handler of handlers) {
      handler(payload);
    }
  }

  public once(event: string, handler: Function): void {
    const handlerOnce = (payload: unknown) => {
      handler(payload);
      this.off(event, handlerOnce);
    };

    this.listen(event, handlerOnce);
  }

  public getAllListenersFromEvent(event: string): Function[] {
    if (this.bus_[event] === undefined) return [];
    return this.bus_[event];
  }
}
