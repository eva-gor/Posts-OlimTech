import { Chip, ListItemText, IconButton, Divider } from "@mui/material";
import PostType from "../model/PostType";
import likesDislikesAction from "../../utils/likesFn";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { useSelectorAuth } from "../../redux/store";
import CommentType from "../model/CommentType";
import { postService } from "../../config/service-config";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useState } from "react";
import ThumbnailMenu from "./ThumbnailMenu";
import AddUpdatePostForm from "./AddUpdatePostForm";
import DeletePostCommentForm from "./DeletePostCommentForm";

type Props = {
    com: CommentType
}
const CommentsForm: React.FC<Props> = ({ com }) => {
    const username = useSelectorAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [action, setAction] = useState<{ delete: boolean, update: boolean }>({ delete: false, update: false });

    const dislikePost = async (com: CommentType) => {
        const { ar1, ar2 } = likesDislikesAction(com!.dislikes, com!.likes, username);
        await postService.updateComment(com!.id, com!.text, ar2, ar1);
    }
    const likePost = async (com: CommentType) => {
        const { ar1, ar2 } = likesDislikesAction(com!.likes, com!.dislikes, username);
        await postService.updateComment(com!.id, com!.text, ar1, ar2);
    }
    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    function onCloseContextMenu(type: string) {
        if (type === 'delete') {
            setAction({ ...action, delete: true });
        } else if (type === 'update') {
            setAction({ ...action, update: true });
        }
        setAnchorEl(null);
    }

    return <li>
        <ThumbnailMenu anchorEl={anchorEl} closeFn={(type: string) => onCloseContextMenu(type)} />
        {/* <AddUpdatePostForm openDialog={action.update} goBack={setAction.bind(undefined, { ...action, update: false })} postExtisted={post} /> */}
        <DeletePostCommentForm open={action.delete} handleClose={setAction.bind(undefined, { ...action, delete: false })} post={com} isPost={false} />
        <Divider ><Chip label={com!.username} sx={{ padding: 2, marginTop: '5px', marginBottom: '3px' }} /></Divider>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <i> &#160;{new Date(+com!.date).toDateString()}</i>
            {username && username === com?.username &&
                <IconButton
                    sx={{ right: 0 }}
                    color="inherit"
                    onClick={handleMenuClick}
                    aria-label="close"
                >
                    <EditNoteIcon />
                </IconButton>
            }
        </div>
        <ListItemText primary={com!.text} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {username && com!.username != username ? <div>
                <IconButton onClick={() => dislikePost(com)}>
                    {com!.dislikes.includes(username) ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
                </IconButton>
                <IconButton onClick={() => likePost(com)}>
                    {com!.likes.includes(username) ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                </IconButton>
            </div>
                : <div></div>}
            <i style={{ color: com!.likes.length - com!.dislikes.length > 0 ? 'green' : com!.likes.length - com!.dislikes.length === 0 ? 'grey' : 'red' }}>
                Rating: {com!.likes.length - com!.dislikes.length}</i>
        </div>
    </li>
}

export default CommentsForm;