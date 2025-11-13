export const removeIdFromObject = (id: string, obj: Record<string, object>): Record<string, object> => {
  const { [id]: removed, ...rest } = obj;
  return rest;
};

export const removeIdFromArray = (id: string, arr: string[]): string[] => {
  return arr.filter(item => item !== id);
};