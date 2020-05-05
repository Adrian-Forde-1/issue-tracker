import React, { useEffect, useState } from 'react';

//Tostify
import { toast } from 'react-toastify';

//Redux
import { connect } from 'react-redux';

//Actions
import { getUserTeams } from '../../redux/actions/teamActions';

//React Router DOM
import { Link } from 'react-router-dom';

//Compoenents
import TeamPreview from '../Preview/TeamPreview';
import SearchBar from '../SearchBar';
import SideNav from '../Navigation/SideNav';
import ProjectsGroupsHamburger from '../Navigation/ProjectsGroupsHamburger';

function AllTeams(props) {
  const [teams, changeTeams] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    props.getUserTeams(localStorage.getItem('token'));
    changeTeams(props.teams);
  }, []);
  useEffect(() => {
    changeTeams(props.teams);
  }, [props.teams]);

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div
      className="d-flex flex-column p-l-175"
      style={{ position: 'relative' }}
    >
      <Link to="/create/team" className="action-btn">
        <i className="fas fa-plus-square "></i>
      </Link>
      <SearchBar search={search} onChange={onChange} />
      <ProjectsGroupsHamburger />
      <SideNav />
      {props.errors !== null &&
        props.errors['team'] &&
        !toast.isActive('teamtoast') &&
        toast(props.errors.bug, {
          toastId: 'teamtoast',
          type: 'error',
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          onClose: () => {
            props.clearErrors();
          },
        })}
      <h3 className="section-title">Teams</h3>
      <div className="action-bar m-l-16">
        <Link to="/join/team">Join Team</Link>
      </div>

      {teams && teams.length > 0 && search === ''
        ? teams.map((team) => <TeamPreview team={team} key={team._id} />)
        : teams.map((team) => {
            if (team.name.toLowerCase().indexOf(search.toLowerCase()) > -1)
              return <TeamPreview team={team} key={team._id} />;
          })}
    </div>
  );
}

const mapDispatchToProps = {
  getUserTeams,
};

const mapStateToProps = (state) => ({
  teams: state.teams.teams,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(AllTeams);
