// Simple event system for component communication
export const createCustomEvent = (eventName: string, detail: any) => {
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
};

export const SHOP_VIEW_CHANGED = 'shop-view-changed';
