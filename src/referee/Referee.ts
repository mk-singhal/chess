import { PieceType, TeamType } from "../components/Chessboard/Chessboard";

export default class Referee {
  isValidMove(prevX: number, prevY: number, currX: number, currY: number, pieceType: PieceType, teamType: TeamType) {
    console.log("Referee is checking the move");
    console.log(`Previous Location: (${prevX},${prevY})`);
    console.log(`Previous Location: (${currX},${currY})`);
    console.log(`Piece Type: ${pieceType}`);
    console.log(`Piece Type: ${teamType}`);
    
    if (pieceType === PieceType.PAWN) {
      if (teamType === TeamType.OUR) {
        if (prevY === 1) {
          if (prevX === currX && (currY-prevY === 1 || currY-prevY === 2)) {
            return true;
          }
        } else {
          if (prevX === currX && currY-prevY === 1) {
            return true;
          }
        }
      }
    }

    return false;
  }
}