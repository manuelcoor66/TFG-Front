import { autoserializeAs, autoserializeAsArray } from 'dcerialize';

export class Sport {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Name
   */
  @autoserializeAs(() => String) name: string;

  /**
   * Icon
   */
  @autoserializeAs(() => String) icon: string;
  /**
   * Players
   */
  @autoserializeAs(() => Number) players: number;

  constructor(id: number, name: string, icon: string, players: number) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.players = players;
  }
}

export class SportList {
  /**
   * Name
   */
  @autoserializeAsArray(() => Sport) items: Sport[];

  /**
   * ID
   */
  @autoserializeAs(() => Number) total: number;

  constructor(items: Sport[], total: number) {
    this.items = items;
    this.total = total;
  }
}
