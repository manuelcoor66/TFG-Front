import { autoserializeAs, autoserializeAsArray } from 'dcerialize';
import { TicketState } from '../utils/enum';

export class UserTicket {
  /**
   * id
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * League name
   */
  @autoserializeAs(() => String, 'league_name') leagueName: string;

  /**
   * User name
   */
  @autoserializeAs(() => String, 'user_name') userName: string;

  /**
   * State
   */
  @autoserializeAs(() => String) state: TicketState;

  /**
   * Date
   */
  @autoserializeAs(() => Date) date: Date;

  constructor(
    id: number,
    leagueName: string,
    userName: string,
    state: TicketState,
    date: Date,
  ) {
    this.id = id;
    this.leagueName = leagueName;
    this.userName = userName;
    this.state = state;
    this.date = date;
  }
}

export class UserTicketList {
  /**
   * Name
   */
  @autoserializeAsArray(() => UserTicket) items: UserTicket[];

  /**
   * ID
   */
  @autoserializeAs(() => Number) total: number;

  constructor(items: UserTicket[], total: number) {
    this.items = items;
    this.total = total;
  }
}
