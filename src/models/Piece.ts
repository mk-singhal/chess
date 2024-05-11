import { PieceType, TeamType } from "../Types";
import { Position } from "./Position";

export class Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  possibleMoves?: Position[];

  get isPawn(): boolean {
    return this.type === PieceType.PAWN;
  }

  get isBishop(): boolean {
    return this.type === PieceType.BISHOP;
  }

  get isKnight(): boolean {
    return this.type === PieceType.KNIGHT;
  }

  get isRook(): boolean {
    return this.type === PieceType.ROOK;
  }

  get isQueen(): boolean {
    return this.type === PieceType.QUEEN;
  }

  get isKing(): boolean {
    return this.type === PieceType.KING;
  }

  constructor(position: Position, type: PieceType, team: TeamType) {
    this.image = `assets/images/${type}_${team}.png`;
    this.position = position;
    this.type = type;
    this.team = team;
  }

  samePiecePosition(otherPiece: Piece): boolean {
    return this.position.samePosition(otherPiece.position);
  }

  samePosition(otherPosition: Position): boolean {
    return this.position.samePosition(otherPosition);
  }
}
