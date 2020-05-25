import React, { useEffect } from "react";

import { graphql } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";

import { NavLink, Redirect } from "react-router-dom";

import UserData from "./userData.js";
import ResumeCard from "./ResumeCard";

import { getDraftsQuery as GET_DRAFTS_QUERY } from "../../queries/draft";

import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    addResume: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        width: "75%",
        backgroundColor: "lightgrey",
    },
    infoContainer: {
        backgroundColor: "#3f51b5",
        width: "20%",
        alignSelf: "flex-start",
    },
}));

export default function Profile(props) {
    const { loading, error, data } = useQuery(GET_DRAFTS_QUERY);
    const classes = useStyles();

    if (loading) return <div>Loading</div>;
    if (error) return <div>{error}</div>;
    const { getDrafts } = data;
    console.log(getDrafts, "profile query response");

    return (
        <div className="profile">
            <div className={classes.container}>
                <div
                    className="resume-container"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {getDrafts.map((draft) => (
                        <ResumeCard key={draft.id} draftID={draft.id} />
                    ))}
                </div>

                {/* <Button
          variant="contained"
          color="primary"
          className={classes.addResume}
          onClick={() => {
              <Redirect to="/form/generalInfo" />
            // props.history.push("/form/generalInfo");
          }}
        >
          Add a New Resume
        </Button> */}
            </div>

            <div className={classes.infoContainer}>
                <UserData />
                <NavLink to="/form/generalInfo">
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.addResume}
                    >
                        Add a New Resume
                    </Button>
                </NavLink>
            </div>
        </div>
    );
}

// * just add a draft query every single time the profile component mounts, and it'll always update with the latest information

// * o
