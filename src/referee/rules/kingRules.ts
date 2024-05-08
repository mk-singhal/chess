import { Piece, Position, TeamType } from "../../constants";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const kingMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (
    desiredPosition.x === initialPosition.x &&
    desiredPosition.y === initialPosition.y
  )
    return false;
  return Math.abs(desiredPosition.x - initialPosition.x) < 2 &&
    Math.abs(desiredPosition.y - initialPosition.y) < 2
    ? tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
    : false;
};
