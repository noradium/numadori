export enum Gesture {
  Tap, SlideDown, SlideUp
}

export class GestureHandler extends g.E {
  readonly onTap: g.Trigger<void>;
  readonly onTapUp: g.Trigger<void>;
  readonly onSlideDown: g.Trigger<void>;
  readonly onSlideUp: g.Trigger<void>;
  private currentTempGesture: Gesture;
  private lastGesture: Gesture;

  constructor(params: {
    scene: g.Scene;
  }) {
    super({
      scene: params.scene,
      width: params.scene.game.width,
      height: params.scene.game.height,
      touchable: true,
      local: true
    });
    this.onTap = new g.Trigger();
    this.onTapUp = new g.Trigger();
    this.onSlideDown = new g.Trigger();
    this.onSlideUp = new g.Trigger();
    this.pointDown.add(this.onPointDown.bind(this));
    this.pointUp.add(this.onPointUp.bind(this));
    this.pointMove.add(this.onPointMove.bind(this));
  }

  private onPointDown(event: g.PointDownEvent) {
    this.currentTempGesture = Gesture.Tap;
    this.scene.setTimeout(() => {
      if (
        this.currentTempGesture === Gesture.Tap &&
        this.lastGesture !== Gesture.SlideDown &&
        this.lastGesture !== Gesture.SlideUp
      ) {
        this.currentTempGesture = null;
        this.lastGesture = Gesture.Tap;
        this.onTap.fire();
        console.log('tap');
      }
    }, 100);
  }

  private onPointUp(event: g.PointUpEvent) {
    if (this.currentTempGesture === Gesture.Tap) {
      this.lastGesture = Gesture.Tap;
      this.onTap.fire();
      console.log('tap in pointup');
    }
    if (this.lastGesture === Gesture.SlideDown || this.lastGesture === Gesture.SlideUp) {
      this.lastGesture = null;
      return;
    }
    this.currentTempGesture = null;
    this.lastGesture = null;
    this.onTapUp.fire();
    console.log('tapup');
  }

  private onPointMove(event: g.PointMoveEvent) {
    // console.log('pointmove', event.startDelta);
    if (
      this.lastGesture !== Gesture.SlideDown &&
      this.lastGesture !== Gesture.SlideUp &&
      event.startDelta.y > 20
    ) {
      this.currentTempGesture = null;
      this.lastGesture = Gesture.SlideDown;
      this.onSlideDown.fire();
      console.log('slidedown');
    } else if (
      this.lastGesture === Gesture.SlideDown &&
      event.prevDelta.y < -5
    ) {
      this.currentTempGesture = null;
      this.lastGesture = Gesture.SlideUp;
      this.onSlideUp.fire();
      console.log('slideup');
    }
  }
}
