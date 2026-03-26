// Defines the payments table column configuration.

export const PAYMENT_COLUMNS = [
    { key: 'PaymentNumber', label: 'Payment #',   sortable: true  },
    { key: 'Customer',      label: 'Customer',     sortable: true  },
    { key: 'Amount',        label: 'Amount (GHS)', sortable: true  },
    { key: 'PaymentDate',   label: 'Date',         sortable: true  },
    { key: 'actions',       label: '',             sortable: false },
  ]