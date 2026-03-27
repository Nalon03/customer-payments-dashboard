/**
 * Column definitions for the payments table: labels, sortable flags, and `key`
 * paths into each row object. Reordering or editing entries updates headers and sorting.
 */
export const PAYMENT_COLUMNS = [
    { key: 'PaymentNumber', label: 'Payment #',    sortable: true  },
    { key: 'Customer',      label: 'Customer',      sortable: true  },
    { key: 'Amount',        label: 'Amount (GHS)',  sortable: true  },
    { key: 'PaymentDate',   label: 'Date',          sortable: true  },
    { key: 'Status',        label: 'Status',        sortable: false },
    { key: 'actions',       label: '',              sortable: false },
  ]