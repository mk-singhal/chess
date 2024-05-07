import { Piece, PieceType, Position, TeamType } from "../constants";

export default class Referee {
  tileIsEmptyOrOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    return (
      this.tileIsOccupiedByOpponent(position, boardState, team) ||
      !this.tileIsOccupied(position, boardState)
    );
  }

  tileIsOccupied(position: Position, boardState: Piece[]): boolean {
    const piece = boardState.find(
      (p) => p.position.x === position.x && p.position.y === position.y
    );
    return piece ? true : false;
  }

  tileIsOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    const piece = boardState.find(
      (p) =>
        p.position.x === position.x &&
        p.position.y === position.y &&
        p.team !== team
    );
    return piece ? true : false;
  }

  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
        );
        return piece ? true : false;
      }
    }
  }

  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    pieceType: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    if (pieceType === PieceType.PAWN) {
      const specialRow = team === TeamType.OUR ? 1 : 6;
      const pawnDirection = team === TeamType.OUR ? 1 : -1;
      // Movement Logic
      if (
        initialPosition.y === specialRow &&
        initialPosition.x === desiredPosition.x &&
        desiredPosition.y - initialPosition.y === 2 * pawnDirection
      ) {
        // when pawn is on special row it can move 2 positions
        return (
          !this.tileIsOccupied(desiredPosition, boardState) &&
          !this.tileIsOccupied(
            {
              x: desiredPosition.x,
              y: desiredPosition.y - pawnDirection,
            },
            boardState
          )
        );
      } else if (
        initialPosition.x === desiredPosition.x &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        // pawn can move 1 position
        return !this.tileIsOccupied(desiredPosition, boardState);
      }
      // Attacking Logic
      else if (
        desiredPosition.x - initialPosition.x === -1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        // Attack in upper/bottom left corner
        return this.tileIsOccupiedByOpponent(desiredPosition, boardState, team);
      } else if (
        desiredPosition.x - initialPosition.x === 1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        // Attack in upper/bottom right corner
        return this.tileIsOccupiedByOpponent(desiredPosition, boardState, team);
      }
    } 
    
    else if (pieceType === PieceType.KNIGHT) {
      for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
          if (desiredPosition.x - initialPosition.x === 1 * i) {
            if (desiredPosition.y - initialPosition.y === 2 * j) {
              return this.tileIsEmptyOrOccupiedByOpponent(
                desiredPosition,
                boardState,
                team
              );
            }
          }
          if (desiredPosition.x - initialPosition.x === 2 * i) {
            if (desiredPosition.y - initialPosition.y === 1 * j) {
              return this.tileIsEmptyOrOccupiedByOpponent(
                desiredPosition,
                boardState,
                team
              );
            }
          }
        }
      }
    }

    else if (pieceType === PieceType.BISHOP) {
      const positionFactor = {
        x: (desiredPosition.x - initialPosition.x) / Math.abs(desiredPosition.x - initialPosition.x),
        y: (desiredPosition.y - initialPosition.y) / Math.abs(desiredPosition.x - initialPosition.x),
      } as Position;
      if (Math.abs(positionFactor.x) === Math.abs(positionFactor.y)) {
        let tmpPosition = {
          x: initialPosition.x + positionFactor.x,
          y: initialPosition.y + positionFactor.y,
        } as Position;
        while (tmpPosition.x !== desiredPosition.x) {
          if (this.tileIsOccupied(tmpPosition, boardState)) return false;
          tmpPosition.x += positionFactor.x;
          tmpPosition.y += positionFactor.y;
        }
        return this.tileIsEmptyOrOccupiedByOpponent(tmpPosition, boardState, team);
      }
    }

    return false;
  }
}
