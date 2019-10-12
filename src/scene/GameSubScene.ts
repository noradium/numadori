import {SubScene} from './SubScene';
import {Player} from '../component/Player';
import {BeatActionStatus, GameManager, UserAction} from '../component/GameManager';
import {GestureHandler} from '../component/GestureHandler';
import {PlayerJoiningManager} from '../component/PlayerJoiningManager';
import {Messenger} from '../component/Messenger';
import {Timeline} from '@akashic-extension/akashic-timeline';
import {GameBackground} from '../component/GameBackground';
import {BeatAction} from '../score/BeatAction';

export interface GameResult {
  states: BeatActionStatus[];
}

export class GameSubScene extends SubScene {
  readonly onGameEnd: g.Trigger<GameResult> = new g.Trigger<GameResult>();
  private players: {[playerId: string]: Player} = {};
  private manager: GameManager;
  private actionResultLabel: g.Label;
  private background: GameBackground;
  private playersLayer: g.E;
  private gestureHandler: GestureHandler;
  private messenger: Messenger;
  private timeline: Timeline;
  private fadeOutOverlay: g.FilledRect;
  private pipyakoCount = 0;

  constructor(_scene: g.Scene, private playerJoiningManager: PlayerJoiningManager) {
    super(_scene);
    this.messenger = new Messenger(_scene);
  }

  init() {
    this.timeline = new Timeline(this.scene);
    this.manager = new GameManager({
      scene: this.scene
    });
    this.actionResultLabel = new g.Label({
      scene: this.scene,
      text: '',
      font: new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.Serif,
        size: 15
      }),
      fontSize: 30
    });
    this.background = new GameBackground({
      scene: this.scene
    });
    this.playersLayer = new g.E({
      scene: this.scene
    });
    this.gestureHandler = new GestureHandler({
      scene: this.scene
    });
    this.gestureHandler.onTap.add(() => {
      // gestureHandler は local
      const beatIndex = this.manager.action(UserAction.Click);
      this.messenger.send('tap', {playerId: g.game.selfId, beatIndex});
    });
    this.gestureHandler.onTapUp.add(() => {
      // local
      this.messenger.send('tapUp', {playerId: g.game.selfId});
    });
    this.gestureHandler.onSlideDown.add(() => {
      // local
      this.manager.action(UserAction.SlideDown);
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
      } else {
        Object.keys(this.players).forEach(k => {
          this.players[k].actionCount();
        });
      }
    });
    this.manager.onBeatActionStatusFixed.add(event => {
      // local
      // console.log('onBeatActionStatusFixed', event);
      switch (event.status) {
        case BeatActionStatus.Great:
          this.actionResultLabel.text = 'Great!!';
          break;
        case BeatActionStatus.Good:
          this.actionResultLabel.text = 'Good!';
          break;
        case BeatActionStatus.Fail:
          this.messenger.send('miss', {playerId: g.game.selfId});
          this.actionResultLabel.text = 'Fail';
          break;
      }
      this.actionResultLabel.invalidate();
    });
    this.manager.onLastSomeMeasures.add(event => {
      this.timeline.create(this.fadeOutOverlay, {modified: this.fadeOutOverlay.modified, destroyed: this.fadeOutOverlay.destroyed})
        .to({opacity: 1}, 1000 * event.age / g.game.fps)
        .wait(1500)
        .call(() => {
          this.onGameEnd.fire({
            states: this.manager.getStates()
          });
        });
    });
    this.manager.onBeat.add(event => {
      // beat
      this.background.step(this.calculateStep(event.action));
    });
    this.messenger.onReceive('miss', (event) => {
      const targetPlayer = this.players[event.playerId];
      if (!targetPlayer) {
        return;
      }
      targetPlayer.setMiss();
    });
  }

  initPlayers() {
    this.playerJoiningManager.players.forEach((p, index) => {
      const player = new Player({
        scene: this.scene,
        id: p.id,
        name: p.userName,
        x: 100 + index * 100,
        y: 100,
        isMe: p.id === this.scene.game.selfId
      });
      this.players[p.id] = player;
      this.playersLayer.append(player);
    });
  }

  showContent() {
    this.background.show();
    this.playersLayer.show();
    this.manager.show();
    this.gestureHandler.show();
    this.fadeOutOverlay.show();
  }

  startContent() {
    this.manager.start();
  }

  onUpdate() {
    //
  }

  stopContent() {
    //
  }

  hideContent() {
    this.background.hide();
    this.playersLayer.hide();
    this.manager.hide();
    this.gestureHandler.hide();
    this.fadeOutOverlay.hide();
  }

  private calculateStep(beatAction: BeatAction) {
    if (this.pipyakoCount > 0) {
      this.pipyakoCount++;
    }
    if (beatAction === BeatAction.PiPyako) {
      this.pipyakoCount = 1;
      return 8;
    }

    if (this.pipyakoCount === 3) {
      return 2;
    }
    if (this.pipyakoCount === 4) {
      this.pipyakoCount = 0;
      return 24;
    }
    if (beatAction === BeatAction.Normal) {
      return 8;
    }
    return 0;
  }
}
