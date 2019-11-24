import {MediumWhite64pxLabel} from './Label';
import {RankingNamePlate} from './RankingNamePlate';
import {HyoukaStamp} from '../scene/ResultSubScene';
import {Easing, Timeline} from '@akashic-extension/akashic-timeline';

export class MultiResult extends g.E {
  private background: g.Sprite;
  private textLayer: g.E;
  private synchroLabel: MediumWhite64pxLabel;
  private synchroValue: MediumWhite64pxLabel;
  private rankingLabel: MediumWhite64pxLabel;
  private namePlates: RankingNamePlate[] = [];
  private timeline: Timeline;

  constructor(params: {
    scene: g.Scene;
    result: {
      synchroPercentage: number;
      ranking: Array<{
        name: string;
        hyouka: HyoukaStamp;
      }>;
    };
  }) {
    super({
      scene: params.scene,
      touchable: true,
      local: true
    });
    this.timeline = new Timeline(params.scene);
    this.background = new g.Sprite({
      scene: this.scene,
      src: this.scene.assets['board']
    });
    this.width = this.background.width;
    this.height = this.background.height;
    this.append(this.background);
    this.textLayer = new g.E({
      scene: this.scene,
      x: 50,
      y: 90,
      width: 500,
      height: 230,
      angle: -6
    });
    this.rankingLabel = new MediumWhite64pxLabel({
      scene: this.scene,
      fontSize: 26,
      text: 'ランキング'
    });
    this.rankingLabel.x = (this.textLayer.width - this.rankingLabel.width) / 2;

    params.result.ranking.forEach((r, index) => {
      const namePlate = new RankingNamePlate({
        scene: this.scene,
        rank: index + 1,
        name: r.name,
        hyouka: r.hyouka
      });
      namePlate.x = (this.textLayer.width - namePlate.width) / 2;
      namePlate.y = this.rankingLabel.y + this.rankingLabel.height + namePlate.height * index + 15;
      this.namePlates.push(namePlate);
      this.textLayer.append(namePlate);
    });

    this.synchroLabel = new MediumWhite64pxLabel({
      scene: this.scene,
      fontSize: 26,
      text: 'シンクロ率',
      x: 280
    });
    this.synchroLabel.y = this.textLayer.height - this.synchroLabel.height;
    this.synchroValue = new MediumWhite64pxLabel({
      scene: this.scene,
      fontSize: 32,
      text: `${params.result.synchroPercentage}%`,
      x: this.synchroLabel.x + this.synchroLabel.width + 20
    });
    this.synchroValue.y = this.textLayer.height - this.synchroValue.height;

    this.textLayer.append(this.synchroLabel);
    this.textLayer.append(this.synchroValue);
    this.textLayer.append(this.rankingLabel);
    this.append(this.textLayer);

    this.x = 0;
    this.y = -this.background.height;
    this.modified();
  }

  slideDownIn() {
    this.timeline.create(this, {modified: this.modified, destroyed: this.destroyed})
      .moveTo(this.x, 0, 700, Easing.easeInCubic)
      .moveTo(this.x, -60, 200, Easing.easeOutCubic)
      .moveTo(this.x, 0, 200, Easing.easeInCubic);
  }

  slideUpOut() {
    this.timeline.create(this, {modified: this.modified, destroyed: this.destroyed})
      .moveTo(this.x, -this.background.height + 50, 500, Easing.easeOutCubic);
  }

  isShown() {
    return this.y >= 0;
  }
}
