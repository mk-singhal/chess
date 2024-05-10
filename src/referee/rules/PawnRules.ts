import {
  Piece,
  PieceType,
  Position,
  TeamType,
  samePosition,
} from "../../constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const pawnMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const specialRow = team === TeamType.OUR ? 1 : 6;
  const pawnDirection = team === TeamType.OUR ? 1 : -1;
  // Movement Logic
  if (
    initialPosition.y === specialRow &&
    initialPosition.x === desiredPosition.x &&
    desiredPosition.y - initialPosition.y === 2 * pawnDirection
  ) {
    // when pawn is on special row it can move 2 positions
    return (
      !tileIsOccupied(desiredPosition, boardState) &&
      !tileIsOccupied(
        {
          x: desiredPosition.x,
          y: desiredPosition.y - pawnDirection,
        },
        boardState
      )
    );
  } else if (
    initialPosition.x === desiredPosition.x &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    // pawn can move 1 position
    return !tileIsOccupied(desiredPosition, boardState);
  }
  // Attacking Logic
  else if (
    desiredPosition.x - initialPosition.x === -1 &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    // Attack in upper/bottom left corner
    return tileIsOccupiedByOpponent(desiredPosition, boardState, team);
  } else if (
    desiredPosition.x - initialPosition.x === 1 &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    // Attack in upper/bottom right corner
    return tileIsOccupiedByOpponent(desiredPosition, boardState, team);
  }
  return false;
};

export const getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]) => {
  const possibleMoves: Position[] = [];

  const specialRow = pawn.team === TeamType.OUR ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;

  const normalMove: Position = {
    x: pawn.position.x,
    y: pawn.position.y + pawnDirection,
  };
  const specialMove: Position = {
    x: pawn.position.x,
    y: pawn.position.y + pawnDirection * 2,
  };
  const upperLeftAttack: Position = {
    x: pawn.position.x - 1,
    y: pawn.position.y + pawnDirection,
  };
  const upperRightAttack: Position = {
    x: pawn.position.x + 1,
    y: pawn.position.y + pawnDirection,
  };
  const enPassantLeftPosition: Position = {
    x: pawn.position.x - 1,
    y: pawn.position.y,
  };
  const enPassantRightPosition: Position = {
    x: pawn.position.x + 1,
    y: pawn.position.y,
  };

  if (!tileIsOccupied(normalMove, boardState)) {
    possibleMoves.push(normalMove);

    if (
      pawn.position.y === specialRow &&
      !tileIsOccupied(specialMove, boardState)
    ) {
      possibleMoves.push(specialMove);
    }
  }
  if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)) {
    possibleMoves.push(upperLeftAttack);
  } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
    const leftPiece = boardState.find((p) =>
      samePosition(enPassantLeftPosition, p.position)
    );
    if (
      leftPiece !== undefined &&
      leftPiece.type === PieceType.PAWN &&
      leftPiece.enPassant
    ) {
      possibleMoves.push(upperLeftAttack);
    }
  }

  if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
    possibleMoves.push(upperRightAttack);
  } else if (!tileIsOccupied(upperRightAttack, boardState)) {
    const rightPiece = boardState.find((p) =>
      samePosition(enPassantRightPosition, p.position)
    );
    if (
      rightPiece !== undefined &&
      rightPiece.type === PieceType.PAWN &&
      rightPiece.enPassant
    ) {
      possibleMoves.push(upperRightAttack);
    }
  }

  return possibleMoves;
};
