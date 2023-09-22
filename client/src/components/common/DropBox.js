import { useDropzone } from 'react-dropzone';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const getColor = (props) => {
    if (props.isDragAccept) {
        return 'blueviolet';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    return '#eeeeee';
};

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px;
	border-width: 2px;
	border-radius: 10px;
	border-color: ${(props) => getColor(props)};
	border-style: dashed;
	color: black;
	font-weight: bold;
	font-size: 1.4rem;
	outline: none;
	transition: border 0.24s ease-in-out;
`;

function DropBox({ onDrop }) {
    const {
        getRootProps,
        getInputProps,
        open,
        isDragAccept,
        isFocused,
        isDragReject,
    } = useDropzone({
        accept: 'image/*',
        onDrop,
        noClick: true,
        noKeyboard: true,
    });

    return <Container className='dropbox'
        {...getRootProps({ isDragAccept, isFocused, isDragReject })}
    >
        <input {...getInputProps()} />
        <Typography variant="subtitle2" gutterBottom><i>Drag 'n' drop an image here</i></Typography>
        <Button variant="outlined" onClick={open} sx={{backgroundColor: 'white'}}>Click to select file</Button>
    </Container>
}

export default DropBox;