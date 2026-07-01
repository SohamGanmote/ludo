import { RoomState } from "@/types/types";
import Cell from "../Cell";
import SafeCell from "../SafeCell";
import { getCellPiecesLookup } from "../CellMap";

const CellPath1 = ({ roomState }: { roomState: RoomState }) => {

  const cellPieces = getCellPiecesLookup(roomState);

  const getPieces = (cellId: number) => cellPieces[cellId];

  return <div className="flex">
    <div>
      <Cell className="border" pieces={getPieces(13)} />
      <Cell className="border" pieces={getPieces(12)} />
      <Cell className="border" pieces={getPieces(11)} />
    </div>

    <div>
      <SafeCell className="border-t border-l border-b" pieces={getPieces(14)} cellColor="red" />
      <Cell className="border-l" pieces={getPieces(200)} cellColor="red" />
      <Cell className="border" pieces={getPieces(10)} />
    </div>

    <div>
      <Cell className="border" pieces={getPieces(15)} />
      <Cell className="border-l" pieces={getPieces(201)} cellColor="red" />
      <SafeCell className="border" cellColor="blue" pieces={getPieces(9)} />
    </div>

    <div >
      <Cell className="border" pieces={getPieces(16)} />
      <Cell className="border-l" pieces={getPieces(202)} cellColor="red" />
      <Cell className="border" pieces={getPieces(8)} />
    </div>

    <div >
      <Cell className="border" pieces={getPieces(17)} />
      <Cell className="border-l" pieces={getPieces(203)} cellColor="red" />
      <Cell className="border" pieces={getPieces(7)} />
    </div>

    <div >
      <Cell className="border" pieces={getPieces(18)} />
      <Cell className="border-l border-r" pieces={getPieces(204)} cellColor="red" />
      <Cell className="border" pieces={getPieces(6)} />
    </div>
  </div>
}
export default CellPath1;