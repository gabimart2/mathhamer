import { useState, useEffect } from 'react'

const getStorageValue = (key, defaultValue) => {
  const stored = JSON.parse(window.localStorage.getItem(key))
  return stored !== null ? stored : defaultValue
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue)
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
