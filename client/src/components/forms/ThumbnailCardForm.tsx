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
import { purple } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbnailMenu from "./ThumbnailMenu";
import { useSelectorAuth } from "../../redux/store";
import { useState } from "react";
import DeletePost from "./DeletePost";
import AddUpdatePostForm from "./AddUpdatePostForm";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { postService } from "../../config/service-config";
import ArticleIcon from '@mui/icons-material/Article';
import likesDislikesAction from "../../utils/likesFn";
import DetailedCardForm from "./DetailedCardForm";
import Popover from '@mui/material/Popover';

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
type Props = {
  post: PostType
}
const ThumbnailCardForm: React.FC<Props> = ({ post }) => {
  const [anchorElPopOp, setAnchorElPopOp] = useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElPopOp(event.currentTarget);
  };
  const handlePopoverClose = (): void => { setAnchorElPopOp(null); };
  const openPopOp = Boolean(anchorElPopOp);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [action, setAction] = useState<{ delete: boolean, update: boolean }>({ delete: false, update: false });
  const username = useSelectorAuth();
  const [openCardDetails, setOpenCardDetails] = useState<boolean>(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const allowActions = username && post.username === username;

  function onCloseContextMenu(type: string) {
    if (type === 'delete') {
      setAction({ ...action, delete: true });
    } else if (type === 'update') {
      setAction({ ...action, update: true });
    }
    setAnchorEl(null);
  }
  const dislikePost = async () => {
    const { ar1, ar2 } = likesDislikesAction(post.dislikes, post.likes, username);
    await postService.updatePost(post.id, post.title, ar2, ar1);
  }
  const likePost = async () => {
    const { ar1, ar2 } = likesDislikesAction(post.likes, post.dislikes, username);
    await postService.updatePost(post.id, post.title, ar1, ar2);
  }
  return (
    <Box>
      <DetailedCardForm onClose={() => setOpenCardDetails(false)} open={openCardDetails} post={post} />
      <ThumbnailMenu anchorEl={anchorEl} closeFn={(type: string) => onCloseContextMenu(type)} />
      <AddUpdatePostForm openDialog={action.update} goBack={setAction.bind(undefined, { ...action, update: false })} postExtisted={post} />
      <DeletePost open={action.delete} handleClose={setAction.bind(undefined, { ...action, delete: false })} post={post} />
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
          subheader={new Date(+post.date).toDateString()}
        />
        <CardMedia
          component="img"
          height='70vh'
          image={post.imageSrc ? post.imageSrc : "/static/images/default.jpg"}
          alt="Image"
          sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary"
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 4,
            }}>
            <p><i>
              Rating: {post.likes.length - post.dislikes.length}
            </i>
            </p>
            {post.title}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {username && post.username != username && <div>
            <IconButton onClick={dislikePost}>
              {post.dislikes.includes(username) ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
            </IconButton>
            <IconButton onClick={likePost}>
              {post.likes.includes(username) ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
            </IconButton>
          </div>}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon onClick={handleExpandClick} />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography display='flex' justifyContent='space-between'>
              <div>Commentaries: {post.comments?.length || 0}</div>
              <IconButton onClick={() => setOpenCardDetails(true)}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}>
                <ArticleIcon />
              </IconButton>
              <Popover
                id="mouse-over-popover"
                sx={{
                  pointerEvents: 'none'
                }}
                open={openPopOp}
                anchorEl={anchorElPopOp}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography sx={{ p: 1, backgroundColor: "beige" }}>Details</Typography>
              </Popover>
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Box>
  )
}

export default ThumbnailCardForm;