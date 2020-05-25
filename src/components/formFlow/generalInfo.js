import React, { useState } from "react";

//Apollo useMutation Hook for API call
import { useMutation } from "@apollo/react-hooks";
//Importing GraphQL Query for useMutation API call
import { addDraftMutation as ADD_DRAFT_MUTATION } from "../../queries/draft";

import GeneralInfoFormTemplate from "./formsTemplate/generalInfoFormTemplate";
import TipsLayout from "./formUtils/tipsLayout";

import {
    Button,
    CssBaseline,
    Paper,
    Grid,
    makeStyles,
} from "@material-ui/core";

import MobileStepper from "@material-ui/core/MobileStepper";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    tipTextLarge: {
        fontSize: "1.1rem",
    },
    tipTextSmall: {
        fontSize: "0.8rem",
    },
    bold: {
        fontWeight: "900",
    },
    progress: {
        width: "100%",
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
    },
}));

export default function GeneralInfo(props) {
    const [info, setInfo] = useState({
        email: "",
        firstName: "",
        lastName: "",
    });

    //Instantiate useMutation Hook / Creates tuple with 1st var being actual
    //call function, and 2nd destructured variable being return data and tracking
    const [addDraft, { loading, error, data }] = useMutation(
        ADD_DRAFT_MUTATION,
        {
            onCompleted(data) {
                // write data to the Apollo store here
                // https://www.apollographql.com/docs/react/data/local-state/
                console.log(data, "\n Add Education Response");

                localStorage.setItem("draftID", data.addDraft);
            },
        }
    );

    const classes = useStyles();

    const nextPage = (event) => {
        event.preventDefault();
        // props.addData(info);
        console.log("NextPage inside of GeneralInfo");
        const name = info.firstName + " " + info.lastName;

        //Calls addDraft Mutation only if component state
        //is NOT empty
        if (
            info.firstName.length > 0 &&
            info.lastName.length > 0 &&
            info.email.length > 0
        ) {
            //Apollo useMutation API call to send data to backend
            addDraft({
                variables: {
                    input: {
                        name: name,
                        email: info.email,
                    },
                },
            });
        }

        //Resets Component State to ''
        // setInfo({
        //     email: "",
        //     firstName: "",
        //     lastName: "",
        // });
        props.setActiveStep((prevActiveStep) => prevActiveStep + 1);

        props.history.push("/form/education");
    };

    const onChange = (event) => {
        console.log(event.target.name, "onChange");
        setInfo({ ...info, [event.target.name]: event.target.value });
    };

    if (loading) return <div>loading : {loading}</div>;
    if (error) return <div>{error}</div>;

    console.log("outside of onChange", data);

    return (
        <div id="generalInfoForm">
            <Grid container componet="main" className={classes.root}>
                <CssBaseline />
                <TipsLayout tips={Tip()} />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={9}
                    component={Paper}
                    elevation={6}
                    square
                >
                    <MobileStepper
                        variant="progress"
                        steps={8}
                        position="static"
                        activeStep={props.activeStep}
                        className={classes.progress}
                    />
                    <div className={classes.paper}>
                        <form className={classes.form}>
                            <GeneralInfoFormTemplate
                                onChange={onChange}
                                info={info}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={(e) => nextPage(e)}
                                className={classes.submit}
                            >
                                Next
                            </Button>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

//tips="Hey, welcome to Resumeker forms! These forms will help you create a beautiful
//resume to impress your potential employers!"

function Tip() {
    const classes = useStyles();

    return (
        <div>
            <p className={classes.tipTextLarge}>
                Hey, Welcome to Resumeker Forms!
            </p>
            <p className={classes.tipTextLarge}>
                This Form Flow process will help you create a beautiful and
                effective resume for potential employers.
            </p>
            <p className={classes.tipTextSmall}>
                Keep an eye out for these{" "}
                <span className={classes.bold}>tips</span> as they will help you
                along the way!
            </p>
        </div>
    );
}
