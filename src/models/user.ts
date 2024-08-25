import { autoserializeAs, autoserializeAsArray } from 'dcerialize';
import { UserRole, UserState } from '../utils/enum';

export class User {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id?: number;

  /**
   * User email
   */
  @autoserializeAs(() => String) email: string;

  /**
   * User name
   */
  @autoserializeAs(() => String) name?: string;

  /**
   * User last name
   */
  @autoserializeAs(() => String, 'last_names') lastNames?: string;

  /**
   * User password
   */
  @autoserializeAs(() => String) password?: string;

  /**
   * Security word
   */
  @autoserializeAs(() => String, 'security_word') securityWord?: string;

  /**
   * User State
   */
  @autoserializeAs(() => String) role?: UserRole;

  /**
   * User State
   */
  @autoserializeAs(() => String) state?: UserState;

  constructor(
    email: string,
    name?: string,
    lastNames?: string,
    password?: string,
    securityWord?: string,
    id?: number,
    role?: UserRole,
    state?: UserState,
  ) {
    this.name = name;
    this.lastNames = lastNames;
    this.email = email;
    this.password = password;
    this.securityWord = securityWord;
    this.id = id;
    this.role = role;
    this.state = state;
  }

  updateNames(user: User): void {
    this.name = user.name;
    this.lastNames = user.lastNames;
  }
}

export class UserTable {
  /**
   * User name
   */
  @autoserializeAs(() => String) name: string;

  /**
   * User email
   */
  @autoserializeAs(() => String) email: string;

  /**
   * User State
   */
  @autoserializeAs(() => String) role: UserRole;

  /**
   * User State
   */
  @autoserializeAs(() => String) state: UserState;

  constructor(name: string, email: string, role: UserRole, state: UserState) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.state = state;
  }
}

export class UserTableList {
  /**
   * Items
   */
  @autoserializeAsArray(() => UserTable) items: UserTable[];

  /**
   * Total
   */
  @autoserializeAs(() => Number) total: number;

  constructor(items: UserTable[], total: number) {
    this.items = items;
    this.total = total;
  }
}
