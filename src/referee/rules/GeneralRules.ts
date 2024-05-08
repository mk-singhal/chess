import { Piece, Position, TeamType, samePosition } from "../../constants";

export const tileIsEmptyOrOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  return (
    tileIsOccupiedByOpponent(position, boardState, team) ||
    !tileIsOccupied(position, boardState)
  );
};

export const tileIsOccupied = (
  position: Position,
  boardState: Piece[]
): boolean => {
  const piece = boardState.find((p) => samePosition(p.position, position));
  return piece ? true : false;
};

export const tileIsOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  const piece = boardState.find(
    (p) => samePosition(p.position, position) && p.team !== team
  );
  return piece ? true : false;
};
