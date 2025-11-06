import React from 'react';

const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => {
    return (
        <div className="table-wrapper">
            <table
                className={['table', className].filter(Boolean).join(' ')}
                {...props}
            >
                {props.children}
            </table>
        </div>
    );
};

const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
    return (
        <thead
            className={['table__header', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </thead>
    );
};

const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
    return (
        <tbody
            className={['table__body', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </tbody>
    );
};

const TableFooter = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
    return (
        <tfoot
            className={['table__footer', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </tfoot>
    );
};

const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
    return (
        <tr
            className={['table__row', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </tr>
    );
};

const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => {
    return (
        <th
            className={['table__head', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </th>
    );
};

const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => {
    return (
        <td
            className={['table__cell', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </td>
    );
};

const TableCaption = ({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) => {
    return (
        <caption
            className={['table__caption', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </caption>
    );
};

export {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
};
