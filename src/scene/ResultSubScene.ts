import {SubScene} from './SubScene';
import {BeatActionStatus} from '../component/GameManager';
import {RoundedFilledRect} from '../component/RoundedFilledRect';

enum HyoukaStamp {
  Perfect, HighLevel, DemoHeibon, Heibon, Yarinaosi
}

export class ResultSubScene extends SubScene {
  readonly onTitleSceneEnd = new g.Trigger<void>();
  private background: g.FilledRect;
  private titleBackground: RoundedFilledRect;
  private titleLabel: g.Label;
  private hyoukaText: g.Label;
  private hyoukaStampHighLevelText: g.Label;
  private hyoukaStampHeibonText: g.Label;
  private resultStates: BeatActionStatus[];
  private hyouka?: {stamp: HyoukaStamp; message: string};

  constructor(_scene: g.Scene) {
    super(_scene);
  }

  init() {
    this.background = new g.FilledRect({
      scene: this.scene,
      cssColor: '#000000',
      width: this.scene.game.width,
      height: this.scene.game.height
    });
    this.append(this.background);
    this.titleBackground = new RoundedFilledRect({
      scene: this.scene,
      width: 400,
      height: 50,
      x: (this.scene.game.width - 400) / 2,
      y: 40,
      borderRadius: 25,
      cssColor: '#ffffff'
    });
    this.append(this.titleBackground);
    this.titleLabel = new g.Label({
      scene: this.scene,
      text: 'みんなの声',
      font: new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.Serif,
        size: 24
      }),
      fontSize: 24,
      textColor: '#000000'
    });
    this.titleLabel.x = (this.scene.game.width - this.titleLabel.width) / 2;
    this.titleLabel.y = 50;
    this.append(this.titleLabel);

    this.hyoukaText = new g.Label({
      scene: this.scene,
      text: 'ちゃんと歩けてた',
      font: new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.Serif,
        size: 18
      }),
      fontSize: 18,
      textColor: '#ffffff'
    });
    this.hyoukaText.x = 140;
    this.hyoukaText.y = 140;
    this.append(this.hyoukaText);

    this.hyoukaStampHighLevelText = new g.Label({
      scene: this.scene,
      text: 'ハイレベル',
      font: new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.Serif,
        size: 50
      }),
      fontSize: 50,
      textColor: '#ffffff'
    });
    this.hyoukaStampHighLevelText.x = this.scene.game.width - this.hyoukaStampHighLevelText.width - 10;
    this.hyoukaStampHighLevelText.y = this.scene.game.height - this.hyoukaStampHighLevelText.height - 10;
    this.append(this.hyoukaStampHighLevelText);

    this.hyoukaStampHeibonText = new g.Label({
      scene: this.scene,
      text: '平凡',
      font: new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.Serif,
        size: 50
      }),
      fontSize: 50,
      textColor: '#ffffff'
    });
    this.hyoukaStampHeibonText.x = this.scene.game.width - this.hyoukaStampHeibonText.width - 10;
    this.hyoukaStampHeibonText.y = this.scene.game.height - this.hyoukaStampHeibonText.height - 10;
    this.append(this.hyoukaStampHeibonText);

    this.hideContent();
  }

  setResult(states: BeatActionStatus[]) {
    this.resultStates = states;
    this.hyouka = this.calculateHyouka(states);
    console.log(states, this.hyouka);
  }

  showContent() {
    this.background.show();
    this.titleBackground.show();
    this.titleLabel.show();
    this.hyoukaText.text = this.hyouka.message;
    this.hyoukaText.invalidate();
    this.hyoukaText.show();
    if (this.hyouka.stamp === HyoukaStamp.Perfect) {
      this.hyoukaStampHighLevelText.show();
    } else if (this.hyouka.stamp === HyoukaStamp.HighLevel) {
      this.hyoukaStampHighLevelText.show();
    } else {
      this.hyoukaStampHeibonText.show();
    }
  }

  startContent() {
    //
  }

  onUpdate() {
    //
  }

  stopContent() {
    //
  }

  hideContent() {
    this.background.hide();
    this.titleBackground.hide();
    this.titleLabel.hide();
    this.hyoukaText.hide();
    this.hyoukaStampHighLevelText.hide();
    this.hyoukaStampHeibonText.hide();
  }

  private calculateHyouka(states: BeatActionStatus[]) {
    const pointsPerfect = this.resultStates.reduce((prev, current) => {
      return prev + this.state2point(current === BeatActionStatus.Waiting ? current : BeatActionStatus.Great);
    }, 0);
    const points = this.resultStates.reduce((prev, current) => prev + this.state2point(current), 0);

    const hyoukaStamp = (() => {
      if (points === pointsPerfect) {
        return HyoukaStamp.Perfect;
      }
      if (points > pointsPerfect - 2) {
        return HyoukaStamp.HighLevel;
      }
      if (points > pointsPerfect - 6) {
        return HyoukaStamp.DemoHeibon;
      }
      if (points > pointsPerfect - 16) {
        return HyoukaStamp.Heibon;
      }
      return HyoukaStamp.Yarinaosi;
    })();

    const hyoukaMessage = (() => {
      return '完璧に歩けてた';
    })();

    return {
      stamp: hyoukaStamp,
      message: hyoukaMessage
    };
  }

  private state2point(state: BeatActionStatus) {
    switch (state) {
      case BeatActionStatus.Waiting:
        return 0;
      case BeatActionStatus.Great:
        return 2;
      case BeatActionStatus.Good:
        return 1;
      case BeatActionStatus.Fail:
        return -2;
    }
  }
}
