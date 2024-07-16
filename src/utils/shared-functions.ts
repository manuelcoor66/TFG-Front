import {Matches} from "../models/matches";

export function fourPlayers(match: Matches): boolean {
  return (!!match.playerName1 && !!match.playerName2 && !!match.playerName3 && !!match.playerName4)
}
