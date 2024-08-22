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
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Los meses en JavaScript son 0-basados
  const year = date.getFullYear();

  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
