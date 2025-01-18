const useSubdomain = (): string | null => {
  const { hostname } = window.location;
  const parts = hostname.split(".");

  console.log(parts)
  if (parts.length > 2) {
    return parts[0];
  } else if (parts.length === 2 && parts[0] !== "localhost") {
    return parts[0];
  }

  return null;
};

export default useSubdomain;
