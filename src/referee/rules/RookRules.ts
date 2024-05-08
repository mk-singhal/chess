import { Piece, Position, TeamType } from "../../constants";
import {
  tileIsOccupied,
  tileIsEmptyOrOccupiedByOpponent,
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
      if (tileIsOccupied({ x: initialPosition.x, y: tempY }, boardState))
        return false;
      tempY += factorY;
    }
    return tileIsEmptyOrOccupiedByOpponent(
      { x: initialPosition.x, y: tempY },
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
      if (tileIsOccupied({ x: tempX, y: initialPosition.y }, boardState))
        return false;
      tempX += factorX;
    }
    return tileIsEmptyOrOccupiedByOpponent(
      { x: tempX, y: initialPosition.y },
      boardState,
      team
    );
  }
  return false;
};
