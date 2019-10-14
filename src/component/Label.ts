export interface LabelParameterObject {
  scene: g.Scene;
  fontSize: number;
  text: string;
  width?: number;
  height?: number;
  widthAutoAdjust?: boolean;
  textAlign?: g.TextAlign;
  x?: number;
  y?: number;
  opacity?: number;
}

class Label extends g.Label {
  constructor(
    params: LabelParameterObject,
    asset: {
      image: string;
      glyph: string;
    }) {
    const glyph = JSON.parse((params.scene.assets[asset.glyph] as g.TextAsset).data);
    const font = new g.BitmapFont({
      src: params.scene.assets[asset.image],
      map: glyph.map,
      defaultGlyphWidth: glyph.width,
      defaultGlyphHeight: glyph.height,
      missingGlyph: glyph.missingGlyph
    });
    super({
      scene: params.scene,
      fontSize: params.fontSize,
      text: params.text,
      width: params.width,
      height: params.height,
      widthAutoAdjust: typeof params.widthAutoAdjust !== 'undefined' ? params.widthAutoAdjust : true,
      textAlign: params.textAlign,
      x: params.x,
      y: params.y,
      opacity: params.opacity,
      font
    });
  }
}

export class MediumBlack64pxLabel extends Label {
  constructor(params: LabelParameterObject) {
    super(params, {
      image: 'medium_black_64',
      glyph: 'medium_black_64_glyph'
    });
  }
}
export class MediumWhite64pxLabel extends Label {
  constructor(params: LabelParameterObject) {
    super(params, {
      image: 'medium_white_64',
      glyph: 'medium_white_64_glyph'
    });
  }
}
export class BoldBlack128pxLabel extends Label {
  constructor(params: LabelParameterObject) {
    super(params, {
      image: 'bold_black_128',
      glyph: 'bold_black_128_glyph'
    });
  }
}
