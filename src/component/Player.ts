import {Util} from '../util/Util';

export class Player extends g.E {
  private tori1: g.Sprite;
  private tori2: g.Sprite;
  private tori3: g.Sprite;
  private tori4: g.Sprite;
  private tori_tame1: g.Sprite;
  private tori_jump1: g.Sprite;
  private tori_miss1: g.Sprite;
  private nameLabel: g.Label;
  private _currentStep: number;
  private disableSound: boolean;

  constructor(params: {
    scene: g.Scene;
    id?: string;
    name?: string;
    x?: number;
    y?: number;
    disableSound?: boolean;
  }) {
    super({
      scene: params.scene,
      x: params.x,
      y: params.y
    });
    this.disableSound = params.disableSound;
    this.tori1 = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets['tori']
    });
    this.tori2 = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets['tori2']
    });
    this.tori3 = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets['tori3']
    });
    this.tori4 = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets['tori4']
    });
    this.tori_tame1 = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets['tori_tame1']
    });
    this.tori_jump1 = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets['tori_jump1']
    });
    this.tori_miss1 = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets['tori_miss1']
    });
    this.append(this.tori1);
    this.append(this.tori2);
    this.append(this.tori3);
    this.append(this.tori4);
    this.append(this.tori_tame1);
    this.append(this.tori_jump1);
    this.append(this.tori_miss1);
    this.width = this.tori1.width;
    this.height = this.tori1.height;

    if (params.name) {
      this.nameLabel = new g.Label({
        scene: this.scene,
        text: params.name,
        font: new g.DynamicFont({
          game: g.game,
          fontFamily: g.FontFamily.Serif,
          size: 20
        }),
        fontSize: 20,
        textColor: '#333'
      });
      this.nameLabel.x = (this.width - this.nameLabel.width) / 2;
      this.nameLabel.y = 0;
      this.append(this.nameLabel);
    }

    this.modified();
    this.setStep1();
  }

  get currentStep() {
    return this._currentStep;
  }

  setStep1() {
    this._currentStep = 1;
    this.tori1.show();
    this.tori2.hide();
    this.tori3.hide();
    this.tori4.hide();
    this.tori_tame1.hide();
    this.tori_jump1.hide();
    this.tori_miss1.hide();
    if (!this.disableSound) {
      Util.playAudio(this.scene, 'peta1');
      Util.playAudio(this.scene, 'don');
    }
  }

  setStep2() {
    this._currentStep = 2;
    this.tori1.hide();
    this.tori2.show();
    this.tori3.hide();
    this.tori4.hide();
    this.tori_tame1.hide();
    this.tori_jump1.hide();
    this.tori_miss1.hide();
    if (!this.disableSound) {
      Util.playAudio(this.scene, 'peta2');
    }
  }

  setStep3() {
    this._currentStep = 3;
    this.tori1.hide();
    this.tori2.hide();
    this.tori3.show();
    this.tori4.hide();
    this.tori_tame1.hide();
    this.tori_jump1.hide();
    this.tori_miss1.hide();
    if (!this.disableSound) {
      Util.playAudio(this.scene, 'peta1');
      Util.playAudio(this.scene, 'don');
    }
  }

  setStep4() {
    this._currentStep = 4;
    this.tori1.hide();
    this.tori2.hide();
    this.tori3.hide();
    this.tori4.show();
    this.tori_tame1.hide();
    this.tori_jump1.hide();
    this.tori_miss1.hide();
    if (!this.disableSound) {
      Util.playAudio(this.scene, 'peta2');
    }
  }

  setTame() {
    this.tori1.hide();
    this.tori2.hide();
    this.tori3.hide();
    this.tori4.hide();
    this.tori_tame1.show();
    this.tori_jump1.hide();
    this.tori_miss1.hide();
  }

  setJump() {
    this.tori1.hide();
    this.tori2.hide();
    this.tori3.hide();
    this.tori4.hide();
    this.tori_tame1.hide();
    this.tori_jump1.show();
    this.tori_miss1.hide();
    if (!this.disableSound) {
      Util.playAudio(this.scene, 'numa_tail');
    }
  }

  setMiss() {
    if (this.tori_miss1.visible()) {
      return;
    }
    this.tori1.hide();
    this.tori2.hide();
    this.tori3.hide();
    this.tori4.hide();
    this.tori_tame1.hide();
    this.tori_jump1.hide();
    this.tori_miss1.show();
    if (!this.disableSound) {
      Util.playAudio(this.scene, 'miss');
    }
  }
}
