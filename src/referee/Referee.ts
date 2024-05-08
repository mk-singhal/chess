import { Piece, PieceType, Position, TeamType } from "../constants";
import { bishopMove, knightMove, pawnMove, queenMove, kingMove, rookMove } from "./rules/index";

export default class Referee {
  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
        );
        return piece ? true : false;
      }
    }
  }

  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    pieceType: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    let validMove = false;
    switch (pieceType) {
      case PieceType.PAWN:
        validMove = pawnMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.KNIGHT:
        validMove = knightMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.BISHOP:
        validMove = bishopMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.ROOK:
        validMove = rookMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.QUEEN:
        validMove = queenMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.KING:
        validMove = kingMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
    }
    return validMove;
  }
}
