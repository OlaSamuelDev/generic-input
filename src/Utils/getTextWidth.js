function getTextWidth(text, font) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const width = context.measureText(text).width;
  const formattedWidth = Math.ceil(width);
  return formattedWidth;
}

export default getTextWidth;
