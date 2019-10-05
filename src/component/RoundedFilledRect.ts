export interface RoundedFilledRectParameterObject extends g.FilledRectParameterObject {
  borderRadius: number;
}

export class RoundedFilledRect extends g.E {
  private topBottomFilledRect: g.FilledRect;
  private leftRightFilledRect: g.FilledRect;
  private leftTopCircle: g.Label;
  private rightTopCircle: g.Label;
  private rightBottomCircle: g.Label;
  private leftBottomCircle: g.Label;

  constructor(params: RoundedFilledRectParameterObject) {
    super({
      scene: params.scene,
      width: params.width,
      height: params.height,
      x: params.x,
      y: params.y
    });
    this.topBottomFilledRect = new g.FilledRect({
      scene: params.scene,
      width: params.width - params.borderRadius * 2,
      height: params.height,
      x: params.borderRadius,
      y: 0,
      cssColor: params.cssColor
    });
    this.leftRightFilledRect = new g.FilledRect({
      scene: params.scene,
      width: params.width,
      height: params.height - params.borderRadius * 2,
      x: 0,
      y: params.borderRadius,
      cssColor: params.cssColor
    });
    const fontSizeCoef = 1;
    const fontCirclePaddingLeftCoef = 0.06;
    const fontCirclePaddingTopCoef = 0.18;
    const fontCirclePaddingBottomCoef = 0.06;
    const size = params.borderRadius * 2 * fontSizeCoef;
    const font = new g.DynamicFont({
      game: g.game,
      fontFamily: g.FontFamily.Serif,
      size: size
    });
    this.leftTopCircle = new g.Label({
      scene: params.scene,
      text: '●',
      font: font,
      fontSize: size,
      width: size,
      height: size,
      textColor: params.cssColor,
      x: -fontCirclePaddingLeftCoef * size,
      y: -fontCirclePaddingTopCoef * size
    });
    this.rightTopCircle = new g.Label({
      scene: params.scene,
      text: '●',
      font: font,
      fontSize: size,
      width: size,
      height: size,
      textColor: params.cssColor,
      x: params.width - size + fontCirclePaddingLeftCoef * size,
      y: -fontCirclePaddingTopCoef * size
    });
    this.rightBottomCircle = new g.Label({
      scene: params.scene,
      text: '●',
      font: font,
      fontSize: size,
      width: size,
      height: size,
      textColor: params.cssColor,
      x: params.width - size + fontCirclePaddingLeftCoef * size,
      y: params.height - size - fontCirclePaddingBottomCoef * size
    });
    this.leftBottomCircle = new g.Label({
      scene: params.scene,
      text: '●',
      font: font,
      fontSize: size,
      width: size,
      height: size,
      textColor: params.cssColor,
      x: -fontCirclePaddingLeftCoef * size,
      y: params.height - size - fontCirclePaddingBottomCoef * size
    });
    this.append(this.topBottomFilledRect);
    this.append(this.leftRightFilledRect);
    this.append(this.leftTopCircle);
    this.append(this.rightTopCircle);
    this.append(this.rightBottomCircle);
    this.append(this.leftBottomCircle);
  }

  set cssColor(value: string) {
    this.topBottomFilledRect.cssColor = value;
    this.leftRightFilledRect.cssColor = value;
    this.leftTopCircle.textColor = value;
    this.rightTopCircle.textColor = value;
    this.rightBottomCircle.textColor = value;
    this.leftBottomCircle.textColor = value;
    this.topBottomFilledRect.modified();
    this.leftRightFilledRect.modified();
    this.leftTopCircle.invalidate();
    this.rightTopCircle.invalidate();
    this.rightBottomCircle.invalidate();
    this.leftBottomCircle.invalidate();
  }
}
