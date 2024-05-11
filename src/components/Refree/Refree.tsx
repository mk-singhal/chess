import { useEffect, useRef, useState } from "react";
import { initialBoardState } from "../../constants";
import Chessboard from "../Chessboard/Chessboard";
import {
  bishopMove,
  getPossibleBishopMoves,
  getPossibleKingMoves,
  getPossibleKnightMoves,
  getPossiblePawnMoves,
  getPossibleQueenMoves,
  getPossibleRookMoves,
  kingMove,
  knightMove,
  pawnMove,
  queenMove,
  rookMove,
} from "../../referee/rules";
import { Pawn, Piece, Position } from "../../models";
import { PieceType, TeamType } from "../../Types";

export default function Referee() {
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updatePossibleMoves();
  });

  function updatePossibleMoves() {
    setPieces((currentPieces) => {
      return currentPieces.map((p) => {
        p.possibleMoves = getValidMoves(p, currentPieces);
        return p;
      });
    });
  }

  function playMove(playedPiece: Piece, destination: Position): boolean {
    const validMove = isValidMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );
    const grabPositionX = playedPiece.position.x;
    const grabPositionY = playedPiece.position.y;
    const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

    if (enPassantMove) {
      const updatedPieces = pieces.reduce((results, piece) => {
        if (
          piece.samePosition(
            new Position(grabPositionX, grabPositionY)
          )
        ) {
          if (piece.isPawn)
            (piece as Pawn).enPassant = false;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          results.push(piece);
        } else if (
          !piece.samePosition(
            new Position(destination.x, destination.y - pawnDirection)
          )
        ) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }
        return results;
      }, [] as Piece[]);

      updatePossibleMoves();
      setPieces(updatedPieces);
    } else if (validMove) {
      // UPDATES the piece position
      // and if a piece is attacked, REMOVES it
      const updatedPiececs = pieces.reduce((results, piece) => {
        if (
          piece.samePosition(
            new Position(grabPositionX, grabPositionY)
          )
        ) {
          // Special Move
          if (piece.isPawn)
            (piece as Pawn).enPassant =
              Math.abs(grabPositionY - destination.y) === 2 &&
              piece.type === PieceType.PAWN;

          piece.position.x = destination.x;
          piece.position.y = destination.y;

          let promotionRow = piece.team === TeamType.OUR ? 7 : 0;

          if (destination.y === promotionRow && piece.type === PieceType.PAWN) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(piece);
          }

          results.push(piece);
        } else if (
          !piece.samePosition(
            new Position(destination.x, destination.y)
          )
        ) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }

          results.push(piece);
        }

        return results;
      }, [] as Piece[]);

      updatePossibleMoves();
      setPieces(updatedPiececs);
    } else {
      return false;
    }
    return true;
  }

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.isPawn &&
            (p as Pawn).enPassant
        );
        return piece ? true : false;
      }
    }
  }

  function isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    pieceType: PieceType,
    team: TeamType
  ) {
    let validMove = false;
    switch (pieceType) {
      case PieceType.PAWN:
        validMove = pawnMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KNIGHT:
        validMove = knightMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.BISHOP:
        validMove = bishopMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.ROOK:
        validMove = rookMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.QUEEN:
        validMove = queenMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KING:
        validMove = kingMove(initialPosition, desiredPosition, team, pieces);
        break;
    }
    return validMove;
  }

  function getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) return;
    const updatedPieces = pieces.reduce((results, piece) => {
      if (piece.samePiecePosition(promotionPawn)) {
        piece.type = pieceType;
        const teamType = piece.team === TeamType.OUR ? "w" : "b";
        let image = "";
        switch (pieceType) {
          case PieceType.ROOK:
            image = "rook";
            break;
          case PieceType.BISHOP:
            image = "bishop";
            break;
          case PieceType.KNIGHT:
            image = "knight";
            break;
          case PieceType.QUEEN:
            image = "queen";
            break;
        }
        piece.image = `assets/images/${image}_${teamType}.png`;
      }
      results.push(piece);
      return results;
    }, [] as Piece[]);

    updatePossibleMoves();
    setPieces(updatedPieces);

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.OUR ? "w" : "b";
  }

  return (
    <>
      <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
        <div className="modal-body">
          <img
            onClick={() => promotePawn(PieceType.ROOK)}
            src={`/assets/images/rook_${promotionTeamType()}.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.BISHOP)}
            src={`/assets/images/bishop_${promotionTeamType()}.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.KNIGHT)}
            src={`/assets/images/knight_${promotionTeamType()}.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.QUEEN)}
            src={`/assets/images/queen_${promotionTeamType()}.png`}
          />
        </div>
      </div>
      <Chessboard playMove={playMove} pieces={pieces} />
    </>
  );
}
