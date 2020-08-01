import React, { Component, Fragment } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import {
  handleModelClickSingle,
  handleRunAllClick,
  ConsoleLogger
} from "../utils";

const styles = {
  paper: {
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    height: 650,
    overflowY: "auto"
  }
};

class ModelButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "Start",
      progress: 0,
      epochs: 30,
      total: 0,
      num_models: 0
    };
    this.state.total = this.state.epochs * this.props.models.length;
    this.state.num_models = this.props.models.length;

    console.log("Total :", this.state.total);
    this.handleClick = this.handleClick.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
  }

  updateProgress(val) {
    this.setState(state => {
      state.progress = state.progress + val;
      return state;
    });
  }
  async handleClick() {
    this.setState(state => {
      state.status = "Running";
      return state;
    });

    const models = this.props.models;
    const epochs = this.state.epochs;
    const csvContent = await handleRunAllClick(
      models,
      epochs,
      this.updateProgress
    );
    this.setState(state => {
      state.status = "Completed";
      state.progress = 0;
      return state;
    });
    console.log("Should save?:", this.props.downloadAfterRun)
    if (this.props.downloadAfterRun) {
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "inference_data.csv");
      document.body.appendChild(link); // Required for FF

      link.click();
    }
  }
  render() {
    return (
      <Fragment>
        <div>
          <TextField
            id="num_epochs"
            label="Number Of Epochs"
            value={this.state.epochs}
            onChange={event => {
              const val = event.target.value;
              this.setState(state => {
                state.epochs = val;
                state.total = val * state.num_models;
                return state;
              });
              console.log("Epochs ", this.state.epochs);
              console.log("Total ", this.state.total);
            }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={this.handleClick}
          style={{ marginTop: 10, marginBottom: 10, marginRight: 10 }}
        >
          {this.state.status}{" "}
          {this.state.status == "Running"
            ? ((this.state.progress * 100) / this.state.total).toFixed(2) + "%"
            : ""}
        </Button>
      </Fragment>
    );
  }
}

export default class Models extends Component {


  constructor(props) {
    super(props);

    this.state = { viewConsole: false, downloadAfterRun: true, per_model_epochs: 30 };

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);

  }



  handleCheckboxClick(name, event) {
    console.log("Checkbox clicked")
    this.setState((state) => { state.downloadAfterRun = event; return state })
  }

  showConsoleComponent() {
    return (
      <Fragment>
        {this.state.viewConsole ? <ConsoleLogger /> : <div></div>}
      </Fragment>
    );
  }

  render() {
    const models = this.props.models;
    return (
      <Grid container>
        <Grid item sm>
          <Paper style={styles.paper}>

            <FormControlLabel
              control={<Checkbox checked={this.state.downloadAfterRun} color="primary"
                onChange={this.handleCheckboxClick} />
              }
              label="Download log"
            />

            <TextField
              id="per_model_num_epochs"
              label="Epochs per model"
              value={this.state.per_model_epochs}
              onChange={event => {
                const val = event.target.value;
                this.setState(state => {
                  state.per_model_epochs = val;
                  return state;
                });
                console.log("Epochs ", this.state.per_model_epochs);
              }} />


            <List component="ul">
              {models.map(model => (
                <ListItem
                  button
                  key={model.id}
                  onClick={() => handleModelClickSingle(model, this.state.per_model_epochs, this.state.downloadAfterRun)}
                >
                  <ListItemText primary={model.title} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* right gird */}
        <Grid item sm>
          <Paper style={styles.paper}>
            <Typography
              variant="h3"
              style={{ marginTop: 20, marginBottom: 20, display: "block" }}
            >
              Run all models
            </Typography>

            <div>
              <ModelButton models={models} epochs={2} downloadAfterRun={this.state.downloadAfterRun} />
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  this.setState(state => {
                    state.viewConsole = !state.viewConsole;
                    return state;
                  });
                }}
              >
                Console
              </Button>
            </div>
            <div>{this.showConsoleComponent()}</div>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
