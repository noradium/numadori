import {Timeline} from '@akashic-extension/akashic-timeline';

export class GameBackground extends g.E {
  private background0: g.FilledRect;
  private background1: g.E;
  private background2: g.E;
  private timeline: Timeline;

  constructor(params: {
    scene: g.Scene;
  }) {
    super({
      scene: params.scene,
      width: params.scene.game.width,
      height: params.scene.game.height
    });
    this.timeline = new Timeline(params.scene);
    this.background0 = new g.FilledRect({
      scene: this.scene,
      cssColor: '#98d98e',
      // cssColor: '#bafbb0',
      width: params.scene.game.width,
      height: params.scene.game.height
    });
    this.background1 = new g.E({
      scene: this.scene,
      width: params.scene.game.width,
      height: params.scene.game.height
    });
    this.background2 = new g.E({
      scene: this.scene,
      width: params.scene.game.width,
      height: params.scene.game.height
    });
    this.background1.x = -params.scene.game.width;
    this.background2.x = 0;

    const asiatoPositions = [
      {x: 50, y: 50, angle: -10, scale: 0.35},
      {x: 110, y: 300, angle: -30, scale: 0.2},
      {x: 130, y: 90, angle: -50, scale: 0.3},
      {x: 300, y: 150, angle: -90, scale: 0.35},
      {x: 430, y: 20, angle: -70, scale: 0.18},
      {x: 500, y: 270, angle: -40, scale: 0.25}
    ];
    asiatoPositions.forEach(v => {
      this.background1.append(new g.Sprite({
        scene: this.scene,
        src: params.scene.assets['asiato'],
        x: v.x,
        y: v.y,
        angle: v.angle,
        scaleX: v.scale,
        scaleY: v.scale
      }));
      this.background2.append(new g.Sprite({
        scene: this.scene,
        src: params.scene.assets['asiato'],
        x: v.x,
        y: v.y,
        angle: v.angle,
        scaleX: v.scale,
        scaleY: v.scale
      }));
    });
    this.append(this.background0);
    this.append(this.background1);
    this.append(this.background2);
  }

  step(x: number) {
    if (this.background2.x + x > this.scene.game.width) {
      this.background1.x -= this.scene.game.width;
      this.background2.x -= this.scene.game.width;
    }
    this.background1.modified();
    this.background2.modified();

    this.timeline.create(this.background1, {modified: this.background1.modified, destroyed: this.background1.destroyed})
      .moveBy(x, 0, 50);
    this.timeline.create(this.background2, {modified: this.background2.modified, destroyed: this.background2.destroyed})
      .moveBy(x, 0, 50);
  }
}
