import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

type Props = {
    anchorEl: null | HTMLElement,
    closeFn: (type:string) => void
}

const ThumbnailMenu: React.FC<Props> = ({ anchorEl, closeFn }) => {
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
                <MenuItem onClick={()=> closeFn('update')}>Update</MenuItem>
                <MenuItem onClick={()=> closeFn('delete')}>Delete</MenuItem>
            </Menu>
        </div>
    );
}
export default ThumbnailMenu;