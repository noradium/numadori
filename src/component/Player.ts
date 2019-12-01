import {Util} from '../util/Util';
import {Easing, Timeline} from '@akashic-extension/akashic-timeline';
import {MediumBlack64pxLabel} from './Label';

export class Player extends g.E {
  private tori1: g.Sprite;
  private tori2: g.Sprite;
  private tori3: g.Sprite;
  private tori4: g.Sprite;
  private tori_tame1: g.Sprite;
  private tori_jump1: g.Sprite;
  private tori_miss1: g.Sprite;
  private nameLabel: g.Label;
  private meLabel: g.Label;
  private greatLabel: g.Sprite;
  private goodLabel: g.Sprite;
  private failLabel: g.Sprite;
  private _currentStep: number;
  private disableSound: boolean;
  private enableNumaTailSound: boolean;
  private timeline: Timeline;
  private highTopY: number;
  private topY: number;
  private bottomY: number;
  private isMe: boolean;
  private withoutAnimation: boolean;

  constructor(params: {
    scene: g.Scene;
    id?: string;
    name?: string;
    x: number;
    y: number;
    disableSound?: boolean;
    enableNumaTailSound?: boolean;
    isMe?: boolean;
    withoutAnimation?: boolean;
  }) {
    super({
      scene: params.scene,
      x: params.x,
      y: params.y
    });
    this.timeline = new Timeline(params.scene);
    this.highTopY = params.y - 10;
    this.topY = params.y;
    this.bottomY = params.y + 3;
    this.disableSound = params.disableSound;
    this.enableNumaTailSound = params.enableNumaTailSound;
    this.isMe = params.isMe;
    this.withoutAnimation = !!params.withoutAnimation;
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
          fontFamily: g.FontFamily.Monospace,
          size: 20
        }),
        fontSize: 20,
        textColor: '#0d0015'
      });
      this.nameLabel.x = (this.width - this.nameLabel.width) / 2;
      this.nameLabel.y = 0;
      this.append(this.nameLabel);
    }

    if (params.isMe) {
      this.meLabel = new MediumBlack64pxLabel({
        scene: this.scene,
        text: 'あなた',
        fontSize: 20
      });
      this.meLabel.x = (this.width - this.meLabel.width) / 2;
      this.meLabel.y = this.nameLabel ? -this.nameLabel.height : 0;
      this.append(this.meLabel);
    }

    this.greatLabel = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets['great_icon'],
      opacity: 0,
      x: this.width - 30,
      y: 0
    });
    this.goodLabel = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets['good_icon'],
      opacity: 0,
      x: this.width - 30,
      y: 0
    });
    this.failLabel = new g.Sprite({
      scene: params.scene,
      src: params.scene.assets['fail_icon'],
      opacity: 0,
      x: this.width - 30,
      y: 0
    });
    // this.greatLabel.hide();
    // this.goodLabel.hide();
    // this.failLabel.hide();
    this.append(this.greatLabel);
    this.append(this.goodLabel);
    this.append(this.failLabel);

    this.modified();
    this.setStep1();
  }

  get currentStep() {
    return this._currentStep;
  }

  actionCount() {
    this.timeline.create(this, {modified: this.modified, destroyed: this.destroyed})
      .moveY(this.bottomY, 100, Easing.easeInOutExpo)
      .moveY(this.topY, 100, Easing.easeInOutExpo);
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
    if (this.withoutAnimation) {
      this.y = this.bottomY;
      this.modified();
    } else {
      this.timeline.create(this, {modified: this.modified, destroyed: this.destroyed})
        .moveY(this.bottomY, 100, Easing.easeInOutExpo);
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
    if (this.withoutAnimation) {
      this.y = this.topY;
      this.modified();
    } else {
      this.timeline.create(this, {modified: this.modified, destroyed: this.destroyed})
        .moveY(this.topY, 100, Easing.easeInOutExpo);
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
    if (this.withoutAnimation) {
      this.y = this.bottomY;
      this.modified();
    } else {
      this.timeline.create(this, {modified: this.modified, destroyed: this.destroyed})
        .moveY(this.bottomY, 100, Easing.easeInOutExpo);
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
    if (this.withoutAnimation) {
      this.y = this.topY;
      this.modified();
    } else {
      this.timeline.create(this, {modified: this.modified, destroyed: this.destroyed})
        .moveY(this.topY, 100, Easing.easeInOutExpo);
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
    if (this.withoutAnimation) {
      this.y = this.bottomY;
      this.modified();
    } else {
      this.timeline.create(this, {modified: this.modified, destroyed: this.destroyed})
        .moveY(this.bottomY, 50, Easing.easeInOutExpo);
    }
  }

  setJump() {
    this.tori1.hide();
    this.tori2.hide();
    this.tori3.hide();
    this.tori4.hide();
    this.tori_tame1.hide();
    this.tori_jump1.show();
    this.tori_miss1.hide();
    if (!this.disableSound || this.disableSound && this.enableNumaTailSound) {
      Util.playAudio(this.scene, 'numa_tail');
    }
    if (this.withoutAnimation) {
      this.y = this.topY;
      this.modified();
    } else {
      this.timeline.create(this, {modified: this.modified, destroyed: this.destroyed})
        .moveY(this.highTopY, 300, Easing.easeInOutExpo)
        .moveY(this.topY, 60, Easing.easeInOutExpo);
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

  showFeedbackLabel(type: 'great' | 'good' | 'fail') {
    const targetEntity = this.getFeedbackLabelTargetEntity(type);
    this.timeline.create(targetEntity, {modified: targetEntity.modified, destroyed: targetEntity.destroyed})
      .fadeIn(50, Easing.easeOutCirc)
      .wait(120)
      .fadeOut(50, Easing.easeOutCirc);
  }

  private getFeedbackLabelTargetEntity(type: 'great' | 'good' | 'fail') {
    switch (type) {
      case 'great':
        return this.greatLabel;
      case 'good':
        return this.goodLabel;
      case 'fail':
        return this.failLabel;
    }
  }
}
