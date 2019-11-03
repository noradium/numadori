// import {GameMode, GameResult, GameSubScene} from './GameSubScene';
import {SubScene} from './SubScene';
// import {TitleSubScene} from './TitleSubScene';
import {GameParameters, LaunchType, SessionParameters} from '../util/GameParameters';
// import {GameOverSubScene} from './GameOverSubScene';
import {GameResult, GameSubScene} from './GameSubScene';
import {TitleSubScene} from './TitleSubScene';
import {WaitingRoomSubScene} from './WaitingRoomSubScene';
import {PlayerJoiningManager} from '../component/PlayerJoiningManager';
import {ResultSubScene} from './ResultSubScene';
import {BeatActionStatus} from '../component/GameManager';
import {Util} from '../util/Util';

export class MainScene extends g.Scene {
  private currentSubScene: SubScene;
  private titleSubScene: TitleSubScene;
  private gameSubScene: GameSubScene;
  private waitingRoomSubScene: WaitingRoomSubScene;
  private resultSubScene: ResultSubScene;
  private gameParameters: SessionParameters;
  private playerJoiningManager: PlayerJoiningManager;

  constructor(params: g.SceneParameterObject) {
    super(params);
    this.playerJoiningManager = new PlayerJoiningManager(this);
    this.loaded.add(() => this._onLoad());
  }

  private _onLoad() {
    if (this.playerJoiningManager.isGameMaster()) {
      this.playerJoiningManager.getGameMasterUserInfo();
    }

    g.game.vars.gameState = { score: 0 };

    // loaded完了後、OperationEventを処理するため1 tick遅延させる
    this.update.addOnce(() => {
      // console.log("scene.update: parameters:" + parameters + ".");
      if (this.gameParameters) {
        GameParameters.init(this.gameParameters);
      } else {
        GameParameters.init({});
      }
      this._onInitialUpdate();
      return true;
    });

    this.message.add((e: g.MessageEvent): boolean => {
      // console.log("scene.message: e:" + JSON.stringify(e) + ".");
      if (e.data.type === 'start') {
        this.gameParameters = e.data.parameters;
      }
      return true;
    });
  }

  private _onInitialUpdate() {
    if (GameParameters.launchType !== LaunchType.RANKING) {
      // ランキング以外のとき背景設定
      const background = new g.FilledRect({
        scene: this,
        cssColor: '#ffffff',
        width: this.game.width,
        height: this.game.height
      });
      this.append(background);
    }
    this.titleSubScene = new TitleSubScene(this);
    this.titleSubScene.init();
    this.titleSubScene.onTitleSceneEnd.add(() => this.onTitleSceneEnd());
    this.append(this.titleSubScene);

    this.waitingRoomSubScene = new WaitingRoomSubScene(this, this.playerJoiningManager);
    this.waitingRoomSubScene.init();
    this.waitingRoomSubScene.onSceneEnd.add(() => this.onWaitingRoomSceneEnd());
    this.append(this.waitingRoomSubScene);

    this.gameSubScene = new GameSubScene(this, this.playerJoiningManager);
    this.gameSubScene.init();
    this.gameSubScene.onGameEnd.add(event => this.onGameEnd(event));
    this.append(this.gameSubScene);

    this.resultSubScene = new ResultSubScene(this, this.playerJoiningManager);
    this.resultSubScene.init();
    this.append(this.resultSubScene);

    this.playerJoiningManager.join();
    this.resultSubScene.setResult([
      // BeatActionStatus.Waiting,
      // BeatActionStatus.Waiting,
      // BeatActionStatus.Great,
      // BeatActionStatus.Good,
      // BeatActionStatus.Good,
      // BeatActionStatus.Good,
      // BeatActionStatus.Great,
      BeatActionStatus.Good,
      BeatActionStatus.Good,
      BeatActionStatus.Fail,
      BeatActionStatus.Fail,
      BeatActionStatus.Fail,
      BeatActionStatus.Fail,
      BeatActionStatus.Fail,
      BeatActionStatus.Fail,
      BeatActionStatus.Great,
      BeatActionStatus.Great,
      BeatActionStatus.Great,
      BeatActionStatus.Great
    ]);
    this.changeSubscene(this.resultSubScene);
    // this.changeSubscene(this.gameSubScene);
    // this.changeSubscene(this.titleSubScene);
    // this.changeSubscene(this.waitingRoomSubScene);

    if (Util.isAtsumaruEnv()) {
      this.changeSubscene(this.titleSubScene);
    }

    this.playerJoiningManager.onPlayerJoin.addOnce(() => {
      // this.changeSubscene(this.titleSubScene);
    });

    this.update.add(() => {
      return this.onUpdate(this);
    });
  }

  private onUpdate(scene: g.Scene) {
    this.currentSubScene && this.currentSubScene.onUpdate();
    return false;
  }

  /**
   * currentSubsceneをワイプなしで変更する
   */
  private changeSubscene(_next: SubScene): void {
    if (this.currentSubScene) {
      this.currentSubScene.stopContent();
      this.currentSubScene.hideContent();
    }
    this.currentSubScene = _next;
    this.currentSubScene.showContent();
    this.currentSubScene.startContent();
  }

  private onGameEnd(event: GameResult) {
    this.resultSubScene.setResult(event.states);
    this.changeSubscene(this.resultSubScene);
  }

  private onTitleSceneEnd() {
    this.changeSubscene(this.waitingRoomSubScene);
  }

  private onWaitingRoomSceneEnd() {
    this.gameSubScene.initPlayers();
    this.changeSubscene(this.gameSubScene);
  }

  // private onBackToTitleRequested() {
  //   this.changeSubscene(this.titleSubScene);
  // }
}
