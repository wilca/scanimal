export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatWeight = (val) =>
  val != null ? `${parseFloat(val).toFixed(2)} kg` : '—'

export const formatAge = (val, unit = 'años') =>
  val != null ? `${val} ${unit}` : '—'

export const adoptionStatusColor = (status) => ({
  pendiente: 'badge-pending',
  aprobada: 'badge-approved',
  rechazada: 'badge-rejected',
}[status] || 'badge-inactive')
