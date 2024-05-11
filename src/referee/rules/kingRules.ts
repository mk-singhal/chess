import { TeamType } from "../../Types";
import { Position, Piece } from "../../models";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const kingMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (
    desiredPosition.x === initialPosition.x &&
    desiredPosition.y === initialPosition.y
  )
    return false;
  return Math.abs(desiredPosition.x - initialPosition.x) < 2 &&
    Math.abs(desiredPosition.y - initialPosition.y) < 2
    ? tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
    : false;
};

export const getPossibleKingMoves = (king: Piece, boardState: Piece[]) => {
  const possibleMoves: Position[] = [];
  // Upper Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x, king.position.y + 1),
      boardState,
      king.team
    )
  )
    possibleMoves.push(new Position(king.position.x, king.position.y + 1));

  // Right Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x + 1, king.position.y),
      boardState,
      king.team
    )
  )
    possibleMoves.push(new Position(king.position.x + 1, king.position.y));

  // Lower Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x, king.position.y - 1),
      boardState,
      king.team
    )
  )
    possibleMoves.push(new Position(king.position.x, king.position.y - 1));

  // Left Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x - 1, king.position.y),
      boardState,
      king.team
    )
  )
    possibleMoves.push(new Position(king.position.x - 1, king.position.y));

  // Upper-left Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x - 1, king.position.y + 1),
      boardState,
      king.team
    )
  )
    possibleMoves.push(new Position(king.position.x - 1, king.position.y + 1));

  // Upper-right Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x + 1, king.position.y + 1),
      boardState,
      king.team
    )
  )
    possibleMoves.push(new Position(king.position.x + 1, king.position.y + 1));

  // Lower-right Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x + 1, king.position.y - 1),
      boardState,
      king.team
    )
  )
    possibleMoves.push(new Position(king.position.x + 1, king.position.y - 1));

  // Lower-Left Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x - 1, king.position.y - 1),
      boardState,
      king.team
    )
  )
    possibleMoves.push(new Position(king.position.x - 1, king.position.y - 1));

  return possibleMoves;
};
