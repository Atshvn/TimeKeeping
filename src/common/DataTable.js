import React from 'react';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';

const DataTableComp = ({
    data = () => { },
    columns = () => { },
    sizePage = 10
}) => {

    
        return (
            <ReactTable
                filterable={true}
                sortable={true}
                data={data}
                columns={columns}
                defaultPageSize={sizePage}
                className="-striped -highlight"
                previousText='<'
                nextText='>'
                loadingText='Loading...'
                noDataText='Không tìm thấy dữ liệu'
                pageText='Trang'
                ofText='của'
                rowsText='dòng'
                pageJumpText='chuyển đến trang'
                rowsSelectorText='số dòng trên trang '
                globalSearch={true}
            />
        )
}


export const DataTable = React.memo(DataTableComp)