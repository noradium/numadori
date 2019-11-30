export enum Gesture {
  Tap, SlideDown, SlideUp
}

export interface GestureEvent {
  fixDelay: number;
}

export class GestureHandler extends g.E {
  readonly onTap: g.Trigger<GestureEvent>;
  readonly onTapUp: g.Trigger<void>;
  readonly onSlideDown: g.Trigger<GestureEvent>;
  readonly onSlideUp: g.Trigger<GestureEvent>;
  private currentTempGesture: Gesture;
  private tempGestureTime: number;
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
    // console.log('pointdown', g.game.age);
    this.currentTempGesture = Gesture.Tap;
    this.tempGestureTime = this.scene.game.age;
    this.scene.setTimeout(() => {
      if (
        this.currentTempGesture === Gesture.Tap &&
        this.lastGesture !== Gesture.SlideDown &&
        this.lastGesture !== Gesture.SlideUp
      ) {
        this.currentTempGesture = null;
        this.lastGesture = Gesture.Tap;
        this.onTap.fire({fixDelay: this.scene.game.age - this.tempGestureTime});
        // console.log(g.game.age, 'tap');
      }
    }, 100);
  }

  private onPointUp(event: g.PointUpEvent) {
    if (this.currentTempGesture === Gesture.Tap) {
      this.lastGesture = Gesture.Tap;
      this.onTap.fire({fixDelay: this.scene.game.age - this.tempGestureTime});
      // console.log('tap in pointup', g.game.age);
    }
    if (this.lastGesture === Gesture.SlideDown || this.lastGesture === Gesture.SlideUp) {
      this.lastGesture = null;
      return;
    }
    this.currentTempGesture = null;
    this.lastGesture = null;
    this.onTapUp.fire();
    // console.log('tapup');
  }

  private onPointMove(event: g.PointMoveEvent) {
    // console.log('pointmove', event.startDelta);
    if (
      this.currentTempGesture === Gesture.Tap &&
      this.lastGesture !== Gesture.SlideDown &&
      this.lastGesture !== Gesture.SlideUp &&
      event.startDelta.y > 10
    ) {
      this.currentTempGesture = null;
      this.lastGesture = Gesture.SlideDown;
      this.onSlideDown.fire({fixDelay: this.scene.game.age - this.tempGestureTime});
      // console.log('slidedown', g.game.age);
    } else if (
      this.lastGesture === Gesture.SlideDown &&
      event.prevDelta.y < -10
    ) {
      this.currentTempGesture = null;
      this.lastGesture = Gesture.SlideUp;
      this.onSlideUp.fire({fixDelay: 0});
      // console.log('slideup', g.game.age);
    }
  }
}
