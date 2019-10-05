import {SubScene} from './SubScene';
import {Player} from '../component/Player';
import {BeatActionStatus, GameManager, UserAction} from '../component/GameManager';
import {GestureHandler} from '../component/GestureHandler';
import {PlayerJoiningManager} from '../component/PlayerJoiningManager';
import {Messenger} from '../component/Messenger';

export interface GameResult {
  score: number;
}

export class GameSubScene extends SubScene {
  private players: {[playerId: string]: Player} = {};
  private manager: GameManager;
  private actionResultLabel: g.Label;
  private gestureHandler: GestureHandler;
  private messenger: Messenger;

  constructor(_scene: g.Scene, private playerJoiningManager: PlayerJoiningManager) {
    super(_scene);
    this.messenger = new Messenger(_scene);
  }

  init() {
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
    this.append(this.manager);
    this.append(this.actionResultLabel);
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
    this.manager.onLastCount.add(() => {
      Object.keys(this.players).forEach(k => {
        this.players[k].setStep4();
      });
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
        y: 100
      });
      this.players[p.id] = player;
      this.append(player);
    });
  }

  showContent() {
    Object.keys(this.players).forEach(k => {
      this.players[k].show();
    });
    this.manager.show();
    this.gestureHandler.show();
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
    Object.keys(this.players).forEach(k => {
      this.players[k].hide();
    });
    this.manager.hide();
    this.gestureHandler.hide();
  }
}
