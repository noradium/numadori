import {SubScene} from './SubScene';
import {Util} from '../util/Util';
import {TeachingTap} from '../component/TeachingTap';
import {TeachingSlide} from '../component/TeachingSlide';
import {Timeline} from '@akashic-extension/akashic-timeline';
import {RoundedFilledRect} from '../component/RoundedFilledRect';
import {PlayerJoiningManager} from '../component/PlayerJoiningManager';
import {JoinButton} from '../component/JoinButton';
import {StopJoinButton} from '../component/StopJoinButton';
import {Messenger} from '../component/Messenger';
import {MediumBlack64pxLabel} from '../component/Label';
import {StartButton} from '../component/StartButton';
import {GameManager} from '../component/GameManager';
import TutorialScore from '../score/TutorialScore';
import {BeatAction} from '../score/BeatAction';

export class WaitingRoomSubScene extends SubScene {
  readonly onSceneEnd = new g.Trigger<void>();
  private titleLabel: g.Label;
  private playerNumLabel: g.Label;
  private playerNumValueLabel: g.Label;
  private titleEndTimer: g.TimerIdentifier;
  private teachingTap: TeachingTap;
  private teachingSlide: TeachingSlide;
  private teachingBackground: RoundedFilledRect;
  private joinButton: JoinButton;
  private stopJoinButton: StopJoinButton;
  private atsumaruStartButton: StartButton;
  private messenger: Messenger;
  private timeline: Timeline;
  private manager: GameManager;

  constructor(_scene: g.Scene, private playerJoiningManager: PlayerJoiningManager) {
    super(_scene);
    this.messenger = new Messenger(_scene);
  }

  init() {
    this.manager = new GameManager({
      scene: this.scene,
      score: TutorialScore,
      loop: true
    });
    this.titleLabel = new MediumBlack64pxLabel({
      scene: this.scene,
      text: '鳥の行進',
      fontSize: 30
    });
    this.titleLabel.x = 5;
    this.titleLabel.y = 5;
    this.append(this.titleLabel);

    this.playerNumLabel = new MediumBlack64pxLabel({
      scene: this.scene,
      text: '参加人数      人',
      fontSize: 30
    });
    this.playerNumLabel.x = g.game.width - this.playerNumLabel.width - 5;
    this.playerNumLabel.y = 5;
    this.append(this.playerNumLabel);

    this.playerNumValueLabel = new MediumBlack64pxLabel({
      scene: this.scene,
      text: '0',
      fontSize: 30
    });
    this.playerNumValueLabel.x = g.game.width - 75 - this.playerNumValueLabel.width / 2;
    this.playerNumValueLabel.y = this.playerNumLabel.y;
    this.append(this.playerNumValueLabel);

    this.teachingBackground = new RoundedFilledRect({
      scene: this.scene,
      width: 360,
      height: 300,
      x: 20,
      y: 50,
      borderRadius: 20,
      cssColor: '#f0fbff',
      circleAssetId: 'lightblue_circle_32',
      circleAssetSize: 32
    });
    this.append(this.teachingBackground);

    this.teachingTap = new TeachingTap({
      scene: this.scene
    });
    this.teachingSlide = new TeachingSlide({
      scene: this.scene
    });
    this.teachingTap.x = 50;
    this.teachingTap.y = 50;
    this.teachingSlide.x = 220;
    this.teachingSlide.y = 50;
    this.append(this.teachingTap);
    this.append(this.teachingSlide);

    this.stopJoinButton = new StopJoinButton({
      scene: this.scene
    });
    this.stopJoinButton.x = this.scene.game.width - this.stopJoinButton.width - 20;
    this.stopJoinButton.y = this.scene.game.height - this.stopJoinButton.height - 20;
    this.stopJoinButton.pointUp.add(() => {
      // only game master fire
      console.log('stop join', this.playerJoiningManager.players);
      this.messenger.send('gameStart', null);
    });
    this.append(this.stopJoinButton);

    this.joinButton = new JoinButton({
      scene: this.scene
    });
    this.joinButton.x = this.scene.game.width - this.joinButton.width - 20;
    this.joinButton.y = this.scene.game.height - this.joinButton.height - 20;
    this.joinButton.pointUp.add(() => {
      if (this.playerJoiningManager.isJoined()) {
        return;
      }
      this.playerJoiningManager.join();
      this.joinButton.setJoined();
    });
    this.append(this.joinButton);

    this.atsumaruStartButton = new StartButton({
      scene: this.scene
    });
    this.atsumaruStartButton.x = this.scene.game.width - this.atsumaruStartButton.width - 20;
    this.atsumaruStartButton.y = this.scene.game.height - this.atsumaruStartButton.height - 20;
    this.atsumaruStartButton.pointUp.add(() => {
      this.onSceneEnd.fire();
    });
    this.append(this.atsumaruStartButton);

    this.hideContent();

    this.messenger.onReceive('gameStart', () => {
      this.onSceneEnd.fire();
    });

    let pipyakoCount = 0;
    this.manager.onBeat.add(event => {
      if (pipyakoCount > 0) {
        pipyakoCount++;
      }
      if (event.action === BeatAction.PiPyako) {
        pipyakoCount = 1;
        // tap
        this.teachingTap.opacity = 1;
        this.teachingSlide.opacity = 0.3;
        this.teachingTap.modified();
        this.teachingSlide.modified();
        this.teachingTap.action(event.beatIndex);
        return;
      }

      if (pipyakoCount === 3) {
        // しゃがみ
        this.teachingTap.opacity = 0.3;
        this.teachingSlide.opacity = 1;
        this.teachingTap.modified();
        this.teachingSlide.modified();
        this.teachingSlide.slideDown();
        return;
      }
      if (pipyakoCount === 4) {
        pipyakoCount = 0;
        // ジャンプ
        this.teachingSlide.slideUp();
        return;
      }
      if (event.action === BeatAction.Normal) {
        // tap
        this.teachingTap.opacity = 1;
        this.teachingSlide.opacity = 0.3;
        this.teachingTap.modified();
        this.teachingSlide.modified();
        this.teachingTap.action(event.beatIndex);
      }
      // not reached
    });
  }

  showContent() {
    this.titleLabel.show();
    if (!Util.isAtsumaruEnv()) {
      this.playerNumLabel.show();
      this.playerNumValueLabel.show();
    }
    this.teachingTap.show();
    this.teachingSlide.show();
    this.teachingBackground.show();

    if (Util.isAtsumaruEnv()) {
      this.atsumaruStartButton.show();
    } else {
      if (this.playerJoiningManager.isGameMaster()) {
        this.stopJoinButton.show();
      } else {
        this.joinButton.show();
      }
    }
  }

  startContent() {
    this.playerNumValueLabel.text = `${this.playerJoiningManager.players.length}`;
    this.playerNumValueLabel.invalidate();

    this.playerJoiningManager.onPlayerJoin.add(event => {
      console.log('onPlayerJoin', event.player, this.playerJoiningManager.players);
      this.playerNumValueLabel.text = `${this.playerJoiningManager.players.length}`;
      this.playerNumValueLabel.invalidate();
    });

    this.timeline = new Timeline(this.scene);
    this.timeline.create(this.scene)
      .wait(1000)
      .call(() => {
        this.teachingTap.show();
        this.teachingTap.startAnimation();
        Util.playAudio(this.scene, 'peta1');
        this.manager.start();
      })
      .wait(3000)
      .call(() => {
        this.teachingSlide.show();
        this.teachingSlide.startAnimation();
        Util.playAudio(this.scene, 'peta1');
      })
      .wait(5000);
  }

  onUpdate() {
    //
  }

  stopContent() {
    if (this.titleEndTimer && !this.titleEndTimer.destroyed()) {
      this.titleEndTimer.destroy();
      this.titleEndTimer = null;
    }
    this.timeline.clear();
  }

  hideContent() {
    this.titleLabel.hide();
    this.playerNumLabel.hide();
    this.playerNumValueLabel.hide();
    this.teachingTap.hide();
    this.teachingSlide.hide();
    this.teachingBackground.hide();
    this.joinButton.hide();
    this.stopJoinButton.hide();
    this.atsumaruStartButton.hide();
  }
}
