import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import Referee from "../../referee/Referee";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  Piece,
  TeamType,
  PieceType,
  initialBoardState,
  Position,
  samePosition,
} from "../../constants";

function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessBoardRef = useRef<HTMLDivElement>(null);
  const referee = new Referee();

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessBoard = chessBoardRef.current;

    if (element.classList.contains("chess-piece") && chessBoard) {
      // console.log("Grab");

      const grabX = Math.floor(
        (e.clientX - chessBoard.offsetLeft) / (chessBoard.clientWidth / 8)
      );
      const grabY = Math.abs(
        Math.ceil(
          (e.clientY - chessBoard.offsetTop - chessBoard.clientHeight) /
            (chessBoard.clientHeight / 8)
        )
      );
      setGrabPosition({ x: grabX, y: grabY });

      const x = e.clientX - chessBoard.clientWidth / 16;
      const y = e.clientY - chessBoard.clientHeight / 16;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessBoard = chessBoardRef.current;

    if (activePiece && chessBoard) {
      // console.log("Move");
      const minX = chessBoard.offsetLeft - chessBoard.clientWidth / 32;
      const minY = chessBoard.offsetTop - chessBoard.clientHeight / 32;
      const maxX =
        chessBoard.offsetLeft +
        chessBoard.clientWidth -
        (chessBoard.clientWidth * 3) / 32;
      const maxY =
        chessBoard.offsetTop +
        chessBoard.clientHeight -
        (chessBoard.clientHeight * 3) / 32;
      const x = e.clientX - chessBoard.clientWidth / 16;
      const y = e.clientY - chessBoard.clientHeight / 16;
      activePiece.style.position = "absolute";
      activePiece.style.left =
        x < minX ? `${minX}px` : x > maxX ? `${maxX}` : `${x}px`;
      activePiece.style.top =
        y < minY ? `${minY}px` : y > maxY ? `${maxY}` : `${y}px`;
    }
  }

  function dropPiece(e: React.MouseEvent) {
    // console.log("Drop-out");

    const chessBoard = chessBoardRef.current;

    if (activePiece && chessBoard) {
      // console.log("Drop");
      const x = Math.floor(
        (e.clientX - chessBoard.offsetLeft) / (chessBoard.clientWidth / 8)
      );
      const y = Math.abs(
        Math.ceil(
          (e.clientY - chessBoard.offsetTop - chessBoard.clientHeight) /
            (chessBoard.clientHeight / 8)
        )
      );

      const currentPiece = pieces.find((p) =>
        samePosition(p.position, grabPosition)
      );

      if (currentPiece) {
        const validMove = referee.isValidMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const isEnPassantMove = referee.isEnPassantMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

        if (isEnPassantMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (
              !samePosition(piece.position, { x, y: y - pawnDirection })
            ) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }
            return results;
          }, [] as Piece[]);
          setPieces(updatedPieces);
        } else if (validMove) {
          // UPDATES the piece position
          // and if a piece is attacked, REMOVES it
          const updatedPiececs = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              // Special Move
              piece.enPassant =
                Math.abs(grabPosition.y - y) === 2 &&
                piece.type === PieceType.PAWN;

              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y })) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, [] as Piece[]);

          setPieces(updatedPiececs);
        } else {
          // RESETS the piece position
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("left");
          activePiece.style.removeProperty("top");
        }
      }

      setActivePiece(null);
    }
  }

  let board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) =>
        samePosition(p.position, { x: i, y: j })
      );
      let image = piece ? piece.image : undefined;

      board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
    }
  }
  return (
    <div
      onMouseUp={(e) => dropPiece(e)}
      onMouseMove={(e) => movePiece(e)}
      onMouseDown={(e) => grabPiece(e)}
      id="chessboard"
      ref={chessBoardRef}
    >
      {board}
    </div>
  );
}

export default Chessboard;
