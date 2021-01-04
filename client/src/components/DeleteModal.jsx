import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

//Redux
import { connect } from "react-redux";

//Actions
import {
  closeModal,
  removeDeleteItem,
  removeItemType,
  removeCurrentLocation,
} from "../redux/actions/modalActions";

import {
  getUserProjects,
  setProjectUpdated,
} from "../redux/actions/projectActions";

import { getUserTeams, setTeamUpdated } from "../redux/actions/teamActions";

import { setErrors } from "../redux/actions/userActions";

//React Router DOM
import { withRouter } from "react-router-dom";

function DeleteModal(props) {
  // const { item, type, teamId, reRoute } = props;
  const modalRoot = document.getElementById("modal-root");

  const closeModal = (cb) => {
    props.closeModal();
    props.removeDeleteItem();
    props.removeItemType();
    props.removeCurrentLocation();
  };

  const deleteItem = () => {
    const { item, itemType } = props;
    axios
      .delete(`/api/${itemType}/${item._id}`)
      .then(() => {
        if (itemType === "project") {
          props.getUserProjects(localStorage.getItem("token"));
          closeModal();

          if (item.team !== null && props.currentLocation.includes("project")) {
            props.setTeamUpdated(true);
            props.history.goBack();
          } else if (item.team !== null) {
            props.setTeamUpdated(true);
          }
        }

        if (itemType === "bug") {
          props.setProjectUpdated(true);
          closeModal();
          if (props.currentLocation.includes("bug")) {
            props.history.goBack();
          }
        }

        if (itemType === "team") {
          props.getUserTeams(localStorage.getItem("token"));
          closeModal();

          if (props.currentLocation.includes("team")) {
            props.history.goBack();
          }
        }
      })
      .catch((error) => {
        props.setErrors(error);
      });
  };

  return ReactDOM.createPortal(
    <div className="modal-bg">
      <div className="modal-body">
        <h5>
          Are you sure you want to delete <span>{props.item.name}</span>?
        </h5>
        <div className="modal-btn-container">
          <button onClick={deleteItem}>Yes</button>
          <button onClick={closeModal}>No</button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}

const mapStateToProps = (state) => ({
  item: state.modal.deleteItem,
  itemType: state.modal.itemType,
  currentLocation: state.modal.currentLocation,
});

const mapDispatchToProps = {
  closeModal,
  removeDeleteItem,
  removeItemType,
  getUserProjects,
  setProjectUpdated,
  getUserTeams,
  setTeamUpdated,
  removeCurrentLocation,
  setErrors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DeleteModal));
