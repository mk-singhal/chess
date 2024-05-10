import { Piece, Position, TeamType } from "../../constants";
import {
  tileIsOccupied,
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

export const bishopMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (desiredPosition.x - initialPosition.x === 0) return false;
  const positionFactor = {
    x:
      (desiredPosition.x - initialPosition.x) /
      Math.abs(desiredPosition.x - initialPosition.x),
    y:
      (desiredPosition.y - initialPosition.y) /
      Math.abs(desiredPosition.x - initialPosition.x),
  } as Position;
  if (Math.abs(positionFactor.x) === Math.abs(positionFactor.y)) {
    let tmpPosition = {
      x: initialPosition.x + positionFactor.x,
      y: initialPosition.y + positionFactor.y,
    } as Position;
    for (
      let i = 0;
      i < Math.abs(desiredPosition.x - initialPosition.x) - 1;
      i++
    ) {
      if (tileIsOccupied(tmpPosition, boardState)) return false;
      tmpPosition.x += positionFactor.x;
      tmpPosition.y += positionFactor.y;
    }

    return tileIsEmptyOrOccupiedByOpponent(tmpPosition, boardState, team);
  }
  return false;
};

export const getPossibleBishopMoves = (bishop: Piece, boardState: Piece[]) => {
  const possibleMoves: Position[] = [];
  // Upper-right Movement
  for (let i = 1; i < 8; i++) {
    const tmpPosition: Position = {
      x: bishop.position.x + i,
      y: bishop.position.y + i,
    };
    if (!tileIsOccupied(tmpPosition, boardState)) {
      possibleMoves.push(tmpPosition);
    } else if (tileIsOccupiedByOpponent(tmpPosition, boardState, bishop.team)) {
      possibleMoves.push(tmpPosition);
      break;
    } else {
      break;
    }
  }
  // Lower-right Movement
  for (let i = 1; i < 8; i++) {
    const tmpPosition: Position = {
      x: bishop.position.x + i,
      y: bishop.position.y - i,
    };
    if (!tileIsOccupied(tmpPosition, boardState)) {
      possibleMoves.push(tmpPosition);
    } else if (tileIsOccupiedByOpponent(tmpPosition, boardState, bishop.team)) {
      possibleMoves.push(tmpPosition);
      break;
    } else {
      break;
    }
  }
  // Lower-left Movement
  for (let i = 1; i < 8; i++) {
    const tmpPosition: Position = {
      x: bishop.position.x - i,
      y: bishop.position.y - i,
    };
    if (!tileIsOccupied(tmpPosition, boardState)) {
      possibleMoves.push(tmpPosition);
    } else if (tileIsOccupiedByOpponent(tmpPosition, boardState, bishop.team)) {
      possibleMoves.push(tmpPosition);
      break;
    } else {
      break;
    }
  }
  // Upper-left Movement
  for (let i = 1; i < 8; i++) {
    const tmpPosition: Position = {
      x: bishop.position.x - i,
      y: bishop.position.y + i,
    };
    if (!tileIsOccupied(tmpPosition, boardState)) {
      possibleMoves.push(tmpPosition);
    } else if (tileIsOccupiedByOpponent(tmpPosition, boardState, bishop.team)) {
      possibleMoves.push(tmpPosition);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
};
