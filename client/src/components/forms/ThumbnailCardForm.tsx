import { Box } from "@mui/material";
import PostType from "../model/PostType";
import * as React from 'react';
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
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return <Card >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: purple[500] }} aria-label="recipe">
            {post.username!.toString().charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`Posted by ${post.username?.username}`}
        subheader= {new Date(post.date).toDateString()}
      />
      <CardMedia
        component="img"
        height="194"
        image={post.imageSrc ? post.imageSrc : "/static/images/default.jpg"}
        alt="Image"
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
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Commentaries:</Typography>
          {post.comments?.map(com => <Typography paragraph>
            {com?.username?.username}: {com?.text}
            <Box>
                {new Date(com!.date).toDateString()}
            </Box>
            <Box>
               Votes: {com!.likes.length - com!.dislikes.length}
            </Box>
          </Typography>)}
        </CardContent>
      </Collapse>
    </Card>
}

export default ThumbnailCardForm;