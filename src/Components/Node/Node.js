import React, { useEffect, useReducer } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";

import nodes from "../../nodes.json";

let parsedNodes = JSON.parse(JSON.stringify(nodes));

const ADD_NODES = "ADD_NODES";
const UPDATE_NODE = "UPDATE_NODE";

const initialState = [];

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_NODES:
      return [...state, ...action.payload.nodes];
    case UPDATE_NODE:
      const node = state.find(node => node.id === action.payload.id);
      node.selected = !node.selected;

      return [...state, ...node];

    default:
      return state;
  }
};

function Node() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let nodesArray = [];
    for (const item in parsedNodes) {
      nodesArray.push(parsedNodes[item]);
    }

    const createRelationShip = (object, relation = "") => {
      if (!object) {
        return relation;
      }

      if (object.name === "ACT" || object.parents === null) {
        return `${object.name} ${relation}`;
      }

      relation = `< ${object.name} ${relation}`;
      const parents = object.parents !== null && Object.keys(object.parents);
      if (parents.length > 1) {
        parents.forEach(p => {
          if (object.parents[p] === true) {
            return createRelationShip(parsedNodes[p], relation);
          }
        });
      } else {
        return createRelationShip(parsedNodes[parents[0]], relation);
      }
    };

    const nodesWithRelation = nodesArray.map(node => {
      return {
        ...node,
        relation: createRelationShip(node),
        selected: false
      };
    });

    dispatch({
      type: ADD_NODES,
      payload: {
        nodes: nodesWithRelation
      }
    });
  }, []);

  const handleSelect = id => {
    console.log(id);

    dispatch({
      type: UPDATE_NODE,
      payload: {
        id
      }
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#e6e7e8",
        padding: 50
      }}
    >
      <CssBaseline />
      <Container maxWidth="sm">
        <List>
          {state.map(i => (
            <React.Fragment key={i.id}>
              <ListItem
                alignItems="flex-start"
                style={{
                  backgroundColor: "#ffffff"
                }}
              >
                <ListItemText>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={i.selected}
                        onChange={() => handleSelect(i.id)}
                        value="antoine"
                      />
                    }
                    label={
                      <Tooltip
                        title={i.relation || i.name}
                        aria-label={i.relation}
                      >
                        <Typography>{i.name}</Typography>
                      </Tooltip>
                    }
                  />
                </ListItemText>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Container>
    </div>
  );
}

export default Node;
