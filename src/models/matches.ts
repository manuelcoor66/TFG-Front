import { autoserializeAs, autoserializeAsArray } from 'dcerialize';

export class Matches {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Name
   */
  @autoserializeAs(() => Number, 'league_id') leagueId: number;

  /**
   * Description
   */
  @autoserializeAs(() => String) result: string;

  /**
   * Created By
   */
  @autoserializeAs(() => String, 'player_name_1') playerName1: string;

  /**
   * Created By
   */
  @autoserializeAs(() => String, 'player_name_2') playerName2?: string;

  /**
   * Enrolments
   */
  @autoserializeAs(() => String, 'player_name_3') playerName3?: string;

  /**
   * Points Victory
   */
  @autoserializeAs(() => String, 'player_name_4') playerName4?: string;

  /**
   * Weeks
   */
  @autoserializeAs(() => Date) date: Date;

  /**
   * Weeks Played
   */
  @autoserializeAs(() => Number) place: number;

  constructor(
    id: number,
    leagueId: number,
    result: string,
    playerName1: string,
    date: Date,
    place: number,
    playerName2?: string,
    playerName3?: string,
    playerName4?: string,
  ) {
    this.id = id;
    this.leagueId = leagueId;
    this.result = result;
    this.playerName1 = playerName1;
    this.playerName2 = playerName2;
    this.playerName3 = playerName3;
    this.playerName4 = playerName4;
    this.date = date;
    this.place = place;
  }
}

export class MatchesList {
  /**
   * Name
   */
  @autoserializeAsArray(() => Matches) items: Matches[];

  /**
   * ID
   */
  @autoserializeAs(() => Number) total: number;

  constructor(items: Matches[], total: number) {
    this.items = items;
    this.total = total;
  }
}
