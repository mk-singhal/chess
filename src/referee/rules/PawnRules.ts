import { TeamType } from "../../Types";
import { Position, Piece, Pawn } from "../../models";
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
        new Position(desiredPosition.x, desiredPosition.y - pawnDirection),
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

  const normalMove = new Position(
    pawn.position.x,
    pawn.position.y + pawnDirection
  );
  const specialMove = new Position(
    pawn.position.x,
    pawn.position.y + pawnDirection * 2
  );
  const upperLeftAttack = new Position(
    pawn.position.x - 1,
    pawn.position.y + pawnDirection
  );
  const upperRightAttack = new Position(
    pawn.position.x + 1,
    pawn.position.y + pawnDirection
  );
  const enPassantLeftPosition = new Position(
    pawn.position.x - 1,
    pawn.position.y
  );
  const enPassantRightPosition = new Position(
    pawn.position.x + 1,
    pawn.position.y
  );

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
      enPassantLeftPosition.samePosition(p.position)
    );
    if (
      leftPiece !== undefined &&
      leftPiece.isPawn &&
      (leftPiece as Pawn).enPassant
    ) {
      possibleMoves.push(upperLeftAttack);
    }
  }

  if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
    possibleMoves.push(upperRightAttack);
  } else if (!tileIsOccupied(upperRightAttack, boardState)) {
    const rightPiece = boardState.find((p) =>
      enPassantRightPosition.samePosition(p.position)
    );
    if (
      rightPiece !== undefined &&
      rightPiece.isPawn &&
      (rightPiece as Pawn).enPassant
    ) {
      possibleMoves.push(upperRightAttack);
    }
  }

  return possibleMoves;
};
