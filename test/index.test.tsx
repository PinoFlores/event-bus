import { EventBus } from '../src/index';

const eventHandler = jest.fn();

describe('EventBus', () => {
  let eventBus = new EventBus();

  beforeEach(() => {
    eventBus = new EventBus();
    eventHandler.mockClear();
  });

  test('should add handler on liste is called', () => {
    eventBus.listen('submit', () => {});
    expect(eventBus.getAllListenersFromEvent('submit').length).toBe(1);
  });

  test('should remove lister for a given event on off call', () => {
    eventBus.listen('submit', () => {});
    const unsubscribe = eventBus.listen('submit', () => {});
    expect(eventBus.getAllListenersFromEvent('submit').length).toBe(2);
    unsubscribe();
    expect(eventBus.getAllListenersFromEvent('submit').length).toBe(1);
  });

  test('should dispatch an event and notify subscriptor', () => {
    eventBus.listen('add-item', eventHandler);

    const eventPayload = { id: 1, amount: 3, customerId: 123 };
    eventBus.dispatch('add-item', eventPayload);

    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect(eventHandler).toHaveBeenCalledWith(eventPayload);
  });

  test('should dispatch an event and should not notify subscriptor on unsubscribe before', () => {
    const unsubscribe = eventBus.listen('add-item', eventHandler);

    unsubscribe();
    eventBus.dispatch('add-item', { id: 1 });

    expect(eventHandler).toHaveBeenCalledTimes(0);
  });

  test('should subscribe only once', () => {
    eventBus.once('remove-item', eventHandler);

    eventBus.dispatch('remove-item', { id: 1 });
    eventBus.dispatch('remove-item', { id: 1 });

    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect(eventHandler).toHaveBeenCalledWith({ id: 1 });
  });
});
