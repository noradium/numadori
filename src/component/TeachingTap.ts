import {Player} from './Player';
import {Timeline} from '@akashic-extension/akashic-timeline';
import {MediumBlack64pxLabel} from './Label';

export class TeachingTap extends g.E {
  readonly player: Player;
  private text1: g.Label;
  private text2: g.Label;
  private yubi: g.Label;
  private timeline: Timeline;

  constructor(params: {
    scene: g.Scene;
  }) {
    super({
      scene: params.scene
    });
    this.timeline = new Timeline(this.scene);
    this.text1 = new MediumBlack64pxLabel({
      scene: this.scene,
      text: '曲に合わせて',
      fontSize: 20
    });
    this.text2 = new MediumBlack64pxLabel({
      scene: this.scene,
      text: 'タップ',
      fontSize: 20
    });
    this.yubi = new g.Label({
      scene: this.scene,
      text: '👆',
      font: new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.Monospace,
        size: 60
      }),
      fontSize: 60
    });

    // 一番長いのをコンテナの幅に
    this.width = this.text1.width;
    this.text1.y = 0;
    this.text1.x = (this.width - this.text1.width) / 2;
    this.text2.y = this.text1.height;
    this.text2.x = (this.width - this.text2.width) / 2;
    this.yubi.y = this.text2.y + this.text2.height;
    this.yubi.x = (this.width - this.yubi.width) / 2;

    this.player = new Player({
      scene: this.scene,
      disableSound: true,
      enableNumaTailSound: true,
      x: 0,
      y: this.yubi.y + this.yubi.height - 30
    });

    this.append(this.player);
    this.append(this.text1);
    this.append(this.text2);
    this.append(this.yubi);
  }

  action(beatIndex: number) {
    switch (beatIndex) {
      case 0:
      case 2:
        this.player.setStep1();
        this.timeline.create(this.yubi, {modified: this.yubi.modified, destroyed: this.yubi.destroyed})
          .rotateBy(-60, 50)
          .con()
          .moveBy(0, 10, 50);
        this.scene.setTimeout(() => {
          this.player.setStep2();
          this.timeline.create(this.yubi, {modified: this.yubi.modified, destroyed: this.yubi.destroyed})
            .rotateBy(60, 50)
            .con()
            .moveBy(0, -10, 50);
        }, 150);
        break;
      case 1:
      case 3:
        this.player.setStep3();
        this.timeline.create(this.yubi, {modified: this.yubi.modified, destroyed: this.yubi.destroyed})
          .rotateBy(-60, 50)
          .con()
          .moveBy(0, 10, 50);
        this.scene.setTimeout(() => {
          this.player.setStep4();
          this.timeline.create(this.yubi, {modified: this.yubi.modified, destroyed: this.yubi.destroyed})
            .rotateBy(60, 50)
            .con()
            .moveBy(0, -10, 50);
        }, 150);
        break;
    }
  }

  startAnimation() {
    // this.timeline = new Timeline(this.scene);
    // const tapDuration = 100;
    // const interval = 500;
    // this.timeline.create(this.yubi, {
    //   modified: this.yubi.modified,
    //   destroyed: this.yubi.destroyed,
    //   loop: true
    // })
    //   .rotateBy(-60, tapDuration)
    //   .con()
    //   .moveBy(0, 10, tapDuration)
    //   .wait(interval - tapDuration)
    //   .con()
    //   .call(() => this.player.setStep2())
    //   .wait(interval)
    //   .rotateBy(60, tapDuration)
    //   .con()
    //   .moveBy(0, -10, tapDuration)
    //   .wait(interval - tapDuration)
    //   .con()
    //   .call(() => this.player.setStep3())
    //   .wait(interval)
    //   .rotateBy(-60, tapDuration)
    //   .con()
    //   .moveBy(0, 10, tapDuration)
    //   .wait(interval - tapDuration)
    //   .con()
    //   .call(() => this.player.setStep4())
    //   .wait(interval)
    //   .rotateBy(60, tapDuration)
    //   .con()
    //   .moveBy(0, -10, tapDuration)
    //   .wait(interval - tapDuration)
    //   .con()
    //   .call(() => this.player.setStep1())
    //   .wait(interval);
  }
}
