import PostType from "../model/PostType"
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Chip, Divider, Grid, IconButton, ListItemText, Slide, Toolbar, Typography } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import AddCommentForm from "./AddCommentForm";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { useSelectorAuth } from "../../redux/store";
import likesDislikesAction from "../../utils/likesFn";
import { postService } from "../../config/service-config";
import CommentType from "../model/CommentType";
import { useState } from "react";

type Props = {
    open: boolean,
    onClose: () => void,
    post: PostType
}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DetailedCardForm: React.FC<Props> = ({ open, onClose, post}) => {
    const scroll: DialogProps['scroll'] = 'paper';
    const username = useSelectorAuth();

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const dislikePost = async (com: CommentType) => {
        const { ar1, ar2 } = likesDislikesAction(com!.dislikes, com!.likes, username);
        await postService.updateComment(com!.id, com!.text, ar2, ar1);
    }
    const likePost = async (com: CommentType) => {
        const { ar1, ar2 } = likesDislikesAction(com!.likes, com!.dislikes, username);
        await postService.updateComment(com!.id, com!.text, ar1, ar2);
    }

    const getComments = () => {
        return post.comments!.map(com => <li>
            <div style={{display:'flex', flexWrap:'wrap'}}>
                <Chip label={com!.username} sx={{ padding: 2, marginTop: '5px', marginBottom: '3px' }} />

                <i> &#160;{new Date(+com!.date).toDateString()}</i>
            </div>
            <ListItemText primary={com!.text} />
            {username && com!.username != username && <div>
                <IconButton onClick={() => dislikePost(com)}>
                    {post.dislikes.includes(username) ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
                </IconButton>
                <IconButton onClick={() => likePost(com)}>
                    {post.likes.includes(username) ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                </IconButton>
            </div>}
            <Divider variant="inset" component="li" />
        </li>
        );
    }
    return <Dialog
        open={open}
        onClose={onClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullScreen
        TransitionComponent={Transition}
    >
        <AppBar sx={{ position: 'sticky' }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    <DialogTitle id="scroll-dialog-title" display='flex' justifyContent='space-between'>
                        <b>Posted by {post.username}</b> <i>{new Date(+post.date).toDateString()}</i>
                    </DialogTitle>
                </Typography>
            </Toolbar>
        </AppBar>
        <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
            >
                <p>
                    {post.imageSrc && <img src={post.imageSrc} alt="Image"
                        style={{ maxWidth: '100vw', maxHeight: '30vh', objectFit: "contain", float: 'left', margin: '10px' }} />}
                    {post.title}
                </p>
                <Divider><DialogTitle>Commentaries:</DialogTitle></Divider>

                <AddCommentForm post={post} />
                {post.comments &&
                    <ul style={{ listStyleType: 'none' }}>
                        {getComments()}
                    </ul>
                }
            </DialogContentText>
        </DialogContent>
    </Dialog>
}

export default DetailedCardForm