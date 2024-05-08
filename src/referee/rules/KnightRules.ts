import { Piece, Position, TeamType } from "../../constants";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const knightMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      if (desiredPosition.x - initialPosition.x === 1 * i) {
        if (desiredPosition.y - initialPosition.y === 2 * j) {
          return tileIsEmptyOrOccupiedByOpponent(
            desiredPosition,
            boardState,
            team
          );
        }
      }
      if (desiredPosition.x - initialPosition.x === 2 * i) {
        if (desiredPosition.y - initialPosition.y === 1 * j) {
          return tileIsEmptyOrOccupiedByOpponent(
            desiredPosition,
            boardState,
            team
          );
        }
      }
    }
  }
  return false;
};
