import { autoserializeAs, autoserializeAsArray } from 'dcerialize';

export class Enrolment {
  /**
   * id
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * User id
   */
  @autoserializeAs(() => Number, 'user_id') userId: number;

  /**
   * League id
   */
  @autoserializeAs(() => Number, 'league_id') leagueId: number;

  /**
   * Enrolment points
   */
  @autoserializeAs(() => Number) points: number;

  /**
   * Enrolment points
   */
  @autoserializeAs(() => Number) wins: number;

  /**
   * Enrolment points
   */
  @autoserializeAs(() => Number) defeats: number;

  /**
   * Enrolment points
   */
  @autoserializeAs(() => Number, 'matches_played') matchesPlayed: number;

  /**
   * Whetever the enrolment is paid
   */
  @autoserializeAs(() => Boolean) paid: boolean;

  /**
   * Whetever the enrolment is active
   */
  @autoserializeAs(() => Boolean) active: boolean;

  /**
   * Whetever the enrolment is finalized
   */
  @autoserializeAs(() => Boolean) finalized: boolean;

  /**
   *
   * @param id
   * @param userId
   * @param leagueId
   * @param points
   * @param wins
   * @param defeats
   * @param matchesPlayed
   * @param paid
   * @param active
   * @param finalized
   */
  constructor(
    id: number,
    userId: number,
    leagueId: number,
    points: number,
    wins: number,
    defeats: number,
    matchesPlayed: number,
    paid: boolean,
    active: boolean,
    finalized: boolean,
  ) {
    this.id = id;
    this.userId = userId;
    this.leagueId = leagueId;
    this.points = points;
    this.wins = wins;
    this.defeats = defeats;
    this.matchesPlayed = matchesPlayed;
    this.paid = paid;
    this.active = active;
    this.finalized = finalized;
  }
}

export class EnrolmentList {
  /**
   * items
   */
  @autoserializeAsArray(() => Enrolment) items: Enrolment[];

  /**
   * ID
   */
  @autoserializeAs(() => Number) total: number;

  constructor(items: Enrolment[], total: number) {
    this.items = items;
    this.total = total;
  }
}

export class EnrolmentTable {
  /**
   * id
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * User name
   */
  @autoserializeAs(() => String) name: string;

  /**
   * Enrolment points
   */
  @autoserializeAs(() => Number) points: number;

  /**
   * Enrolment points
   */
  @autoserializeAs(() => Number) wins: number;

  /**
   * Enrolment points
   */
  @autoserializeAs(() => Number) defeats: number;

  /**
   *
   * @param id
   * @param name
   * @param points
   * @param wins
   * @param defeats
   */
  constructor(
    id: number,
    name: string,
    points: number,
    wins: number,
    defeats: number,
  ) {
    this.id = id;
    this.name = name;
    this.points = points;
    this.wins = wins;
    this.defeats = defeats;
  }
}

export class EnrolmentTableList {
  /**
   * Items
   */
  @autoserializeAsArray(() => EnrolmentTable) items: EnrolmentTable[];

  /**
   * Total
   */
  @autoserializeAs(() => Number) total: number;

  constructor(items: EnrolmentTable[], total: number) {
    this.items = items;
    this.total = total;
  }
}
