import { createContext, useContext } from 'react'

export const SettingsContext = createContext()
export const useSettingsContext = () => useContext(SettingsContext)
