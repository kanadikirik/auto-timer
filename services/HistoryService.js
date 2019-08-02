import { AsyncStorage } from 'react-native';

const STORAGE_NAME = "HISTORY"

const checkStorage = async () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(STORAGE_NAME).then(history => resolve(history ? JSON.parse(history) : false))
    .catch(err => reject(err))
  })
}

export const getHistory = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(STORAGE_NAME)
    .then(history => resolve(history ? JSON.parse(history) : []))
    .catch(err => reject(err))
  })
  
}

export const addToHistory = (timerData) => {
  return new Promise((resolve, reject) => {
    checkStorage().then(history => {
      setHistory(history ? [timerData, ...history] : [history])
      .then(() => resolve())
      .catch(err => reject(err))
    })
  })
}

export const setHistory = (history) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.setItem(STORAGE_NAME, JSON.stringify(history))
    .then(() => resolve())
    .catch(err => reject(err))
  })
}