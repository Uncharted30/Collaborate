import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import './AccountPage.css'
import {Card} from "antd";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function AccountPage(props) {
    const classes = useStyles();
    return (
        <div id='account-page-container'>
            <Card className={classes.root} id="account-setting-card" variant="outlined" title='Account Settings'>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline/>
                        <div className={classes.paper + ' account-setting-form'}>
                            <form className={classes.form} noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    size='small'
                                    disabled
                                    value='abc@123.com'
                                />
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
                                    fullWidth
                                    id="last-name"
                                    label="Last Name"
                                    name="last-name"
                                    size='small'
                                />
                                <TextField
                                    variant="outlined"
                                    margin="dense"
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
                                    Update
                                </Button>
                            </form>
                        </div>
                    </Container>
            </Card>
        </div>
    )
}