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
      ...params,
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
export class MediumLightblue64pxLabel extends Label {
  constructor(params: LabelParameterObject) {
    super(params, {
      image: 'medium_lightblue_64',
      glyph: 'medium_lightblue_64_glyph'
    });
  }
}
export class MediumGray64pxLabel extends Label {
  constructor(params: LabelParameterObject) {
    super(params, {
      image: 'medium_gray_64',
      glyph: 'medium_gray_64_glyph'
    });
  }
}
export class MediumRed64pxLabel extends Label {
  constructor(params: LabelParameterObject) {
    super(params, {
      image: 'medium_red_64',
      glyph: 'medium_red_64_glyph'
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
