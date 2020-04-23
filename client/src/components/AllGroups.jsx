import React, { useEffect, useState } from 'react';

//Redux
import store from '../redux/store';

//Actions
import { getUserGroups } from '../redux/actions/groupActions';

//Compoenents
import GroupPreview from './GroupPreview';

function AllGroups(props) {
  const [groups, changeGroups] = useState([]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      changeGroups(store.getState().groups.groups);
    });

    store.dispatch(getUserGroups(props.userId));

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="item-row" id="groups">
      {groups && groups.length > 0 && props.search === ''
        ? groups.map((group) => <GroupPreview group={group} key={group._id} />)
        : groups.map((group) => {
            if (
              group.name.toLowerCase().indexOf(props.search.toLowerCase()) > -1
            )
              return <GroupPreview group={group} key={group._id} />;
          })}
    </div>
  );
}

export default AllGroups;
