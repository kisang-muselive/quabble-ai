export const getTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error("Failed to get timezone:", error);
    return "UTC";
  }
};

export const getQueryString = (url: string, key: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(key);
  } catch (error) {
    console.error("Failed to parse URL:", error);
    return null;
  }
};
