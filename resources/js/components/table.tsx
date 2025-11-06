import React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

const Table = ({ className, ...props }: TableProps) => {
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

interface TableHeaderProps
    extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = ({ className, ...props }: TableHeaderProps) => {
    return (
        <thead
            className={['table__header', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </thead>
    );
};

interface TableBodyProps
    extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = ({ className, ...props }: TableBodyProps) => {
    return (
        <tbody
            className={['table__body', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </tbody>
    );
};

interface TableFooterProps
    extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = ({ className, ...props }: TableFooterProps) => {
    return (
        <tfoot
            className={['table__footer', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </tfoot>
    );
};

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

const TableRow = ({ className, ...props }: TableRowProps) => {
    return (
        <tr
            className={['table__row', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </tr>
    );
};

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

const TableHead = ({ className, ...props }: TableHeadProps) => {
    return (
        <th
            className={['table__head', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </th>
    );
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = ({ className, ...props }: TableCellProps) => {
    return (
        <td
            className={['table__cell', className].filter(Boolean).join(' ')}
            {...props}
        >
            {props.children}
        </td>
    );
};

interface TableCaptionProps
    extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = ({ className, ...props }: TableCaptionProps) => {
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
