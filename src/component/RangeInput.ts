import {RoundedFilledRect} from './RoundedFilledRect';
import {MediumBlack64pxLabel} from './Label';

export class RangeInput extends g.E {
  private minValue: number;
  private maxValue: number;
  private minusButtonBackground: RoundedFilledRect;
  private minusButtonText: MediumBlack64pxLabel;
  private plusButtonBackground: RoundedFilledRect;
  private plusButtonText: MediumBlack64pxLabel;
  private scaleLine: g.FilledRect;
  private division0: g.FilledRect;
  private currentValueMarker: g.FilledRect;
  private currentValueText: MediumBlack64pxLabel;

  constructor(params: {
    scene: g.Scene;
    width: number;
    height: number;
    x: number;
    y: number;
    minValue: number;
    maxValue: number;
  }) {
    super({
      scene: params.scene,
      width: params.width,
      height: params.height,
      x: params.x,
      y: params.y,
      local: true
    });
    this.minValue = params.minValue;
    this.maxValue = params.maxValue;
    this.minusButtonBackground = new RoundedFilledRect({
      scene: this.scene,
      width: params.height,
      height: params.height,
      x: 0,
      y: 0,
      borderRadius: params.height / 2,
      cssColor: '#f0fbff',
      circleAssetId: 'lightblue_circle_32',
      circleAssetSize: 32,
      touchable: true
    });
    this.minusButtonText = new MediumBlack64pxLabel({
      scene: this.scene,
      text: '-',
      fontSize: params.height
    });
    this.minusButtonText.x = (this.minusButtonBackground.width - this.minusButtonText.width) / 2;
    this.minusButtonText.y = (this.minusButtonBackground.height - this.minusButtonText.height) / 2;
    this.plusButtonBackground = new RoundedFilledRect({
      scene: this.scene,
      width: params.height,
      height: params.height,
      x: params.width - params.height,
      y: 0,
      borderRadius: params.height / 2,
      cssColor: '#f0fbff',
      circleAssetId: 'lightblue_circle_32',
      circleAssetSize: 32,
      touchable: true
    });
    this.plusButtonText = new MediumBlack64pxLabel({
      scene: this.scene,
      text: '+',
      fontSize: params.height
    });
    this.plusButtonText.x = this.plusButtonBackground.x + ((this.plusButtonBackground.width - this.plusButtonText.width) / 2);
    this.plusButtonText.y = (this.plusButtonBackground.height - this.plusButtonText.height) / 2;
    this.scaleLine = new g.FilledRect({
      scene: this.scene,
      cssColor: '#0d0015',
      width: params.width - params.height * 2 - 4 * 2,
      height: 2,
      x: params.height + 2,
      y: (params.height - 2) / 2
    });
    this.division0 = new g.FilledRect({
      scene: this.scene,
      cssColor: '#0d0015',
      width: 2,
      height: 10,
      x: this.scaleLine.x + this.calculateX(0) - 2 / 2,
      y: (params.height - 10) / 2
    });
    this.currentValueMarker = new g.FilledRect({
      scene: this.scene,
      cssColor: '#c33',
      width: 4,
      height: 20,
      x: this.scaleLine.x + this.calculateX(0) - 4 / 2,
      y: (params.height - 20) / 2
    });
    this.currentValueText = new MediumBlack64pxLabel({
      scene: this.scene,
      text: '0',
      fontSize: 18
    });
    this.currentValueText.x = this.currentValueMarker.x + 1 - this.currentValueText.width / 2;
    this.currentValueText.y = -this.currentValueText.height;

    this.minusButtonBackground.pointUp.add(() => {
      this.updateCurrentValue(-1);
    });

    this.plusButtonBackground.pointUp.add(() => {
      this.updateCurrentValue(1);
    });

    this.append(this.minusButtonBackground);
    this.append(this.minusButtonText);
    this.append(this.plusButtonBackground);
    this.append(this.plusButtonText);
    this.append(this.scaleLine);
    this.append(this.division0);
    this.append(this.currentValueMarker);
    this.append(this.currentValueText);
  }

  getCurrentValue() {
    return parseInt(this.currentValueText.text, 10);
  }

  setCurrentValue(value: number) {
    const currentValue = parseInt(this.currentValueText.text, 10);
    this.updateCurrentValue(value - currentValue);
  }

  private calculateX(value: number) {
    const pxPerValue = this.scaleLine.width / (this.maxValue - this.minValue);
    return pxPerValue * (value - this.minValue);
  }

  private updateCurrentValue(diff: number) {
    const currentValue = parseInt(this.currentValueText.text, 10);
    const nextValue = currentValue + diff;
    if (nextValue < this.minValue || this.maxValue < nextValue) {
      return;
    }
    this.currentValueMarker.x = this.scaleLine.x + this.calculateX(nextValue) - this.currentValueMarker.width / 2;
    this.currentValueMarker.modified();
    this.currentValueText.text = `${nextValue}`;
    this.currentValueText.invalidate();
  }
}
