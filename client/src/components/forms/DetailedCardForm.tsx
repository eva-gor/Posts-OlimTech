import PostType from "../model/PostType"
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Divider, Grid, IconButton, Paper, Slide, Toolbar, Typography } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import AddCommentForm from "./AddCommentForm";
import { useSelectorAuth } from "../../redux/store";
import { useRef } from "react";
import CommentsForm from "./CommentsForm";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { postService } from "../../config/service-config";
import likesDislikesAction from "../../utils/likesFn";

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

const DetailedCardForm: React.FC<Props> = ({ open, onClose, post }) => {
    const ref = useRef<any>(null);
    const scroll: DialogProps['scroll'] = 'paper';

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    const username = useSelectorAuth();
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const handleScrollClick = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const dislikePost = async () => {
        const { ar1, ar2 } = likesDislikesAction(post.dislikes, post.likes, username);
        await postService.updatePost(post.id, post.title, ar2, ar1);
    }
    const likePost = async () => {
        const { ar1, ar2 } = likesDislikesAction(post.likes, post.dislikes, username);
        await postService.updatePost(post.id, post.title, ar1, ar2);
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
                <Grid item container>
                    <Grid xs={12}>
                        <Paper elevation={3} sx={{ margin: '10px', padding: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <i style={{ color: post.likes.length - post.dislikes.length > 0 ? 'green' : post.likes.length - post.dislikes.length === 0 ? 'grey' : 'red' }}>
                                        Rating:{post.likes.length - post.dislikes.length}
                                    </i>
                                    &#160; &#160;
                                    <i>(Likes: {post.likes.length},  &#160; Dislikes: {post.dislikes.length})</i>
                                </div>
                                <Button onClick={handleScrollClick} > Go to commentaries </Button>
                                {username && post.username != username && <div>
                                    <IconButton onClick={dislikePost}>
                                        {post.dislikes.includes(username) ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
                                    </IconButton>
                                    <IconButton onClick={likePost}>
                                        {post.likes.includes(username) ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                                    </IconButton>
                                </div>}
                            </div>
                        </Paper>
                        <p>
                            {post.imageSrc && <img src={post.imageSrc} alt="Image"
                                style={{ maxWidth: '100vw', maxHeight: '30vh', objectFit: "contain", float: 'left', margin: '10px' }} />}

                            {post.title}
                        </p>
                    </Grid>
                    <Grid xs={12}>
                        <Divider><DialogTitle ref={ref}>Commentaries:</DialogTitle></Divider>

                        <AddCommentForm post={post} />
                        {post.comments &&
                            <ul style={{ listStyleType: 'none' }}>
                                {post.comments!.sort((c1, c2) => +c2!.date - +c1!.date).map(com => <CommentsForm com={com} />)}
                            </ul>
                        }
                    </Grid>
                </Grid>
            </DialogContentText>
        </DialogContent>
    </Dialog>
}

export default DetailedCardForm