import { Box } from "@mui/material";
import PostType from "../model/PostType";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { purple} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbnailMenu from "./ThumbnailMenu";
import { useSelectorAuth } from "../../redux/store";
import { useState } from "react";
import DeletePost from "./DeletePost";
import AddUpdatePostForm from "./AddUpdatePostForm";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
type Props ={
  post : PostType
}
const ThumbnailCardForm: React.FC<Props> =({post})=>{
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [action, setAction] = useState<{delete: boolean, update:boolean}>({delete: false, update: false});
  const username = useSelectorAuth();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const allowActions = post.username === username;

  function onCloseContextMenu(type: string){
    if (type === 'delete'){
      setAction({...action, delete: true});
    } else if (type === 'update'){
      setAction({...action, update: true});
    } 
    setAnchorEl(null);
  }

  return (
    <Box>
      <ThumbnailMenu anchorEl={anchorEl} closeFn={(type:string)=> onCloseContextMenu(type)}/>
      <AddUpdatePostForm openDialog = {action.update} goBack={setAction.bind(undefined, { ...action, update: false })} postExtisted={post}/>
      <DeletePost open={action.delete} handleClose={setAction.bind(undefined, { ...action, delete: false })} post = {post}/>
  <Card >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: purple[500] }} aria-label="recipe">
            {post.username.charAt(0)}
          </Avatar>
        }
        action={
          allowActions &&
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          }
        title={`Posted by ${post.username}`}
        subheader= {new Date(+post.date).toDateString()}
      />
      <CardMedia
        component="img"
        height="194"
        image={post.imageSrc ? post.imageSrc : "/static/images/default.jpg"}
        alt="Image"
        sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.title}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon onClick={handleExpandClick}/>
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Commentaries:</Typography>
          {post.comments?.map(com => <Typography paragraph>
            {com?.username}: {com?.text}
            <Box>
                {new Date(+com!.date).toDateString()}
            </Box>
            <Box>
               Votes: {com!.likes.length - com!.dislikes.length}
            </Box>
          </Typography>)}
        </CardContent>
      </Collapse>
    </Card>
    </Box>
  )
}

export default ThumbnailCardForm;