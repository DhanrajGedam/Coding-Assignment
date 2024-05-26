import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const customStyles = {
  headRow: {
    style: {
      backgroundColor: 'blue',
      color: 'white',
    },
  },
  headCells: {
    style: {
      fontSize: '16px',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
  },
  cells: {
    style: {
      fontSize: '15px',
    },
  },
};

function Details() {
  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(0);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth]);

  const fetchData = async (selectedMonth) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?month=${selectedMonth}`);
      console.log(response.data);
      setRecords(response.data);
      setFilterRecords(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateTotals = (data) => {
    let totalAmount = 0;
    let totalSoldItems = 0;
    let totalNotSoldItems = 0;

    data.forEach((item) => {
      totalAmount += item.price;
      if (item.sold) {
        totalSoldItems++;
      } else {
        totalNotSoldItems++;
      }
    });

    setTotalAmount(totalAmount);
    setTotalSoldItems(totalSoldItems);
    setTotalNotSoldItems(totalNotSoldItems);
  };

  const handleFilter = (e) => {
    const newData = filterRecords.filter(row => row.title.toLowerCase().includes(e.target.value.toLowerCase()));
    setRecords(newData);
    calculateTotals(newData);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true
    },
    {
      name: "Title",
      selector: row => row.title,
      sortable: true
    },
    {
      name: "Price",
      selector: row => row.price
    },
    {
      name: "Description",
      selector: row => row.description
    },
    {
      name: "Category",
      selector: row => row.category
    },
    {
      name: "Image",
      selector: row => row.image
    },
    {
      name: "Sold",
      selector: row => row.sold
    },
    {
      name: "DateofSale",
      selector: row => row.dateOfSale
    },
  ];

  return (
    <div style={{padding:"50px 2%",  backgroundColor:"gray"}}>
      <div style={{ display:'flex',justifyContent:'center', alignItems:'center'}}>
        <h1 >Transaction Dashboard</h1>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="month">Select Month:</label>
        <select id="month" value={selectedMonth} onChange={handleMonthChange}>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <div>
        <p>Total Amount of Sale: ${totalAmount}</p>
        <p>Total Sold Items: {totalSoldItems}</p>
        <p>Total Not Sold Items: {totalNotSoldItems}</p>
      </div>
      <div style={{display: 'flex', justifyContent:'right'}} >
        <input type="text" placeholder='Search Title...' onChange={handleFilter} style={{padding:"6px 20px"} } />
      </div>
      <DataTable 
        columns={columns}
        data={records} // Use the fetched records as data source
        customStyles={customStyles}
        pagination
      />
    </div>
  );
}

export default Details;
