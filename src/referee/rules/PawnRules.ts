import { Piece, Position, TeamType } from "../../constants";
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

  if (
    !tileIsOccupied(
      { x: pawn.position.x, y: pawn.position.y + pawnDirection },
      boardState
    )
  ) {
    possibleMoves.push({
      x: pawn.position.x,
      y: pawn.position.y + pawnDirection,
    });
    
    if (
      pawn.position.y === specialRow &&
      !tileIsOccupied(
        { x: pawn.position.x, y: pawn.position.y + 2 * pawnDirection },
        boardState
      )
    ) {
      possibleMoves.push({
        x: pawn.position.x,
        y: pawn.position.y + pawnDirection * 2,
      });
    }
  }

  return possibleMoves;
};
