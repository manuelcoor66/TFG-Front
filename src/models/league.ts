import { autoserializeAs, autoserializeAsArray } from 'dcerialize';

export class League {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Name
   */
  @autoserializeAs(() => String) name: string;

  /**
   * Description
   */
  @autoserializeAs(() => String) description: string;

  /**
   * Created By
   */
  @autoserializeAs(() => String, 'created_by') createdBy: string;

  /**
   * Enrolments
   */
  @autoserializeAs(() => Number) enrolments: number;

  /**
   * Points Victory
   */
  @autoserializeAs(() => Number, 'points_victory') pointsVictory: number;

  /**
   * Points Defeat
   */
  @autoserializeAs(() => Number, 'points_defeat') pointsDefeat: number;

  /**
   * Weeks
   */
  @autoserializeAs(() => Number) weeks: number;

  /**
   * Weeks Played
   */
  @autoserializeAs(() => Number, 'weeks_played') weeksPlayed: number;

  /**
   * Date Start
   */
  @autoserializeAs(() => Date, 'date_start') dateStart: Date;

  constructor(
    id: number,
    name: string,
    description: string,
    createdBy: string,
    enrolments: number,
    pointsVictory: number,
    pointsDefeat: number,
    weeks: number,
    weeksPlayed: number,
    dateStart: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdBy = createdBy;
    this.enrolments = enrolments;
    this.pointsVictory = pointsVictory;
    this.pointsDefeat = pointsDefeat;
    this.weeks = weeks;
    this.weeksPlayed = weeksPlayed;
    this.dateStart = dateStart;
  }
}

export class LeagueList {
  /**
   * Name
   */
  @autoserializeAsArray(() => League) items: League[];

  /**
   * ID
   */
  @autoserializeAs(() => Number) total: number;

  constructor(items: League[], total: number) {
    this.items = items;
    this.total = total;
  }
}
