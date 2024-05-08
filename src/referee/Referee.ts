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

  pawnMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
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
    return false;
  }

  knightMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
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
    return false;
  }

  bishopMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    if (desiredPosition.x - initialPosition.x === 0) return false;
    const positionFactor = {
      x:
        (desiredPosition.x - initialPosition.x) /
        Math.abs(desiredPosition.x - initialPosition.x),
      y:
        (desiredPosition.y - initialPosition.y) /
        Math.abs(desiredPosition.x - initialPosition.x),
    } as Position;
    if (Math.abs(positionFactor.x) === Math.abs(positionFactor.y)) {
      let tmpPosition = {
        x: initialPosition.x + positionFactor.x,
        y: initialPosition.y + positionFactor.y,
      } as Position;
      for (
        let i = 0;
        i < Math.abs(desiredPosition.x - initialPosition.x) - 1;
        i++
      ) {
        if (this.tileIsOccupied(tmpPosition, boardState)) return false;
        tmpPosition.x += positionFactor.x;
        tmpPosition.y += positionFactor.y;
      }

      return this.tileIsEmptyOrOccupiedByOpponent(
        tmpPosition,
        boardState,
        team
      );
    }
    return false;
  }

  rookMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
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
        if (this.tileIsOccupied({ x: initialPosition.x, y: tempY }, boardState))
          return false;
        tempY += factorY;
      }
      return this.tileIsEmptyOrOccupiedByOpponent(
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
        if (this.tileIsOccupied({ x: tempX, y: initialPosition.y }, boardState))
          return false;
        tempX += factorX;
      }
      return this.tileIsEmptyOrOccupiedByOpponent(
        { x: tempX, y: initialPosition.y },
        boardState,
        team
      );
    }
    return false;
  }
  
  queenMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    
    return this.rookMove(initialPosition, desiredPosition, team, boardState)
      ? true
      : this.bishopMove(initialPosition, desiredPosition, team, boardState);
  }

  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    pieceType: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    let validMove = false;
    switch (pieceType) {
      case PieceType.PAWN:
        validMove = this.pawnMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.KNIGHT:
        validMove = this.knightMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.BISHOP:
        validMove = this.bishopMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.ROOK:
        validMove = this.rookMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.QUEEN:
        validMove = this.queenMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
    }
    return validMove;
  }
}
