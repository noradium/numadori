export interface SessionParameters {
  /**
   * ゲームの終了時間。省略された場合、そのゲームのデフォルト値になる。
   * falseを指定した場合、そのゲームが許容する最大値になる。
   */
  totalTimeLimit?: number;

  /**
   * 起動方法
   * 指定なし：未定義（説明省略でよさそうなもの）
   * self：放送者がプレーする
   * lottery：抽選で選ばれたユーザがプレーする
   * ranking：みんなでプレーする
   */
  launchType?: string;
}

/**
 * 起動方法
 * @export
 * @enum {number}
 */
export enum LaunchType {
  /** 未指定 */
  NOTHING,
  /** 放送者プレイ */
  SELF,
  /** 抽選されたユーザーがプレイ */
  LOTTERY,
  /** みんなでプレイ */
  RANKING
}

/** 起動方法の放送者プレイを判定する文字列 */
const LAUNCH_TYPE_SELF_STRING: string = 'self';
/** 起動方法の抽選されたユーザーがプレイを判定する文字列 */
const LAUNCH_TYPE_LOTTERY_STRING: string = 'lottery';
/** 起動方法のみんなでプレイを判定する文字列 */
const LAUNCH_TYPE_RANKING_STRING: string = 'ranking';

export class GameParameters {
  /**
   * SessionParameters.launchType に相当する値
   * パラメータそのものではなくLaunchType型を使わせる
   */
  static launchType: LaunchType;

  static totalTimeLimit: number;

  /**
   * 起動パラメータから対応するメンバ変数を設定する
   * @param {SessionParameters} parameters 起動パラメータ
   */
  static init(parameters: SessionParameters): void {
    this.launchType = LaunchType.NOTHING;

    if (typeof parameters.launchType === 'string') {
      if (parameters.launchType === LAUNCH_TYPE_SELF_STRING) {
        this.launchType = LaunchType.SELF;
      } else if (parameters.launchType === LAUNCH_TYPE_LOTTERY_STRING) {
        this.launchType = LaunchType.LOTTERY;
      } else if (parameters.launchType === LAUNCH_TYPE_RANKING_STRING) {
        this.launchType = LaunchType.RANKING;
      }
    }

    if (parameters.totalTimeLimit) {
      this.totalTimeLimit = parameters.totalTimeLimit;
    }
  }
}
