import React, { ReactElement, useEffect, useState } from 'react'
import styles from './TableReporting.module.css'
import DataTable, { createTheme } from 'react-data-table-component'

const columns = [
  {
    name: 'Data Set'
  },
  {
    name: 'Datatoken'
  },
  {
    name: 'Time'
  }
]

createTheme('solarized', {
  text: {
    primary: '#268bd2',
    secondary: '#2aa198'
  },
  background: {
    default: styles.tableReportingTable
  },
  context: {
    background: '#cb4b16',
    text: '#FFFFFF'
  },
  divider: {
    default: '#073642'
  },
  action: {
    button: 'rgba(0,0,0,.54)',
    hover: 'rgba(0,0,0,.08)',
    disabled: 'rgba(0,0,0,.12)'
  }
})

export default function TableReporting(): ReactElement {
  return <DataTable columns={columns} data={['']} noHeader />
}
