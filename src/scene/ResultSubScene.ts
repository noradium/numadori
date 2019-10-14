import {SubScene} from './SubScene';
import {BeatActionStatus} from '../component/GameManager';
import {RoundedFilledRect} from '../component/RoundedFilledRect';
import {MediumBlack64pxLabel, MediumWhite64pxLabel} from '../component/Label';

enum HyoukaStamp {
  Perfect, HighLevel, DemoHeibon, Heibon
}

export class ResultSubScene extends SubScene {
  readonly onTitleSceneEnd = new g.Trigger<void>();
  private background: g.FilledRect;
  private titleBackground: RoundedFilledRect;
  private titleLabel: g.Label;
  private hyoukaText: g.Label;
  private hyoukaPerfectText: g.Label;
  private hyoukaStampHighLevelText: g.Label;
  private hyoukaStampDemoText: g.Label;
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
      cssColor: '#ffffff',
      circleAssetId: 'white_circle_32',
      circleAssetSize: 32
    });
    this.append(this.titleBackground);
    this.titleLabel = new MediumBlack64pxLabel({
      scene: this.scene,
      text: 'みんなの声',
      fontSize: 24
    });
    this.titleLabel.x = (this.scene.game.width - this.titleLabel.width) / 2;
    this.titleLabel.y = 50;
    this.append(this.titleLabel);

    this.hyoukaText = new MediumWhite64pxLabel({
      scene: this.scene,
      text: '',
      fontSize: 18
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

    this.hyoukaPerfectText = new g.Label({
      scene: this.scene,
      text: 'パーフェクト',
      font: new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.Serif,
        size: 24
      }),
      fontSize: 24,
      textColor: '#ffffff'
    });
    this.hyoukaPerfectText.x = this.scene.game.width - this.hyoukaPerfectText.width - 10;
    this.hyoukaPerfectText.y = this.scene.game.height - this.hyoukaPerfectText.height - 10 - this.hyoukaStampHighLevelText.height;
    this.append(this.hyoukaPerfectText);

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

    this.hyoukaStampDemoText = new MediumWhite64pxLabel({
      scene: this.scene,
      text: 'でも...',
      fontSize: 18
    });
    this.hyoukaStampDemoText.x = this.scene.game.width - this.hyoukaStampDemoText.width - 10 - this.hyoukaStampHeibonText.width;
    this.hyoukaStampDemoText.y = this.scene.game.height - this.hyoukaStampHeibonText.height - 10;
    this.append(this.hyoukaStampDemoText);

    this.hideContent();
  }

  setResult(states: BeatActionStatus[]) {
    this.resultStates = states;
    this.hyouka = this.calculateHyouka(states);
    // console.log(states, this.hyouka);
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
      this.hyoukaPerfectText.show();
    } else if (this.hyouka.stamp === HyoukaStamp.HighLevel) {
      this.hyoukaStampHighLevelText.show();
    } else if (this.hyouka.stamp === HyoukaStamp.DemoHeibon) {
      this.hyoukaStampHeibonText.show();
      this.hyoukaStampDemoText.show();
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
    this.hyoukaStampDemoText.hide();
    this.hyoukaPerfectText.hide();
  }

  private calculateHyouka(states: BeatActionStatus[]) {
    const pointsPerfect = states.reduce((prev, current) => {
      return prev + this.state2point(BeatActionStatus.Great);
    }, 0);
    const points = states.reduce((prev, current) => prev + this.state2point(current), 0);
    const failedCount = states.filter(v => v === BeatActionStatus.Fail).length;

    const hyoukaStamp = (() => {
      if (points === pointsPerfect) {
        return HyoukaStamp.Perfect;
      }
      if (points > pointsPerfect - 6 && failedCount < 2) {
        return HyoukaStamp.HighLevel;
      }
      if (points > pointsPerfect - 10) {
        return HyoukaStamp.DemoHeibon;
      }
      return HyoukaStamp.Heibon;
    })();

    const hyoukaMessage = (() => {
      if (hyoukaStamp === HyoukaStamp.Perfect) {
        return '完璧に歩けてた';
      }
      if (hyoukaStamp === HyoukaStamp.HighLevel) {
        return 'ちゃんと歩けてた';
      }
      if (hyoukaStamp === HyoukaStamp.DemoHeibon) {
        const q1Index =  Math.ceil((states.length - 1) / 4);
        const q2Index =  Math.ceil((states.length - 1) / 2);
        const q3Index =  Math.ceil((states.length - 1) / 4 * 3);
        const blockNum = q1Index;
        const quarterScore = states.reduce((prev, current, index) => {
          const point = this.state2point(current);
          // console.log('index: ', index, point);
          if (index < blockNum) {
            // console.log('increment 0');
            prev[0] += point;
          }
          if (q1Index <= index && index < q1Index + blockNum) {
            // console.log('increment 1');
            prev[1] += point;
          }
          if (q2Index <= index && index < q2Index + blockNum) {
            // console.log('increment 2');
            prev[2] += point;
          }
          if (q3Index <= index && index < q3Index + blockNum) {
            // console.log('increment 3');
            prev[3] += point;
          }
          return prev;
        }, [0, 0, 0, 0]);
        // console.log(quarterScore);
        const bestQuarter = quarterScore.indexOf(Math.max(...quarterScore));
        switch (bestQuarter) {
          case 0:
            return '最初よくできてた';
          case 1:
          case 2:
            return '中盤よくできてた';
          default: // case 4
            return '最後よくできてた';
        }
      }
      // Heibon
      return 'もう少しがんばろう';
    })();

    return {
      stamp: hyoukaStamp,
      message: hyoukaMessage
    };
  }

  private state2point(state: BeatActionStatus) {
    switch (state) {
      case BeatActionStatus.Waiting:
      case BeatActionStatus.Great:
        return 2;
      case BeatActionStatus.Good:
        return 1;
      case BeatActionStatus.Fail:
        return -2;
    }
  }
}
