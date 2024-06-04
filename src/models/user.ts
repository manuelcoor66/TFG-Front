import { autoserializeAs } from 'dcerialize';

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

  constructor(
    email: string,
    name?: string,
    lastNames?: string,
    password?: string,
    securityWord?: string,
    id?: number,
  ) {
    this.name = name;
    this.lastNames = lastNames;
    this.email = email;
    this.password = password;
    this.securityWord = securityWord;
    this.id = id;
  }

  updateNames(user: User): void {
    this.name = user.name;
    this.lastNames = user.lastNames;
  }
}
