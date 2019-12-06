import {SubScene} from './SubScene';
import {Player} from '../component/Player';
import {BeatActionStatus, GameManager, UserAction} from '../component/GameManager';
import {GestureHandler} from '../component/GestureHandler';
import {PlayerJoiningManager} from '../component/PlayerJoiningManager';
import {Messenger} from '../component/Messenger';
import {Timeline} from '@akashic-extension/akashic-timeline';
import {GameBackground} from '../component/GameBackground';
import {BeatAction} from '../score/BeatAction';
import {Util} from '../util/Util';
import NonbiriTouringScore from '../score/NonbiriTouringScore';

export interface GameResult {
  states: BeatActionStatus[];
}

export class GameSubScene extends SubScene {
  readonly onGameEnd: g.Trigger<GameResult> = new g.Trigger<GameResult>();
  private players: {[playerId: string]: Player} = {};
  private manager: GameManager;
  private background: GameBackground;
  private playersLayer: g.E;
  private gestureHandler: GestureHandler;
  private messenger: Messenger;
  private timeline: Timeline;
  private fadeOutOverlay: g.FilledRect;
  private companionPlayers: Player[] = [];
  private companionPlayersLayer: g.E;

  constructor(_scene: g.Scene, private playerJoiningManager: PlayerJoiningManager) {
    super(_scene);
    this.messenger = new Messenger(_scene);
  }

  init() {
    this.timeline = new Timeline(this.scene);
    this.manager = new GameManager({
      scene: this.scene,
      score: NonbiriTouringScore
    });
    this.background = new GameBackground({
      scene: this.scene
    });
    this.playersLayer = new g.E({
      scene: this.scene
    });
    this.companionPlayersLayer = new g.E({
      scene: this.scene
    });
    this.gestureHandler = new GestureHandler({
      scene: this.scene
    });
    this.gestureHandler.onTap.add(event => {
      // gestureHandler は local
      const result = this.manager.action(UserAction.Click, event.fixDelay);
      this.messenger.send('tap', {playerId: g.game.selfId, beatIndex: result ? result.beatIndex : 0});
    });
    this.gestureHandler.onTapUp.add(() => {
      // local
      this.messenger.send('tapUp', {playerId: g.game.selfId});
    });
    this.gestureHandler.onSlideDown.add(event => {
      // local
      this.manager.action(UserAction.SlideDown, event.fixDelay);
      this.messenger.send('slideDown', {playerId: g.game.selfId});
    });
    this.gestureHandler.onSlideUp.add(() => {
      // local
      this.manager.action(UserAction.SlideUp);
      this.messenger.send('slideUp', {playerId: g.game.selfId});
    });
    this.fadeOutOverlay = new g.FilledRect({
      scene: this.scene,
      cssColor: '#000000',
      width: this.scene.game.width,
      height: this.scene.game.height,
      opacity: 0
    });
    this.append(this.background);
    this.append(this.manager);
    this.append(this.companionPlayersLayer);
    this.append(this.playersLayer);
    // this.append(this.actionResultLabel);
    this.append(this.fadeOutOverlay);
    this.append(this.gestureHandler);
    this.hideContent();
    this.messenger.onReceive('tap', (event) => {
      const targetPlayer = this.players[event.playerId];
      if (!targetPlayer) {
        return;
      }
      switch (event.beatIndex) {
        case 0:
        case 2:
          targetPlayer.setStep1();
          break;
        case 1:
        case 3:
          targetPlayer.setStep3();
          break;
      }
    });
    this.messenger.onReceive('tapUp', (event) => {
      const targetPlayer = this.players[event.playerId];
      if (!targetPlayer) {
        return;
      }

      switch (targetPlayer.currentStep) {
        case 1:
          targetPlayer.setStep2();
          break;
        case 3:
          targetPlayer.setStep4();
          break;
      }
    });
    this.messenger.onReceive('slideDown', (event) => {
      const targetPlayer = this.players[event.playerId];
      if (!targetPlayer) {
        return;
      }
      targetPlayer.setTame();
    });
    this.messenger.onReceive('slideUp', (event) => {
      const targetPlayer = this.players[event.playerId];
      if (!targetPlayer) {
        return;
      }
      targetPlayer.setJump();
    });
    this.manager.onCount.add((event) => {
      if (event.isLast) {
        Object.keys(this.players).forEach(k => {
          this.players[k].setStep4();
        });
        this.companionPlayers.forEach(p => p.setStep4());
      } else {
        Object.keys(this.players).forEach(k => {
          this.players[k].actionCount();
        });
        this.companionPlayers.forEach(p => p.actionCount());
      }
    });
    this.manager.onBeatActionStatusFixed.add(event => {
      // local
      const myPlayer = this.players[this.scene.game.selfId];
      if (!myPlayer) {
        return;
      }
      // console.log('onBeatActionStatusFixed', event);
      switch (event.status) {
        case BeatActionStatus.Great:
          myPlayer.showFeedbackLabel('great');
          break;
        case BeatActionStatus.Good:
          myPlayer.showFeedbackLabel('good');
          break;
        case BeatActionStatus.Fail:
          myPlayer.showFeedbackLabel('fail');
          if (this.companionPlayers.length) {
            this.companionPlayers.forEach(p => p.showMukaIcon());
          }
          this.messenger.send('miss', {playerId: g.game.selfId});
          break;
      }
    });
    this.manager.onLastSomeMeasures.add(event => {
      this.timeline.create(this.fadeOutOverlay, {modified: this.fadeOutOverlay.modified, destroyed: this.fadeOutOverlay.destroyed})
        // 残り時間の 2/3 で完全に暗転
        .to({opacity: 1}, 1000 * event.age * (2 / 3) / g.game.fps)
        .wait(4000)
        .call(() => {
          this.onGameEnd.fire({
            states: this.manager.getStates()
          });
        });
    });
    this.manager.onBeat.add(event => {
      // beat
      this.background.step(this.calculateStep(event.expectedAction));
      this.updateCompanionPlayers(event.expectedAction, event.beatIndex);
    });
    this.messenger.onReceive('miss', (event) => {
      const targetPlayer = this.players[event.playerId];
      if (!targetPlayer) {
        return;
      }
      targetPlayer.setMiss();
    });
  }

  setTimingOffset(timingOffset: number) {
    // console.log('setTimingOffset', timingOffset);
    this.manager.setTimingOffset(timingOffset);
  }

  initPlayers() {
    if (Util.isAtsumaruEnv()) {
      [
        {x: 100, y: 100, enableMukaIcon: false},
        {x: 200, y: 100, enableMukaIcon: false},
        {x: 400, y: 100, enableMukaIcon: true}
      ].forEach((params, index) => {
        const p = new Player({
          scene: this.scene,
          id: `companion-${index}`,
          x: params.x,
          y: params.y,
          disableSound: true,
          enableMukaIcon: params.enableMukaIcon
        });
        this.companionPlayers.push(p);
        this.companionPlayersLayer.append(p);
      });
      const player = new Player({
        scene: this.scene,
        id: this.scene.game.selfId,
        x: 300,
        y: 100,
        isMe: true
      });
      this.players[this.scene.game.selfId] = player;
      this.playersLayer.append(player);
    } else {
      let me: Player = null;
      this.playerJoiningManager.players.forEach((p, index) => {
        const x = this.scene.game.random.get(20, this.scene.game.width - 120);
        const y = this.scene.game.random.get(40, this.scene.game.height - 200);
        const isMe = p.id === this.scene.game.selfId;
        const player = new Player({
          scene: this.scene,
          id: p.id,
          name: p.userName,
          x,
          y,
          isMe,
          disableSound: !isMe
        });
        this.players[p.id] = player;
        if (isMe) {
          // 最前面にするためあとでappend
          me = player;
        } else {
          this.playersLayer.append(player);
        }
      });
      if (me) {
        this.playersLayer.append(me);
      }
    }
  }

  showContent() {
    this.background.show();
    this.playersLayer.show();
    this.manager.show();
    this.gestureHandler.show();
    this.fadeOutOverlay.show();
    this.companionPlayersLayer.show();
  }

  startContent() {
    this.manager.start();
  }

  onUpdate() {
    //
  }

  stopContent() {
    this.fadeOutOverlay.opacity = 0;
    this.companionPlayers.forEach(child => {
      this.companionPlayersLayer.remove(child);
    });
    this.companionPlayers = [];
    Object.keys(this.players).forEach(k => {
      this.playersLayer.remove(this.players[k]);
    });
    this.players = {};
  }

  hideContent() {
    this.background.hide();
    this.playersLayer.hide();
    this.manager.hide();
    this.gestureHandler.hide();
    this.fadeOutOverlay.hide();
    this.companionPlayersLayer.hide();
  }

  private calculateStep(action: UserAction | null) {
    switch (action) {
      case UserAction.Click:
        return 8;
      case UserAction.SlideDown:
        return 2;
      case UserAction.SlideUp:
        return 24;
      default:
        return 0;
    }
  }

  private updateCompanionPlayers(action: UserAction | null, beatIndex: number) {
    switch (action) {
      case UserAction.Click:
        this.companionPlayers.forEach(p => {
          switch (beatIndex) {
            case 0:
            case 2:
              p.setStep1();
              this.scene.setTimeout(() => p.setStep2(), 150);
              break;
            case 1:
            case 3:
              p.setStep3();
              this.scene.setTimeout(() => p.setStep4(), 150);
              break;
          }
        });
        break;
      case UserAction.SlideDown:
        this.companionPlayers.forEach(p => p.setTame());
        break;
      case UserAction.SlideUp:
        this.companionPlayers.forEach(p => p.setJump());
        break;
    }
  }
}
