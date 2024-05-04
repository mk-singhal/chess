import {
  Piece,
  PieceType,
  TeamType,
} from "../components/Chessboard/Chessboard";

export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    console.log("Checking is tile is occupied");
    const piece = boardState.find((p) => p.x === x && p.y == y);
    console.log(piece);
    return piece ? true : false;
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
    console.log("Referee is checking the move");
    console.log(`Previous Location: (${prevX},${prevY})`);
    console.log(`Previous Location: (${currX},${currY})`);
    console.log(`Piece Type: ${pieceType}`);
    console.log(`Piece Type: ${team}`);

    if (pieceType === PieceType.PAWN) {
      const specialRow = team === TeamType.OUR ? 1 : 6;
      const pawnDirection = team === TeamType.OUR ? 1 : -1;

      if (
        prevY === specialRow &&
        prevX === currX &&
        currY - prevY === 2 * pawnDirection
      ) {
        return (
          !this.tileIsOccupied(currX, currY, boardState) &&
          !this.tileIsOccupied(currX, currY - pawnDirection, boardState)
        );
      } else if (prevX === currX && currY - prevY === pawnDirection) {
        return !this.tileIsOccupied(currX, currY, boardState);
      }
    }

    return false;
  }
}
