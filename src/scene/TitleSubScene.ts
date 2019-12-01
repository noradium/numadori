import {SubScene} from './SubScene';
import {Util} from '../util/Util';
import {BoldWhite128pxLabel} from '../component/Label';
import {GameBackground} from '../component/GameBackground';
import {Player} from '../component/Player';

export class TitleSubScene extends SubScene {
  readonly onTitleSceneEnd = new g.Trigger<void>();
  private background: GameBackground;
  private titleLabel: g.Label;
  private titleEndTimer: g.TimerIdentifier;
  private players: g.E;

  constructor(_scene: g.Scene) {
    super(_scene);
  }

  init() {
    this.background = new GameBackground({
      scene: this.scene
    });
    this.append(this.background);
    this.players = new g.E({
      scene: this.scene
    });
    this.append(this.players);
    this.titleLabel = new BoldWhite128pxLabel({
      scene: this.scene,
      text: '鳥の行進',
      fontSize: 60
    });
    this.titleLabel.x = (this.scene.game.width - this.titleLabel.width) / 2;
    this.titleLabel.y = (this.scene.game.height - this.titleLabel.height) / 2;
    this.append(this.titleLabel);

    [
      {x: 40, y: 50, customize: (p: Player) => p.setStep3()},
      {x: 150, y: 20, customize: (p: Player) => p.setStep2()},
      {x: 260, y: 70, customize: (p: Player) => p.setStep1()},
      {x: 500, y: 80, customize: (p: Player) => p.setJump()},
      {x: 50, y: 180, customize: (p: Player) => p.setStep1()},
      {x: 120, y: 170, customize: (p: Player) => p.setStep1()},
      {x: 360, y: 160, customize: (p: Player) => p.setStep3()},
      {x: 570, y: 150, customize: (p: Player) => p.setStep1()}
    ].forEach(params => {
      const player = new Player({
        scene: this.scene,
        disableSound: true,
        withoutAnimation: true,
        x: params.x,
        y: params.y
      });
      params.customize(player);
      this.players.append(player);
    });

    this.hideContent();
  }

  showContent() {
    this.background.show();
    this.players.show();
    this.titleLabel.show();
  }

  startContent() {
    this.scene.setTimeout(() => {
      Util.playAudio(this.scene, 'opening');
      this.titleEndTimer = this.scene.setTimeout(() => {
        this.titleEndTimer = null;
        this.onTitleSceneEnd.fire();
      }, 6500);
    }, 1000);
  }

  onUpdate() {
    //
  }

  stopContent() {
    if (this.titleEndTimer && !this.titleEndTimer.destroyed()) {
      this.titleEndTimer.destroy();
      this.titleEndTimer = null;
    }
  }

  hideContent() {
    this.background.hide();
    this.players.hide();
    this.titleLabel.hide();
  }
}
