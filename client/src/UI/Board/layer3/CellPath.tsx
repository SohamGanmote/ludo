import { RoomState } from "@/types/types";
import Cell from "../Cell";
import SafeCell from "../SafeCell";
import { getCellPiecesLookup } from "../CellMap";

const CellPath = ({ roomState }: { roomState: RoomState }) => {

  const cellPieces = getCellPiecesLookup(roomState);

  const getPieces = (cellId: number) => cellPieces[cellId];

  return <div className="flex">
    <div>
      <Cell className="border" pieces={getPieces(5)} />
      <Cell className="border" pieces={getPieces(4)} />
      <Cell className="border" pieces={getPieces(3)} />
      <Cell className="border" pieces={getPieces(2)} />
      <SafeCell
        cellColor="blue" className="border"
        pieces={getPieces(1)}
      />
      <Cell className="border" pieces={getPieces(52)} />
    </div>

    <div>
      <Cell cellColor="blue" className="border-b border-t" pieces={getPieces(104)} />
      <Cell cellColor="blue" className="border-b border-t" pieces={getPieces(103)} />
      <Cell cellColor="blue" className="border-b" pieces={getPieces(102)} />
      <Cell cellColor="blue" className="border-b" pieces={getPieces(101)} />
      <Cell cellColor="blue" className="border-b" pieces={getPieces(100)} />
      <Cell className="border-b" pieces={getPieces(51)} />
    </div>

    <div>
      <Cell className="border" pieces={getPieces(45)} />
      <Cell className="border" pieces={getPieces(46)} />
      <Cell className="border" pieces={getPieces(47)} />
      <SafeCell
        cellColor="yellow" className="border"
        pieces={getPieces(48)}
      />
      <Cell className="border" pieces={getPieces(49)} />
      <Cell className="border" pieces={getPieces(50)} />
    </div>
  </div>
}
export default CellPath;