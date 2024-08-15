import { Matches } from '../models/matches';

export function fourPlayers(match: Matches): boolean {
  return (
    !!match.playerName1 &&
    !!match.playerName2 &&
    !!match.playerName3 &&
    !!match.playerName4
  );
}

export function formatDate(date: Date): string {
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}
