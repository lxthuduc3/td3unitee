import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const buildUrl = (endpoint, searchParams) => {
  const query = new URLSearchParams(searchParams)
  const queryString = query.toString()
  return queryString ? `${endpoint}?${queryString}` : endpoint
}

export const getAbbreviationName = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export const removeVietnameseTones = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const isOldIphone = () => {
  let match = navigator.userAgent.match(/OS (\d+)_/)
  return match && parseInt(match[1], 10) <= 15
}
