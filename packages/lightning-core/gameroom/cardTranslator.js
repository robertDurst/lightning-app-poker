export default function cardTranslator(value, suite) {
  let retStr = ""
  switch(value) {
    case 1:
      retStr = 'A';
      break;
    case 11:
      retStr = 'J';
      break;
    case 12:
      retStr = 'Q';
      break;
    case 13:
      retStr = 'K';
      break;
    default:
      retStr = value.toString();
  }

  return retStr + suite[0];
}
