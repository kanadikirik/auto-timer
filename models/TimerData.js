export class TimerData {
  constructor(second, date) {
    this.second = second;
    this.date = date;
  }

  static configureTime = (second) => {
    if (second < 60) return `${second} s`;
    else if (second >= 60 && second < 3600)
      return `${Math.floor(second / 60)} m ${second % 60} s`;
  };
}
