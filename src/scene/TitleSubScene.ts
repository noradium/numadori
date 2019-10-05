import {SubScene} from './SubScene';
import {Util} from '../util/Util';

export class TitleSubScene extends SubScene {
  readonly onTitleSceneEnd = new g.Trigger<void>();
  private titleLabel: g.Label;
  private titleEndTimer: g.TimerIdentifier;

  constructor(_scene: g.Scene) {
    super(_scene);
  }

  init() {
    this.titleLabel = new g.Label({
      scene: this.scene,
      text: '鳥の群れ',
      font: new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.Serif,
        size: 60
      }),
      fontSize: 60
    });
    this.titleLabel.x = (this.scene.game.width - this.titleLabel.width) / 2;
    this.titleLabel.y = (this.scene.game.height - this.titleLabel.height) / 2;
    this.append(this.titleLabel);
    this.hideContent();
  }

  showContent() {
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
    this.titleLabel.hide();
  }
}