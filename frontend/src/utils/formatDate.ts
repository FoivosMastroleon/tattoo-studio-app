export const formatDate = (date: string | Date): string =>
  new Date(date).toLocaleDateString('en-GB')

export const formatDateLong = (date: string | Date): string =>
  new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
