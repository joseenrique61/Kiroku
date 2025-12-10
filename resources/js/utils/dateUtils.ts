const formatter = new Intl.DateTimeFormat('es-EC', { 
  timeZone: 'UTC', 
  day: '2-digit',
  month: '2-digit', 
  year: 'numeric'
});

export const formatDateUtc = (dateString: string) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Fecha inválida';

  return formatter.format(date);
};