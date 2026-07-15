import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from './useActiveSection';

type ObserverCallback = (entries: Array<{ intersectionRatio: number }>) => void;

describe('useActiveSection', () => {
  let observerCallbacks: ObserverCallback[] = [];

  beforeEach(() => {
    observerCallbacks = [];
    document.body.innerHTML = '<section id="a"></section><section id="b"></section>';

    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      jest.fn().mockImplementation((cb: ObserverCallback) => {
        observerCallbacks.push(cb);
        return {
          observe: jest.fn(),
          disconnect: jest.fn(),
          unobserve: jest.fn(),
          takeRecords: jest.fn(() => []),
        };
      });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return the first section id as the initial active section', () => {
    const { result } = renderHook(() => useActiveSection(['a', 'b']));

    expect(result.current).toBe('a');
  });

  it('should return an empty string when no ids are provided', () => {
    const { result } = renderHook(() => useActiveSection([]));

    expect(result.current).toBe('');
  });

  it('should update the active section when the second observer reports a higher intersection ratio', () => {
    const { result } = renderHook(() => useActiveSection(['a', 'b']));

    act(() => {
      observerCallbacks[0]([{ intersectionRatio: 0.3 }]);
    });
    act(() => {
      observerCallbacks[1]([{ intersectionRatio: 0.7 }]);
    });

    expect(result.current).toBe('b');
  });

  it('should not update when no section is visible', () => {
    const { result } = renderHook(() => useActiveSection(['a', 'b']));

    act(() => {
      observerCallbacks[0]([{ intersectionRatio: 0 }]);
    });
    act(() => {
      observerCallbacks[1]([{ intersectionRatio: 0 }]);
    });

    expect(result.current).toBe('a');
  });

  it('should skip ids without a matching element in the DOM', () => {
    const { result } = renderHook(() => useActiveSection(['a', 'missing', 'b']));

    expect(observerCallbacks).toHaveLength(2);
    expect(result.current).toBe('a');
  });
});
