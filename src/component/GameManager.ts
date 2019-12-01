import {BeatAction} from '../score/BeatAction';
import {Util} from '../util/Util';
import {Score} from '../score/Score';

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
  readonly onBeat: g.Trigger<{action: BeatAction, beatIndex: number}>;
  /**
   * 各拍ごとのアクションが成功したか失敗したか確定したタイミングでemitされます
   * プレイヤーのクリック起因、時間経過起因で発生
   */
  readonly onBeatActionStatusFixed: g.Trigger<{status: BeatActionStatus}>;
  /**
   * 曲が始まる前のカウントの拍を打ったときに発火
   */
  readonly onCount: g.Trigger<{isLast: boolean}>;
  readonly onLastSomeMeasures: g.Trigger<{age: number}>;
  /**
   * ※ BB: 1拍の長さ
   *              |    0.25 BB   |        0.25 BB      |
   *              |       |0.15BB|   0.15 BB |        |
   *   miss       | good  |    great         |  good  |  miss
   *              |       |      |           |        |
   * ----------------------------B-----------------------------
   *                           (↑Beat)
   */
  private GREAT_MARGIN_FW = 0.15;
  private GREAT_MARGIN_BW = 0.15;
  private GOOD_MARGIN_FW = 0.3;
  private GOOD_MARGIN_BW = 0.3;
  private score: Score;
  private loop: boolean;
  private timeline: Timeline;
  private agePerBeat: number;
  private beat: number;
  private currentTimelineIndex: number;
  private timingOffset: number = 0;
  private playingMusicAssetId: string;

  constructor(params: {
    scene: g.Scene;
    score: Score;
    loop?: boolean;
  }) {
    super({
      scene: params.scene,
      width: params.scene.game.width,
      height: params.scene.game.height,
      local: true
    });
    this.score = params.score;
    this.loop = !!params.loop;
    this.onBeat = new g.Trigger<{action: BeatAction, beatIndex: number}>();
    this.onBeatActionStatusFixed = new g.Trigger<{status: BeatActionStatus}>();
    this.onCount = new g.Trigger();
    this.onLastSomeMeasures = new g.Trigger();
    this.update.add(this.onUpdate.bind(this));
  }

  setTimingOffset(timingOffset: number) {
    this.timingOffset = timingOffset;
  }

  start() {
    this.initializeTimeline(this.score, this.scene.game.age + 60);
    this.currentTimelineIndex = -1;
    // console.log('timeline', this.timeline);
  }

  stop() {
    this.timeline = null;
    if (typeof this.playingMusicAssetId === 'string') {
      Util.stopAudio(this.scene, this.playingMusicAssetId);
    }
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
      if (this.scene.game.age + this.timingOffset - this.timeline[this.currentTimelineIndex].age > this.agePerBeat * this.GOOD_MARGIN_FW) {
        // console.log('超過 failed', this.currentTimelineIndex);
        this.timeline[this.currentTimelineIndex].beatActionStatus = BeatActionStatus.Fail;
        this.onBeatActionStatusFixed.fire({status: this.timeline[this.currentTimelineIndex].beatActionStatus});
      }
    }

    // 次のタイムラインの時刻を過ぎていたら、
    if (this.timeline[this.currentTimelineIndex + 1] && this.timeline[this.currentTimelineIndex + 1].age < this.scene.game.age) {
      // タイムラインを進める
      this.currentTimelineIndex++;
      this.beatExec(this.currentTimelineIndex);
    }

    // loop設定がオンで、次のタイムラインがないかつ1拍分時間が経っていたら
    if (this.loop && !this.timeline[this.currentTimelineIndex + 1] && this.timeline[this.currentTimelineIndex].age + this.agePerBeat < this.scene.game.age) {
      // リセット
      this.currentTimelineIndex = 0;
      this.timeline.forEach((v, index) => {
        v.beatActionStatus = BeatActionStatus.Waiting;
        v.age = this.scene.game.age + this.agePerBeat * index;
      });
      // このタイミングがループ後の1拍目なのでここでも beat時の処理を実行
      this.beatExec(this.currentTimelineIndex);
      // console.log('reset', this.timeline);
    }
  }

  /**
   * 確定した結果の beatIndex(小節中の何拍目か) と timingGap を返します
   */
  action(action: UserAction, fixDelay: number = 0): {beatIndex: number, status: BeatActionStatus, timingGap: number} | null {
    // console.log(g.game.age, 'action', action, fixDelay);
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

    const isSlideDownExpected = this.timeline[nearestIndex - 2] && this.timeline[nearestIndex - 2].beatAction === BeatAction.PiPyako;
    const isSlideUpExpected = this.timeline[nearestIndex - 3] && this.timeline[nearestIndex - 3].beatAction === BeatAction.PiPyako;
    let timingGap: number = null;
    if (
      // SlideDown であるべきだが間違い
      isSlideDownExpected && action !== UserAction.SlideDown ||
      // SlideUp であるべきだが間違い
      isSlideUpExpected && action !== UserAction.SlideUp ||
      // それ以外(Click)であるべきだが間違い
      !isSlideDownExpected && !isSlideUpExpected && action !== UserAction.Click
    ) {
      // console.log('miss');
      this.timeline[nearestIndex].beatActionStatus = BeatActionStatus.Fail;
    } else {
      timingGap = this.scene.game.age + this.timingOffset - this.timeline[nearestIndex].age - fixDelay;
      // console.log('gap', `${this.scene.game.age} + ${this.timingOffset} - ${this.timeline[nearestIndex].age} - ${fixDelay}`, timingGap);
      const status = (timingGap < 0 ? -this.agePerBeat * this.GREAT_MARGIN_BW < timingGap : timingGap < this.agePerBeat * this.GREAT_MARGIN_FW)
        ? BeatActionStatus.Great
        : (timingGap < 0 ? -this.agePerBeat * this.GOOD_MARGIN_BW < timingGap : timingGap < this.agePerBeat * this.GOOD_MARGIN_FW)
          ? BeatActionStatus.Good
          : BeatActionStatus.Waiting;
      if (status === BeatActionStatus.Waiting) {
        return null;
      }
      this.timeline[nearestIndex].beatActionStatus = status;
    }

    this.onBeatActionStatusFixed.fire({status: this.timeline[nearestIndex].beatActionStatus});
    // console.log('onBeatActionStatusFixed', nearestIndex, action, this.timeline[nearestIndex].beatActionStatus);
    return {
      beatIndex: nearestIndex % 4,
      status: this.timeline[nearestIndex].beatActionStatus,
      timingGap: timingGap
    };
  }

  getStates() {
    return this.timeline.map(v => v.beatActionStatus);
  }

  private beatExec(timelineIndex: number) {
    // console.log(g.game.age, 'beatExec called');
    // システムアクションがあれば実行
    if (this.timeline[timelineIndex].systemAction) {
      this.timeline[timelineIndex].systemAction();
    }
    this.onBeat.fire({
      action: this.timeline[timelineIndex].beatAction,
      beatIndex: timelineIndex % this.beat
    });
    // console.log(g.game.age, 'beat!', timelineIndex, this.timeline[timelineIndex]);
  }

  private initializeTimeline(score: Score, startAge: number) {
    const timeline: Timeline = [];
    this.agePerBeat = 60 / score.bpm * this.scene.game.fps;
    this.beat = score.beat;
    score.fragments.forEach((fragment, fi) => {
      fragment.beatAction.forEach((beatAction, bi) => {
        timeline.push({
          age: startAge + this.agePerBeat * (fi * score.beat + bi),
          beatAction: beatAction,
          beatActionStatus: BeatActionStatus.Waiting,
          systemAction: () => {
            if (bi === 0) {
              // console.log('playAudio', g.game.age, fragment.assetId);
              Util.playAudio(this.scene, fragment.assetId);
              this.playingMusicAssetId = fragment.assetId;
            }
            if (beatAction === BeatAction.Count) {
              Util.playAudio(this.scene, 'pi');
              this.onCount.fire({isLast: false});
            }
            if (beatAction === BeatAction.LastCount) {
              Util.playAudio(this.scene, 'pi');
              this.onCount.fire({isLast: true});
            }
            if (beatAction === BeatAction.PiPyako) {
              Util.playAudio(this.scene, 'numa_head');
            }
            if (fi === score.fragments.length - 3 && bi === 0) {
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
