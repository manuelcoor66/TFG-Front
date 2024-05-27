import { autoserializeAs } from 'dcerialize';

export class User {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id?: number;

  /**
   * User email
   */
  @autoserializeAs(() => String) email?: string;

  /**
   * User name
   */
  @autoserializeAs(() => String) name?: string;

  /**
   * User last name
   */
  @autoserializeAs(() => String) last_names?: string;

  /**
   * User last name
   */
  @autoserializeAs(() => String) password?: string;

  /**
   * User last name
   */
  @autoserializeAs(() => String) security_word?: string;

  constructor(
    name?: string,
    lastName?: string,
    email?: string,
    password?: string,
    securityWord?: string,
    id?: number,
  ) {
    this.name = name;
    this.last_names = lastName;
    this.email = email;
    this.password = password;
    this.security_word = securityWord;
    this.id = id;
  }
}
