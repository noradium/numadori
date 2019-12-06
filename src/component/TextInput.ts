import {DynamicFontLabel} from './Label';

export class TextInput extends g.E {
  private background: g.FilledRect;
  private backgroundBorder: g.FilledRect;
  private disabledLayer: g.FilledRect;
  private text: g.Label;
  private maxLength = 0;
  private isDisabled = false;

  constructor(params: {
    scene: g.Scene;
    width: number;
    height: number;
    maxLength: number;
  }) {
    super({
      scene: params.scene,
      width: params.width,
      height: params.height,
      touchable: true,
      local: true
    });
    this.maxLength = params.maxLength;
    this.background = new g.FilledRect({
      scene: params.scene,
      cssColor: '#ffffff',
      width: params.width - 2,
      height: params.height - 2,
      x: 1,
      y: 1
    });
    this.backgroundBorder = new g.FilledRect({
      scene: params.scene,
      cssColor: '#000000',
      width: params.width,
      height: params.height
    });
    this.append(this.backgroundBorder);
    this.append(this.background);

    this.text = new DynamicFontLabel({
      scene: this.scene,
      text: '',
      fontSize: 28
    });
    this.text.x = 4;
    this.text.y = 4;
    this.append(this.text);

    this.disabledLayer = new g.FilledRect({
      scene: params.scene,
      cssColor: '#000000',
      opacity: 0.5,
      width: params.width,
      height: params.height
    });
    this.disabledLayer.hide();
    this.append(this.disabledLayer);
  }

  currentValue() {
    return this.text.text;
  }

  updateValue(text: string) {
    if (this.isDisabled || text.length > this.maxLength) {
      return;
    }
    this.text.text = text;
    this.text.invalidate();
  }

  setDisabled(disabled: boolean) {
    this.isDisabled = disabled;
    this.touchable = !disabled;
    disabled ? this.disabledLayer.show() : this.disabledLayer.hide();
  }
}
