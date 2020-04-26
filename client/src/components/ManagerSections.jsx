import React, { useState } from 'react';

//Components
import AllProjects from './AllProjects';
import AllGroups from './AllGroups';

function ManagerSections(props) {
  const [section, setSection] = useState('projects');
  return (
    <div className="manager-section">
      {section === 'projects' && (
        <div>
          <h3>Projects</h3>
          <AllProjects search={props.search} />
        </div>
      )}
      {section === 'groups' && (
        <div>
          <h3>Groups</h3>
          <AllGroups search={props.search} />
        </div>
      )}
    </div>
  );
}

export default ManagerSections;
