import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import {
  tileIsOccupied,
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

export const rookMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (
    initialPosition.x === desiredPosition.x &&
    desiredPosition.y !== initialPosition.y
  ) {
    const factorY =
      (desiredPosition.y - initialPosition.y) /
      Math.abs(desiredPosition.y - initialPosition.y);
    let tempY = initialPosition.y + factorY;
    for (
      let i = 0;
      i < Math.abs(desiredPosition.y - initialPosition.y) - 1;
      i++
    ) {
      if (tileIsOccupied(new Position(initialPosition.x, tempY), boardState))
        return false;
      tempY += factorY;
    }
    return tileIsEmptyOrOccupiedByOpponent(
      new Position(initialPosition.x, tempY),
      boardState,
      team
    );
  } else if (
    initialPosition.y === desiredPosition.y &&
    desiredPosition.x !== initialPosition.x
  ) {
    const factorX =
      (desiredPosition.x - initialPosition.x) /
      Math.abs(desiredPosition.x - initialPosition.x);
    let tempX = initialPosition.x + factorX;
    for (
      let i = 0;
      i < Math.abs(desiredPosition.x - initialPosition.x) - 1;
      i++
    ) {
      if (tileIsOccupied(new Position(tempX, initialPosition.y), boardState))
        return false;
      tempX += factorX;
    }
    return tileIsEmptyOrOccupiedByOpponent(
      new Position(tempX, initialPosition.y),
      boardState,
      team
    );
  }
  return false;
};

export const getPossibleRookMoves = (rook: Piece, boardState: Piece[]) => {
  const possibleMoves: Position[] = [];
  // Right Movement
  for (let i = 1; i < 8; i++) {
    const tmpPosition = new Position(rook.position.x + i, rook.position.y);
    if (!tileIsOccupied(tmpPosition, boardState)) {
      possibleMoves.push(tmpPosition);
    } else if (tileIsOccupiedByOpponent(tmpPosition, boardState, rook.team)) {
      possibleMoves.push(tmpPosition);
      break;
    } else {
      break;
    }
  }
  // Lower Movement
  for (let i = 1; i < 8; i++) {
    const tmpPosition = new Position(rook.position.x, rook.position.y - i);
    if (!tileIsOccupied(tmpPosition, boardState)) {
      possibleMoves.push(tmpPosition);
    } else if (tileIsOccupiedByOpponent(tmpPosition, boardState, rook.team)) {
      possibleMoves.push(tmpPosition);
      break;
    } else {
      break;
    }
  }
  // Left Movement
  for (let i = 1; i < 8; i++) {
    const tmpPosition = new Position(rook.position.x - i, rook.position.y);
    if (!tileIsOccupied(tmpPosition, boardState)) {
      possibleMoves.push(tmpPosition);
    } else if (tileIsOccupiedByOpponent(tmpPosition, boardState, rook.team)) {
      possibleMoves.push(tmpPosition);
      break;
    } else {
      break;
    }
  }
  // Upper Movement
  for (let i = 1; i < 8; i++) {
    const tmpPosition = new Position(rook.position.x, rook.position.y + i);
    if (!tileIsOccupied(tmpPosition, boardState)) {
      possibleMoves.push(tmpPosition);
    } else if (tileIsOccupiedByOpponent(tmpPosition, boardState, rook.team)) {
      possibleMoves.push(tmpPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};
