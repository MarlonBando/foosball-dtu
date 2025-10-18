import React from 'react';
import './FoosballTable.css';
import foosballTable from '../../assets/unnamed.jpg';

const FoosballTable: React.FC = () => {
  return (
    <div className="foosball-table-container">
      <img src={foosballTable} alt="Foosball Table" className="foosball-table-image" />
    </div>
  );
};

export default FoosballTable;
