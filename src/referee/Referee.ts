import {
  Piece,
  PieceType,
  TeamType,
} from "../components/Chessboard/Chessboard";

export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    // console.log("Checking is tile is occupied");
    const piece = boardState.find((p) => p.x === x && p.y === y);
    // console.log(piece);
    return piece ? true : false;
  }

  tileIsOccupiedByOpponent(
    x: number,
    y: number,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    const piece = boardState.find(
      (p) => p.x === x && p.y === y && p.team !== team
    );
    return piece ? true : false;
  }

  isEnPassantMove(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if ((x - px === -1 || x - px === 1) && y - py === pawnDirection) {
        const piece = boardState.find(
          (p) => p.x === x && p.y === y - pawnDirection && p.enPassant
        )
        return piece ? true : false;
      }
    }
  }

  isValidMove(
    prevX: number,
    prevY: number,
    currX: number,
    currY: number,
    pieceType: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    // console.log("Referee is checking the move");
    // console.log(`Previous Location: (${prevX},${prevY})`);
    // console.log(`Previous Location: (${currX},${currY})`);
    // console.log(`Piece Type: ${pieceType}`);
    // console.log(`Piece Type: ${team}`);

    if (pieceType === PieceType.PAWN) {
      const specialRow = team === TeamType.OUR ? 1 : 6;
      const pawnDirection = team === TeamType.OUR ? 1 : -1;

      // Movement Logic
      if (
        prevY === specialRow &&
        prevX === currX &&
        currY - prevY === 2 * pawnDirection
      ) {
        // when pawn is on special row it can move 2 positions
        return (
          !this.tileIsOccupied(currX, currY, boardState) &&
          !this.tileIsOccupied(currX, currY - pawnDirection, boardState)
        );
      } else if (prevX === currX && currY - prevY === pawnDirection) {
        // pawn can move 1 position
        return !this.tileIsOccupied(currX, currY, boardState);
      }

      // Attacking Logic
      else if (currX - prevX === -1 && currY - prevY === pawnDirection) {
        // Attack in upper/bottom left corner
        return this.tileIsOccupiedByOpponent(currX, currY, boardState, team);
      } else if (currX - prevX === 1 && currY - prevY === pawnDirection) {
        // Attack in upper/bottom right corner
        return this.tileIsOccupiedByOpponent(currX, currY, boardState, team);
      }
    }

    return false;
  }
}
