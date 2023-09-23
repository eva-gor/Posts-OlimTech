import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

type Props = {
    anchorEl: null | HTMLElement,
    closeFn: (type:string) => void,
    actions: {update:boolean, delete:boolean, details: boolean}
}

const ThumbnailMenu: React.FC<Props> = ({ anchorEl, closeFn, actions }) => {
    const open = Boolean(anchorEl);
    return (
        <div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={()=> closeFn('')}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {actions.update && <MenuItem onClick={()=> closeFn('update')}>Update</MenuItem>}
                {actions.delete && <MenuItem onClick={()=> closeFn('delete')}>Delete</MenuItem>}
                {actions.details && <MenuItem onClick={()=> closeFn('details')}>Details</MenuItem>}
            </Menu>
        </div>
    );
}
export default ThumbnailMenu;