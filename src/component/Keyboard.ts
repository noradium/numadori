import {DynamicFontLabel} from './Label';

export const enum KeyboardCommand {
  Input, Delete, Enter
}

export class Keyboard extends g.E {
  readonly onKeyDown: g.Trigger<{
    command: KeyboardCommand;
    value?: string;
  }>;
  private background: g.FilledRect;
  private HIRAGANA = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもや　ゆ　よらりるれろわ　を　ん';

  constructor(params: {
    scene: g.Scene;
  }) {
    super({
      scene: params.scene,
      width: 540,
      height: 210
    });
    this.onKeyDown = new g.Trigger<{command: KeyboardCommand, value: string}>();
    this.background = new g.FilledRect({
      scene: params.scene,
      cssColor: '#cccccc',
      width: this.width,
      height: this.height
    });
    this.append(this.background);

    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 5; ++j) {
        const text = this.getChar(i, j);
        const char = new DynamicFontLabel({
          scene: params.scene,
          text,
          fontSize: 24,
          touchable: true,
          local: true
        });
        char.x = this.width - 14 * (i + 1) - 30 * (i + 1);
        char.y = 10 * (j + 1) + 30 * j;
        char.pointUp.add(() => {
          this.onKeyDown.fire({
            command: KeyboardCommand.Input,
            value: text
          });
        });
        this.append(char);
      }
    }

    const del = new DynamicFontLabel({
      scene: params.scene,
      text: '消す',
      fontSize: 24,
      touchable: true,
      local: true
    });
    del.x = 10;
    del.y = 10;
    del.pointUp.add(() => {
      this.onKeyDown.fire({
        command: KeyboardCommand.Delete
      });
    });
    this.append(del);

    const enter = new DynamicFontLabel({
      scene: params.scene,
      text: '決定',
      fontSize: 24,
      touchable: true,
      local: true
    });
    enter.x = 10;
    enter.y = this.height - enter.height - 10;
    enter.pointUp.add(() => {
      this.onKeyDown.fire({
        command: KeyboardCommand.Enter
      });
    });
    this.append(enter);
  }

  private getChar(shiin: number, boin: number) {
    return this.HIRAGANA.charAt(shiin * 5 + boin);
  }
}
