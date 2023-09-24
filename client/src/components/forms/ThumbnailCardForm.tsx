import { Box, Divider } from "@mui/material";
import PostType from "../model/PostType";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { purple } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbnailMenu from "./ThumbnailMenu";
import { useSelectorAuth } from "../../redux/store";
import { useState } from "react";
import DeletePostCommentForm from "./DeletePostCommentForm";
import AddUpdatePostForm from "./AddUpdatePostForm";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { postService } from "../../config/service-config";
import likesDislikesAction from "../../utils/likesFn";
import DetailedCardForm from "./DetailedCardForm";
import config from '../../config/config-params.json'

const defaultPic = config.defaultPic;

type Props = {
  post: PostType
}
const ThumbnailCardForm: React.FC<Props> = ({ post }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [action, setAction] = useState<{ delete: boolean, update: boolean, details: boolean }>({ delete: false, update: false, details: false });
  const username = useSelectorAuth();

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const allowActions = !!username && username === post.username;

  function onCloseContextMenu(type: string) {
    if (type === 'delete') {
      setAction({ ...action, delete: true });
    } else if (type === 'update') {
      setAction({ ...action, update: true });
    } else if (type === 'details') {
      setAction({ ...action, details: true });
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
  const actionsVisisbility = username && post.username != username ? 'visible' : 'hidden';
  return (
    <Box>
      <DetailedCardForm onClose={() => setAction({ ...action, details: false })} open={action.details} post={post} />
      <ThumbnailMenu anchorEl={anchorEl} closeFn={(type: string) => onCloseContextMenu(type)}
        actions={{ details: true, update: allowActions, delete: allowActions }} />
      <AddUpdatePostForm openDialog={action.update} goBack={setAction.bind(undefined, { ...action, update: false })} postExtisted={post} />
      <DeletePostCommentForm open={action.delete} handleClose={setAction.bind(undefined, { ...action, delete: false })} post={post} isPost={true} />
      <Card onDoubleClick={() => setAction({ ...action, details: true })} >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: purple[500] }} aria-label="recipe">
              {post.username.charAt(0)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={`Posted by ${post.username}`}
          subheader={new Date(+post.date).toDateString()}
        />
        <CardMedia
          component="img"
          image={post.imageSrc ? post.imageSrc : defaultPic}
          height='250'
          alt="Image"
          sx={{ padding: 0, objectFit: "contain" }}
        />
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary"
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 4,
                height: '80px'
              }}>
              <div style={{ textAlign: 'left' }}>
                {post.title}
              </div>
            </Typography>
          </div>
          <Divider sx={{ marginTop: '5px' }} />
          <div style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
            <div >Commentaries: {post.comments?.length || 0}</div>
            <i style={{ color: post.likes.length - post.dislikes.length > 0 ? 'green' : post.likes.length - post.dislikes.length === 0 ? 'grey' : 'red' }}>
              Rating:{post.likes.length - post.dislikes.length}
            </i>
          </div>
        </CardContent>
        <CardActions disableSpacing >
          <div style={{visibility: actionsVisisbility}}>
            <IconButton onClick={dislikePost}>
              {post.dislikes.includes(username) ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
            </IconButton>
            <IconButton onClick={likePost}>
              {post.likes.includes(username) ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
            </IconButton>
          </div>
        </CardActions>

      </Card>
    </Box>
  )
}

export default ThumbnailCardForm;