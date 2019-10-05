import {RoundedFilledRect} from './RoundedFilledRect';

export class StopJoinButton extends g.E {
  private background: RoundedFilledRect;
  private text: g.Label;

  constructor(params: {
    scene: g.Scene;
  }) {
    super({
      scene: params.scene,
      width: 180,
      height: 50,
      touchable: true,
      local: true
    });
    this.background = new RoundedFilledRect({
      scene: this.scene,
      width: this.width,
      height: this.height,
      x: 0,
      y: 0,
      borderRadius: 20,
      cssColor: '#c33'
    });
    this.append(this.background);

    this.text = new g.Label({
      scene: this.scene,
      text: '参加締め切り',
      font: new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.Serif,
        size: 28
      }),
      fontSize: 28,
      textColor: '#fff'
    });
    this.text.x = (this.width - this.text.width) / 2;
    this.text.y = (this.height - this.text.height) / 2;
    this.append(this.text);
  }
}
