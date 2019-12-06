import {SubScene} from './SubScene';
import {BeatActionStatus} from '../component/GameManager';
import {RoundedFilledRect} from '../component/RoundedFilledRect';
import {MediumBlack64pxLabel, MediumWhite64pxLabel} from '../component/Label';
import {Messenger} from '../component/Messenger';
import {PlayerJoiningManager} from '../component/PlayerJoiningManager';
import {Util} from '../util/Util';
import {MultiResult} from '../component/MultiResult';

export enum HyoukaStamp {
  Perfect, HighLevel, DemoHeibon, Heibon
}

export class ResultSubScene extends SubScene {
  readonly onSceneEnd = new g.Trigger<void>();
  private background: g.FilledRect;
  private titleBackground: RoundedFilledRect;
  private titleLabel: g.Label;
  private hyoukaText: g.Label;
  private hyoukaPerfectText: g.Sprite;
  private hyoukaStampHighLevelText: g.Sprite;
  private hyoukaStampDemoText: g.Label;
  private hyoukaStampHeibonText: g.Sprite;
  private retryButton: MediumWhite64pxLabel;
  private resultStates: BeatActionStatus[];
  private hyouka?: {
    stamp: HyoukaStamp;
    message: string;
    points: number;
  };
  private allResults: {[playerId: string]: {
    playerId: string;
    playerName: string;
    states: BeatActionStatus[];
    points: number;
    hyouka: {
      stamp: HyoukaStamp;
    };
  }} = {};
  private messenger: Messenger;
  private multiResult: MultiResult;

  constructor(_scene: g.Scene, private playerJoiningManager: PlayerJoiningManager) {
    super(_scene);
    this.messenger = new Messenger(_scene);
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
    this.titleLabel.y = 54;
    this.append(this.titleLabel);

    this.hyoukaText = new MediumWhite64pxLabel({
      scene: this.scene,
      text: '',
      fontSize: 18
    });
    this.hyoukaText.x = 140;
    this.hyoukaText.y = 140;
    this.append(this.hyoukaText);

    this.hyoukaStampHighLevelText = new g.Sprite({
      scene: this.scene,
      src: this.scene.assets['highlevel']
    });
    this.hyoukaStampHighLevelText.x = this.scene.game.width - this.hyoukaStampHighLevelText.width - 10;
    this.hyoukaStampHighLevelText.y = this.scene.game.height - this.hyoukaStampHighLevelText.height - 10;
    this.append(this.hyoukaStampHighLevelText);

    this.hyoukaPerfectText = new g.Sprite({
      scene: this.scene,
      src: this.scene.assets['perfect']
    });
    this.hyoukaPerfectText.x = this.scene.game.width - this.hyoukaStampHighLevelText.width - 40;
    this.hyoukaPerfectText.y = this.scene.game.height - this.hyoukaPerfectText.height - this.hyoukaStampHighLevelText.height + 10;
    this.append(this.hyoukaPerfectText);

    this.hyoukaStampHeibonText = new g.Sprite({
      scene: this.scene,
      src: this.scene.assets['heibon']
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

    if (Util.isAtsumaruEnv()) {
      this.retryButton = new MediumWhite64pxLabel({
        scene: this.scene,
        text: '<<もういちど',
        fontSize: 24,
        touchable: true
      });
      this.retryButton.x = 20;
      this.retryButton.y = this.scene.game.height - this.retryButton.height - 20;
      this.retryButton.pointUp.add(() => {
        this.onSceneEnd.fire();
      });
      this.append(this.retryButton);
    }

    this.hideContent();

    this.messenger.onReceive('result', result => {
      this.allResults[result.playerId] = result;
    });
  }

  setResult(states: BeatActionStatus[]) {
    this.resultStates = states;
    this.hyouka = this.calculateHyouka(states);
    const me = this.playerJoiningManager.me();
    // console.log('setResult', states, this.hyouka, me);
    if (me) {
      this.messenger.send('result', {
        playerId: me.id,
        playerName: me.userName,
        states: this.resultStates,
        points: this.hyouka.points,
        hyouka: {
          stamp: this.hyouka.stamp
        }
      });
    }
  }

  showContent() {
    this.background.show();
    this.hyoukaText.text = this.hyouka.message;
    this.hyoukaText.invalidate();
  }

  startContent() {
    this.scene.setTimeout(() => {
      this.titleBackground.show();
      this.titleLabel.show();
      Util.playAudio(this.scene, 'pi2');
    }, 1000);
    this.scene.setTimeout(() => {
      this.hyoukaText.show();
      Util.playAudio(this.scene, 'peta2');
    }, 2500);
    this.scene.setTimeout(() => {
      if (this.hyouka.stamp === HyoukaStamp.Perfect) {
        this.hyoukaStampHighLevelText.show();
        this.hyoukaPerfectText.show();
        Util.playAudio(this.scene, 'jingle_highlevel');
      } else if (this.hyouka.stamp === HyoukaStamp.HighLevel) {
        this.hyoukaStampHighLevelText.show();
        Util.playAudio(this.scene, 'jingle_highlevel');
      } else if (this.hyouka.stamp === HyoukaStamp.DemoHeibon) {
        this.hyoukaStampHeibonText.show();
        this.hyoukaStampDemoText.show();
        Util.playAudio(this.scene, 'jingle_heibon');
      } else {
        this.hyoukaStampHeibonText.show();
        Util.playAudio(this.scene, 'jingle_heibon');
      }
    }, 4000);
    if (Util.isAtsumaruEnv()) {
      this.scene.setTimeout(() => {
        const savePromise = Util.saveScore(this.hyouka.points);
        if (savePromise) {
          savePromise.then(() => {
            Util.showScoreboard();
          });
        }
        this.retryButton && this.retryButton.show();
      }, 5500);
    } else {
      this.scene.setTimeout(() => {
        const result = this.calculateMultiResult();
        this.multiResult = new MultiResult({
          scene: this.scene,
          result
        });
        this.append(this.multiResult);
        this.multiResult.slideDownIn();
        this.multiResult.pointDown.add(() => {
          if (this.multiResult.isShown()) {
            this.multiResult.slideUpOut();
          } else {
            this.multiResult.slideDownIn();
          }
        });
      }, 5500);
    }
  }

  onUpdate() {
    //
  }

  stopContent() {
    this.multiResult && this.multiResult.destroy();
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
    this.retryButton && this.retryButton.hide();
  }

  private calculateHyouka(states: BeatActionStatus[]) {
    const pointsPerfect = states.reduce((prev, current) => {
      return prev + this.state2point(BeatActionStatus.Great);
    }, 0);
    const points = states.reduce((prev, current) => prev + this.state2point(current), 0);
    const failedCount = states.filter(v => v === BeatActionStatus.Fail).length;
    // console.log(`result: ${points}/${pointsPerfect} (${failedCount} miss)`);
    const hyoukaStamp = (() => {
      if (points === pointsPerfect) {
        return HyoukaStamp.Perfect;
      }
      if (points > pointsPerfect - 10 && failedCount < 2) {
        return HyoukaStamp.HighLevel;
      }
      if (points > pointsPerfect - 20) {
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
    // console.log(hyoukaStamp, hyoukaMessage);

    return {
      points: points,
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
        return -1;
    }
  }

  private calculateMultiResult() {
    const masterId = this.playerJoiningManager.gameMasterPlayer().id;
    const masterResult = this.allResults[masterId];
    const distances: number[] = [];
    Object.keys(this.allResults).forEach(id => {
      const result = this.allResults[id];
      if (result.playerId === masterId) {
        return;
      }
      // 0 <= d <= 1
      const d = result.states.reduce((prev, current, index) => {
        const a = current === BeatActionStatus.Fail ? 0 : 1;
        const b = masterResult.states[index] === BeatActionStatus.Fail ? 0 : 1;
        return prev + (a - b) * (a - b);
      }, 0) / result.states.length;
      distances.push(d);
    });
    // console.log('distances', distances);
    const weight = 100 / (Object.keys(this.allResults).length - 1);
    // console.log('weight', weight);
    const synchroPercentage = distances.reduce((prev, current) => {
      return prev + (1 - current) * weight;
    }, 0);
    // console.log('synchroPercentage', synchroPercentage);

    const ranking = Object.keys(this.allResults).sort((ka, kb) => {
      return this.allResults[kb].points - this.allResults[ka].points;
    }).slice(0, 5).map(k => this.allResults[k]).map(result => ({
      name: result.playerName,
      hyouka: result.hyouka.stamp
    }));
    return {
      synchroPercentage: Math.max(0, Math.min(100, Math.round(synchroPercentage))),
      ranking
    };
  }
}
