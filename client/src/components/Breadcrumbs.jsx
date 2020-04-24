import React, { useEffect } from 'react';

//React Router DOM
import { Link, withRouter } from 'react-router-dom';

function Breadcrumbs(props) {
  useEffect(() => {
    const currentPathName = props.location.pathname.split('/')[1];
    var inSessionStorage = false;
    var foundAt = null;
    var sessionStorageBreadcrumbs = JSON.parse(
      sessionStorage.getItem('breadcrumbs')
    );
    for (let i = 0; i < sessionStorageBreadcrumbs.length; i++) {
      if (sessionStorageBreadcrumbs[i].name === currentPathName) {
        inSessionStorage = true;
        foundAt = i;
      }
    }

    console.log(inSessionStorage);
    console.log(foundAt);
    console.log(JSON.parse(sessionStorage.getItem('breadcrumbs')));

    if (inSessionStorage) {
      var newSessionStorage = JSON.parse(sessionStorage.getItem('breadcrumbs'));
      newSessionStorage.slice(0, foundAt);
      sessionStorage.setItem('breadcrumbs', newSessionStorage);
    } else {
      const newPath = { name: currentPathName, link: props.location.pathname };
      var newSessionStorage = JSON.parse(sessionStorage.getItem('breadcrumbs'));
      console.log(newSessionStorage);
      newSessionStorage = [...newSessionStorage, newPath];
      console.log(newSessionStorage);
      sessionStorage.setItem('breadcrumbs', JSON.stringify(newSessionStorage));
    }
  }, [props.location]);

  var breadcrumbs = JSON.parse(sessionStorage.getItem('breadcrumbs'));

  return (
    <div className="breadcrumbs">
      <ul>{breadcrumbs.forEach((crumb) => console.log(crumb))}</ul>
    </div>
  );
}

export default withRouter(Breadcrumbs);
