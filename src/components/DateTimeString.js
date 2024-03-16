export const DateTimeString = timestamp => {
  return (
    new Date(timestamp).toLocaleDateString() +
    ' ' +
    new Date(timestamp).toLocaleTimeString()
  );
};
