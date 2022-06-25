import { createContext, useContext } from 'react'

export const InfoContext = createContext()
export const useInfoContext = () => useContext(InfoContext)
