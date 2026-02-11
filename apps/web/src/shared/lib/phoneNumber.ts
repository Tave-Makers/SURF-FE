export const onlyDigits = (raw: string) => raw.replace(/\D/g, '').slice(0, 11);

export const formatPhoneNumber = (digits: string) => {
  const d = onlyDigits(digits);

  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};
