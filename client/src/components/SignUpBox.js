import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "./SignUpBox.css"

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root} id="sign-up-card" variant="outlined">
            <CardContent>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper + ' sign-up-form-div'}>
                        <Avatar className={classes.avatar}>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
                        <form className={classes.form} noValidate>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                id="first-name"
                                label="First Name"
                                name="first-name"
                                autoFocus
                                size='small'
                            />
                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                id="last-name"
                                label="Last Name"
                                name="last-name"
                                size='small'
                            />
                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                size='small'
                            />
                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                size='small'
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign Up
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                </Grid>
                                <Grid item>
                                    <a href="#" onClick={props.switchToSignIn}>
                                        {"Sign In"}
                                    </a>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </CardContent>
        </Card>
    );
}