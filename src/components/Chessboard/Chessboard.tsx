import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from "../../constants";
import { Piece, Position } from "../../models";

interface Props {
  playMove: (playedPiece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

function Chessboard({ playMove, pieces }: Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(
    new Position(-1, -1)
  );
  const chessBoardRef = useRef<HTMLDivElement>(null);

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
      setGrabPosition(new Position(grabX, grabY));

      const x = e.clientX - chessBoard.clientWidth / 16;
      const y = e.clientY - chessBoard.clientHeight / 16;
      element.style.position = "absolute";
      element.style.zIndex = "1";
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

      const currentPiece = pieces.find((p) => p.samePosition(grabPosition));

      if (currentPiece) {
        var success = playMove(currentPiece.clone(), new Position(x, y));

        if (!success) {
          // RESETS the piece position
          activePiece.style.position = "relative";
          activePiece.style.zIndex = "auto";
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
      const piece = pieces.find((p) => p.samePosition(new Position(i, j)));
      let image = piece ? piece.image : undefined;

      let currentPiece =
        activePiece !== null
          ? pieces.find((p) => p.samePosition(grabPosition))
          : undefined;
      let highlight = currentPiece?.possibleMoves
        ? currentPiece.possibleMoves.some((p) =>
            p.samePosition(new Position(i, j))
          )
        : false;

      board.push(
        <Tile
          key={`${j},${i}`}
          image={image}
          number={number}
          highlight={highlight}
        />
      );
    }
  }
  return (
    <>
      <div
        onMouseUp={(e) => dropPiece(e)}
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        id="chessboard"
        ref={chessBoardRef}
      >
        {board}
      </div>
    </>
  );
}

export default Chessboard;
