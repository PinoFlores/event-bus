import EventBus from './event-bus';
import { useEffect } from 'react';

export default function useEventBusCreator(eventBusInstance: EventBus) {
  return function (event: string, cb: Function): void {
    const { listen } = eventBusInstance;
    useEffect(() => {
      const off = listen(event, cb);
      return () => {
        off();
      };
    }, [cb, event, listen]);
  };
}
