import React, { useState } from "react";
import axios from "axios";

//React Router DOM
import { connect } from "react-redux";

//Actions
import { getUser, setMessages } from "../../redux/actions/userActions";

const Profile = ({ user, getUser, setMessages }) => {
  const [profilePicture, setProfilePicture] = useState({});

  const renderImage = () => {
    if (user.image && user.image !== null) {
      return <img src={user.image} alt="" className="profile__image" />;
    }
    return (
      <div className="profile__default-img">
        {user && user.username && (
          <span>{user.username.toString().toUpperCase()[0]}</span>
        )}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    axios.put("/api/edit-profile", formData).then((res) => {
      if (res && res.data) {
        getUser();
        setMessages(res.data);
      }
    });
  };
  return (
    <div className="profile__wrapper">
      <div className="profile__body">
        <div className="profile__header">
          <div className="profile__header__img-container">
            {renderImage()}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept="image/*"
                onChange={(e) => {
                  setProfilePicture(e.target.files[0]);
                }}
              />
              <br />
              <button>Edit Photo</button>
            </form>
          </div>
          <div className="profile__header__basic-info">
            <h1>{user.username}</h1>
            <h4>{user.email}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  getUser,
  setMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
