import { RoomState } from "@/types/types";
import Cell from "../Cell";
import SafeCell from "../SafeCell";
import { getCellPiecesLookup } from "../CellMap";

const CellPath2 = ({ roomState }: { roomState: RoomState }) => {

  const cellPieces = getCellPiecesLookup(roomState);

  const getPieces = (cellId: number) => cellPieces[cellId];

  return <div className="flex">
    <div>
      <Cell className="border" pieces={getPieces(32)} />
      <Cell className="border-r border-l" pieces={getPieces(404)} cellColor="yellow" />
      <Cell className="border" pieces={getPieces(44)} />
    </div>

    <div>
      <Cell className="border-t border-l border-b" pieces={getPieces(33)} />
      <Cell className="border-r" pieces={getPieces(403)} cellColor="yellow" />
      <Cell className="border" pieces={getPieces(43)} />
    </div>

    <div>
      <Cell className="border" pieces={getPieces(34)} />
      <Cell className="border-r" pieces={getPieces(402)} cellColor="yellow" />
      <Cell className="border" pieces={getPieces(42)} />
    </div>

    <div >
      <SafeCell className="border" pieces={getPieces(35)} cellColor="green" />
      <Cell className="border-r" pieces={getPieces(401)} cellColor="yellow" />
      <Cell className="border" pieces={getPieces(41)} />
    </div>

    <div >
      <Cell className="border" pieces={getPieces(36)} />
      <Cell className="border-r" pieces={getPieces(400)} cellColor="yellow" />
      <SafeCell className="border" pieces={getPieces(40)} cellColor="yellow" />
    </div>

    <div >
      <Cell className="border" pieces={getPieces(37)} />
      <Cell className="border-r" pieces={getPieces(38)} />
      <Cell className="border" pieces={getPieces(39)} />
    </div>
  </div>
}
export default CellPath2;