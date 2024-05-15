import { TeamType } from "../../Types";
import { Position, Piece } from "../../models";

export const positionOutOfBoard = (position: Position): boolean => {
  return position.x < 0 || position.x > 7 || position.y < 0 || position.y > 7;
};

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
  const piece = boardState.find((p) => p.samePosition(position));
  return piece ? true : false;
};

export const tileIsOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  const piece = boardState.find(
    (p) => p.samePosition(position) && p.team !== team
  );
  return piece ? true : false;
};
