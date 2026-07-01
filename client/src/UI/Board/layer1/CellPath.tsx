import { RoomState } from "@/types/types";
import Cell from "../Cell";
import { getCellPiecesLookup } from "../CellMap";
import SafeCell from "../SafeCell";

const CellPath = ({ roomState }: { roomState: RoomState }) => {

  const cellPieces = getCellPiecesLookup(roomState);

  const getPieces = (cellId: number) => cellPieces[cellId];

  return <div className="flex">
    <div>
      <Cell className="border" pieces={getPieces(24)} />
      <Cell className="border" pieces={getPieces(23)} />
      <SafeCell
        cellColor="red"
        className="border"
        pieces={getPieces(22)}
      />
      <Cell className="border" pieces={getPieces(21)} />
      <Cell className="border" pieces={getPieces(20)} />
      <Cell className="border" pieces={getPieces(19)} />
    </div>

    <div>
      <Cell className="border" pieces={getPieces(25)} />
      <Cell cellColor="green" className="border-b border-t" pieces={getPieces(300)} />
      <Cell cellColor="green" className="border-b" pieces={getPieces(301)} />
      <Cell cellColor="green" className="border-b" pieces={getPieces(302)} />
      <Cell cellColor="green" className="border-b" pieces={getPieces(303)} />
      <Cell cellColor="green" className="border-b" pieces={getPieces(304)} />
    </div>

    <div>
      <Cell className="border" pieces={getPieces(26)} />
      <SafeCell
        cellColor="green" className="border"
        pieces={getPieces(27)}
      />
      <Cell className="border" pieces={getPieces(28)} />
      <Cell className="border" pieces={getPieces(29)} />
      <Cell className="border" pieces={getPieces(30)} />
      <Cell className="border" pieces={getPieces(31)} />
    </div>
  </div>
}
export default CellPath;