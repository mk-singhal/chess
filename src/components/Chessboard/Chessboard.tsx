import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece {
  image: string;
  x: number;
  y: number;
}

const initialBoardState: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const type = p === 0 ? "b" : "w";
  const y = p === 0 ? 7 : 0;

  initialBoardState.push({ image: `assets/images/rook_${type}.png`, x: 0, y });
  initialBoardState.push({ image: `assets/images/rook_${type}.png`, x: 7, y });
  initialBoardState.push({ image: `assets/images/knight_${type}.png`, x: 1, y });
  initialBoardState.push({ image: `assets/images/knight_${type}.png`, x: 6, y });
  initialBoardState.push({ image: `assets/images/bishop_${type}.png`, x: 2, y });
  initialBoardState.push({ image: `assets/images/bishop_${type}.png`, x: 5, y });
  initialBoardState.push({ image: `assets/images/queen_${type}.png`, x: 3, y });
  initialBoardState.push({ image: `assets/images/king_${type}.png`, x: 4, y });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: "assets/images/pawn_b.png", x: i, y: 6 });
  initialBoardState.push({ image: "assets/images/pawn_w.png", x: i, y: 1 });
}

function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY  ] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessBoardRef = useRef<HTMLDivElement>(null);

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;    
    const chessBoard = chessBoardRef.current;

    if (element.classList.contains("chess-piece") && chessBoard) {
      setGridX(Math.floor((e.clientX - chessBoard.offsetLeft) / ((chessBoard.clientWidth)/8)));
      setGridY(Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - chessBoard.clientHeight) / ((chessBoard.clientHeight)/8))));
      const x = e.clientX - ((chessBoard.clientWidth)/16);
      const y = e.clientY - ((chessBoard.clientHeight)/16);
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessBoard = chessBoardRef.current;
    
    if (activePiece && chessBoard) {
      const minX = chessBoard.offsetLeft - ((chessBoard.clientWidth)/32);
      const minY = chessBoard.offsetTop - ((chessBoard.clientHeight)/32);
      const maxX = chessBoard.offsetLeft + chessBoard.clientWidth - ((chessBoard.clientWidth*3)/32);
      const maxY = chessBoard.offsetTop + chessBoard.clientHeight - ((chessBoard.clientHeight*3)/32);
      const x = e.clientX - ((chessBoard.clientWidth)/16);
      const y = e.clientY - ((chessBoard.clientHeight)/16);
      activePiece.style.position = "absolute";
      activePiece.style.left = x < minX ? `${minX}px` : (x > maxX ? `${maxX}` : `${x}px`);
      activePiece.style.top = y < minY ? `${minY}px` : (y > maxY ? `${maxY}` : `${y}px`);
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessBoard = chessBoardRef.current;
    
    if (activePiece && chessBoard) {
      const x = Math.floor((e.clientX - chessBoard.offsetLeft) / ((chessBoard.clientWidth)/8));
      const y = Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - chessBoard.clientHeight) / ((chessBoard.clientHeight)/8)));
      
      setPieces((board) => {
        const pieces = board.map((piece) => {
          if (piece.x === gridX && piece.y === gridY) {
            piece.x = x;
            piece.y = y;
          }
          return piece;
        })
        return pieces;
      })
      setActivePiece(null);
    }
  }

  let board = [];

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i + 2;
      let image = undefined;

      pieces.forEach((p) => {
        if (p.x === i && p.y === j) {
          image = p.image;
        }
      });

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
