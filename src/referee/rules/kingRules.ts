import { TeamType } from "../../Types";
import { Position, Piece } from "../../models";
import {
  positionOutOfBoard,
  tileIsEmptyOrOccupiedByOpponent,
} from "./GeneralRules";

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
    ) &&
    !positionOutOfBoard(new Position(king.position.x, king.position.y + 1))
  )
    possibleMoves.push(new Position(king.position.x, king.position.y + 1));

  // Right Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x + 1, king.position.y),
      boardState,
      king.team
    ) &&
    !positionOutOfBoard(new Position(king.position.x + 1, king.position.y))
  )
    possibleMoves.push(new Position(king.position.x + 1, king.position.y));

  // Lower Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x, king.position.y - 1),
      boardState,
      king.team
    ) &&
    !positionOutOfBoard(new Position(king.position.x, king.position.y - 1))
  )
    possibleMoves.push(new Position(king.position.x, king.position.y - 1));

  // Left Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x - 1, king.position.y),
      boardState,
      king.team
    ) &&
    !positionOutOfBoard(new Position(king.position.x - 1, king.position.y))
  )
    possibleMoves.push(new Position(king.position.x - 1, king.position.y));

  // Upper-left Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x - 1, king.position.y + 1),
      boardState,
      king.team
    ) &&
    !positionOutOfBoard(new Position(king.position.x - 1, king.position.y + 1))
  )
    possibleMoves.push(new Position(king.position.x - 1, king.position.y + 1));

  // Upper-right Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x + 1, king.position.y + 1),
      boardState,
      king.team
    ) &&
    !positionOutOfBoard(new Position(king.position.x + 1, king.position.y + 1))
  )
    possibleMoves.push(new Position(king.position.x + 1, king.position.y + 1));

  // Lower-right Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x + 1, king.position.y - 1),
      boardState,
      king.team
    ) &&
    !positionOutOfBoard(new Position(king.position.x + 1, king.position.y - 1))
  )
    possibleMoves.push(new Position(king.position.x + 1, king.position.y - 1));

  // Lower-Left Movement
  if (
    tileIsEmptyOrOccupiedByOpponent(
      new Position(king.position.x - 1, king.position.y - 1),
      boardState,
      king.team
    ) &&
    !positionOutOfBoard(new Position(king.position.x - 1, king.position.y - 1))
  )
    possibleMoves.push(new Position(king.position.x - 1, king.position.y - 1));

  return possibleMoves;
};

export const getCastlingMoves = (king: Piece, boardState: Piece[]) => {
  const possibleMoves: Position[] = [];

  if (king.hasMoved) return possibleMoves;

  // We get the rooks for the king's team
  const rooks = boardState.filter(
    (p) => p.isRook && p.team === king.team && !p.hasMoved
  );
  for (const rook of rooks) {
    const dir = rook.position.x - king.position.x > 0 ? 1 : -1;

    const adjacentPosition = king.position.clone();
    adjacentPosition.x += dir;

    // If rook can't move to the adjacent position of the king, we skip this iteration
    if (!rook.possibleMoves?.some((m) => m.samePosition(adjacentPosition)))
      continue;

    // Check if tiles in between are under attack by enemy
    const concerningTiles = rook.possibleMoves.filter(
      (m) => m.y === king.position.y
    );

    const enemyPieces = boardState.filter((p) => p.team !== king.team);

    let valid = true;

    for (const enemy of enemyPieces) {
      if (enemy.possibleMoves === undefined) continue;

      for (const move of enemy.possibleMoves) {
        if (concerningTiles.some((ct) => ct.samePosition(move))) {
          valid = false;
          break;
        }
      }

      if (!valid) break;
    }

    if (!valid) continue;

    // Add it to the possible moves
    possibleMoves.push(rook.position.clone());
  }

  return possibleMoves;
};
