import {RoundedFilledRect} from './RoundedFilledRect';
import {MediumWhite64pxLabel} from './Label';

export class NiconamaCampaign extends g.E {
  private background: RoundedFilledRect;
  private text: g.Label;

  constructor(params: {
    scene: g.Scene;
  }) {
    super({
      scene: params.scene,
      width: 120,
      height: 40,
      angle: -5
    });

    this.background = new RoundedFilledRect({
      scene: this.scene,
      width: 100,
      height: 24,
      x: 0,
      y: 0,
      borderRadius: 12,
      cssColor: '#c33',
      circleAssetId: 'red_circle_32',
      circleAssetSize: 32
    });
    this.append(this.background);

    this.text = new MediumWhite64pxLabel({
      scene: this.scene,
      text: 'ニコ生対応',
      x: 12,
      y: 4,
      fontSize: 16
    });
    this.append(this.text);
  }
}
