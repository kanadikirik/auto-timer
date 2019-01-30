import { AsyncStorage } from 'react-native';

export class TimerData{

  static storage = () => { return 'TIMERDATAS' };

  constructor(second, alias, date){
    this.second = second;
    this.alias  = alias;
    this.date   = date;
  }

  static buildMultiple = (timerDatas) => {
    let timerDataObjects = [];
    timerDatas.map(timerData => {
      let { second, alias, date } = timerData;
      return timerDataObjects.push(new TimerData(second, alias, date));
    })
    return timerDataObjects;
  }

  static configureTime = (second) => {
    if(second < 60)
      return `${second} s`
    else if(second >= 60 && second < 3600)
      return `${Math.floor(second/60)} m ${second%60} s`
  }

  static get = async () => {
    let timerDatas = false;
    await AsyncStorage.getItem(TimerData.storage())
    .then(result => timerDatas = TimerData.buildMultiple(JSON.parse(result)))
    .catch(err => console.log(err));
    return timerDatas;
  }

  static save = async (second, alias, date) => {
    let saveStatus = false;
    const timerData = new TimerData(second, alias, date);
    let isStorageExist = await TimerData.isStorageExist();
    if(!isStorageExist.error){ // If error is true then still saveStatus = false
      if(isStorageExist.exist){ // If TimerData storage created before then save TimerData
        let timerDatas = isStorageExist.exist;
        const isAliasExist = TimerData.isAliasExist(timerDatas, alias);
        if(!isAliasExist){
          timerDatas.push(timerData);
          await AsyncStorage.setItem(TimerData.storage(), JSON.stringify(timerDatas))
          .then(() => saveStatus = true)
          .catch(err => console.log(err));
        } else {
          saveStatus = 'Alias exist!';
        }
      } else { // If TimerData storage is not created before then create storage and save TimerData
        const timerDatas = [timerData];
        await AsyncStorage.setItem(TimerData.storage(), JSON.stringify(timerDatas))
        .then(() => saveStatus = true)
        .catch(err => console.log(err));
      }
    }
    return saveStatus;
  }

  // Control is first time for save data 
  static isStorageExist = async () => {
    let status = {exist: false, error: false};
    await AsyncStorage.getItem(TimerData.storage())
    .then(result => status.exist = result ? JSON.parse(result) : false)
    .catch(err => {
      console.log(err);
      status.error = true;
    });
    return status;
  }

  static isAliasExist = (timerDatas, alias) => {
    const index = timerDatas.findIndex(timerData => timerData.alias === alias);
    return index === -1 ? false : true;
  }

}