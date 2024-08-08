import { autoserializeAs, autoserializeAsArray } from 'dcerialize';

export class Achievement {
  /**
   * Description
   */
  @autoserializeAs(() => String) description: string;
  /**
   * Amount
   */
  @autoserializeAs(() => Number) amount: number;
  /**
   * Made
   */
  @autoserializeAs(() => Number) made: number;
  /**
   * Finalized
   */
  @autoserializeAs(() => Boolean) finalized: boolean;

  constructor(
    description: string,
    amount: number,
    made: number,
    finalized: boolean,
  ) {
    this.description = description;
    this.amount = amount;
    this.made = made;
    this.finalized = finalized;
  }
}

export class AchievementList {
  /**
   * Name
   */
  @autoserializeAsArray(() => Achievement) items: Achievement[];

  /**
   * ID
   */
  @autoserializeAs(() => Number) total: number;

  constructor(items: Achievement[], total: number) {
    this.items = items;
    this.total = total;
  }
}
