export const COLOR = {
  DARK: "#0E121A",
  WHITE: "white",
  BLUE: "#267BE9",
  BLUE_SOFT: "#E8F0FE",
  GREEN: "#41B398",
  GREEN_SOFT: "#E5FAF7",
  RED: "#FD5D5E",
  RED_SOFT: "#FFF2F2",
}

export const STYLE = {
  DARK: { color: COLOR.DARK },
  WHITE: { color: COLOR.WHITE },
  BLUE: { color: COLOR.BLUE },
  GREEN: { color: COLOR.GREEN },
  RED: { color: COLOR.RED },
  BOLD: { fontWeight: "bold" },
  BG_DARK: { backgroundColor: COLOR.DARK },
  BG_WHITE: { backgroundColor: COLOR.WHITE },
  BG_RED_SOFT: { backgroundColor: COLOR.RED },
  TA_CENTER: { textAlign: "center" },
  SPACE: (width, height) => {
    return{
      paddingHorizontal: width*.05, 
      paddingVertical: height*.05
    }
  },

}