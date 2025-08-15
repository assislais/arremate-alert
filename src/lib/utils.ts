import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for ArremateAlert
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR').format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function calculateMargin(valorArrematado: number, valorEstimado: number): number {
  if (!valorEstimado || valorEstimado === 0) return 0
  return ((valorEstimado - valorArrematado) / valorEstimado) * 100
}

export function getRiskLevel(margin: number): 'baixo' | 'medio' | 'alto' {
  if (margin >= 30) return 'baixo'
  if (margin >= 15) return 'medio'
  return 'alto'
}

export function getRiskColor(risk: 'baixo' | 'medio' | 'alto'): string {
  switch (risk) {
    case 'baixo': return 'text-success'
    case 'medio': return 'text-warning'
    case 'alto': return 'text-destructive'
  }
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}