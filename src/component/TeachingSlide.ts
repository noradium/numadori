import {Player} from './Player';
import {Timeline} from '@akashic-extension/akashic-timeline';
import {MediumBlack64pxLabel} from './Label';

export class TeachingSlide extends g.E {
  private text1: g.Label;
  private text2: g.Label;
  private yubi: g.Label;
  private tori: Player;
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
      text: '掛け声で',
      fontSize: 20
    });
    this.text2 = new MediumBlack64pxLabel({
      scene: this.scene,
      text: '下スライドして',
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
    this.width = this.text2.width;

    this.text1.y = 0;
    this.text1.x = (this.width - this.text1.width) / 2;
    this.text2.y = this.text1.height;
    this.text2.x = (this.width - this.text2.width) / 2;
    this.yubi.y = this.text2.y + this.text2.height;
    this.yubi.x = (this.width - this.yubi.width) / 2;

    this.tori = new Player({
      scene: this.scene,
      disableSound: true,
      x: 0,
      y: this.yubi.y + this.yubi.height - 30
    });

    this.append(this.tori);
    this.append(this.text1);
    this.append(this.text2);
    this.append(this.yubi);
  }

  slideDown() {
    this.timeline.create(this.yubi, {modified: this.yubi.modified, destroyed: this.yubi.destroyed})
      .moveBy(0, 80, 50)
      .con()
      .call(() => {
        this.tori.setTame();
        this.text1.text = '掛け声で';
        this.text2.text = '下スライドして';
        this.text1.invalidate();
        this.text2.invalidate();
        this.text1.x = (this.width - this.text1.width) / 2;
        this.text2.x = (this.width - this.text2.width) / 2;
      });
  }

  slideUp() {
    this.timeline.create(this.yubi, {modified: this.yubi.modified, destroyed: this.yubi.destroyed})
      .moveBy(0, -80, 50)
      .con()
      .call(() => {
        this.tori.setJump();
        this.text1.text = '上スライドで';
        this.text2.text = 'ジャンプ';
        this.text1.invalidate();
        this.text2.invalidate();
        this.text1.x = (this.width - this.text1.width) / 2;
        this.text2.x = (this.width - this.text2.width) / 2;
      });
  }

  startAnimation() {
    // const tapDuration = 200;
    // const interval = 700;
    // this.timeline.create(this.yubi, {
    //   modified: this.yubi.modified,
    //   destroyed: this.yubi.destroyed,
    //   loop: true
    // })
    //   .moveBy(0, 80, tapDuration)
    //   .wait(interval - tapDuration)
    //   .con()
    //   .call(() => {
    //     this.tori.setTame();
    //     this.text1.text = '掛け声で';
    //     this.text2.text = '下スライドして';
    //     this.text1.invalidate();
    //     this.text2.invalidate();
    //     this.text1.x = (this.width - this.text1.width) / 2;
    //     this.text2.x = (this.width - this.text2.width) / 2;
    //   })
    //   .wait(interval)
    //   .moveBy(0, -80, tapDuration)
    //   .wait(interval - tapDuration)
    //   .con()
    //   .call(() => {
    //     this.tori.setJump();
    //     this.text1.text = '上スライドで';
    //     this.text2.text = 'ジャンプ';
    //     this.text1.invalidate();
    //     this.text2.invalidate();
    //     this.text1.x = (this.width - this.text1.width) / 2;
    //     this.text2.x = (this.width - this.text2.width) / 2;
    //   })
    //   .wait(interval);
  }
}
