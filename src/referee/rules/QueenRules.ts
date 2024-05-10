import { Piece, Position, TeamType } from "../../constants";
import { bishopMove, getPossibleBishopMoves } from "./BishopRules";
import { getPossibleRookMoves, rookMove } from "./RookRules";

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

export const getPossibleQueenMoves = (queen: Piece, boardState: Piece[]) => {
  return getPossibleRookMoves(queen, boardState).concat(
    getPossibleBishopMoves(queen, boardState)
  );
};
