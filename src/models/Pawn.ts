import { PieceType, TeamType } from "../Types";
import { Piece, Position } from "./index";

export class Pawn extends Piece {
  enPassant?: boolean;

  constructor(position: Position, team: TeamType) {
    super(position, PieceType.PAWN, team);
  }
}