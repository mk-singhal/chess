import { PieceType, TeamType } from "../Types";
import { Piece, Position } from "./index";

export class Pawn extends Piece {
  enPassant?: Boolean;

  constructor(
    position: Position,
    team: TeamType,
    enPassant?: Boolean,
    possibleMoves: Position[] = []
  ) {
    super(position, PieceType.PAWN, team, possibleMoves);
    this.enPassant = enPassant;
  }

  clone(): Pawn {
    return new Pawn(
      this.position.clone(),
      this.team,
      this.enPassant,
      this.possibleMoves?.map((m) => m.clone())
    );
  }
}
