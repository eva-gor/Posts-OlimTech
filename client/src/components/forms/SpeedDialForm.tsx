import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const actions = [
  { icon: <AddCircleIcon />, name: 'Add post' }
];
type Props ={
  openAddPostForm: ()=>void
}
const SpeedDialForm: React.FC<Props> = ({openAddPostForm}) =>  {
  return (
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        icon={<SpeedDialIcon />}
        direction='down'
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={()=>openAddPostForm()}
          />
        ))}
      </SpeedDial>
  );
}

export default SpeedDialForm;