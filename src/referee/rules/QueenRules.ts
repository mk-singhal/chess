import { Piece, Position, TeamType } from "../../constants";
import { bishopMove } from "./BishopRules";
import { rookMove } from "./RookRules";

export const queenMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  return rookMove(initialPosition, desiredPosition, team, boardState)
    ? true
    : bishopMove(initialPosition, desiredPosition, team, boardState);
};
