import NonbiriTouringScore from '../score/NonbiriTouringScore';
import {BeatAction} from '../score/BeatAction';
import {Util} from '../util/Util';

export const enum BeatActionStatus {
  Waiting, Great, Good, Fail
}

export const enum UserAction {
  Click, SlideDown, SlideUp
}

type Timeline = Array<{
  age: number;
  beatAction: BeatAction;
  beatActionStatus: BeatActionStatus;
  systemAction: () => void; // 曲の再生などシステムで必要な処理
}>;

export class GameManager extends g.E {
  /**
   * 各拍ごとのアクションが成功したか失敗したか確定したタイミングでemitされます
   * プレイヤーのクリック起因、時間経過起因で発生
   */
  readonly onBeatActionStatusFixed: g.Trigger<{status: BeatActionStatus}>;
  /**
   * 曲が始まる前のカウントの最後の拍を打ったときに発火
   */
  readonly onLastCount: g.Trigger<void>;
  readonly onLastSomeMeasures: g.Trigger<{age: number}>;
  /**
   * ※ B-B: 1拍の長さ
   *          |      0.25 B-B    |
   *          |        | 0.1 B-B |
   *   miss   |  good  |       great     |  good  |  miss
   *          |        |         |       |        |
   * ----------------------------B-----------------------------
   *                           (↑Beat)
   */
  private GREAT_MARGIN = 0.15;
  private GOOD_MARGIN = 0.30;
  private timeline: Timeline;
  private agePerBeat: number;
  private currentTimelineIndex: number;

  constructor(params: {
    scene: g.Scene;
  }) {
    super({
      scene: params.scene,
      width: params.scene.game.width,
      height: params.scene.game.height,
      local: true
    });
    this.onBeatActionStatusFixed = new g.Trigger<{status: BeatActionStatus}>();
    this.onLastCount = new g.Trigger();
    this.onLastSomeMeasures = new g.Trigger();
    this.update.add(this.onUpdate.bind(this));
  }

  start() {
    this.initializeTimeline(NonbiriTouringScore, this.scene.game.age + 60);
    this.currentTimelineIndex = -1;
    // console.log('timeline', this.timeline);
  }

  onUpdate() {
    if (!this.timeline) {
      return;
    }

    // 今のタイムラインの beatActionStatus をチェック Waiting かつ Fail となる範囲なら Fail とする
    if (
      this.timeline[this.currentTimelineIndex] &&
      this.timeline[this.currentTimelineIndex].beatActionStatus === BeatActionStatus.Waiting &&
      (
        this.timeline[this.currentTimelineIndex].beatAction === BeatAction.Normal ||
        this.timeline[this.currentTimelineIndex].beatAction === BeatAction.PiPyako
      )
    ) {
      if (this.scene.game.age - this.timeline[this.currentTimelineIndex].age > this.agePerBeat * this.GOOD_MARGIN) {
        console.log('超過 failed', this.currentTimelineIndex);
        this.timeline[this.currentTimelineIndex].beatActionStatus = BeatActionStatus.Fail;
        this.onBeatActionStatusFixed.fire({status: this.timeline[this.currentTimelineIndex].beatActionStatus});
      }
    }

    // 次のタイムラインの時刻を過ぎていたら、
    if (this.timeline[this.currentTimelineIndex + 1] && this.timeline[this.currentTimelineIndex + 1].age < this.scene.game.age) {
      // タイムラインを進める
      this.currentTimelineIndex++;

      // システムアクションがあれば実行
      if (this.timeline[this.currentTimelineIndex].systemAction) {
        this.timeline[this.currentTimelineIndex].systemAction();
      }
      // console.log('beat!', this.timeline[this.currentTimelineIndex]);
    }
  }

  /**
   * 確定した結果の beatIndex(小節中の何拍目か) を返します
   */
  action(action: UserAction): number | null {
    // console.log('action', action);
    const nearestIndex = (
      this.timeline[this.currentTimelineIndex].beatActionStatus === BeatActionStatus.Waiting &&
      this.timeline[this.currentTimelineIndex].beatAction !== BeatAction.Count &&
      this.timeline[this.currentTimelineIndex].beatAction !== BeatAction.LastCount
    )
      ? this.currentTimelineIndex
      : this.currentTimelineIndex + 1;
    // console.log('nearestIndex', nearestIndex);
    if (!this.timeline[nearestIndex]) {
      return null;
    }

    if (this.timeline[nearestIndex].beatActionStatus !== BeatActionStatus.Waiting) {
      // 結果が確定済みならスルー
      return null;
    }
    if (this.timeline[nearestIndex].beatAction !== BeatAction.Normal && this.timeline[nearestIndex].beatAction !== BeatAction.PiPyako) {
      // console.log('not normal, pipyako');
      return null;
    }

    if (this.timeline[nearestIndex - 2] && this.timeline[nearestIndex - 2].beatAction === BeatAction.PiPyako) {
      console.log('SlideDown であるべき');
      // SlideDown であるべき
      if (action !== UserAction.SlideDown) {
        this.timeline[nearestIndex].beatActionStatus = BeatActionStatus.Fail;
      } else {
        const timingGap = this.scene.game.age - this.timeline[nearestIndex].age;
        const status = timingGap < this.agePerBeat * this.GREAT_MARGIN
          ? BeatActionStatus.Great
          : timingGap < this.agePerBeat * this.GOOD_MARGIN
            ? BeatActionStatus.Good
            : BeatActionStatus.Fail;
        this.timeline[nearestIndex].beatActionStatus = status;
        // console.log('status', status, timingGap);
      }
    } else if (this.timeline[nearestIndex - 3] && this.timeline[nearestIndex - 3].beatAction === BeatAction.PiPyako) {
      console.log('SlideUp であるべき');
      // SlideUp であるべき
      if (action !== UserAction.SlideUp) {
        this.timeline[nearestIndex].beatActionStatus = BeatActionStatus.Fail;
      } else {
        const timingGap = this.scene.game.age - this.timeline[nearestIndex].age;
        const status = timingGap < this.agePerBeat * this.GREAT_MARGIN
          ? BeatActionStatus.Great
          : timingGap < this.agePerBeat * this.GOOD_MARGIN
            ? BeatActionStatus.Good
            : BeatActionStatus.Fail;
        this.timeline[nearestIndex].beatActionStatus = status;
        // console.log('status', status, timingGap);
      }
    } else {
      console.log('Click であるべき');
      // Click であるべき
      if (action !== UserAction.Click) {
        this.timeline[nearestIndex].beatActionStatus = BeatActionStatus.Fail;
      } else {
        const timingGap = this.scene.game.age - this.timeline[nearestIndex].age;
        const status = timingGap < this.agePerBeat * this.GREAT_MARGIN
          ? BeatActionStatus.Great
          : timingGap < this.agePerBeat * this.GOOD_MARGIN
            ? BeatActionStatus.Good
            : BeatActionStatus.Fail;
        this.timeline[nearestIndex].beatActionStatus = status;
        // console.log('status', status, timingGap);
      }
    }
    this.onBeatActionStatusFixed.fire({status: this.timeline[nearestIndex].beatActionStatus});
    console.log('onBeatActionStatusFixed', nearestIndex, action, this.timeline[nearestIndex].beatActionStatus);
    return nearestIndex % 4;
  }

  private initializeTimeline(score: typeof NonbiriTouringScore, startAge: number) {
    const timeline: Timeline = [];
    this.agePerBeat = 60 / score.bpm * this.scene.game.fps;
    score.fragments.forEach((fragment, fi) => {
      fragment.beatAction.forEach((beatAction, bi) => {
        timeline.push({
          age: startAge + this.agePerBeat * (fi * score.beat + bi),
          beatAction: beatAction,
          beatActionStatus: BeatActionStatus.Waiting,
          systemAction: () => {
            if (bi === 0) {
              // console.log('playAudio', fragment.assetId);
              Util.playAudio(this.scene, fragment.assetId);
            }
            if (beatAction === BeatAction.Count) {
              Util.playAudio(this.scene, 'pi');
            }
            if (beatAction === BeatAction.LastCount) {
              Util.playAudio(this.scene, 'pi');
              this.onLastCount.fire();
            }
            if (beatAction === BeatAction.PiPyako) {
              Util.playAudio(this.scene, 'numa_head');
            }
            if (fi === score.fragments.length - 3) {
              // 最後から3小節目
              this.onLastSomeMeasures.fire({
                age: 3 * score.beat * this.agePerBeat
              });
            }
          }
        });
      });
    });
    this.timeline = timeline;
  }
}
