import React, { useEffect, useState } from "react";
import axios from "axios";

//Redux
import { connect } from "react-redux";

//Actions
import { setErrors } from "../../redux/actions/userActions";
import SearchBar from "../SearchBar";

//Components
import ProjectPreview from "../Preview/ProjectPreview";
import SideNav from "../Navigation/SideNav";
import ProjectsTeamsHamburger from "../Navigation/ProjectsTeamsHamburger";

function ArchivedProjects(props) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`/api/projects/archived`)
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.push("/projects");
      });
  }, []);

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  const resetProjects = () => {
    axios
      .get(`/api/projects/archived`)
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.push("/projects");
      });
  };

  return (
    <div
      className="d-flex flex-column p-l-175"
      style={{ position: "relative" }}
    >
      <ProjectsTeamsHamburger />
      <SideNav />
      <SearchBar search={search} onChange={onChange} />
      <h3 className="section-title">Archived Projects</h3>
      {projects && projects.length > 0 && search === ""
        ? projects.map((project) => {
            if (project.archived === true)
              return (
                <ProjectPreview
                  project={project}
                  key={project._id}
                  extraIconClass="remove-archive-sign"
                  resetProjects={resetProjects}
                />
              );
          })
        : projects.map((project) => {
            if (
              project.name.toLowerCase().indexOf(search.toLowerCase()) > -1 &&
              project.archived === true
            )
              return <ProjectPreview project={project} key={project._id} />;
          })}
    </div>
  );
}

const mapDispatchToProps = {
  setErrors,
};

export default connect(null, mapDispatchToProps)(ArchivedProjects);
