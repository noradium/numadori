export interface RoundedFilledRectParameterObject {
  scene: g.Scene;
  width: number;
  height: number;
  x: number;
  y: number;
  cssColor: string;
  circleAssetId: string;
  circleAssetSize: number;
  borderRadius: number;
}

export class RoundedFilledRect extends g.E {
  private topBottomFilledRect: g.FilledRect;
  private leftRightFilledRect: g.FilledRect;
  private leftTopCircle: g.Sprite;
  private rightTopCircle: g.Sprite;
  private rightBottomCircle: g.Sprite;
  private leftBottomCircle: g.Sprite;

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
    const size = params.borderRadius * 2;
    this.leftTopCircle = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets[params.circleAssetId],
      width: size,
      height: size,
      srcWidth: params.circleAssetSize,
      srcHeight: params.circleAssetSize,
      x: 0,
      y: 0
    });
    this.rightTopCircle = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets[params.circleAssetId],
      width: size,
      height: size,
      srcWidth: params.circleAssetSize,
      srcHeight: params.circleAssetSize,
      x: params.width - size,
      y: 0
    });
    this.rightBottomCircle = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets[params.circleAssetId],
      width: size,
      height: size,
      srcWidth: params.circleAssetSize,
      srcHeight: params.circleAssetSize,
      x: params.width - size,
      y: params.height - size
    });
    this.leftBottomCircle = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets[params.circleAssetId],
      width: size,
      height: size,
      srcWidth: params.circleAssetSize,
      srcHeight: params.circleAssetSize,
      x: 0,
      y: params.height - size
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
    this.topBottomFilledRect.modified();
    this.leftRightFilledRect.modified();
    this.leftTopCircle.invalidate();
    this.rightTopCircle.invalidate();
    this.rightBottomCircle.invalidate();
    this.leftBottomCircle.invalidate();
  }
}
