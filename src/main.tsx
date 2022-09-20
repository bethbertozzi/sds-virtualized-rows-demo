import React from "react";
import {
  Table,
  TableRow,
  CellHeaderDirection,
  CellHeader,
  CellBasic,
} from "czifui";

import { StyledTableHeader } from "./style";

import "./index.css";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { makeData, Person } from "./makeData";
import { useVirtual } from "react-virtual";

function App() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorKey: "age",
        header: () => "Age",
        size: 50,
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        size: 50,
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        size: 80,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) => info.getValue<Date>().toLocaleString(),
      },
    ],
    []
  );

  const [data, setData] = React.useState(() => makeData(50_000));
  const refreshData = () => setData(() => makeData(50_000));

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <div className="p-2">
      <h1 className="title">Table with virtualized rows</h1>
      <p className="description"></p>
      <div ref={tableContainerRef} className="app">
        <Table>
          <StyledTableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <CellHeader
                      key={header.id}
                      colSpan={header.colSpan}
                      direction={
                        header.column.getIsSorted()
                          ? (header.column.getIsSorted() as CellHeaderDirection)
                          : null
                      }
                      active={!!header.column.getIsSorted()}
                      onClick={header.column.getToggleSortingHandler()}
                      shouldShowTooltipOnHover
                      tooltipText="This column uses a custom sorting function."
                      tooltipSubtitle="Sorts items based on their length."
                    >
                      {
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        ) as string
                      }
                    </CellHeader>
                  );
                })}
              </TableRow>
            ))}
          </StyledTableHeader>
          {paddingTop > 0 && (
            <TableRow>
              <td style={{ height: `${paddingTop}px` }} />
            </TableRow>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<Person>;
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <CellBasic
                      key={cell.id}
                      primaryText={
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        ) as string
                      }
                    >
                      {/* {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )} */}
                    </CellBasic>
                  );
                })}
              </TableRow>
            );
          })}
          {paddingBottom > 0 && (
            <TableRow>
              <td style={{ height: `${paddingBottom}px` }} />
            </TableRow>
          )}
        </Table>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
    </div>
  );
}

export default App;
