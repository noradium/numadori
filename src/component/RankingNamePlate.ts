import {DynamicFontLabel, MediumWhite64pxLabel} from './Label';
import {HyoukaStamp} from '../scene/ResultSubScene';

export class RankingNamePlate extends g.E {
  private rankLabel: MediumWhite64pxLabel;
  private nameLabel: MediumWhite64pxLabel;
  private scoreLabel: MediumWhite64pxLabel;

  constructor(params: {
    scene: g.Scene;
    rank: number;
    name: string;
    hyouka: HyoukaStamp;
    x?: number;
    y?: number;
  }) {
    super({
      scene: params.scene,
      x: params.x,
      y: params.y,
      width: 400,
      height: 30
    });
    this.rankLabel = new MediumWhite64pxLabel({
      scene: this.scene,
      fontSize: 24,
      text: `${params.rank}位`
    });
    this.rankLabel.y = (this.height - this.rankLabel.height) / 2;
    this.nameLabel = new DynamicFontLabel({
      scene: this.scene,
      fontSize: 24,
      text: params.name,
      textColor: '#ffffff',
      x: this.rankLabel.width + 20,
      widthAutoAdjust: false,
      width: 200
    });
    this.nameLabel.y = (this.height - this.nameLabel.height) / 2;
    this.scoreLabel = new MediumWhite64pxLabel({
      scene: this.scene,
      fontSize: 24,
      text: this.hyouka2text(params.hyouka),
      x: this.nameLabel.x + this.nameLabel.width + 20
    });
    this.scoreLabel.y = (this.height - this.scoreLabel.height) / 2;
    this.append(this.rankLabel);
    this.append(this.nameLabel);
    this.append(this.scoreLabel);
  }

  private hyouka2text(hyouka: HyoukaStamp) {
    switch (hyouka) {
      case HyoukaStamp.Perfect:
        return 'パーフェクト';
      case HyoukaStamp.HighLevel:
        return 'ハイレベル';
      case HyoukaStamp.DemoHeibon:
        return 'でも平凡';
      case HyoukaStamp.Heibon:
        return '平凡';
    }
  }
}
