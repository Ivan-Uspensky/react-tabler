import { useState, useEffect } from "react";
import "./dataTable.css";

export const TableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);

  const COLUMN_INDEX_WITH_EXPANDER = 0;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = (e) => {
    updateTableMeta(value);
  };

  const onSelectChange = (e) => {
    setValue(e.target.value);
    updateTableMeta(e.target.value);
  };

  const onCheckChange = (e) => {
    setValue(e.target.checked);
    updateTableMeta(e.target.checked);
  };

  const updateTableMeta = (value) => {
    tableMeta?.updateData(row.original.id, column.id, value);
  }

  const renderCellType = (type) => {
    let el;
    switch (type) {
      case "select":
        el = (
          <select
            onChange={onSelectChange}
            value={initialValue}
          >
            {columnMeta?.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
      case "boolean":
        el = (
          <input
            checked={value}
            onChange={(e) => onCheckChange(e)}
            type="checkbox"
          />
        );
        break;
      case "string":
      case "number":
        el = (<input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />);
        break
      default:
        el = (<span>{value}</span>)
      
      return el;
    }
    
    const isFirst = columnMeta.columnIndex === COLUMN_INDEX_WITH_EXPANDER;

    return (
      <div style={{ paddingLeft: isFirst? `${row.depth * 2}rem` : "0px" }} >
        {row.getCanExpand() && isFirst ? (
          <button
            className="cell-expand-control"
            {...{
              onClick: row.getToggleExpandedHandler(),
            }}
          >
            {row.getIsExpanded() ? "-" : "+"}
          </button>
        ) : <span className="cell-expand-placeholder"/>}
        {el}
      </div>
    )
    
  }
  
  return renderCellType(columnMeta?.type);
};