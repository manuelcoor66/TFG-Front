import { autoserializeAs, autoserializeAsArray } from 'dcerialize';

export class Place {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Name
   */
  @autoserializeAs(() => String) name: string;

  /**
   * Coordinates
   */
  @autoserializeAs(() => String) coordinates: string;

  constructor(id: number, name: string, coordinates: string) {
    this.id = id;
    this.name = name;
    this.coordinates = coordinates;
  }
}

export class PlaceList {
  /**
   * Name
   */
  @autoserializeAsArray(() => Place) items: Place[];

  /**
   * ID
   */
  @autoserializeAs(() => Number) total: number;

  constructor(items: Place[], total: number) {
    this.items = items;
    this.total = total;
  }
}
