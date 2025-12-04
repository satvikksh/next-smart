// utils/idGenerator.ts
export function generateUniqueId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `TG-${timestamp}-${randomStr}`.toUpperCase();
}

export function generateUserId(): string {
  const prefix = 'USER';
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${randomStr}`.toUpperCase();
}